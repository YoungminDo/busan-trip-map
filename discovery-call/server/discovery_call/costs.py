"""원가 미터 — Day 1 대시보드 (확정 13번, 6-5 유닛 이코노믹스 모델의 실측 장치).

추적: 분당 실원가 / 유저당 월 실사용 분수(무료·유료 분리) / 월 API 총비용.
self-host 검토 트리거(확정 16번): 월 API 총비용 ≥ ₩1,000,000.
"""
from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass, field

from .domain import Tier

SELF_HOST_TRIGGER_KRW = 1_000_000

# 분당 원가 구성 (KRW) — 벤더 가격 변경 시 여기만 갱신
DEFAULT_RATES = {
    "stt": 10.0,
    "llm": 7.0,
    "tts": 8.0,
    "infra": 13.0,
    "async": 4.0,
}


@dataclass
class CostMeter:
    rates: dict[str, float] = field(default_factory=lambda: dict(DEFAULT_RATES))
    minutes_by_user: dict[str, float] = field(default_factory=lambda: defaultdict(float))
    tier_by_user: dict[str, Tier] = field(default_factory=dict)

    @property
    def per_minute(self) -> float:
        return sum(self.rates.values())

    def record_call(self, user_id: str, tier: Tier, duration_sec: float) -> float:
        minutes = duration_sec / 60.0
        self.minutes_by_user[user_id] += minutes
        self.tier_by_user[user_id] = tier
        return minutes * self.per_minute

    def monthly_total_krw(self) -> float:
        return sum(self.minutes_by_user.values()) * self.per_minute

    def self_host_review_triggered(self) -> bool:
        return self.monthly_total_krw() >= SELF_HOST_TRIGGER_KRW

    def avg_minutes(self, tier: Tier) -> float:
        vals = [m for u, m in self.minutes_by_user.items() if self.tier_by_user.get(u) is tier]
        return sum(vals) / len(vals) if vals else 0.0

    def dashboard(self) -> dict:
        return {
            "per_minute_krw": self.per_minute,
            "monthly_total_krw": round(self.monthly_total_krw()),
            "avg_minutes_free": round(self.avg_minutes(Tier.FREE), 1),
            "avg_minutes_paid": round(self.avg_minutes(Tier.PAID), 1),
            "self_host_review": self.self_host_review_triggered(),
        }
