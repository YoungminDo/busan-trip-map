"""대화 엔진 골격 — PRD 6-1 통화 구조 상태머신.

체크인(30초) → 메인 질문 1개(로테이션, 콜백 우선) → 반영 → 연착륙 랩업.
실제 발화 생성은 LLM의 몫이고, 이 모듈은 '지금 어떤 단계이고 어떤 질문 플랜인가'를 정한다.
"""
from __future__ import annotations

import enum
from dataclasses import dataclass, field


class Phase(enum.Enum):
    CHECKIN = "checkin"
    MAIN = "main"
    REFLECT = "reflect"
    WRAPUP = "wrapup"
    ENDED = "ended"


class QuestionKind(enum.Enum):
    DAILY_CORE = "daily_core"        # 오늘 좋았던 것 하나 + 이유 (Three Good Things 변형)
    STRENGTH = "strength"            # 시간 가는 줄 몰랐던 순간 (몰입=강점 신호)
    VALUES = "values"                # ACT/VLQ 로테이션 (주 1–2회)
    CALLBACK = "callback"            # 기억 콜백 — 있으면 최우선


# 통화 시간 정책 (초). 유료는 cap을 420으로 올린다.
FREE_CAP_SEC = 300
PAID_CAP_SEC = 420
WRAPUP_LEAD_SEC = 60             # cap 1분 전부터 랩업 시작 — 하드컷 금지
SILENCE_BRIDGE_SEC = 8           # "천천히 생각해도 돼요"
SILENCE_MOVE_ON_SEC = 20         # 브릿지 후 12초 더 → 다음 단계


def pick_main_question(callback_available: bool, calls_this_week: int, values_asked_this_week: int) -> QuestionKind:
    """메인 질문 로테이션. 콜백 최우선(관계 형성 = 차별화의 순간), 가치 질문은 주 1–2회."""
    if callback_available:
        return QuestionKind.CALLBACK
    if values_asked_this_week < 1 and calls_this_week >= 2:
        return QuestionKind.VALUES
    if calls_this_week % 2 == 1:
        return QuestionKind.STRENGTH
    return QuestionKind.DAILY_CORE


@dataclass
class CallSession:
    cap_sec: int = FREE_CAP_SEC
    phase: Phase = Phase.CHECKIN
    elapsed_sec: float = 0.0
    silence_sec: float = 0.0
    bridge_sent: bool = False
    events: list[str] = field(default_factory=list)

    def tick(self, seconds: float, user_spoke: bool) -> None:
        """시간 경과 처리 — 랩업 진입과 침묵 정책은 여기서만 결정된다."""
        if self.phase is Phase.ENDED:
            return
        self.elapsed_sec += seconds
        self.silence_sec = 0.0 if user_spoke else self.silence_sec + seconds

        if self.phase is not Phase.WRAPUP and self.elapsed_sec >= self.cap_sec - WRAPUP_LEAD_SEC:
            self.phase = Phase.WRAPUP
            self.events.append("wrapup_started")
            return

        if not user_spoke:
            if not self.bridge_sent and self.silence_sec >= SILENCE_BRIDGE_SEC:
                self.bridge_sent = True
                self.events.append("silence_bridge")
            elif self.bridge_sent and self.silence_sec >= SILENCE_MOVE_ON_SEC:
                self.advance()
                self.silence_sec = 0.0
                self.bridge_sent = False

    def advance(self) -> None:
        order = [Phase.CHECKIN, Phase.MAIN, Phase.REFLECT, Phase.WRAPUP, Phase.ENDED]
        i = order.index(self.phase)
        self.phase = order[min(i + 1, len(order) - 1)]
        self.events.append(f"phase:{self.phase.value}")

    def finish_wrapup(self) -> None:
        """랩업 발화가 '끝난 뒤' 종료 — 하드컷 없음 (연착륙 원칙)."""
        if self.phase is Phase.WRAPUP:
            self.phase = Phase.ENDED
            self.events.append("ended")
