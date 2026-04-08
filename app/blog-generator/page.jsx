
'use client';
import React, { useState } from "react";

const pretendardFontUrl = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css";

const mint = "#B2F1DD";
const dark = "#2C2C2C";
const accent = "#4CAF50";
const warning = "#FF9800";
const blue = "#2196F3";

// STEP 1: Trending keywords data
const trendingKeywords = [
  { rank: 1, keyword: "부산 벚꽃 명소 2026", volume: 41200, trend: "+320%", category: "시즌", difficulty: 22, cpc: 580 },
  { rank: 2, keyword: "해운대 맛집 추천", volume: 33100, trend: "+12%", category: "맛집", difficulty: 65, cpc: 420 },
  { rank: 3, keyword: "부산 가볼만한곳", volume: 28900, trend: "+45%", category: "여행", difficulty: 58, cpc: 390 },
  { rank: 4, keyword: "감천문화마을 주차", volume: 18400, trend: "+180%", category: "정보", difficulty: 15, cpc: 120 },
  { rank: 5, keyword: "부산 카페 추천", volume: 22600, trend: "+28%", category: "카페", difficulty: 52, cpc: 350 },
  { rank: 6, keyword: "부산 숙소 가성비", volume: 19800, trend: "+67%", category: "숙박", difficulty: 48, cpc: 680 },
  { rank: 7, keyword: "광안리 야경 맛집", volume: 14200, trend: "+95%", category: "맛집", difficulty: 32, cpc: 310 },
  { rank: 8, keyword: "부산 1박2일 코스", volume: 16500, trend: "+52%", category: "여행", difficulty: 44, cpc: 450 },
];

// STEP 4: Automation pipeline
const automationSteps = [
  {
    step: 1,
    title: "트렌드 키워드 발굴",
    desc: "네이버 데이터랩 + 구글 트렌드 자동 크롤링",
    tools: ["Playwright", "네이버 API", "Google Trends"],
    time: "자동 (매일 06:00)",
    status: "active",
  },
  {
    step: 2,
    title: "AI 아티클 생성",
    desc: "검색 의도 분석 → 구조화된 글 자동 작성",
    tools: ["Claude API", "GPT-4", "Perplexity"],
    time: "3~5분/글",
    status: "active",
  },
  {
    step: 3,
    title: "SEO 최적화 자동 적용",
    desc: "메타태그·OG·Schema·내부링크 자동 삽입",
    tools: ["Custom SEO Engine", "JSON-LD Generator"],
    time: "자동 (즉시)",
    status: "active",
  },
  {
    step: 4,
    title: "광고·제휴링크 자동 배치",
    desc: "AdSense 배너 + 쿠팡파트너스 상품 자동 삽입",
    tools: ["AdSense API", "쿠팡 API", "UTM Builder"],
    time: "자동 (즉시)",
    status: "active",
  },
  {
    step: 5,
    title: "발행 + 검색엔진 색인",
    desc: "블로그 업로드 → 구글·네이버 색인 요청",
    tools: ["WordPress API", "Search Console", "네이버 웹마스터"],
    time: "자동 (발행 즉시)",
    status: "active",
  },
];

// Article generation queue
const articleQueue = [
  { id: 1, keyword: "부산 벚꽃 명소 2026", status: "published", seoScore: 94, adSlots: 3, affiliateLinks: 5, est: "₩18,200/월" },
  { id: 2, keyword: "해운대 맛집 추천", status: "published", seoScore: 91, adSlots: 4, affiliateLinks: 8, est: "₩24,500/월" },
  { id: 3, keyword: "감천문화마을 주차", status: "published", seoScore: 88, adSlots: 2, affiliateLinks: 2, est: "₩8,400/월" },
  { id: 4, keyword: "부산 카페 추천", status: "seo", seoScore: 72, adSlots: 3, affiliateLinks: 6, est: "₩15,800/월" },
  { id: 5, keyword: "광안리 야경 맛집", status: "writing", seoScore: 0, adSlots: 0, affiliateLinks: 0, est: "-" },
  { id: 6, keyword: "부산 1박2일 코스", status: "queued", seoScore: 0, adSlots: 0, affiliateLinks: 0, est: "-" },
];

const statusConfig = {
  published: { bg: "#E8F5E9", color: accent, label: "발행 완료", icon: "5" },
  seo: { bg: "#E3F2FD", color: blue, label: "SEO 최적화중", icon: "3" },
  writing: { bg: "#FFF3E0", color: warning, label: "글 생성중", icon: "2" },
  queued: { bg: "#f5f5f5", color: "#888", label: "대기중", icon: "1" },
};

// SEO checklist
const seoChecklist = [
  { item: "Title 태그 (55자 이내, 키워드 포함)", auto: true },
  { item: "Meta Description (155자 이내, CTA 포함)", auto: true },
  { item: "H1 태그 (키워드 포함, 1개만)", auto: true },
  { item: "H2~H3 소제목 구조화 (키워드 변형)", auto: true },
  { item: "Open Graph 이미지·제목·설명", auto: true },
  { item: "Canonical URL 설정", auto: true },
  { item: "Schema.org 구조화 데이터 (Article)", auto: true },
  { item: "이미지 Alt 태그 + WebP 변환", auto: true },
  { item: "내부 링크 2~3개 자동 삽입", auto: true },
  { item: "목차(TOC) 자동 생성", auto: true },
  { item: "모바일 최적화 체크", auto: true },
  { item: "Core Web Vitals 점검", auto: false },
];

// Ad placement strategy
const adPlacements = [
  { position: "상단 (본문 시작 전)", type: "디스플레이 배너", network: "Google AdSense", rpm: "₩3,200", best: true },
  { position: "본문 중간 (H2 사이)", type: "인피드 광고", network: "Google AdSense", rpm: "₩2,800", best: true },
  { position: "상품 추천 영역", type: "쿠팡 상품 카드", network: "쿠팡 파트너스", rpm: "₩4,500", best: true },
  { position: "본문 하단", type: "디스플레이 배너", network: "Google AdSense", rpm: "₩1,200", best: false },
  { position: "사이드바", type: "네이티브 광고", network: "네이버 애드포스트", rpm: "₩900", best: false },
  { position: "관련 글 영역", type: "추천 콘텐츠형", network: "Taboola/Dable", rpm: "₩1,800", best: false },
];

export default function BlogGeneratorPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [pipelineProgress, setPipelineProgress] = useState(-1);

  const handleAutoGenerate = () => {
    if (!selectedKeyword) return;
    setGenerating(true);
    setPipelineProgress(0);
    const interval = setInterval(() => {
      setPipelineProgress((prev) => {
        if (prev >= 4) {
          clearInterval(interval);
          setGenerating(false);
          setSelectedKeyword(null);
          return -1;
        }
        return prev + 1;
      });
    }, 2500);
  };

  return (
    <div style={{ fontFamily: "Pretendard, sans-serif", background: "#f8faf9", minHeight: "100vh", color: dark }}>
      <link rel="stylesheet" href={pretendardFontUrl} />

      {/* Header */}
      <div style={{ background: dark, color: "#fff", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ color: "#fff", textDecoration: "none", fontSize: 14 }}>← Home</a>
        <div style={{ fontWeight: 700, fontSize: 17 }}>Blog Automation Pipeline</div>
        <a href="/monetization" style={{ color: mint, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>Formula →</a>
      </div>

      {/* 5-Step Process Overview */}
      <div style={{ background: "#fff", margin: 16, borderRadius: 20, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>5-Step Automation Process</div>
        <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
          {automationSteps.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(idx)}
              style={{
                flex: "1 0 auto",
                minWidth: 60,
                padding: "10px 6px",
                borderRadius: 12,
                background: activeStep === idx ? dark : generating && pipelineProgress === idx ? mint : generating && pipelineProgress > idx ? "#E8F5E9" : "#f5f5f5",
                color: activeStep === idx ? "#fff" : dark,
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                position: "relative",
                fontFamily: "Pretendard, sans-serif",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 2 }}>STEP {s.step}</div>
              <div style={{ fontSize: 10, fontWeight: 500, lineHeight: 1.2 }}>{s.title}</div>
              {generating && pipelineProgress === idx && (
                <div style={{ position: "absolute", top: -4, right: -4, width: 10, height: 10, borderRadius: "50%", background: accent, border: "2px solid #fff" }} />
              )}
              {generating && pipelineProgress > idx && (
                <div style={{ position: "absolute", top: -4, right: -4, fontSize: 12 }}>Done</div>
              )}
            </button>
          ))}
        </div>

        {/* Step Detail */}
        <div style={{ marginTop: 14, padding: 14, background: "#f9f9f9", borderRadius: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            Step {automationSteps[activeStep].step}. {automationSteps[activeStep].title}
          </div>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>{automationSteps[activeStep].desc}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
            {automationSteps[activeStep].tools.map((t) => (
              <span key={t} style={{ background: "#fff", padding: "3px 8px", borderRadius: 6, fontSize: 11, color: dark, border: "1px solid #e0e0e0" }}>
                {t}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 12, color: accent, fontWeight: 600 }}>
            {automationSteps[activeStep].time}
          </div>
        </div>
      </div>

      {/* STEP 1: Trending Keywords */}
      <div style={{ background: "#fff", margin: "0 16px", borderRadius: 20, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>STEP 1. Trend Keywords</div>
            <div style={{ fontSize: 12, color: "#888" }}>AI picks the highest-opportunity keywords automatically</div>
          </div>
          <div style={{ background: "#E8F5E9", padding: "4px 10px", borderRadius: 8, fontSize: 11, color: accent, fontWeight: 600 }}>
            Live
          </div>
        </div>

        {trendingKeywords.map((kw) => (
          <div
            key={kw.rank}
            onClick={() => setSelectedKeyword(kw.keyword)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid #f5f5f5",
              cursor: "pointer",
              background: selectedKeyword === kw.keyword ? "#f0faf5" : "transparent",
              borderRadius: 8,
              padding: "10px 8px",
              margin: "0 -8px",
            }}
          >
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              background: kw.rank <= 3 ? mint : "#f0f0f0",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 12, marginRight: 10, flexShrink: 0,
            }}>
              {kw.rank}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {kw.keyword}
              </div>
              <div style={{ fontSize: 11, color: "#888" }}>
                {kw.volume.toLocaleString()}/month | CPC ₩{kw.cpc} | Difficulty {kw.difficulty}/100
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
              <div style={{ fontSize: 12, color: accent, fontWeight: 700 }}>{kw.trend}</div>
              <span style={{ fontSize: 10, background: "#f5f5f5", padding: "2px 6px", borderRadius: 4, color: "#666" }}>{kw.category}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <div style={{ margin: "16px", background: selectedKeyword ? mint : "#e0e0e0", borderRadius: 16, padding: 16, transition: "all 0.3s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: dark }}>
              {selectedKeyword ? `"${selectedKeyword}"` : "Select a keyword above"}
            </div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
              {selectedKeyword ? "Keyword → Article → SEO → Ads → Publish (Full Auto)" : "Choose a trending keyword to start the pipeline"}
            </div>
          </div>
          <button
            onClick={handleAutoGenerate}
            disabled={!selectedKeyword || generating}
            style={{
              background: selectedKeyword ? dark : "#999",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 20px",
              fontWeight: 700,
              fontSize: 13,
              cursor: selectedKeyword && !generating ? "pointer" : "not-allowed",
              opacity: generating ? 0.6 : 1,
              whiteSpace: "nowrap",
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            {generating ? `Step ${pipelineProgress + 1}/5...` : "Run Pipeline"}
          </button>
        </div>
        {generating && (
          <div style={{ marginTop: 10, background: "#fff", borderRadius: 10, padding: 10 }}>
            {automationSteps.map((s, idx) => (
              <div key={s.step} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 12 }}>
                <span>{pipelineProgress > idx ? "Done" : pipelineProgress === idx ? "..." : "  "}</span>
                <span style={{ color: pipelineProgress >= idx ? dark : "#ccc", fontWeight: pipelineProgress === idx ? 700 : 400 }}>
                  {s.title}
                </span>
                {pipelineProgress === idx && <span style={{ color: accent, fontWeight: 600 }}>{s.time}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Article Queue */}
      <div style={{ background: "#fff", margin: "0 16px", borderRadius: 20, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Article Pipeline Status</div>
        {articleQueue.map((a) => {
          const s = statusConfig[a.status];
          return (
            <div key={a.id} style={{ padding: "12px 0", borderBottom: "1px solid #f5f5f5" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 14, flex: 1, marginRight: 8 }}>{a.keyword}</div>
                <span style={{ background: s.bg, color: s.color, padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                  {s.label}
                </span>
              </div>
              {a.status === "published" && (
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#888" }}>
                  <span>SEO {a.seoScore}</span>
                  <span>Ads {a.adSlots}ea</span>
                  <span>Affiliate {a.affiliateLinks}ea</span>
                  <span style={{ color: accent, fontWeight: 600 }}>est. {a.est}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* STEP 2-3: SEO Optimization Checklist */}
      <div style={{ background: "#fff", margin: "16px", borderRadius: 20, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>STEP 2-3. SEO Auto-Optimization</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>Every article automatically passes through this checklist</div>
        {seoChecklist.map((c, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid #f8f8f8" }}>
            <div style={{
              width: 20, height: 20, borderRadius: 6,
              background: c.auto ? accent : "#e0e0e0",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              {c.auto ? "V" : ""}
            </div>
            <div style={{ fontSize: 13, color: c.auto ? dark : "#999" }}>{c.item}</div>
            {c.auto && (
              <span style={{ marginLeft: "auto", fontSize: 10, color: accent, fontWeight: 600, background: "#E8F5E9", padding: "2px 6px", borderRadius: 4 }}>
                AUTO
              </span>
            )}
          </div>
        ))}
        <div style={{ marginTop: 12, padding: 10, background: "#f9f9f9", borderRadius: 10, fontSize: 12, color: "#666" }}>
          {seoChecklist.filter(c => c.auto).length}/{seoChecklist.length} items auto-checked = Save ~40 min per article
        </div>
      </div>

      {/* STEP 4: Ad & Affiliate Placement Strategy */}
      <div style={{ background: "#fff", margin: "0 16px", borderRadius: 20, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>STEP 4. Ad Auto-Placement</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>Ads and affiliate links are injected automatically at optimal positions</div>

        {adPlacements.map((ad, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{ad.position}</span>
                {ad.best && (
                  <span style={{ fontSize: 9, background: mint, padding: "2px 5px", borderRadius: 4, fontWeight: 700, color: dark }}>
                    TOP
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: "#888" }}>{ad.type} | {ad.network}</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, color: ad.best ? accent : "#888" }}>{ad.rpm}</div>
          </div>
        ))}

        <div style={{ marginTop: 12, padding: 12, background: dark, borderRadius: 12, color: "#fff" }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Revenue per Article (estimated)</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 10, color: "#888" }}>AdSense</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>₩7,200/mo</div>
            </div>
            <div style={{ fontSize: 18, color: "#555", lineHeight: "36px" }}>+</div>
            <div>
              <div style={{ fontSize: 10, color: "#888" }}>Coupang</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#FF6B35" }}>₩4,500/mo</div>
            </div>
            <div style={{ fontSize: 18, color: "#555", lineHeight: "36px" }}>=</div>
            <div>
              <div style={{ fontSize: 10, color: "#888" }}>Total/article</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: mint }}>₩11,700/mo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Productivity Summary */}
      <div style={{ margin: "16px", background: mint, borderRadius: 20, padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Automation Productivity</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#888" }}>Manual per Article</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#f44336", textDecoration: "line-through" }}>4h</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#888" }}>Automated</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: accent }}>20min</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#888" }}>Weekly Output</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>25 articles</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#888" }}>12x Faster</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: accent }}>100/mo</div>
          </div>
        </div>
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}
