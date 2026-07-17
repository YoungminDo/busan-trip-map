/**
 * 추천 엔진 설정 (편집 지점)
 * ─────────────────────────────────────────────
 * 기획자/개발자는 대부분 이 파일만 수정한다.
 *  - weights : 각 신호(feature)의 가중치. 0이면 그 신호는 꺼짐.
 *  - rules   : 재정렬/후처리 규칙 on/off.
 * 신호 자체를 추가/제거하려면 features.js 를 수정한다.
 */
export const config = {
  weights: {
    // 관련성 (적합도 우선 원칙)
    jobMatch:     1.0,  // 관심 직무영역 ↔ 코치 직무
    companyMatch: 0.8,  // 관심 회사유형 ↔ 코치 업무영역
    concernMatch: 0.9,  // 학생 고민 ↔ 코치 추천대상/태그
    // 신뢰/품질
    coachQuality: 0.7,  // 도움% · 응답속도 · 질문수
    // 개인화(있으면 가산)
    schoolMatch:  0.5,  // 동문
    freshness:    0.3,  // 재직중/최근 활동
    // 거버넌스
    fairness:     0.4,  // 저노출 코치 가산 (독식 방지 = 코치 명예)
    seenPenalty:  0.6,  // 이미 본 코치 감점 (음수로 적용)
  },
  rules: {
    verifiedOnly: true,   // 검증 통과 코치만 후보
    dedupPerson:  true,   // 한 사람은 결과에 1회 (프로필 여러 개여도)
    explainTopN:  2,      // "왜 추천됐는지" 상위 N개 신호 노출
  },
};
