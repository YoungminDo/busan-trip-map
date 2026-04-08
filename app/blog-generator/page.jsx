
'use client';
import React, { useState } from "react";

const pretendardFontUrl = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css";

const mint = "#B2F1DD";
const dark = "#2C2C2C";
const accent = "#4CAF50";
const warning = "#FF9800";

const pipelineSteps = [
  { id: 1, label: "크롤링", icon: "🔍", desc: "공식 계정 포스트를 Playwright로 크롤링" },
  { id: 2, label: "콘텐츠 선별", icon: "📋", desc: "SEO·시즈널에 적합한 콘텐츠 선별" },
  { id: 3, label: "SEO 최적화", icon: "✨", desc: "메타태그·OG·canonical URL 자동 생성" },
  { id: 4, label: "이미지 생성", icon: "🎨", desc: "AI 에이전트를 통한 썸네일·본문 이미지" },
  { id: 5, label: "초안 리뷰", icon: "📝", desc: "Slack 봇을 통한 초안 발송 및 컨펌" },
  { id: 6, label: "발행·색인", icon: "🚀", desc: "블로그 업로드 + 구글·네이버 색인 등록" },
];

const samplePosts = [
  {
    id: 1,
    title: "2026 부산 벚꽃 여행 완벽 가이드",
    status: "published",
    seoScore: 92,
    traffic: 3420,
    revenue: 45200,
    date: "2026-04-01",
    keywords: ["부산 벚꽃", "부산 여행", "2026 벚꽃 명소"],
    ctr: 4.8,
  },
  {
    id: 2,
    title: "부산 해운대 맛집 TOP 10 - 현지인 추천",
    status: "published",
    seoScore: 88,
    traffic: 5210,
    revenue: 72800,
    date: "2026-03-28",
    keywords: ["해운대 맛집", "부산 맛집", "현지인 추천"],
    ctr: 5.2,
  },
  {
    id: 3,
    title: "부산 감천문화마을 포토스팟 Best 7",
    status: "draft",
    seoScore: 75,
    traffic: 0,
    revenue: 0,
    date: "2026-04-05",
    keywords: ["감천문화마을", "부산 포토스팟"],
    ctr: 0,
  },
  {
    id: 4,
    title: "저당 간식으로 즐기는 부산 카페 투어",
    status: "review",
    seoScore: 81,
    traffic: 0,
    revenue: 0,
    date: "2026-04-07",
    keywords: ["부산 카페", "저당 간식", "건강 카페"],
    ctr: 0,
  },
  {
    id: 5,
    title: "부산 광안리 야경 명소 & 주변 맛집",
    status: "generating",
    seoScore: 0,
    traffic: 0,
    revenue: 0,
    date: "2026-04-08",
    keywords: ["광안리 야경", "부산 야경"],
    ctr: 0,
  },
];

const seoKeywordSuggestions = [
  { keyword: "부산 여행 코스", volume: 18200, difficulty: 42, opportunity: "높음" },
  { keyword: "부산 맛집 추천", volume: 22400, difficulty: 68, opportunity: "보통" },
  { keyword: "부산 숙소 추천", volume: 14800, difficulty: 55, opportunity: "보통" },
  { keyword: "부산 벚꽃 시기", volume: 9600, difficulty: 28, opportunity: "매우 높음" },
  { keyword: "부산 해운대 카페", volume: 8100, difficulty: 35, opportunity: "높음" },
  { keyword: "부산 감천문화마을 입장료", volume: 6200, difficulty: 18, opportunity: "매우 높음" },
];

function StatusBadge({ status }) {
  const config = {
    published: { bg: "#E8F5E9", color: accent, label: "발행됨" },
    draft: { bg: "#FFF3E0", color: warning, label: "초안" },
    review: { bg: "#E3F2FD", color: "#2196F3", label: "리뷰 중" },
    generating: { bg: "#F3E5F5", color: "#9C27B0", label: "생성 중" },
  };
  const c = config[status] || config.draft;
  return (
    <span style={{ background: c.bg, color: c.color, padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
      {c.label}
    </span>
  );
}

function SeoScoreBar({ score }) {
  const color = score >= 80 ? accent : score >= 50 ? warning : "#f44336";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 60, height: 6, borderRadius: 3, background: "#eee", overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color }}>{score}</span>
    </div>
  );
}

export default function BlogGeneratorPage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [generating, setGenerating] = useState(false);
  const [topicInput, setTopicInput] = useState("");
  const [pipelineProgress, setPipelineProgress] = useState(-1);

  const handleGenerate = () => {
    if (!topicInput.trim()) return;
    setGenerating(true);
    setPipelineProgress(0);
    const interval = setInterval(() => {
      setPipelineProgress((prev) => {
        if (prev >= 5) {
          clearInterval(interval);
          setGenerating(false);
          return -1;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const totalTraffic = samplePosts.reduce((a, b) => a + b.traffic, 0);
  const totalRevenue = samplePosts.reduce((a, b) => a + b.revenue, 0);
  const publishedCount = samplePosts.filter((p) => p.status === "published").length;
  const avgSeo = Math.round(
    samplePosts.filter((p) => p.seoScore > 0).reduce((a, b) => a + b.seoScore, 0) /
      samplePosts.filter((p) => p.seoScore > 0).length
  );

  return (
    <div style={{ fontFamily: "Pretendard, sans-serif", background: "#f8faf9", minHeight: "100vh", color: dark }}>
      <link rel="stylesheet" href={pretendardFontUrl} />

      {/* Header */}
      <div style={{ background: dark, color: "#fff", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ color: "#fff", textDecoration: "none", fontSize: 14 }}>← 홈</a>
        <div style={{ fontWeight: 700, fontSize: 18 }}>블로그 자동 생성기</div>
        <a href="/monetization" style={{ color: mint, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>수익 →</a>
      </div>

      {/* Pipeline Visualization */}
      <div style={{ background: "#fff", margin: 16, borderRadius: 20, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>AI 블로그 파이프라인</div>
        <div style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 8 }}>
          {pipelineSteps.map((step, idx) => (
            <div
              key={step.id}
              style={{
                minWidth: 100,
                padding: "12px 8px",
                borderRadius: 14,
                background: generating && pipelineProgress === idx ? mint : generating && pipelineProgress > idx ? "#E8F5E9" : "#f5f5f5",
                border: generating && pipelineProgress === idx ? `2px solid ${accent}` : "2px solid transparent",
                textAlign: "center",
                transition: "all 0.3s ease",
                position: "relative",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 4 }}>{step.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{step.label}</div>
              <div style={{ fontSize: 10, color: "#888" }}>{step.desc}</div>
              {generating && pipelineProgress === idx && (
                <div style={{ position: "absolute", top: -6, right: -6, width: 14, height: 14, borderRadius: "50%", background: accent, border: "2px solid #fff" }} />
              )}
              {generating && pipelineProgress > idx && (
                <div style={{ position: "absolute", top: -6, right: -6, fontSize: 14 }}>✅</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Generate Section */}
      <div style={{ background: mint, margin: "0 16px", borderRadius: 20, padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>포스트 작성해!</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="주제를 입력하세요 (예: 부산 벚꽃 여행)"
            disabled={generating}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              border: "none",
              fontSize: 14,
              outline: "none",
              background: "#fff",
              color: dark,
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              background: dark,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 20px",
              fontWeight: 700,
              fontSize: 14,
              cursor: generating ? "not-allowed" : "pointer",
              opacity: generating ? 0.6 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {generating ? "생성 중..." : "생성하기"}
          </button>
        </div>
        {generating && (
          <div style={{ marginTop: 12, fontSize: 13, color: dark }}>
            ⏱ 예상 소요시간: 약 20분 | 현재: {pipelineSteps[pipelineProgress]?.label || "완료"}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, padding: "16px 16px 0" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>총 트래픽</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{totalTraffic.toLocaleString()}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>예상 수익</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: accent }}>₩{totalRevenue.toLocaleString()}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>발행 포스트</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{publishedCount}개</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>평균 SEO 점수</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: avgSeo >= 80 ? accent : warning }}>{avgSeo}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, margin: "20px 16px 0", borderBottom: "2px solid #eee" }}>
        {[
          { key: "posts", label: "포스트 관리" },
          { key: "seo", label: "SEO 키워드" },
          { key: "monetize", label: "수익화 설정" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: "12px 0",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.key ? `3px solid ${dark}` : "3px solid transparent",
              fontWeight: activeTab === tab.key ? 700 : 400,
              fontSize: 14,
              color: activeTab === tab.key ? dark : "#888",
              cursor: "pointer",
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: "16px" }}>
        {activeTab === "posts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {samplePosts.map((post) => (
              <div
                key={post.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, flex: 1, marginRight: 8 }}>{post.title}</div>
                  <StatusBadge status={post.status} />
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                  {post.keywords.map((kw) => (
                    <span key={kw} style={{ background: "#f0f0f0", padding: "3px 8px", borderRadius: 6, fontSize: 11, color: "#666" }}>
                      {kw}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#888" }}>
                    <span>📅 {post.date}</span>
                    {post.traffic > 0 && <span>👀 {post.traffic.toLocaleString()}</span>}
                    {post.revenue > 0 && <span>💰 ₩{post.revenue.toLocaleString()}</span>}
                    {post.ctr > 0 && <span>📈 CTR {post.ctr}%</span>}
                  </div>
                  <SeoScoreBar score={post.seoScore} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "seo" && (
          <div>
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>AI 추천 키워드</div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>검색량과 경쟁 난이도를 분석하여 최적의 키워드를 추천합니다</div>
              {seoKeywordSuggestions.map((kw) => (
                <div
                  key={kw.keyword}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #f5f5f5",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{kw.keyword}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>월간 검색량: {kw.volume.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: kw.opportunity.includes("매우") ? accent : warning, fontWeight: 600 }}>
                      기회: {kw.opportunity}
                    </div>
                    <div style={{ fontSize: 11, color: "#888" }}>난이도: {kw.difficulty}/100</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>SEO 자동 최적화 항목</div>
              {[
                { label: "Meta Title & Description", status: true, desc: "검색 결과에 표시되는 제목·설명 자동 생성" },
                { label: "Open Graph 태그", status: true, desc: "SNS 공유 시 미리보기 이미지·제목 자동 설정" },
                { label: "Canonical URL", status: true, desc: "중복 콘텐츠 방지를 위한 정규 URL 설정" },
                { label: "구조화 데이터 (Schema)", status: true, desc: "검색엔진이 콘텐츠를 이해하도록 JSON-LD 삽입" },
                { label: "내부 링크 자동 연결", status: false, desc: "관련 포스트 간 자동 링크 삽입" },
                { label: "이미지 Alt 태그", status: true, desc: "이미지 설명 텍스트 자동 생성" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #f5f5f5",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{item.desc}</div>
                  </div>
                  <div
                    style={{
                      width: 40,
                      height: 22,
                      borderRadius: 11,
                      background: item.status ? accent : "#ddd",
                      position: "relative",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "#fff",
                        position: "absolute",
                        top: 2,
                        left: item.status ? 20 : 2,
                        transition: "left 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "monetize" && (
          <div>
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>수익화 채널</div>
              {[
                { name: "Google AdSense", revenue: "₩42,300/월", status: true, icon: "📊" },
                { name: "쿠팡 파트너스", revenue: "₩28,500/월", status: true, icon: "🛒" },
                { name: "네이버 애드포스트", revenue: "₩15,800/월", status: true, icon: "📰" },
                { name: "제휴 마케팅 (CPA)", revenue: "₩31,400/월", status: false, icon: "🤝" },
                { name: "스폰서 콘텐츠", revenue: "미정", status: false, icon: "💎" },
              ].map((ch) => (
                <div
                  key={ch.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid #f5f5f5",
                  }}
                >
                  <div style={{ fontSize: 24, marginRight: 12 }}>{ch.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{ch.name}</div>
                    <div style={{ fontSize: 13, color: accent, fontWeight: 600 }}>{ch.revenue}</div>
                  </div>
                  <div
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      background: ch.status ? "#E8F5E9" : "#f5f5f5",
                      color: ch.status ? accent : "#888",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {ch.status ? "연결됨" : "미연결"}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>UTM 트래킹 설정</div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>모든 CTA 버튼에 UTM 파라미터가 자동으로 추가됩니다</div>
              {[
                { param: "utm_source", value: "blog", desc: "트래픽 출처" },
                { param: "utm_medium", value: "auto_post", desc: "매체 유형" },
                { param: "utm_campaign", value: "seo_blog_2026", desc: "캠페인명" },
              ].map((utm) => (
                <div
                  key={utm.param}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid #f5f5f5",
                  }}
                >
                  <div>
                    <code style={{ background: "#f5f5f5", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>{utm.param}</code>
                    <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>{utm.desc}</span>
                  </div>
                  <code style={{ fontSize: 13, fontWeight: 600 }}>{utm.value}</code>
                </div>
              ))}
            </div>

            <div style={{ background: mint, borderRadius: 16, padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>예상 월 수익 시뮬레이션</div>
              <div style={{ fontSize: 13, color: dark, marginBottom: 12 }}>
                월 포스트 20개 발행 기준 (주 5개)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div style={{ background: "#fff", borderRadius: 12, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#888" }}>3개월 후</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>₩150,000</div>
                </div>
                <div style={{ background: "#fff", borderRadius: 12, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#888" }}>6개월 후</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>₩450,000</div>
                </div>
                <div style={{ background: "#fff", borderRadius: 12, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#888" }}>12개월 후</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: accent }}>₩1,200,000</div>
                </div>
                <div style={{ background: "#fff", borderRadius: 12, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#888" }}>24개월 후</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: accent }}>₩3,500,000</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 8, textAlign: "center" }}>
                * SEO 트래픽 복리 효과 반영 시뮬레이션 (보장 수익이 아닙니다)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div style={{ height: 40 }} />
    </div>
  );
}
