/**
 * 신호(Feature) 정의 — 확장 지점
 * ─────────────────────────────────────────────
 * 신호 하나 = 순수 함수 하나. (student, view, ctx) → 0..1 | null
 *   - null 반환 = "이 학생/코치에 대해 판단할 데이터 없음" → 점수 계산에서 스킵(재정규화)
 *   - negative:true = 값이 클수록 감점 (예: 이미 본 코치)
 *
 * 새 신호 추가법:
 *   1) 아래 배열에 { key, label, fn } 하나 push
 *   2) engine.config.js weights 에 key 가중치 추가
 *   → 엔진(rank.js) 수정 불필요. 이것이 확장성의 핵심.
 *
 * `view` 기대 형태 (앱 이식 시 이 shape 로 매핑):
 *   { id, company, companyType, job, roleName, status:'current'|'past',
 *     help, cnt, timeHours, school, tags:[], rec:[], verified, exposure }
 * `student`: { interestJobs:[], interestCompanyTypes:[], concerns:[], school, seen:Set }
 * `ctx`: { maxExposure } 등 전역 통계
 */

const overlap = (a = [], b = []) => a.some(x => b.some(y => y.includes(x) || x.includes(y)));
const clamp01 = n => Math.max(0, Math.min(1, n));

export const FEATURES = [
  {
    key: 'jobMatch', label: '직무 관심',
    fn: (s, v) => s.interestJobs?.length ? (s.interestJobs.some(j => v.job.includes(j)) ? 1 : 0) : null,
  },
  {
    key: 'companyMatch', label: '회사유형 관심',
    fn: (s, v) => s.interestCompanyTypes?.length
      ? (s.interestCompanyTypes.some(t => v.companyType.includes(t)) ? 1 : 0) : null,
  },
  {
    key: 'concernMatch', label: '고민 적합',
    fn: (s, v) => s.concerns?.length ? (overlap(s.concerns, [...(v.rec || []), ...(v.tags || [])]) ? 1 : 0) : null,
  },
  {
    key: 'coachQuality', label: '품질',
    // 도움% (0..1) 60% + 응답속도 20% + 질문수(경험) 20%
    fn: (s, v) => clamp01(
      (v.help / 100) * 0.6 +
      clamp01(1 - (v.timeHours || 24) / 48) * 0.2 +
      clamp01((v.cnt || 0) / 50) * 0.2
    ),
  },
  {
    key: 'schoolMatch', label: '동문',
    fn: (s, v) => s.school ? (s.school === v.school ? 1 : 0) : null,
  },
  {
    key: 'freshness', label: '활성',
    fn: (s, v) => v.status === 'current' ? 1 : 0.6,
  },
  {
    key: 'fairness', label: '공정 노출',
    // 노출이 적을수록(=신규/저노출) 가산 → 특정 코치 독식 방지
    fn: (s, v, ctx) => clamp01(1 - (v.exposure || 0) / (ctx?.maxExposure || 1)),
  },
  {
    key: 'seenPenalty', label: '이미 본', negative: true,
    fn: (s, v, ctx) => ctx?.seen?.has(v.id) ? 1 : 0,
  },
];
