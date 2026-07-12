"""도메인 모델 — PRD 4장(프로필 스키마)·5장(시스템 동작)의 자료구조."""
from __future__ import annotations

import enum
from dataclasses import dataclass, field
from datetime import date, datetime


class PersonaId(str, enum.Enum):
    BORA = "bora"      # 또래 친구, 반말
    MUJU = "muju"      # 담담한 기록자, 존댓말
    HAENA = "haena"    # 다정한 코치, 존댓말


class Tier(str, enum.Enum):
    FREE = "free"      # 주 5회, 통화 5분
    PAID = "paid"      # 매일, 통화 7분


class CallState(str, enum.Enum):
    SCHEDULED = "scheduled"
    RINGING = "ringing"
    IN_PROGRESS = "in_progress"
    AUDIO_PENDING = "audio_pending"    # 통화는 끝났지만 원본 오디오 저장 미확인
    COMPLETED = "completed"            # 오디오 저장 확인됨 — 이때만 파이프라인 진행
    MISSED = "missed"
    DECLINED = "declined"
    RECORD_FAILED = "record_failed"    # 저장 최종 실패 — 은폐하지 않고 표시


class DeclineOption(str, enum.Enum):
    SNOOZE_10M = "snooze_10m"
    TONIGHT = "tonight"
    PASS_TODAY = "pass_today"


class ObservationCategory(str, enum.Enum):
    LIKES = "likes"
    DISLIKES = "dislikes"
    WANTS = "wants"
    STRENGTHS = "strengths"
    BLIND_SPOTS = "blind_spots"
    VALUES = "values"
    RECURRING_CONCERNS = "recurring_concerns"
    NARRATIVE = "narrative"


class Confidence(str, enum.Enum):
    CANDIDATE = "candidate"
    EMERGING = "emerging"
    ESTABLISHED = "established"


class ObservationStatus(str, enum.Enum):
    ACTIVE = "active"
    SUPERSEDED = "superseded"   # 모순 발견 시 덮어쓰지 않고 '변화'로 기록
    DELETED = "deleted"         # 원본 통화 삭제 시 파생 관측도 제거


@dataclass
class Evidence:
    call_id: str
    on_date: date
    quote: str                  # 원문 발화 — 모든 관측의 필수 근거
    audio_offset_sec: float | None = None


@dataclass
class Observation:
    id: str
    user_id: str
    category: ObservationCategory
    statement: str
    evidence: list[Evidence]
    confidence: Confidence = Confidence.CANDIDATE
    status: ObservationStatus = ObservationStatus.ACTIVE
    first_observed: date | None = None
    last_observed: date | None = None
    superseded_by: str | None = None


@dataclass
class User:
    id: str
    persona: PersonaId
    tier: Tier = Tier.FREE
    call_time: str = "22:30"                 # HH:MM, 요일별 확장은 schedule_overrides
    schedule_overrides: dict[int, str | None] = field(default_factory=dict)  # 요일(0=월)→시각/None(끔)
    exam_mode_until: date | None = None      # 시험기간 모드: 주 2회로 완화
    paused_until: date | None = None         # 방학 모드: 발신 중단
    completed_call_count: int = 0            # 바넘 게이트 기준 (10회)


@dataclass
class CallRecord:
    id: str
    user_id: str
    on_date: date
    state: CallState = CallState.SCHEDULED
    started_at: datetime | None = None
    duration_sec: float = 0.0
    user_talk_ratio: float = 0.0
    retry_count: int = 0
    audio_saved: bool = False
    transcript: list[TranscriptTurn] = field(default_factory=list)


@dataclass
class TranscriptTurn:
    speaker: str                # "user" | "ai"
    text: str
    at_sec: float


@dataclass
class Diary:
    call_id: str
    user_id: str
    on_date: date
    emotion_tag: str
    body: str                   # 사용자 말투 보존 산문 — AI 대필 금지
    mirroring: str | None       # L1 관찰 한 문장 (직접 인용 필수) — 검증 실패 시 None
    deleted: bool = False
