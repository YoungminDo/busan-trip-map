from discovery_call.mirroring import validate
from discovery_call.safety import CRISIS_LINE, Severity, assess, crisis_response, lexicon_gate


# ---------- 위기 프로토콜 ----------

def test_high_risk_term_triggers_high():
    a = lexicon_gate("요즘 너무 지쳐서 죽고 싶다는 생각이 들어")
    assert a.severity is Severity.HIGH
    assert a.overrides_persona


def test_mild_term_keeps_conversation():
    a = lexicon_gate("요즘 다 무기력하고 그래")
    assert a.severity is Severity.MILD
    assert crisis_response(a) is None  # 스크립트 교체 없음, 내부 플래그만


def test_high_response_includes_109_and_overrides_persona():
    a = lexicon_gate("자해하고 싶어")
    resp = crisis_response(a)
    assert resp and CRISIS_LINE in resp


def test_llm_cannot_downgrade_lexicon_verdict():
    a = assess("죽고 싶어", llm_classifier=lambda t: Severity.NONE)
    assert a.severity is Severity.HIGH  # 다운그레이드 금지


def test_llm_can_upgrade():
    a = assess("너무 힘들어서 어떻게 해야 할지 모르겠어", llm_classifier=lambda t: Severity.HIGH)
    assert a.severity is Severity.HIGH


def test_llm_not_consulted_when_lexicon_clear():
    def boom(t):
        raise AssertionError("어휘 게이트 미통과 발화는 LLM에 보내지 않는다")
    a = assess("오늘 동아리에서 기타 쳤어", llm_classifier=boom)
    assert a.severity is Severity.NONE


# ---------- 미러링 바넘 게이트 ----------

TRANSCRIPT = ["오늘 팀플 진짜 짜증났어", "근데 저녁에 오랜만에 기타 치니까 살 것 같더라"]


def test_valid_mirroring_passes():
    c = '팀플 얘기보다 기타 얘기에서 목소리가 밝아졌어요. "오랜만에 기타 치니까 살 것 같더라"(오늘 당신의 말)'
    assert validate(c, TRANSCRIPT, completed_call_count=3).ok


def test_missing_quote_rejected():
    c = "오늘은 기타 얘기를 할 때 목소리가 밝아졌어요."
    v = validate(c, TRANSCRIPT, completed_call_count=3)
    assert not v.ok and "인용" in v.reason


def test_fabricated_quote_rejected():
    c = '"매일 연습해야겠다고 다짐했다"(오늘 당신의 말) 라는 말이 인상적이었어요'
    v = validate(c, TRANSCRIPT, completed_call_count=3)
    assert not v.ok and "존재하지" in v.reason


def test_personality_word_blocked_under_10_calls():
    c = '당신은 창의적 성향이 있어요. "살 것 같더라"(오늘 당신의 말)'
    v = validate(c, TRANSCRIPT, completed_call_count=3)
    assert not v.ok and "바넘" in v.reason


def test_personality_word_allowed_after_10_calls():
    c = '창의적 시도가 반복돼요. "살 것 같더라"(오늘 당신의 말)'
    assert validate(c, TRANSCRIPT, completed_call_count=12).ok
