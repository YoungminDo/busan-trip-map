-- 나를 발견하는 통화 — /call/lab (W0 R1 일기 링크 + R2 기반)
-- 헬로마이미 Supabase에 적용. RLS: anon 접근 차단, service role만 (API 라우트 경유).

create table if not exists call_lab_diaries (
  id text primary key,                 -- ulid (추측 불가 → 링크 자체가 접근 키)
  participant_code text not null,      -- P01~P37 (실명·전화번호를 DB에 넣지 않는다)
  on_date date not null,
  persona text not null check (persona in ('bora','muju','haena')),
  emotion_tag text,
  body text not null,                  -- 일기 본문 (사용자 말투 보존)
  mirroring text,                      -- L1 관찰 한 문장 (검증 실패 시 null)
  transcript jsonb,                    -- [{speaker,text,at_sec}] 접힌 전사용 (선택)
  created_at timestamptz not null default now()
);

create table if not exists call_lab_opens (
  id bigint generated always as identity primary key,
  diary_id text not null references call_lab_diaries(id) on delete cascade,
  opened_at timestamptz not null default now(),
  user_agent text
);

create index if not exists idx_call_lab_opens_diary on call_lab_opens(diary_id);

alter table call_lab_diaries enable row level security;
alter table call_lab_opens enable row level security;
-- 정책 없음 = anon/authenticated 전부 차단. service role(API 라우트)만 접근.
