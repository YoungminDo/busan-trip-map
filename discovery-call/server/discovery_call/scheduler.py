"""통화 스케줄러 정책 — PRD 3(F2)·5-4.

무료 주 5회 / 재시도 1회(5분 후) / 거절 3옵션 무페널티 / 시험기간 모드 주 2회 /
일시정지 / 월 분수 하드캡 킬스위치. 발신 '여부'를 정하는 순수 정책 로직 —
실제 push 발송·시각 계산은 인프라 레이어의 몫.
"""
from __future__ import annotations

import enum
from dataclasses import dataclass
from datetime import date, timedelta

from .domain import DeclineOption, Tier, User

FREE_CALLS_PER_WEEK = 5
EXAM_MODE_CALLS_PER_WEEK = 2
MAX_RETRY_PER_DAY = 1            # 원 호출 + 5분 후 1회
RETRY_DELAY_MIN = 5
FREE_MONTHLY_MINUTE_CAP = 120    # 킬스위치 (PRD 5-4)
PAID_MONTHLY_MINUTE_CAP = 250


class Decision(enum.Enum):
    CALL = "call"
    SKIP_QUOTA = "skip_quota"          # 주간 쿼터 소진 — "소진" 카피 금지, 다음 통화일 안내
    SKIP_PAUSED = "skip_paused"
    SKIP_DAY_OFF = "skip_day_off"      # 요일 끔
    SKIP_MINUTE_CAP = "skip_minute_cap"  # 하드캡 — 내부 알림 발생


@dataclass
class WeekUsage:
    calls_completed_or_missed: int   # 이번 주 발신 성사 횟수 (완료+부재중 — 시도 기준 아님)
    minutes_this_month: float


def weekly_quota(user: User, today: date) -> int:
    if user.tier is Tier.PAID:
        return 7
    if user.exam_mode_until and today <= user.exam_mode_until:
        return EXAM_MODE_CALLS_PER_WEEK
    return FREE_CALLS_PER_WEEK


def should_call(user: User, today: date, usage: WeekUsage) -> Decision:
    if user.paused_until and today <= user.paused_until:
        return Decision.SKIP_PAUSED
    if user.schedule_overrides.get(today.weekday(), "on") is None:
        return Decision.SKIP_DAY_OFF
    cap = PAID_MONTHLY_MINUTE_CAP if user.tier is Tier.PAID else FREE_MONTHLY_MINUTE_CAP
    if usage.minutes_this_month >= cap:
        return Decision.SKIP_MINUTE_CAP
    if usage.calls_completed_or_missed >= weekly_quota(user, today):
        return Decision.SKIP_QUOTA
    return Decision.CALL


def can_retry(retry_count: int) -> bool:
    return retry_count < MAX_RETRY_PER_DAY


def decline_followup(option: DeclineOption, now_hhmm: str, user_call_time: str) -> str | None:
    """거절 3옵션 처리 → 다음 발신 시각(HH:MM) 또는 None(오늘 패스).

    어떤 옵션도 쿼터·기록에 페널티를 남기지 않는다 (죄책감 제로 설계).
    """
    if option is DeclineOption.PASS_TODAY:
        return None
    if option is DeclineOption.SNOOZE_10M:
        h, m = map(int, now_hhmm.split(":"))
        m += 10
        return f"{(h + m // 60) % 24:02d}:{m % 60:02d}"
    if option is DeclineOption.TONIGHT:
        return max("22:30", user_call_time)
    raise ValueError(option)


def next_call_date(user: User, today: date, usage: WeekUsage) -> date:
    """홈 배너용: 다음 통화 가능일 (쿼터 소진 시 다음 주 월요일)."""
    if usage.calls_completed_or_missed < weekly_quota(user, today):
        return today
    return today + timedelta(days=7 - today.weekday())
