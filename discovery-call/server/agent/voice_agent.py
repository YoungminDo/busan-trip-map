"""VoIP 음성 에이전트 — LiveKit Agents 캐스케이드 (STT→LLM→TTS).

R1 웹 VoIP 베타용. 참가자가 /call/lab 페이지에서 룸에 들어오면 이 워커가 배정되어
페르소나로 대화하고, 통화 종료 시 일기+미러링을 생성해 /api/call-lab/diary로 전송한다.

실행:
  export LIVEKIT_URL=... LIVEKIT_API_KEY=... LIVEKIT_API_SECRET=...
  export DEEPGRAM_API_KEY=... OPENAI_API_KEY=...
  export CALL_LAB_BASE_URL=https://hmm.da-sh.io CALL_LAB_ADMIN_SECRET=...
  python -m agent.voice_agent dev

룸 메타데이터(JSON, 토큰 발급 시 설정): {"participantCode":"P01","persona":"bora","callback":null,"weekSummary":null}
※ livekit-agents 1.x API 기준. 버전은 requirements.txt에 고정 — 실행 검증은 W0-1 개발 주간에.
"""
from __future__ import annotations

import datetime as dt
import json
import logging
import os

import httpx
from livekit import agents
from livekit.agents import Agent, AgentSession, JobContext
from livekit.plugins import deepgram, openai, silero

from discovery_call.conversation import FREE_CAP_SEC, WRAPUP_LEAD_SEC
from discovery_call.domain import PersonaId
from discovery_call.mirroring import validate as validate_mirroring
from discovery_call.personas import PERSONAS, system_prompt
from discovery_call.safety import Severity, crisis_response, lexicon_gate

log = logging.getLogger("voice-agent")

DIARY_PROMPT = (
    "아래는 사용자가 통화에서 말한 내용이다. 사용자가 말한 것만 재구성해서(지어내기 금지) "
    "사용자의 말투를 살린 1인칭 일기 한 페이지를 써라. 마지막 줄에 '감정: <한 단어>' 형식으로 "
    "오늘의 감정 태그를 붙여라.\n\n{utterances}"
)
MIRRORING_PROMPT = (
    "아래 사용자 발화에서 해석 없는 관찰 한 문장을 만들어라. 형식 필수: "
    '관찰 진술 + "원문 인용"(오늘 당신의 말). 성격·성향 단정 금지. 발화에 실제로 있는 문장만 인용하라.\n\n{utterances}'
)


class CallState:
    """통화 1건의 상태 — 전사 수집·위기 플래그·랩업 타이밍."""

    def __init__(self, meta: dict):
        self.participant_code: str = meta.get("participantCode", "P00")
        self.persona = PersonaId(meta.get("persona", "muju"))
        self.callback: str | None = meta.get("callback")
        self.week_summary: str | None = meta.get("weekSummary")
        self.user_texts: list[str] = []
        self.crisis_flag: Severity = Severity.NONE
        self.started_at = dt.datetime.now(dt.timezone.utc)


async def post_diary(state: CallState, body: str, emotion: str, mirroring: str | None) -> None:
    """통화 종료 후 일기 생성 결과를 call-lab API로 전송 (링크 발송은 운영자 몫)."""
    base = os.environ["CALL_LAB_BASE_URL"]
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.post(
            f"{base}/api/call-lab/diary",
            headers={"x-call-lab-secret": os.environ["CALL_LAB_ADMIN_SECRET"]},
            json={
                "participantCode": state.participant_code,
                "onDate": state.started_at.astimezone().date().isoformat(),
                "persona": state.persona.value,
                "emotionTag": emotion,
                "body": body,
                "mirroring": mirroring,
            },
        )
        r.raise_for_status()
        log.info("diary posted: %s -> %s", state.participant_code, r.json().get("url"))


async def generate_diary(llm_client, state: CallState) -> tuple[str, str, str | None]:
    """(body, emotion, mirroring|None). 미러링은 바넘 게이트 검증 실패 시 None."""
    utterances = "\n".join(f"- {t}" for t in state.user_texts) or "- (발화 없음)"
    diary_raw = await _chat(llm_client, DIARY_PROMPT.format(utterances=utterances))
    emotion = "기록"
    body = diary_raw
    if "감정:" in diary_raw:
        body, _, tail = diary_raw.rpartition("감정:")
        emotion = tail.strip().split()[0] if tail.strip() else "기록"
        body = body.strip()

    mirroring: str | None = None
    for _ in range(2):
        candidate = await _chat(llm_client, MIRRORING_PROMPT.format(utterances=utterances))
        # R1 참가자는 전원 신규(대화 10회 미만) → 바넘 게이트 전면 적용
        if validate_mirroring(candidate, state.user_texts, completed_call_count=0).ok:
            mirroring = candidate
            break
    return body, emotion, mirroring


async def _chat(llm_client, prompt: str) -> str:
    resp = await llm_client.chat.completions.create(
        model=os.environ.get("PIPELINE_LLM_MODEL", "gpt-4.1-mini"),
        messages=[{"role": "user", "content": prompt}],
    )
    return (resp.choices[0].message.content or "").strip()


async def entrypoint(ctx: JobContext) -> None:
    await ctx.connect()
    meta = json.loads(ctx.room.metadata or "{}")
    state = CallState(meta)
    persona = PERSONAS[state.persona]

    session = AgentSession(
        stt=deepgram.STT(model="nova-2", language="ko"),
        llm=openai.LLM(model=os.environ.get("CALL_LLM_MODEL", "gpt-4.1-mini")),
        tts=openai.TTS(voice=os.environ.get(f"TTS_VOICE_{state.persona.value.upper()}", "alloy")),
        vad=silero.VAD.load(),
    )

    @session.on("user_input_transcribed")
    def on_user_text(ev):  # 전사 수집 + 위기 게이트 (어휘 1차)
        if not getattr(ev, "is_final", True):
            return
        text = ev.transcript
        state.user_texts.append(text)
        assessment = lexicon_gate(text)
        if assessment.severity.value > state.crisis_flag.value:
            state.crisis_flag = assessment.severity
        if assessment.severity is Severity.HIGH:
            # 페르소나보다 안전이 우선 — 공통 스크립트로 즉시 전환
            session.interrupt()
            session.say(crisis_response(assessment) or "")

    instructions = system_prompt(state.persona, state.week_summary, state.callback)
    await session.start(room=ctx.room, agent=Agent(instructions=instructions))
    session.say(persona.greeting_sample)

    # 연착륙 랩업: cap 1분 전에 정리 발화 지시 (하드컷 금지)
    async def wrapup_timer():
        import asyncio
        await asyncio.sleep(FREE_CAP_SEC - WRAPUP_LEAD_SEC)
        session.generate_reply(
            instructions="이제 통화를 마무리할 시간이다. 오늘 나눈 얘기를 두 문장으로 정리해주고 따뜻하게 인사하라."
        )

    import asyncio
    wrapup = asyncio.create_task(wrapup_timer())

    async def on_shutdown():
        wrapup.cancel()
        if state.user_texts:  # 발화가 있어야 일기가 성립
            import openai as openai_sdk
            llm_client = openai_sdk.AsyncOpenAI()
            body, emotion, mirroring = await generate_diary(llm_client, state)
            await post_diary(state, body, emotion, mirroring)
        if state.crisis_flag is not Severity.NONE:
            log.warning("CRISIS FLAG %s — participant %s (운영자 확인 필요)",
                        state.crisis_flag.name, state.participant_code)

    ctx.add_shutdown_callback(on_shutdown)


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
