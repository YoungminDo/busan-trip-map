from discovery_call.conversation import (
    FREE_CAP_SEC, CallSession, Phase, QuestionKind, pick_main_question,
)
from discovery_call.domain import PersonaId
from discovery_call.personas import PERSONAS, system_prompt


def test_callback_has_top_priority():
    assert pick_main_question(True, 3, 1) is QuestionKind.CALLBACK


def test_values_rotation_once_a_week_after_2_calls():
    assert pick_main_question(False, 2, 0) is QuestionKind.VALUES
    assert pick_main_question(False, 2, 1) is QuestionKind.DAILY_CORE


def test_first_call_of_week_is_daily_core():
    assert pick_main_question(False, 0, 0) is QuestionKind.DAILY_CORE


def test_wrapup_starts_one_minute_before_cap_not_hard_cut():
    s = CallSession(cap_sec=FREE_CAP_SEC)
    s.tick(FREE_CAP_SEC - 61, user_spoke=True)
    assert s.phase is not Phase.WRAPUP
    s.tick(2, user_spoke=True)
    assert s.phase is Phase.WRAPUP
    # cap을 넘겨도 랩업 발화가 끝나기 전엔 종료되지 않는다 (연착륙)
    s.tick(90, user_spoke=False)
    assert s.phase is Phase.WRAPUP
    s.finish_wrapup()
    assert s.phase is Phase.ENDED


def test_silence_bridge_then_move_on():
    s = CallSession()
    s.tick(9, user_spoke=False)
    assert "silence_bridge" in s.events
    assert s.phase is Phase.CHECKIN
    s.tick(12, user_spoke=False)
    assert s.phase is Phase.MAIN  # 브릿지 후에도 침묵이면 다음 단계


def test_user_speech_resets_silence():
    s = CallSession()
    s.tick(7, user_spoke=False)
    s.tick(1, user_spoke=True)
    s.tick(7, user_spoke=False)
    assert "silence_bridge" not in s.events


def test_personas_share_core_rules_in_prompt():
    for pid in PersonaId:
        prompt = system_prompt(pid, week_summary=None, callback=None)
        assert "진단 어휘 금지" in prompt  # 코어 정책은 페르소나 무관 공유
        assert PERSONAS[pid].name in prompt


def test_memory_injection():
    prompt = system_prompt(PersonaId.BORA, week_summary="발표 걱정", callback="발표 어떻게 됐는지")
    assert "발표 걱정" in prompt and "기억 콜백" in prompt
