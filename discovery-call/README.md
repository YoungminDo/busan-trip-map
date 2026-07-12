# 나를 발견하는 통화 (Discovery Call)

> 대학생의 하루하루를, 가장 쉽고 꾸준하게 '나를 발견하는 시간'으로 바꾸는 서비스.
> AI 페르소나(보라/무주/해나)가 정한 시간에 전화를 걸어 3–5분 하루를 물어보고,
> 통화 종료 후 "내 말투의 일기 + 내 발화를 인용한 관찰"이 도착한다. **헬로마이미 앱 탑재 예정.**

## 어디부터 읽나

1. **[docs/00-결정로그.md](docs/00-결정로그.md)** — 모든 창업자 결정(D01~)의 원장. 문서가 어긋나면 이게 우선.
2. [docs/01-전략기획안.md](docs/01-전략기획안.md) — 비전·가설·UX·수익모델·리스크·한계
3. [docs/02-제품기획서-MVP.md](docs/02-제품기획서-MVP.md) — 화면·플로우·시스템·대화설계
4. [docs/03-기술검토.md](docs/03-기술검토.md) — 스택 판정 + 헬로마이미 통합 전략 (v2.7: React/Capacitor)
5. [docs/04-테스트프로세스.md](docs/04-테스트프로세스.md) — 베타 37명(동아리) · VoIP 우선 v2
6. [docs/05-W0-준비킷.md](docs/05-W0-준비킷.md) — 동의서·설문·페르소나 스크립트 (즉시 사용 가능)

## 코드

```
server/
├─ discovery_call/    # 비즈니스 규칙 코어 (순수 로직, pytest 41개)
│   scheduler(주5회·재시도·시험기간모드) / conversation(통화 골격) / personas(3종 톤)
│   safety(위기 이중게이트·109) / mirroring(바넘 게이트) / pipeline(일기·관측) / costs(원가 미터)
├─ agent/             # LiveKit 음성 에이전트 (캐스케이드 STT→LLM→TTS) — API 키 확보 후 실행 검증
└─ tests/             # python3 -m pytest tests/ -q

web-call-lab/         # 헬로마이미 이식용 (경로 1:1 대응, tsc·eslint 통과 확인)
│   /call/lab         # 웹 VoIP 통화 페이지 (R1 진입점)
│   /call/lab/diary   # 일기 링크 페이지 (열람 측정)
│   /api/call-lab/*   # 토큰 발급 / 일기 생성·조회 / 열람 기록
└─ supabase/          # 테이블 SQL (RLS 잠금)

archive/app_flutter/  # 폐기 (D09) — 참고용 보존
```

작업 규칙은 [CLAUDE.md](CLAUDE.md) 참고 (결정로그 갱신 규칙, 검증 절차, hello-my-me 푸시 금지 등).

## 현재 상태와 다음 마일스톤

- ✅ 기획·테스트 프로세스 · 서버 코어(테스트 통과) · 웹 통화/일기 페이지(타입체크 통과)
- ⬜ API 키(LiveKit/Deepgram/OpenAI) → 에이전트 첫 실통화
- ⬜ 헬로마이미 PR (승인 대기) → Supabase SQL + Vercel env → 웹 배포
- ⬜ W0: 참가자 37명 동의서·설문 발송 → R1 시작
