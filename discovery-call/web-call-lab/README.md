# /call/lab — 웹 VoIP 통화 + 일기 링크 (헬로마이미 이식용)

R1 웹 VoIP 베타(테스트프로세스 v2)의 클라이언트 전체: **통화 페이지**(알림톡 링크 → 브라우저 통화)와
**일기 링크 페이지**(열람률·열람까지 시간 측정). 헬로마이미(`hello-my-me`) 컨벤션에 맞춰 작성됨
(`@/lib/supabase` 서비스롤 프록시, ulid, App Router). 서버 상대역은 `../server/agent/voice_agent.py`.

## 이식 방법 (hello-my-me 레포에)

1. `src/` 아래 파일들을 동일 경로로 복사:
   - `src/app/call/lab/page.tsx` + `call-client.tsx` (통화 페이지)
   - `src/app/call/lab/diary/[id]/page.tsx` (+ `open-beacon.tsx`, `transcript-toggle.tsx`)
   - `src/app/api/call-lab/token/route.ts` (룸 생성 + 토큰)
   - `src/app/api/call-lab/diary/route.ts`, `src/app/api/call-lab/open/route.ts`
2. 의존성 추가: `npm i livekit-client livekit-server-sdk`
3. Supabase SQL 적용: `supabase/call-lab.sql` (RLS 잠금 — service role만 접근)
4. Vercel 환경변수:
   - `CALL_LAB_ADMIN_SECRET` (일기 생성 API 보호)
   - `CALL_LAB_PARTICIPANTS` ("P01,P02,…" 초대 명단)
   - `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET` / `NEXT_PUBLIC_LIVEKIT_URL`
5. 웹 배포만으로 반영 — 앱(Capacitor 셸) 업데이트·심사 불필요 (원격 로드 구조)

## R1 운영 흐름 (VoIP)

```
[발송] 정해진 시간에 알림톡/문자: "보라가 기다리고 있어요 📞 /call/lab?code=P01&persona=bora"
→ 참가자 탭 → 통화 시작 (토큰 발급 → LiveKit 룸 → voice_agent 배정)
→ 통화 종료 시 에이전트가 일기+미러링 생성 (바넘 게이트 자동 검증)
   → POST /api/call-lab/diary → 운영자 검수 후 링크 카톡 발송
→ 참가자가 링크를 열면 call_lab_opens에 자동 기록
→ 운영자: GET /api/call-lab/diary?code=P01 로 참가자별 열람 현황 확인
```

## 개인정보 설계

- DB에는 실명·전화번호를 넣지 않는다 — 참가자 코드(P01~P37)만. 매핑표는 운영자 로컬 시트에만.
- 링크 id는 ulid(추측 불가) = 접근 키. 검색엔진 noindex.
- 삭제 요청 시 `call_lab_diaries` 행 삭제(전사·열람 기록 cascade).

## 상태

- 코드 리뷰·타입 체크 완료 기준으로 작성. **hello-my-me 안에서 `npx tsc --noEmit` 통과 확인 후 배포할 것** (이 레포에는 Next.js 툴체인이 없어 여기서는 정적 검증만 수행).
