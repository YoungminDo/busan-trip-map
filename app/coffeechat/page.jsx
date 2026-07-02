'use client';
import React, { useState, useCallback } from "react";

/* ================= 데이터 ================= */
const coaches = [
  {
    id: "han", role: "데이터 분석 리더", yr: "17년차", meta: "데이터 분석 · 핀테크 · 비전공 출신",
    company: "토스", companyType: "핀테크 유니콘", job: "데이터 분석",
    q: "비전공자인데 데이터 분석가가 될 수 있을까요?", tags: ["#비전공자", "#데이터입문", "#포트폴리오"],
    help: 94, cnt: 31, time: "평균 12시간", name: "한태용",
    mission: "통계·코딩 전공이 아니어도 데이터 일은 가능해요. 전공자와 비전공자 모두의 로드맵을 함께 그려드릴게요.",
    good: ["비전공자인데 데이터 분석가가 될 수 있을까요?", "포트폴리오는 뭐부터 만들어야 하나요?"],
    hard: ["특정 회사의 연봉·내부 처우 등 대외비", "합격 보장·채용 추천 요청"],
    rec: ["#비전공이불안한", "#데이터입문", "#첫커리어고민"],
    style: ["현실적", "구체적", "단계별"],
    sampleQ: "비전공자, 뭐부터 시작하죠?",
    sampleA: "“SQL부터 시작하세요. 코딩보다 데이터로 질문에 답하는 감각이 먼저예요. 비전공자도 2~3주면 감을 잡습니다…”",
    reviewTags: ["#현실적", "#방향정리"], review: "“막연했던 데이터 직무가 구체적으로 그려졌어요. 뭐부터 할지 정해졌습니다.”", reviewBy: "문과 3학년 · 매우 도움이 됐어요",
  },
  {
    id: "min", role: "사업개발(BD) 리더", yr: "15년차", meta: "BD · 사업개발 · 외국계/글로벌",
    company: "존슨앤존슨", companyType: "글로벌 헬스케어", job: "사업개발(BD)",
    q: "외국계 BD, 신입은 어떻게 준비하나요?", tags: ["#BD", "#사업개발", "#외국계"],
    help: 91, cnt: 24, time: "평균 20시간", name: "민영호",
    mission: "외국계·스타트업·글로벌의 BD가 회사마다 어떻게 다른지, 15년간 겪은 걸 솔직하게 풀어드릴게요.",
    good: ["외국계 BD는 어떤 일을 하나요?", "영어 실력은 어느 정도 필요한가요?"],
    hard: ["특정 회사 합격 가능성 평가", "내부 조직도·연봉 정보"],
    rec: ["#외국계궁금", "#사업개발관심", "#영어커리어"],
    style: ["넓은 시야", "사례 중심", "솔직함"],
    sampleQ: "BD는 영업이랑 뭐가 다른가요?",
    sampleA: "“영업이 계약을 닫는 일이라면, BD는 없던 판을 만드는 일이에요. 신입 때 가장 도움 된 건…”",
    reviewTags: ["#시야가넓어짐"], review: "“막연히 멋있어 보였던 BD의 실체를 알게 됐어요.”", reviewBy: "경영 4학년 · 도움이 됐어요",
  },
  {
    id: "lee", role: "UX/UI 디자이너", yr: "주니어", meta: "UX/UI · IT 스타트업 · 학생과 가까운 연차",
    company: "당근", companyType: "IT 스타트업", job: "UX/UI 디자인",
    q: "신입 디자이너 포트폴리오, 뭐가 중요해요?", tags: ["#UXUI", "#디자이너", "#포트폴리오"],
    help: 96, cnt: 18, time: "평균 6시간", name: "이민지",
    mission: "학생과 가장 가까운 신입 디자이너예요. 진로 고민, 같이 풀어봐요!",
    good: ["포트폴리오에 뭘 넣어야 하나요?", "비전공자도 디자이너가 될 수 있나요?"],
    hard: ["특정 회사 디자인팀 내부 사정", "합격 보장"],
    rec: ["#디자인입문", "#포트폴리오고민", "#첫취업"],
    style: ["따뜻함", "공감", "현실적"],
    sampleQ: "포트폴리오, 프로젝트 몇 개가 적당해요?",
    sampleA: "“개수보다 ‘과정’이 보이는 프로젝트 2~3개가 나아요. 왜 그렇게 결정했는지가 핵심이에요…”",
    reviewTags: ["#따뜻한조언", "#현실적"], review: "“나이 차이가 적어 더 편하게 물어볼 수 있었어요.”", reviewBy: "시디 2학년 · 매우 도움이 됐어요",
  },
  {
    id: "kang", role: "마케팅 리더", yr: "12년차", meta: "마케팅 전략 · IT 플랫폼 · 브랜드/그로스",
    company: "네이버", companyType: "IT 플랫폼", job: "마케팅",
    q: "마케팅 직무가 이렇게 많은데 뭘 골라야 하죠?", tags: ["#마케팅전략", "#브랜드", "#그로스"],
    help: 93, cnt: 37, time: "평균 15시간", name: "강우연",
    mission: "브랜드·퍼포먼스·그로스·전략 등 마케팅 직무를 12년 시선으로 한눈에 정리해드릴게요.",
    good: ["브랜드 마케팅과 퍼포먼스 마케팅의 차이는?", "문과생이 마케터가 되려면?"],
    hard: ["특정 회사 마케팅 예산·내부 지표", "합격 보장"],
    rec: ["#마케팅이막연한", "#문과생", "#직무탐색"],
    style: ["구조적", "명쾌함", "사례 중심"],
    sampleQ: "마케팅 직무가 너무 많아 헷갈려요.",
    sampleA: "“크게 브랜드/퍼포먼스/그로스 3축으로 보면 쉬워요. 각각 성향이 다른데…”",
    reviewTags: ["#정리가명쾌"], review: "“흩어져 있던 마케팅 직무가 한 장으로 정리됐어요.”", reviewBy: "문과 3학년 · 매우 도움이 됐어요",
  },
];

const FILTERS = ["추천순 ▾", "내 상황", "직무", "회사유형", "응답 빠른순", "도움 많은순"];
const ANSWER_MODES = ["현실적으로", "단계별로", "따뜻하게", "짧고 핵심만"];

const TABS = [
  { k: "home", label: "홈", path: "M4 11l8-7 8 7M6 10v9h12v-9" },
  { k: "prog", label: "프로그램", path: "M6 3h9l3 3v15H6z M9 8h6 M9 12h6" },
  { k: "list", label: "커피챗", path: "M4 8h13v5a4 4 0 01-4 4H8a4 4 0 01-4-4z M17 9h2a2 2 0 010 4h-2" },
  { k: "job", label: "채용소식", path: "M3 7l9-4 9 4-9 4z M3 7v6l9 4 9-4V7" },
  { k: "comm", label: "커뮤니티", path: "M4 5h16v10H9l-4 4z" },
];

const FaceSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);
const Verify = ({ text = "헬로마이미 검증 파트너" }) => (
  <span className="verify"><span className="ck">✓</span>{text}</span>
);

/* ================= 컴포넌트 ================= */
export default function CoffeeChat() {
  const [stack, setStack] = useState(["list"]);
  const [selected, setSelected] = useState("han");
  const [filters, setFilters] = useState([true, false, false, false, false, false]);
  const [variant, setVariant] = useState("company"); // 'role' | 'company'(가설)
  const [modes, setModes] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  const screen = stack[stack.length - 1];
  const coach = coaches.find((c) => c.id === selected) || coaches[0];

  const go = useCallback((id) => setStack((s) => [...s, id]), []);
  const back = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), []);
  const openCoach = useCallback((id) => { setSelected(id); setStack((s) => [...s, "detail"]); }, []);
  const tabGo = useCallback((k) => {
    if (k === "home" || k === "list") setStack([k]);
    else showToast("프로토타입에서는 홈/커피챗만 열려요");
  }, []);
  const toggleFilter = (i) => { if (i === 0) return; setFilters((f) => f.map((v, idx) => (idx === i ? !v : v))); };
  const toggleMode = (m) => setModes((ms) => (ms.includes(m) ? ms.filter((x) => x !== m) : [...ms, m]));

  let toastTimer;
  function showToast(msg) {
    setToastMsg(msg);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToastMsg(""), 1600);
  }

  const Tabbar = ({ active }) => (
    <nav className="tabbar">
      {TABS.map((t) => (
        <div key={t.k} className={`tb ${t.k === active ? "on" : ""}`} onClick={() => tabGo(t.k)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={t.path} /></svg>
          {t.label}
        </div>
      ))}
    </nav>
  );

  const RoleTitle = ({ c }) =>
    variant === "company" ? (
      <>
        <div className="role"><span className="co">{c.company}</span> · {c.job} <span className="yr">· {c.yr}</span></div>
        <div className="meta">{c.companyType} · {c.role}</div>
      </>
    ) : (
      <>
        <div className="role">{c.role} <span className="yr">· {c.yr}</span></div>
        <div className="meta">{c.meta}</div>
      </>
    );

  const CoachCard = ({ c }) => (
    <div className="ccard" onClick={() => openCoach(c.id)}>
      <Verify />
      <RoleTitle c={c} />
      <div className="qbox"><div className="l">이런 질문에 잘 답해요</div><div className="q">“{c.q}”</div></div>
      <div className="tags" style={{ marginTop: 11 }}>{c.tags.map((t) => <span key={t} className="tag b">{t}</span>)}</div>
      <div className="metrics"><span className="s">도움됐어요 {c.help}%</span><span className="d">·</span><span>질문 {c.cnt}개</span><span className="d">·</span><span>{c.time}</span></div>
      <div className="cfoot"><div className="face sm"><FaceSvg /></div><div className="nm"><b>{c.name}</b> 파트너</div></div>
    </div>
  );

  const HomeCard = ({ c }) => (
    <div className="hc" onClick={() => openCoach(c.id)}>
      <Verify text="검증 파트너" />
      {variant === "company"
        ? <div className="role"><span className="co">{c.company}</span> · {c.job} <span className="yr">· {c.yr}</span></div>
        : <div className="role">{c.role} <span className="yr">· {c.yr}</span></div>}
      <div className="q">“{c.q}”</div>
      <div className="mini">{c.id === "lee" ? <span className="s">학생과 가장 가까운 연차</span> : <><span className="s">도움됐어요 {c.help}%</span> · {c.time}</>}</div>
      <div className="who"><div className="face sm"><FaceSvg /></div><div className="n">{c.name} 파트너</div></div>
    </div>
  );

  return (
    <div className="stagewrap">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="headline">
        <span className="k">HELLO MYME · 커피챗</span>
        <h1>검증된 커리어 파트너에게 정중하게 질문하세요</h1>
      </div>

      <div className="phone">
        <div className="notch" />
        <div className="screenwrap">
          <div className={`statusbar ${screen === "done" ? "" : "onbrand"}`}><span>9:41</span><span>5G ⏹ 🔋</span></div>

          {/* ===== 리스트 ===== */}
          <section className={`screen ${screen === "list" ? "active" : ""}`}>
            <div className="topbar"><div className="ttl">커피챗</div><div className="sp" /><div className="coin">🎫 티켓 1</div></div>
            <div className="scroll">
              <div className="pad" style={{ paddingBottom: 6 }}>
                <div className="search" onClick={() => go("write")}><span className="i">✎</span><span className="ph">어떤 커리어 고민이 있나요?</span></div>
                <div className="guide" style={{ marginTop: 11 }} onClick={() => showToast("활용 가이드는 프로토타입에서 생략")}><span className="e">📄</span><span className="t">커피챗 활용 가이드</span><span className="a">›</span></div>
              </div>
              <div className="filters">
                {FILTERS.map((f, i) => <div key={f} className={`fp ${filters[i] ? "on" : ""}`} onClick={() => toggleFilter(i)}>{f}</div>)}
              </div>
              <div className="pad" style={{ paddingTop: 2 }}>
                <div className="sec-h">현직자 커피챗</div>
                <div className="sec-sub">헬로마이미가 직접 검증한 현직자예요. <b>내 질문에 맞는지</b> 먼저 보세요.</div>
                <div className="seg">
                  <div className={`seg-b ${variant === "role" ? "on" : ""}`} onClick={() => setVariant("role")}>역할 중심</div>
                  <div className={`seg-b ${variant === "company" ? "on" : ""}`} onClick={() => setVariant("company")}>회사·직무 중심 <span className="hy">가설</span></div>
                </div>
                {coaches.map((c) => <CoachCard key={c.id} c={c} />)}
              </div>
            </div>
            <Tabbar active="list" />
          </section>

          {/* ===== 홈 ===== */}
          <section className={`screen ${screen === "home" ? "active" : ""}`}>
            <div className="topbar"><div className="ttl" style={{ color: "var(--brand-ink)" }}>hello, myme</div><div className="sp" /><div className="ic">🔔</div></div>
            <div className="scroll">
              <div className="pad">
                <div className="promo"><div className="cc">CAREER COUNSELING</div><div className="tt">FACE 커리어 진로상담</div><div className="dd">나를 이해하고, 진로를 설계하다 · ~8/31</div></div>
                <div className="sec-h" style={{ marginTop: 24 }}>지금 물어볼 수 있는 파트너 <span className="more">더보기</span></div>
                <div className="sec-sub">얼굴이 아니라 <b>질문 적합도</b>로 골라요.</div>
              </div>
              <div className="hrow">{coaches.map((c) => <HomeCard key={c.id} c={c} />)}</div>
              <div className="pad" style={{ paddingTop: 8 }}>
                <div className="sec-h">지금 많이 묻는 질문</div>
                <div className="popq">
                  {["스타트업 첫 커리어, 괜찮을까요?", "무스펙인데 지금 뭐부터 해야 하나요?", "대기업 vs 스타트업 어디가 맞을까요?"].map((q) => (
                    <div key={q} className="row" onClick={() => go("write")}><span className="qm">Q</span> {q}</div>
                  ))}
                </div>
              </div>
            </div>
            <Tabbar active="home" />
          </section>

          {/* ===== 코치 상세 ===== */}
          <section className={`screen ${screen === "detail" ? "active" : ""}`}>
            <div className="topbar"><button className="ic" onClick={back}>‹</button><div className="ttl">파트너</div><div className="sp" /><button className="ic" onClick={() => showToast("찜했어요")}>♡</button></div>
            <div className="scroll">
              <div className="detail-hero">
                <Verify />
                {variant === "company" ? (
                  <>
                    <div className="role"><span className="co">{coach.company}</span> · {coach.job} <span className="yr">· {coach.yr}</span></div>
                    <div className="meta">{coach.companyType} · {coach.role}</div>
                  </>
                ) : (
                  <>
                    <div className="role">{coach.role} <span className="yr">· {coach.yr}</span></div>
                    <div className="meta">{coach.meta}</div>
                  </>
                )}
                <div className="mission"><div className="l">파트너 미션</div><div className="t">“{coach.mission}”</div></div>
              </div>
              <div className="pad">
                <div className="dsec">이런 질문에 잘 답해요</div>
                {coach.good.map((q) => <div key={q} className="qline"><span className="m">Q</span>{q}</div>)}
                <div className="dsec">이런 질문은 조금 어려워요</div>
                {coach.hard.map((q) => <div key={q} className="qline hard"><span className="m">–</span>{q}</div>)}
                <div className="dsec">특히 이런 학생에게 추천해요</div>
                <div className="tags">{coach.rec.map((t) => <span key={t} className="tag b">{t}</span>)}</div>
                <div className="dsec">답변 스타일</div>
                <div className="tags">{coach.style.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                <div className="dsec">도움 지표</div>
                <div className="statbox">
                  <div><div className="v">{coach.help}%</div><div className="kk">도움됐어요</div></div>
                  <div><div className="v">{coach.cnt}개</div><div className="kk">받은 질문</div></div>
                  <div><div className="v">{coach.time.replace("평균 ", "")}</div><div className="kk">평균 응답</div></div>
                </div>
                <div className="dsec">답변 샘플</div>
                <div className="sample"><div className="q">Q. {coach.sampleQ}</div><div className="a">{coach.sampleA} <span style={{ color: "var(--muted)" }}>(미리보기)</span></div></div>
                <div className="dsec">도움 후기</div>
                <div className="review"><div className="tags" style={{ marginBottom: 8 }}>{coach.reviewTags.map((t) => <span key={t} className="tag b">{t}</span>)}</div><div className="txt">{coach.review}</div><div className="by">{coach.reviewBy}</div></div>
              </div>
            </div>
            <div className="ctabar">
              <button className="cta" onClick={() => go("write")}>🎫 질문 티켓으로 물어보기</button>
              <div className="ctasub">990원 · 정중하게 질문 1개를 남길 수 있어요</div>
            </div>
          </section>

          {/* ===== 질문 작성 ===== */}
          <section className={`screen ${screen === "write" ? "active" : ""}`}>
            <div className="topbar"><button className="ic" onClick={back}>‹</button><div className="ttl">질문 작성</div></div>
            <div className="scroll">
              <div className="pad">
                <div className="guidebox">
                  <div className="l">좋은 질문 가이드</div>
                  <ol className="steps"><li>내 상황을 짧게 알려주세요.</li><li>궁금한 걸 한 가지로 좁혀주세요.</li><li>원하는 답변 방향을 말해주세요.</li></ol>
                </div>
                <div className="sec-h">묻고 싶은 질문 <span className="more" style={{ color: "var(--brand-ink)" }}>1개</span></div>
                <textarea className="field" placeholder="예) 데이터 분석에 관심 있는 3학년 문과생인데, 코딩 경험이 거의 없습니다. 이번 방학에 무엇부터 준비하면 좋을까요?" />
                <div className="sec-h">내 상황 <span className="more">파트너가 맥락을 이해해요</span></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                  <input className="field" placeholder="학년 (예: 3학년)" style={{ gridColumn: "span 2" }} />
                  <input className="field" placeholder="전공" /><input className="field" placeholder="관심 직무" />
                </div>
                <div className="sec-h">원하는 답변 방식</div>
                <div className="tags">{ANSWER_MODES.map((m) => <div key={m} className={`seltag ${modes.includes(m) ? "on" : ""}`} onClick={() => toggleMode(m)}>{m}</div>)}</div>
              </div>
            </div>
            <div className="ctabar"><button className="cta" onClick={() => go("pay")}>질문 미리보고 티켓 사용하기</button></div>
          </section>

          {/* ===== 결제 ===== */}
          <section className={`screen ${screen === "pay" ? "active" : ""}`}>
            <div className="topbar"><button className="ic" onClick={back}>‹</button><div className="ttl">질문 티켓</div></div>
            <div className="scroll">
              <div className="pad">
                <div className="ticket">
                  <div className="tp">🎫 질문 티켓 1장</div>
                  <div className="pr">990원</div>
                  <div className="ds">현직자의 시간을 존중하며,<br />정중하게 질문 1개를 남길 수 있어요.</div>
                  <div className="ln" />
                  <div style={{ fontSize: 12, opacity: 0.92, lineHeight: 1.55 }}>무료 DM은 학생도 망설여지고, 현직자도 답하기 어렵습니다. 헬로마이미는 <b>부담 없이 묻고 정중하게 답하는 구조</b>를 만듭니다.</div>
                </div>
                <div className="sec-h">보내는 질문</div>
                <div className="qbox">
                  <div className="q" style={{ fontSize: 13 }}>“데이터 분석에 관심 있는 3학년 문과생인데, 코딩 경험 없이 방학에 뭐부터 준비하면 좋을까요?”</div>
                  <div className="cfoot"><div className="face sm"><FaceSvg /></div><div className="nm"><b>{coach.role} · {coach.yr}</b><br />{coach.name} 파트너</div></div>
                </div>
                <div className="safe" style={{ marginTop: 13 }}>
                  <div className="r"><span className="c">✓</span><span>답변이 없으면 티켓은 <b>자동으로 복구</b>돼요.</span></div>
                  <div className="r"><span className="c">✓</span><span>전송 전까지 질문을 <b>수정</b>할 수 있어요.</span></div>
                  <div className="r"><span className="c">✓</span><span>답변은 평균 <b>24시간 내</b> 도착해요.</span></div>
                </div>
              </div>
            </div>
            <div className="ctabar">
              <button className="cta amber" onClick={() => go("done")}>🎫 질문 티켓 사용하기</button>
              <div className="ctasub">결제 즉시 파트너에게 정중하게 전달돼요</div>
            </div>
          </section>

          {/* ===== 완료 ===== */}
          <section className={`screen ${screen === "done" ? "active" : ""}`}>
            <div className="scroll">
              <div className="done-hero">
                <div className="circle">✓</div>
                <h2>질문이 파트너에게<br />전달되었어요</h2>
                <p>평균 24시간 내 답변을 받을 수 있어요.<br />도착하면 알림으로 알려드릴게요.</p>
              </div>
              <div className="pad">
                <div className="safe" style={{ padding: 18 }}>
                  <div className="timeline">
                    <div className="titem done"><div className="nd" /><div className="t">질문 접수 완료</div><div className="d">방금 전</div></div>
                    <div className="titem now"><div className="nd" /><div className="t">파트너에게 전달됨</div><div className="d">확인 대기 중</div></div>
                    <div className="titem"><div className="nd" /><div className="t">답변 작성 중</div><div className="d">예상 ~내일 오전</div></div>
                    <div className="titem"><div className="nd" /><div className="t">답변 도착 · 알림</div><div className="d" /></div>
                  </div>
                </div>
                <div className="safe" style={{ marginTop: 12, padding: "13px 15px" }}><div className="r"><span className="c">✎</span><span>파트너가 확인하기 전까지 질문을 <b>수정</b>할 수 있어요.</span></div></div>
              </div>
            </div>
            <div className="ctabar"><button className="cta ghost" onClick={() => setStack(["list"])}>다른 파트너 둘러보기</button></div>
          </section>

          <div className={`toast ${toastMsg ? "show" : ""}`}>{toastMsg}</div>
        </div>
      </div>

      <div className="hint">💡 <b>코치 카드를 탭</b>하면 상세로, <b>질문 티켓으로 물어보기</b>를 누르면 작성→결제→완료 흐름이 이어집니다. 하단 탭바에서 <b>홈</b>도 확인해 보세요.</div>
    </div>
  );
}

/* ================= 스타일 ================= */
const CSS = `
:root{
  --ink:#1B2733; --ink-soft:#51606E; --muted:#94A1AE; --line:#EBEEF1; --line-soft:#F3F6F8;
  --bg:#F5F8F9; --card:#FFFFFF;
  --brand:#12B5A6; --brand-ink:#0C8578; --brand-deep:#0A6E63; --brand-soft:#E3F7F4; --brand-soft2:#EFFAF8;
  --amber:#E9962E; --amber-soft:#FCF1DE;
  --chip:#EEF1F3; --chip-ink:#54626F;
  --shadow:0 1px 2px rgba(20,40,50,.05),0 10px 26px rgba(20,40,50,.07);
  --font:"Pretendard","Apple SD Gothic Neo",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Malgun Gothic",sans-serif;
}
.stagewrap *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
.stagewrap{background:#DDE4E6;font-family:var(--font);color:var(--ink);-webkit-font-smoothing:antialiased;line-height:1.5;
  min-height:100vh;display:flex;flex-direction:column;align-items:center;gap:14px;padding:26px 16px 60px}
.headline{text-align:center;max-width:420px}
.headline .k{display:inline-block;font-size:11px;font-weight:800;letter-spacing:.1em;color:var(--brand-ink);background:var(--brand-soft);padding:5px 11px;border-radius:999px}
.headline h1{font-size:18px;font-weight:800;margin:9px 0 4px;letter-spacing:-.02em}
.phone{width:390px;background:#0E1418;border-radius:46px;padding:11px;box-shadow:0 30px 60px rgba(10,20,25,.28);position:relative}
.notch{position:absolute;top:22px;left:50%;transform:translateX(-50%);width:118px;height:26px;background:#0E1418;border-radius:999px;z-index:60}
.screenwrap{background:var(--bg);border-radius:36px;height:820px;overflow:hidden;position:relative}
.statusbar{height:46px;display:flex;align-items:flex-end;justify-content:space-between;padding:0 26px 5px;font-size:13px;font-weight:700;position:relative;z-index:10;background:var(--bg)}
.statusbar.onbrand{background:#fff}
.screen{position:absolute;inset:0;top:46px;bottom:0;display:none;flex-direction:column;background:var(--bg)}
.screen.active{display:flex;animation:fade .22s ease}
@keyframes fade{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:none}}
.scroll{flex:1;overflow-y:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.scroll::-webkit-scrollbar{display:none}
.topbar{display:flex;align-items:center;gap:10px;padding:10px 18px 12px;background:#fff;border-bottom:1px solid var(--line-soft)}
.topbar .ic{width:34px;height:34px;border-radius:11px;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:17px;color:var(--ink-soft);cursor:pointer;border:none}
.topbar .ttl{font-size:17px;font-weight:800;letter-spacing:-.01em}
.topbar .sp{flex:1}
.coin{display:flex;align-items:center;gap:5px;font-size:12.5px;font-weight:800;color:var(--amber);background:var(--amber-soft);padding:6px 11px;border-radius:999px}
.pad{padding:16px 18px 26px}
.search{background:#fff;border:1.5px solid #E3E7EA;border-radius:15px;padding:14px 15px;display:flex;align-items:center;gap:10px;box-shadow:var(--shadow);cursor:text}
.search .i{color:var(--brand);font-size:16px}
.search .ph{color:var(--muted);font-size:13.5px}
.guide{display:flex;align-items:center;gap:11px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:13px 15px;cursor:pointer;box-shadow:var(--shadow)}
.guide .e{font-size:18px}.guide .t{font-size:13.5px;font-weight:700;flex:1}.guide .a{color:var(--muted)}
.filters{display:flex;gap:7px;overflow-x:auto;padding:12px 18px;scrollbar-width:none;background:var(--bg)}
.filters::-webkit-scrollbar{display:none}
.fp{flex:0 0 auto;font-size:12.5px;font-weight:700;color:var(--ink-soft);background:#fff;border:1px solid var(--line);padding:8px 13px;border-radius:999px;white-space:nowrap;cursor:pointer;transition:.15s}
.fp.on{background:var(--brand-soft);border-color:#BFEAE3;color:var(--brand-ink)}
.sec-h{font-size:16px;font-weight:800;letter-spacing:-.02em;margin:22px 4px 4px;display:flex;justify-content:space-between;align-items:center}
.sec-h .more{font-size:12px;color:var(--muted);font-weight:700;cursor:pointer}
.sec-sub{font-size:12.5px;color:var(--ink-soft);margin:0 4px 14px}
.face{border-radius:50%;background:#EEF1F3;display:flex;align-items:center;justify-content:center;color:#B7C0C8;flex:0 0 auto}
.face svg{width:56%;height:56%}
.face.sm{width:30px;height:30px}
.verify{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:800;color:var(--brand-ink);background:var(--brand-soft);padding:4px 9px;border-radius:999px}
.verify .ck{width:13px;height:13px;border-radius:50%;background:var(--brand);color:#fff;display:flex;align-items:center;justify-content:center;font-size:8px}
.tag{display:inline-flex;font-size:11.5px;font-weight:600;color:var(--chip-ink);background:var(--chip);padding:5px 10px;border-radius:8px}
.tag.b{color:var(--brand-ink);background:var(--brand-soft)}
.tags{display:flex;flex-wrap:wrap;gap:6px}
.ccard{background:#fff;border:1px solid var(--line);border-radius:20px;padding:17px;box-shadow:var(--shadow);margin-bottom:13px;cursor:pointer;transition:.15s}
.ccard:active{transform:scale(.99)}
.ccard .role{font-size:16.5px;font-weight:800;letter-spacing:-.02em;line-height:1.32;margin-top:10px}
.ccard .role .yr,.hc .role .yr,.detail-hero .role .yr{color:var(--brand-ink)}
.role .co{color:var(--brand-ink);font-weight:800}
.seg{display:flex;gap:4px;background:#EEF1F3;border-radius:12px;padding:4px;margin-bottom:14px}
.seg-b{flex:1;text-align:center;font-size:12.5px;font-weight:800;color:var(--ink-soft);padding:9px 6px;border-radius:9px;cursor:pointer;transition:.15s;display:flex;align-items:center;justify-content:center;gap:5px}
.seg-b.on{background:#fff;color:var(--brand-ink);box-shadow:0 1px 3px rgba(20,40,50,.12)}
.seg-b .hy{font-size:9px;font-weight:800;color:#fff;background:var(--amber);padding:2px 5px;border-radius:5px}
.ccard .meta{font-size:11.5px;color:var(--muted);font-weight:600;margin-top:4px}
.qbox{background:var(--brand-soft2);border:1px solid #D6EFEB;border-radius:13px;padding:11px 12px;margin-top:13px}
.qbox .l{font-size:10.5px;font-weight:800;color:var(--brand-ink);letter-spacing:.02em}
.qbox .q{font-size:13.5px;font-weight:700;margin-top:5px;line-height:1.45}
.metrics{display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:12px;color:var(--ink-soft);font-weight:600;margin-top:12px}
.metrics .s{color:var(--brand-ink);font-weight:800}.metrics .d{color:var(--line)}
.cfoot{display:flex;align-items:center;gap:8px;margin-top:13px;padding-top:12px;border-top:1px solid var(--line-soft)}
.cfoot .nm{font-size:12px;color:var(--muted);font-weight:600}.cfoot .nm b{color:var(--ink-soft)}
.hrow{display:flex;gap:11px;overflow-x:auto;padding:2px 18px 4px;scrollbar-width:none}
.hrow::-webkit-scrollbar{display:none}
.hc{flex:0 0 236px;background:#fff;border:1px solid var(--line);border-radius:18px;padding:15px;box-shadow:var(--shadow);cursor:pointer}
.hc .role{font-size:14px;font-weight:800;line-height:1.35;margin-top:9px;letter-spacing:-.01em}
.hc .q{font-size:12px;color:var(--ink-soft);margin-top:9px;line-height:1.4;background:var(--brand-soft2);border-radius:10px;padding:9px 10px}
.hc .mini{font-size:11px;color:var(--ink-soft);font-weight:700;margin-top:9px}
.hc .mini .s{color:var(--brand-ink)}
.hc .who{display:flex;align-items:center;gap:6px;margin-top:10px}
.hc .who .n{font-size:11px;color:var(--muted);font-weight:600}
.promo{border-radius:18px;padding:18px;color:#fff;background:linear-gradient(135deg,#17BFAF,#0A6E63);box-shadow:var(--shadow)}
.promo .cc{font-size:11px;font-weight:800;letter-spacing:.08em;opacity:.85}
.promo .tt{font-size:19px;font-weight:800;margin:7px 0 3px}
.promo .dd{font-size:12px;opacity:.9}
.popq{background:#fff;border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:var(--shadow)}
.popq .row{padding:13px 15px;font-size:13px;font-weight:600;border-top:1px solid var(--line-soft);display:flex;gap:8px;cursor:pointer}
.popq .row:first-child{border-top:none}
.popq .row .qm{color:var(--brand);font-weight:800}
.tabbar{display:flex;background:#fff;border-top:1px solid var(--line);padding:9px 6px 12px}
.tb{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:10.5px;font-weight:700;color:var(--muted);cursor:pointer}
.tb.on{color:var(--brand-ink)}
.tb svg{width:22px;height:22px}
.detail-hero{background:#fff;padding:18px 18px 20px;border-bottom:1px solid var(--line-soft)}
.detail-hero .role{font-size:20px;font-weight:800;letter-spacing:-.02em;line-height:1.3;margin-top:11px}
.detail-hero .meta{font-size:12px;color:var(--muted);font-weight:600;margin-top:5px}
.mission{background:var(--brand-soft2);border:1px solid #D6EFEB;border-radius:14px;padding:14px;margin-top:14px}
.mission .l{font-size:11px;font-weight:800;color:var(--brand-ink)}
.mission .t{font-size:13.5px;color:var(--brand-deep);font-weight:600;margin-top:6px;line-height:1.6}
.dsec{font-size:14.5px;font-weight:800;margin:22px 4px 10px}
.qline{background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px 13px;font-size:13px;font-weight:600;margin-bottom:7px;display:flex;gap:8px}
.qline .m{color:var(--brand);font-weight:800}
.qline.hard{color:var(--ink-soft);background:var(--line-soft)}
.qline.hard .m{color:var(--muted)}
.statbox{background:#fff;border:1px solid var(--line);border-radius:14px;padding:15px;display:flex;justify-content:space-around;text-align:center}
.statbox .v{font-size:17px;font-weight:800;color:var(--brand-ink)}
.statbox .kk{font-size:11px;color:var(--muted);font-weight:600;margin-top:3px}
.sample{background:#fff;border:1px solid var(--line);border-radius:14px;padding:15px}
.sample .q{font-size:11.5px;color:var(--muted);font-weight:700}
.sample .a{font-size:13px;margin-top:8px;line-height:1.6}
.review{background:#fff;border:1px solid var(--line);border-radius:14px;padding:15px;margin-bottom:9px}
.review .txt{font-size:13px;color:var(--ink-soft);line-height:1.55}
.review .by{font-size:11px;color:var(--muted);margin-top:8px}
.ctabar{padding:13px 18px;background:#fff;border-top:1px solid var(--line)}
.cta{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;background:var(--brand);color:#fff;font-size:15.5px;font-weight:800;padding:15px;border-radius:15px;border:none;cursor:pointer;box-shadow:0 8px 18px rgba(18,181,166,.3);letter-spacing:-.01em}
.cta:active{transform:translateY(1px)}
.cta.ghost{background:#fff;color:var(--brand-ink);border:1.5px solid var(--brand-soft);box-shadow:none}
.cta.amber{background:linear-gradient(135deg,#EFA53E,#DE8620);box-shadow:0 8px 18px rgba(222,134,32,.3)}
.ctasub{text-align:center;font-size:11.5px;color:var(--muted);margin-top:8px}
.field{width:100%;background:#fff;border:1.5px solid var(--line);border-radius:13px;padding:14px;font-size:13.5px;font-family:var(--font);color:var(--ink)}
.field:focus{outline:none;border-color:var(--brand)}
.field::placeholder{color:var(--muted)}
textarea.field{min-height:100px;resize:none}
.guidebox{background:var(--brand-soft2);border:1px solid #D6EFEB;border-radius:14px;padding:14px}
.guidebox .l{font-size:12px;font-weight:800;color:var(--brand-ink)}
.steps{counter-reset:s;list-style:none;margin-top:9px}
.steps li{position:relative;padding:5px 0 5px 30px;font-size:12.5px;color:var(--brand-deep);font-weight:600}
.steps li::before{counter-increment:s;content:counter(s);position:absolute;left:0;top:4px;width:20px;height:20px;background:var(--brand);color:#fff;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800}
.seltag{display:inline-flex;font-size:12.5px;font-weight:600;color:var(--chip-ink);background:#fff;border:1.5px solid var(--line);padding:8px 13px;border-radius:999px;cursor:pointer}
.seltag.on{color:var(--brand-ink);background:var(--brand-soft);border-color:#BFEAE3}
.ticket{background:linear-gradient(135deg,#17BFAF,#0A6E63);color:#fff;border-radius:20px;padding:22px;position:relative;overflow:hidden}
.ticket::before,.ticket::after{content:"";position:absolute;width:26px;height:26px;background:var(--bg);border-radius:50%;top:50%;transform:translateY(-50%)}
.ticket::before{left:-13px}.ticket::after{right:-13px}
.ticket .tp{font-size:12px;font-weight:800;opacity:.9;letter-spacing:.06em}
.ticket .pr{font-size:32px;font-weight:800;margin:8px 0 3px}
.ticket .ds{font-size:12.5px;opacity:.92;line-height:1.5}
.ticket .ln{border-top:1px dashed rgba(255,255,255,.35);margin:15px 0}
.safe{background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px}
.safe .r{display:flex;gap:9px;font-size:12.5px;color:var(--ink-soft);line-height:1.5;margin-top:9px;align-items:flex-start}
.safe .r:first-child{margin-top:0}
.safe .r .c{color:var(--brand);font-weight:800}
.done-hero{text-align:center;padding:30px 18px 10px}
.done-hero .circle{width:74px;height:74px;border-radius:22px;background:var(--brand-soft);color:var(--brand);display:flex;align-items:center;justify-content:center;font-size:34px;margin:0 auto;animation:pop .4s ease}
@keyframes pop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1)}}
.done-hero h2{font-size:20px;font-weight:800;margin-top:16px;letter-spacing:-.02em}
.done-hero p{font-size:13px;color:var(--ink-soft);margin-top:8px;line-height:1.55}
.timeline{position:relative;padding-left:26px}
.timeline::before{content:"";position:absolute;left:9px;top:8px;bottom:12px;width:2px;background:var(--line)}
.titem{position:relative;padding-bottom:20px}
.titem .nd{position:absolute;left:-24px;top:2px;width:18px;height:18px;border-radius:50%;background:#fff;border:2px solid var(--line)}
.titem.done .nd{background:var(--brand);border-color:var(--brand)}
.titem.now .nd{border-color:var(--brand);box-shadow:0 0 0 4px var(--brand-soft)}
.titem .t{font-size:13.5px;font-weight:700}
.titem .d{font-size:11.5px;color:var(--muted);margin-top:2px}
.toast{position:absolute;left:50%;bottom:26px;transform:translateX(-50%) translateY(20px);background:#1B2733;color:#fff;font-size:12.5px;font-weight:600;padding:11px 18px;border-radius:999px;opacity:0;transition:.28s;z-index:90;pointer-events:none;white-space:nowrap}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.hint{max-width:390px;font-size:11.5px;color:#5b6b6e;text-align:center;line-height:1.6}
.hint b{color:#33484c}
`;
