# discovery-call — 작업 규칙 (Claude 세션용)

「나를 발견하는 통화」: AI 페르소나가 대학생에게 전화를 걸어 하루를 물어보고, 통화가 일기와
자기발견 프로필이 되는 서비스. **추후 헬로마이미(youngmindo/hello-my-me) 앱에 탑재된다.**

## 구조 (이 경계를 섞지 말 것)

```
discovery-call/
├─ docs/            # 00-결정로그(단일 진실 원장) → 01-전략 → 02-PRD → 03-기술검토 → 04-테스트 → 05-준비킷
├─ server/
│  ├─ discovery_call/   # 비즈니스 규칙 코어 — 외부 API 의존 금지 (순수 로직 + pytest)
│  ├─ agent/            # LiveKit 음성 에이전트 — 외부 API는 여기서만
│  └─ tests/
├─ web-call-lab/    # 헬로마이미 이식용 웹 코드 (경로가 hello-my-me의 src/와 1:1 대응)
└─ archive/         # 폐기물 (app_flutter — D09로 폐기, 삭제하지 말고 보존)
```

이 레포(busan-trip-map)의 `app/`, `components/`는 **별개 프로젝트**(실험 대시보드)다. 건드리지 않는다.

## 규칙

1. **창업자 결정이 나오면**: `docs/00-결정로그.md`에 D번호로 append → 영향 문서 갱신. 문서끼리 어긋나면 결정로그가 우선.
2. **server/discovery_call 변경 시**: `cd server && python3 -m pytest tests/ -q` 필수. 코어에 외부 API 호출을 넣지 않는다 (에이전트/파이프라인 어댑터에서만).
3. **web-call-lab 변경 시**: hello-my-me 클론에 복사해 `npx tsc --noEmit` + eslint 통과 확인 후 커밋. 검증 후 클론은 원상복구(스태시/삭제)한다.
4. **hello-my-me 레포에는 직접 커밋·푸시 금지** — 창업자 승인 후 별도 브랜치+PR로만.
5. 제품 카피 원칙(코드·문서 공통): 스트릭·죄책감 카피 금지 / 성격 단정("~한 사람") 금지 — 바넘 게이트(`mirroring.py`)가 코드로 강제하지만 문서·프롬프트도 동일 기준.
6. 위기 대응(109 프로토콜)은 어떤 기능보다 우선한다. `safety.py` 수정 시 다운그레이드 금지 불변식(테스트) 유지.
7. 커밋 메시지는 한국어, 이 브랜치(claude/heyring-call-method-05nlki)에만 푸시.

## 현재 상태 (2026-07-12)

- 기획·프로세스 문서 완성 / 서버 코어 테스트 41개 통과 / 웹 통화·일기 페이지 tsc·eslint 통과
- **미완**: API 키(LiveKit·Deepgram·OpenAI) 없음 → 에이전트 실행 미검증, 헬로마이미 미배포, R1 미시작
- 다음 마일스톤: 키 확보 → 에이전트 첫 실통화 → 헬로마이미 PR → W0 참가자 발송
