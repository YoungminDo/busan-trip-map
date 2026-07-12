"""위기 프로토콜 — PRD 5-3. 모든 페르소나 공통, 톤보다 우선하는 오버라이드.

이중 게이트 원칙: 어휘 사전(1차) + LLM 분류기(2차). LLM 단독 판정 금지 —
어휘 게이트를 통과하지 않은 발화는 LLM 분류기에 보내지 않고,
어휘 게이트에 걸린 발화는 LLM이 아니라고 해도 '경미' 미만으로 내리지 않는다.
"""
from __future__ import annotations

import enum
from dataclasses import dataclass

CRISIS_LINE = "109"  # 자살예방상담전화 (24시간)


class Severity(enum.Enum):
    NONE = 0
    MILD = 1      # 공감적 인정 + 대화 지속, 내부 플래그만 (카드에 리소스 미표기 — 낙인 방지)
    HIGH = 2      # 스크립트 전환 + 109 안내, 통화 후 카드에도 고정 표기


# 1차 어휘 게이트. 실서비스에서는 전문가 감수 사전으로 교체한다.
_HIGH_RISK_TERMS = (
    "죽고 싶", "죽어버리", "자살", "자해", "살기 싫", "사라지고 싶", "목숨을 끊",
)
_MILD_RISK_TERMS = (
    "너무 힘들", "다 포기하고 싶", "무기력", "아무 의미가 없", "혼자인 것 같",
)


@dataclass
class CrisisAssessment:
    severity: Severity
    matched_term: str | None = None

    @property
    def overrides_persona(self) -> bool:
        return self.severity is Severity.HIGH


def lexicon_gate(utterance: str) -> CrisisAssessment:
    for term in _HIGH_RISK_TERMS:
        if term in utterance:
            return CrisisAssessment(Severity.HIGH, term)
    for term in _MILD_RISK_TERMS:
        if term in utterance:
            return CrisisAssessment(Severity.MILD, term)
    return CrisisAssessment(Severity.NONE)


def assess(utterance: str, llm_classifier=None) -> CrisisAssessment:
    """이중 게이트 판정. llm_classifier: (text) -> Severity, 없으면 어휘 게이트 단독.

    규칙: LLM은 심각도를 올릴 수만 있고(MILD→HIGH), 어휘 게이트가 잡은 것을 내릴 수 없다.
    """
    base = lexicon_gate(utterance)
    if llm_classifier is None or base.severity is Severity.NONE:
        return base
    llm_severity = llm_classifier(utterance)
    if llm_severity.value > base.severity.value:
        return CrisisAssessment(llm_severity, base.matched_term)
    return base  # 다운그레이드 금지


def crisis_response(assessment: CrisisAssessment) -> str | None:
    """페르소나 무관 공통 스크립트. HIGH일 때 페르소나 톤을 오버라이드한다."""
    if assessment.severity is Severity.HIGH:
        return (
            "지금 많이 힘드시다는 게 느껴져요. 그렇게 말해줘서 고마워요. "
            f"이런 마음은 전문가와 이야기하는 게 도움이 돼요. "
            f"자살예방상담전화 {CRISIS_LINE}는 24시간 열려 있어요."
        )
    if assessment.severity is Severity.MILD:
        return None  # 대화 지속 — 응답 스크립트 교체 없음, 내부 플래그만
    return None
