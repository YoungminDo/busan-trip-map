from datetime import date

from discovery_call.domain import DeclineOption, PersonaId, Tier, User
from discovery_call.scheduler import (
    Decision, WeekUsage, can_retry, decline_followup, next_call_date, should_call,
)


def user(**kw) -> User:
    return User(id="u1", persona=PersonaId.MUJU, **kw)


MON = date(2026, 7, 13)  # 월요일


def test_free_user_called_within_weekly_quota():
    u = user()
    assert should_call(u, MON, WeekUsage(4, 60)) is Decision.CALL


def test_free_user_skipped_after_5_calls_this_week():
    u = user()
    assert should_call(u, MON, WeekUsage(5, 60)) is Decision.SKIP_QUOTA


def test_paid_user_daily():
    u = user(tier=Tier.PAID)
    assert should_call(u, MON, WeekUsage(6, 100)) is Decision.CALL


def test_exam_mode_reduces_to_2_per_week():
    u = user(exam_mode_until=date(2026, 7, 20))
    assert should_call(u, MON, WeekUsage(2, 30)) is Decision.SKIP_QUOTA
    assert should_call(u, MON, WeekUsage(1, 30)) is Decision.CALL


def test_exam_mode_expires():
    u = user(exam_mode_until=date(2026, 7, 10))  # 과거
    assert should_call(u, MON, WeekUsage(3, 30)) is Decision.CALL


def test_paused_user_not_called():
    u = user(paused_until=date(2026, 8, 31))
    assert should_call(u, MON, WeekUsage(0, 0)) is Decision.SKIP_PAUSED


def test_day_off_respected():
    u = user(schedule_overrides={0: None})  # 월요일 끔
    assert should_call(u, MON, WeekUsage(0, 0)) is Decision.SKIP_DAY_OFF


def test_minute_hard_cap_kills_switch():
    u = user()
    assert should_call(u, MON, WeekUsage(2, 120)) is Decision.SKIP_MINUTE_CAP


def test_retry_at_most_once():
    assert can_retry(0) is True
    assert can_retry(1) is False


def test_decline_options_no_penalty():
    assert decline_followup(DeclineOption.PASS_TODAY, "21:00", "22:30") is None
    assert decline_followup(DeclineOption.SNOOZE_10M, "21:55", "22:30") == "22:05"
    assert decline_followup(DeclineOption.TONIGHT, "18:00", "21:00") == "22:30"


def test_next_call_date_after_quota_is_next_monday():
    u = user()
    wed = date(2026, 7, 15)
    assert next_call_date(u, wed, WeekUsage(5, 60)) == date(2026, 7, 20)
    assert next_call_date(u, wed, WeekUsage(3, 60)) == wed
