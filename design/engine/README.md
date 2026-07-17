# 커피챗 추천 엔진 — 개발자 가이드

설정 주도(config-driven) · 플러그형 신호 · 3단 파이프라인. **데이터가 적은 지금부터 신호가 많아질 미래까지 같은 엔진**이 확장된다.

## 파일 구성

| 파일 | 역할 | 누가 자주 수정? |
|---|---|---|
| `engine.config.js` | 가중치 · 규칙 | 기획/개발 (자주) |
| `features.js` | 신호 함수들 | 개발 (신호 추가 시) |
| `rank.js` | 파이프라인 코어 | 거의 안 함 |

## 쓰는 법

```js
import { rank } from './rank.js';

const student = {
  interestJobs: ['데이터'],
  interestCompanyTypes: ['스타트업'],
  concerns: ['비전공'],
  school: '홍익대',
  seen: new Set(),          // 이미 본 코치 id
};

const views = coaches.flatMap(toViews);   // 아래 매핑 참고
const ctx = { maxExposure: maxOf(views, 'exposure'), seen: student.seen };

const ranked = rank(student, views, ctx);
// ranked[i] = { view, score, why:[{label,part}], contrib:[...] }
ranked.forEach(r => render(r.view, r.score, r.why));
```

### `view` 매핑 (앱 데이터 → 엔진 입력)
멀티프로필은 **회사별 view** 로 펼친다. `personId` 로 사람을 묶어 dedup.

```js
function toViews(coach) {
  const base = { personId: coach.id, help: coach.help, cnt: coach.cnt,
                 timeHours: parseHours(coach.time), school: coach.school,
                 tags: coach.tags, rec: coach.rec, verified: coach.verified !== false,
                 exposure: coach.exposure /* 노출 로그 집계값 */ };
  const profs = coach.profiles || [{ company: coach.company, companyType: coach.companyType,
                                     job: coach.job, roleName: coach.roleName, status: 'current' }];
  return profs.map((p, i) => ({ id: `${coach.id}#${i}`, ...base, ...p }));
}
```

## 확장하기

### 신호 하나 추가 (엔진 수정 없음)
1. `features.js` 배열에 push:
   ```js
   { key: 'faceDiagnosis', label: 'FACE 진단',
     fn: (s, v) => s.faceType ? matchScore(s.faceType, v) : null }  // 데이터 없으면 null
   ```
2. `engine.config.js` weights 에 `faceDiagnosis: 0.6` 추가.
끝. 데이터 없는 학생은 자동 스킵되므로 **콜드스타트에서도 안전**.

### 가중치 튜닝
`engine.config.js` 숫자만 수정. 0 = 신호 끔. 프로토타입의 슬라이더가 이 값을 실시간으로 바꾼다.

### 신호 티어별 도입 (권장 순서)
- **T0(지금):** jobMatch · companyMatch · concernMatch · coachQuality · fairness · freshness
- **T1:** schoolMatch · majorMatch (온보딩 입력)
- **T2:** activityAffinity · purchaseHistory (이벤트 로그)
- **T3:** faceDiagnosis · 안녕하루 (크로스 프로덕트)
- **T4:** 학습된 가중치 · 협업필터링 (로그 충분 시 rank.js 에 러너 추가)

## 파이프라인

```
rank(student, views, ctx)
 ├─ ① retrieval : verifiedOnly 등 후보 축소
 ├─ ② scoring   : score = Σ(signalⱼ × wⱼ) / Σ|wⱼ|   (null 신호는 재정규화로 제외)
 └─ ③ re-rank   : 정렬 → dedupPerson → (확장) diversity/business rules
반환: [{ view, score, why, contrib }]   // why = 설명가능성
```

## 노출 원칙 (중요)
엔진은 **유저에게 보이지 않게** 피드 순서만 정한다. 튜닝 UI(가중치 슬라이더·가상 학생)와 매칭 점수는 **개발자/내부 전용**이다.

| 요소 | 유저(프로덕션) | 개발/내부 |
|---|---|---|
| 랭킹 로직 | 조용히 순서만 결정 | — |
| 가중치 슬라이더 · 가상 학생 · 점수 | ❌ 노출 금지 | ✅ 튜닝/검수 |
| `why`(왜 추천, 한 줄·점수 없이) | 🟡 선택 노출(투명성) | ✅ |

프로토타입에선 튜닝 패널을 **`?debug` / `?dev` / `?eng`** 쿼리에서만 노출한다. 실서비스는 내부 어드민/피처플래그 뒤에 둘 것.

## 거버넌스 (엔진에 박힌 값)
- **적합도 우선**: jobMatch/concernMatch 가중치가 품질보다 큼(인기 아님).
- **공정 노출**: `fairness` 로 저노출 코치 가산 → 독식 방지(코치 명예).
- **설명가능성**: 모든 결과에 `why` 동봉. 블랙박스 금지.
- **콜드스타트 안전**: 데이터 없는 신호는 null → 자동 제외.

## 이벤트 로깅 (엔진의 연료)
랭킹은 impression/click/question/helpful 로그로 학습된다. 노출 시 `impression{student, view.id, position, score}` 를 남겨 T2/T4 신호와 가중치 학습에 사용.

## 로드맵
Phase 0 규칙+로깅 → 1 온보딩(T1) → 2 행동(T2) → 3 크로스프로덕트(T3) → 4 학습랭킹(T4).
자세한 배경은 `../recommendation-engine.html` 참고.
