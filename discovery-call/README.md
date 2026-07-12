# 나를 발견하는 통화 (Discovery Call)

> 대학생의 하루하루를, 가장 쉽고 꾸준하게 '나를 발견하는 시간'으로 바꾸는 서비스.
> AI 페르소나가 정한 시간에 진짜 전화(CallKit)를 걸어 3–5분 하루를 물어보고,
> 통화 종료 30초 안에 "내 말투의 일기 + 내 발화를 인용한 관찰"이 도착한다.

## 구조

```
discovery-call/
├─ docs/                  # 기획 문서 (의사결정의 원본)
│  ├─ 전략기획안.md         # v2.5 — 비전·가설·UX·수익모델·리스크·한계
│  ├─ 제품기획서-MVP.md     # PRD — 화면·플로우·시스템·대화설계·10주 계획
│  └─ 기술검토.md           # 스택 판정 + 실기기 스파이크로 이월된 항목
├─ server/                # 서버 코어 — 비즈니스 규칙 레이어 (Python, 테스트 41개)
│  ├─ discovery_call/
│  │  ├─ domain.py        # 도메인 모델 (통화 상태머신, 관측 스키마)
│  │  ├─ personas.py      # 페르소나 3종 톤 레이어 + 공유 코어 정책
│  │  ├─ conversation.py  # 통화 골격: 체크인→메인→반영→연착륙 랩업, 침묵 정책
│  │  ├─ scheduler.py     # 주 5회 쿼터·재시도·거절 3옵션·시험기간 모드·킬스위치
│  │  ├─ safety.py        # 위기 프로토콜 (이중 게이트, 109, 페르소나 오버라이드)
│  │  ├─ mirroring.py     # 바넘 게이트: 직접 인용 강제 + 성격어휘 필터 (10회 미만)
│  │  ├─ pipeline.py      # 오디오 저장 게이트→일기→관측 추출→주간 통합→콜백 선정
│  │  └─ costs.py         # 원가 대시보드 + self-host 트리거 (월 100만 원)
│  └─ tests/
└─ app_flutter/           # iOS 앱 스캐폴드 (⚠️ 실기기 검증 전 — Week 1–2 스파이크)
```

## 서버 코어 테스트

```bash
cd discovery-call/server && python3 -m pytest tests/ -q
```

## 설계 원칙 (코드에 강제된 것)

1. **원본 오디오 저장 확인 없이는 통화가 '완료'되지 않는다** — `pipeline.finalize_call`
2. **바넘 게이트**: 미러링은 실제 발화 인용 필수, 대화 10회 미만 유저에게 성격 어휘 금지 — `mirroring.validate`
3. **죄책감 제로**: 거절 3옵션 무페널티, 스트릭 없음 — `scheduler.decline_followup`
4. **위기 시 페르소나보다 안전**: 어휘 게이트는 LLM이 다운그레이드 못 함 — `safety.assess`
5. **모순된 관측은 덮어쓰지 않고 superseded** — 변화 자체가 자기발견 콘텐츠 — `pipeline.consolidate`
6. **통화 삭제 시 파생 인사이트도 삭제** — `pipeline.delete_call_cascade`

## 다음 단계

1. **Week 0–2 WoZ**: Vapi/Retell PSTN으로 대학생 30–50명 × 14일 — 응답률 60% 게이트 (앱 개발 착수 조건)
2. **Week 1–2 스파이크**: 실기기 CallKit E2E + 지연 1.5초 실측 + TTS 블라인드 선정
3. Week 3–10: PRD 8장 개발 계획
