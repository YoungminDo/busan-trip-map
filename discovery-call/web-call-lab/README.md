# /call/lab — 일기 링크 페이지 (헬로마이미 이식용)

W0 R1(WoZ)에서 통화 후 일기를 **링크로** 전달해 열람률·열람까지의 시간을 측정하는 숨은 라우트.
R2(웹 통화 베타)의 기반 화면이기도 하다. 헬로마이미(`hello-my-me`) 컨벤션에 맞춰 작성됨
(`@/lib/supabase` 서비스롤 프록시, ulid, App Router).

## 이식 방법 (hello-my-me 레포에)

1. `src/` 아래 파일들을 동일 경로로 복사:
   - `src/app/call/lab/diary/[id]/page.tsx` (+ `open-beacon.tsx`, `transcript-toggle.tsx`)
   - `src/app/api/call-lab/diary/route.ts`
   - `src/app/api/call-lab/open/route.ts`
2. Supabase SQL 적용: `supabase/call-lab.sql` (RLS 잠금 — service role만 접근)
3. Vercel 환경변수 추가: `CALL_LAB_ADMIN_SECRET` (일기 생성 API 보호용, 랜덤 문자열)
4. 웹 배포만으로 반영 — 앱(Capacitor 셸) 업데이트·심사 불필요 (원격 로드 구조)

## WoZ 운영 흐름

```
통화 종료 → 전사 → LLM 일기+미러링 생성 → 운영자 검수(첫 2주 전수 QA)
→ POST /api/call-lab/diary (x-call-lab-secret 헤더) → 응답의 url을 카톡 발송
→ 참가자가 링크를 열면 call_lab_opens에 자동 기록
→ 운영자: GET /api/call-lab/diary?code=P01 로 참가자별 열람 현황 확인
```

## 개인정보 설계

- DB에는 실명·전화번호를 넣지 않는다 — 참가자 코드(P01~P37)만. 매핑표는 운영자 로컬 시트에만.
- 링크 id는 ulid(추측 불가) = 접근 키. 검색엔진 noindex.
- 삭제 요청 시 `call_lab_diaries` 행 삭제(전사·열람 기록 cascade).

## 상태

- 코드 리뷰·타입 체크 완료 기준으로 작성. **hello-my-me 안에서 `npx tsc --noEmit` 통과 확인 후 배포할 것** (이 레포에는 Next.js 툴체인이 없어 여기서는 정적 검증만 수행).
