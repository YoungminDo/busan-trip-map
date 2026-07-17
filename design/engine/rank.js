/**
 * 랭킹 파이프라인 — 엔진 코어 (거의 수정할 일 없음)
 * ─────────────────────────────────────────────
 * rank(student, views, ctx) →
 *   ① 후보 생성(retrieval)  : verifiedOnly 등으로 후보 축소
 *   ② 스코어링(scoring)     : Σ(신호값 × 가중치) / Σ|가중치|  (재정규화)
 *   ③ 재정렬(re-rank)       : 정렬 → dedup(사람 1회) → 규칙 적용
 *   반환: [{ view, score, why:[상위 신호], contrib:[전체 기여] }]
 *
 * "왜 추천됐는지"(why)는 기여도 상위 신호에서 자동 생성 → 설명가능성(투명성 원칙).
 */
import { config } from './engine.config.js';
import { FEATURES } from './features.js';

export function scoreOne(student, view, ctx) {
  const contrib = [];
  let sum = 0, wsum = 0;
  for (const f of FEATURES) {
    const w = config.weights[f.key] ?? 0;
    if (!w) continue;                       // 가중치 0 = 신호 꺼짐
    const val = f.fn(student, view, ctx);
    if (val == null) continue;              // 데이터 없음 → 스킵(재정규화)
    const signed = (f.negative ? -1 : 1) * val;
    const part = signed * w;
    sum += part;
    wsum += Math.abs(w);
    contrib.push({ key: f.key, label: f.label, value: val, weight: w, part });
  }
  const score = wsum ? sum / wsum : 0.5;    // 신호 하나도 없으면 중립
  const why = contrib
    .filter(c => c.part > 0)
    .sort((a, b) => b.part - a.part)
    .slice(0, config.rules.explainTopN);
  return { score, why, contrib };
}

export function rank(student, views, ctx = {}) {
  // ① 후보 생성
  let cands = views.filter(v => !config.rules.verifiedOnly || v.verified !== false);

  // ② 스코어링
  let scored = cands.map(v => ({ view: v, ...scoreOne(student, v, ctx) }));

  // ③ 재정렬
  scored.sort((a, b) => b.score - a.score);
  if (config.rules.dedupPerson) {
    const seen = new Set();
    scored = scored.filter(x => {
      const id = x.view.personId ?? x.view.id;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }
  return scored;
}
