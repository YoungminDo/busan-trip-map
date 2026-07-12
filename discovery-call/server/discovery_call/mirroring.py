"""L1 미러링 계약 — 바넘 게이트의 코드 레벨 구현 (전략 3-4, PRD 6-3).

규칙:
1. 형식 강제: 관찰 진술 + 직접 인용 + (오늘 당신의 말) — 인용 없으면 무효.
2. 인용은 실제 전사에 존재해야 한다 (지어낸 인용 차단).
3. 성격·성향 어휘 필터: 대화 10회 미만 유저에게 성격 어휘가 나오면 차단 → 재생성 요청.
"""
from __future__ import annotations

import re
from dataclasses import dataclass

BARNUM_GATE_CALL_COUNT = 10

# 성격·성향 어휘 사전 (실서비스에서는 확장·감수). '~한 사람' 패턴 포함.
_PERSONALITY_TERMS = (
    "성실", "창의적", "외향적", "내향적", "완벽주의", "예민한 편", "긍정적인 사람",
    "리더십", "책임감이 강한", "감성적인 사람", "이성적인 사람",
)
_PERSONALITY_PATTERNS = (
    re.compile(r"당신은\s?.{0,12}(사람|성격|타입|편이에요|경향)"),
    re.compile(r"[가-힣]+한\s?(사람|성격|타입)이(에요|다|네요)"),
)

_QUOTE_RE = re.compile(r"[\"“'‘](?P<quote>[^\"”'’]{2,})[\"”'’]\s?\(오늘 당신의 말\)")


@dataclass
class MirroringVerdict:
    ok: bool
    reason: str | None = None


def _normalize(s: str) -> str:
    return re.sub(r"\s+", "", s)


def validate(candidate: str, transcript_user_texts: list[str], completed_call_count: int) -> MirroringVerdict:
    """미러링 문장 검증. 실패 시 파이프라인은 재생성하거나 미러링 없이 카드를 발행한다."""
    m = _QUOTE_RE.search(candidate)
    if not m:
        return MirroringVerdict(False, "직접 인용 + (오늘 당신의 말) 형식이 없음")

    quote = _normalize(m.group("quote"))
    corpus = _normalize(" ".join(transcript_user_texts))
    if quote not in corpus:
        return MirroringVerdict(False, "인용이 실제 발화에 존재하지 않음 (지어낸 인용)")

    if completed_call_count < BARNUM_GATE_CALL_COUNT:
        for term in _PERSONALITY_TERMS:
            if term in candidate:
                return MirroringVerdict(False, f"바넘 게이트: 성격 어휘 '{term}' (대화 {completed_call_count}회 < {BARNUM_GATE_CALL_COUNT})")
        for pat in _PERSONALITY_PATTERNS:
            if pat.search(candidate):
                return MirroringVerdict(False, f"바넘 게이트: 성격 진술 패턴 (대화 {completed_call_count}회 < {BARNUM_GATE_CALL_COUNT})")

    return MirroringVerdict(True)
