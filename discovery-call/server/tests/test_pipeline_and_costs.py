from datetime import date

import pytest

from discovery_call.costs import SELF_HOST_TRIGGER_KRW, CostMeter
from discovery_call.domain import (
    CallRecord, CallState, Confidence, Evidence, Observation,
    ObservationCategory, ObservationStatus, Tier, TranscriptTurn,
)
from discovery_call.pipeline import (
    build_diary, consolidate, delete_call_cascade, finalize_call, pick_callback,
)


class MockLLM:
    def generate_diary(self, user_texts):
        return "뿌듯함", " ".join(user_texts)

    def generate_mirroring(self, user_texts):
        return f'기타 얘기에서 목소리가 밝아졌어요. "{user_texts[-1]}"(오늘 당신의 말)'

    def extract_observations(self, call):
        return []


def call(saved=True) -> CallRecord:
    c = CallRecord(id="c1", user_id="u1", on_date=date(2026, 7, 13))
    c.transcript = [
        TranscriptTurn("ai", "오늘 어땠어요?", 1.0),
        TranscriptTurn("user", "오랜만에 기타 치니까 살 것 같더라", 5.0),
    ]
    finalize_call(c, audio_saved=saved)
    return c


def obs(oid, n_evidence, span_days=0, category=ObservationCategory.LIKES, conf=Confidence.CANDIDATE):
    from datetime import timedelta
    start = date(2026, 7, 1)
    step = span_days / (n_evidence - 1) if n_evidence > 1 else 0
    ev = [Evidence(f"c{i}", start + timedelta(days=round(i * step)), f"quote{i}")
          for i in range(n_evidence)]
    dates = [e.on_date for e in ev]
    return Observation(id=oid, user_id="u1", category=category, statement=f"s-{oid}",
                       evidence=ev, confidence=conf,
                       first_observed=min(dates) if dates else None,
                       last_observed=max(dates) if dates else None)


# ---------- 저장 확인 = 완료 선행조건 ----------

def test_audio_save_gate():
    assert call(saved=True).state is CallState.COMPLETED
    assert call(saved=False).state is CallState.RECORD_FAILED


def test_pipeline_rejects_unsaved_call():
    with pytest.raises(ValueError):
        build_diary(call(saved=False), MockLLM(), completed_call_count=3)


def test_diary_built_with_valid_mirroring():
    d = build_diary(call(), MockLLM(), completed_call_count=3)
    assert d.mirroring and "(오늘 당신의 말)" in d.mirroring
    assert d.emotion_tag == "뿌듯함"


def test_diary_published_without_mirroring_when_invalid():
    class BadLLM(MockLLM):
        def generate_mirroring(self, user_texts):
            return "당신은 성실한 사람이에요."  # 인용 없음 + 성격 어휘
    d = build_diary(call(), BadLLM(), completed_call_count=3)
    assert d.mirroring is None  # 틀린 확신보다 빈 자리


# ---------- 관측 승격/모순/삭제 ----------

def test_candidate_promotes_to_emerging_at_2_evidence():
    o = obs("o1", 2)
    consolidate([o])
    assert o.confidence is Confidence.EMERGING


def test_established_requires_3_evidence_and_14day_span():
    short = obs("o2", 3, span_days=5, conf=Confidence.EMERGING)
    consolidate([short])
    assert short.confidence is Confidence.EMERGING  # 기간 미달

    long = obs("o3", 3, span_days=20, conf=Confidence.EMERGING)
    consolidate([long])
    assert long.confidence is Confidence.ESTABLISHED


def test_contradiction_supersedes_not_overwrites():
    old, new = obs("old", 3, 20), obs("new", 1)
    consolidate([old, new], contradictions={"old": "new"})
    assert old.status is ObservationStatus.SUPERSEDED
    assert old.superseded_by == "new"
    assert old.evidence  # 근거는 보존 — '변화'가 콘텐츠


def test_delete_call_cascades_to_observations():
    o = Observation(id="o4", user_id="u1", category=ObservationCategory.LIKES,
                    statement="기타", evidence=[Evidence("c1", date(2026, 7, 13), "q")])
    d = build_diary(call(), MockLLM(), 3)
    delete_call_cascade("c1", [d], [o])
    assert d.deleted and o.status is ObservationStatus.DELETED


def test_callback_prefers_recent_concern():
    today = date(2026, 7, 13)
    concern = obs("c", 2, category=ObservationCategory.RECURRING_CONCERNS)
    concern.last_observed = date(2026, 7, 10)
    like = obs("l", 3, category=ObservationCategory.LIKES)
    like.last_observed = date(2026, 7, 12)
    assert pick_callback([concern, like], today) == "s-c"  # likes는 콜백 대상 아님


def test_callback_none_when_stale():
    concern = obs("c", 2, category=ObservationCategory.RECURRING_CONCERNS)
    concern.last_observed = date(2026, 6, 1)
    assert pick_callback([concern], date(2026, 7, 13)) is None


# ---------- 원가 미터 ----------

def test_cost_meter_dashboard_and_trigger():
    m = CostMeter()
    assert m.per_minute == 42.0  # 10+7+8+13+4
    m.record_call("u1", Tier.FREE, 300)   # 5분
    m.record_call("u2", Tier.PAID, 420)   # 7분
    d = m.dashboard()
    assert d["avg_minutes_free"] == 5.0 and d["avg_minutes_paid"] == 7.0
    assert d["self_host_review"] is False

    # 월 100만 원 도달 시 self-host 검토 트리거 (확정 16번)
    needed_minutes = SELF_HOST_TRIGGER_KRW / m.per_minute
    m.minutes_by_user["u3"] = needed_minutes
    m.tier_by_user["u3"] = Tier.FREE
    assert m.self_host_review_triggered() is True
