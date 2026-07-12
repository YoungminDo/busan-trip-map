"""통화 후 비동기 파이프라인 — PRD 5-2.

원본 오디오 저장 확인 → 일기 생성 → 미러링(검증 포함) → 관측 추출(candidate) →
주간 통합(승격/모순 처리) → 콜백 선정. LLM은 Provider 인터페이스 뒤에 둔다.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from typing import Protocol

from .domain import (
    CallRecord, CallState, Confidence, Diary, Evidence, Observation,
    ObservationStatus,
)
from .mirroring import validate as validate_mirroring

EMERGING_MIN_EVIDENCE = 2
ESTABLISHED_MIN_EVIDENCE = 3
ESTABLISHED_MIN_SPAN_DAYS = 14   # 최소 2주에 걸친 일관성


class LLMProvider(Protocol):
    def generate_diary(self, user_texts: list[str]) -> tuple[str, str]:
        """returns (emotion_tag, body) — 사용자가 말한 내용만 재구성 (대필 금지)"""
        ...

    def generate_mirroring(self, transcript_user_texts: list[str]) -> str: ...

    def extract_observations(self, call: CallRecord) -> list[Observation]: ...


MIRRORING_MAX_ATTEMPTS = 2


def finalize_call(call: CallRecord, audio_saved: bool) -> CallState:
    """원본 오디오 저장 성공 확인이 세션 완료의 선행 조건 (확정 6번).

    실패는 은폐하지 않는다 — RECORD_FAILED로 표시하고 사과 카피가 나간다.
    """
    call.audio_saved = audio_saved
    call.state = CallState.COMPLETED if audio_saved else CallState.RECORD_FAILED
    return call.state


def build_diary(call: CallRecord, llm: LLMProvider, completed_call_count: int) -> Diary:
    if call.state is not CallState.COMPLETED:
        raise ValueError("오디오 저장이 확인되지 않은 통화는 파이프라인에 들어올 수 없다")
    user_texts = [t.text for t in call.transcript if t.speaker == "user"]
    emotion, body = llm.generate_diary(user_texts)

    mirroring: str | None = None
    for _ in range(MIRRORING_MAX_ATTEMPTS):
        candidate = llm.generate_mirroring(user_texts)
        if validate_mirroring(candidate, user_texts, completed_call_count).ok:
            mirroring = candidate
            break
    # 검증 통과 못 하면 미러링 없이 발행 — 틀린 확신보다 빈 자리가 낫다

    return Diary(call_id=call.id, user_id=call.user_id, on_date=call.on_date,
                 emotion_tag=emotion, body=body, mirroring=mirroring)


@dataclass
class ConsolidationResult:
    promoted: list[str]
    superseded: list[str]


def _span_days(obs: Observation) -> int:
    dates = [e.on_date for e in obs.evidence]
    return (max(dates) - min(dates)).days if dates else 0


def consolidate(observations: list[Observation], contradictions: dict[str, str] | None = None) -> ConsolidationResult:
    """주간 통합 잡 — candidate→emerging→established 승격, 모순은 superseded (덮어쓰기 금지).

    contradictions: {구_관측_id: 신_관측_id} — LLM 모순 감지 결과.
    """
    result = ConsolidationResult(promoted=[], superseded=[])
    by_id = {o.id: o for o in observations}

    for old_id, new_id in (contradictions or {}).items():
        old = by_id.get(old_id)
        if old and old.status is ObservationStatus.ACTIVE:
            old.status = ObservationStatus.SUPERSEDED
            old.superseded_by = new_id
            result.superseded.append(old_id)  # '변화 자체'가 자기발견 콘텐츠가 된다

    for obs in observations:
        if obs.status is not ObservationStatus.ACTIVE:
            continue
        n = len(obs.evidence)
        if obs.confidence is Confidence.CANDIDATE and n >= EMERGING_MIN_EVIDENCE:
            obs.confidence = Confidence.EMERGING
            result.promoted.append(obs.id)
        elif (obs.confidence is Confidence.EMERGING and n >= ESTABLISHED_MIN_EVIDENCE
              and _span_days(obs) >= ESTABLISHED_MIN_SPAN_DAYS):
            obs.confidence = Confidence.ESTABLISHED
            result.promoted.append(obs.id)
    return result


def delete_call_cascade(call_id: str, diaries: list[Diary], observations: list[Observation]) -> None:
    """개별 통화 삭제 = Day 1 권리. 파생 일기와 관측 근거도 함께 제거 (확정 8번, S3 삭제 정책)."""
    for d in diaries:
        if d.call_id == call_id:
            d.deleted = True
    for obs in observations:
        obs.evidence = [e for e in obs.evidence if e.call_id != call_id]
        if not obs.evidence:
            obs.status = ObservationStatus.DELETED


def pick_callback(observations: list[Observation], today: date) -> str | None:
    """다음 통화에 주입할 콜백 1개 — 최근 7일 내 걱정/서사 관측 우선."""
    recent = [
        o for o in observations
        if o.status is ObservationStatus.ACTIVE and o.last_observed
        and (today - o.last_observed) <= timedelta(days=7)
        and o.category.value in ("recurring_concerns", "narrative", "wants")
    ]
    if not recent:
        return None
    best = max(recent, key=lambda o: (o.last_observed, len(o.evidence)))
    return best.statement
