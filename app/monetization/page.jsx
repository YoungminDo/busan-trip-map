
'use client';
import React, { useState } from "react";

const pretendardFontUrl = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css";

const mint = "#B2F1DD";
const dark = "#2C2C2C";
const accent = "#4CAF50";
const red = "#f44336";

const monthlyData = [
  { month: "2025.11", posts: 8, traffic: 1200, revenue: 12000, adRevenue: 8000, affiliateRevenue: 4000 },
  { month: "2025.12", posts: 15, traffic: 4500, revenue: 38000, adRevenue: 22000, affiliateRevenue: 16000 },
  { month: "2026.01", posts: 20, traffic: 9800, revenue: 85000, adRevenue: 48000, affiliateRevenue: 37000 },
  { month: "2026.02", posts: 22, traffic: 18200, revenue: 156000, adRevenue: 89000, affiliateRevenue: 67000 },
  { month: "2026.03", posts: 25, traffic: 32400, revenue: 298000, adRevenue: 168000, affiliateRevenue: 130000 },
  { month: "2026.04", posts: 12, traffic: 28100, revenue: 245000, adRevenue: 142000, affiliateRevenue: 103000 },
];

const topPerformers = [
  { title: "부산 해운대 맛집 TOP 10", traffic: 5210, revenue: 72800, rpm: 13970 },
  { title: "2026 부산 벚꽃 여행 가이드", traffic: 3420, revenue: 45200, rpm: 13216 },
  { title: "부산 자갈치시장 해산물 가이드", traffic: 2890, revenue: 38100, rpm: 13184 },
  { title: "부산 감천문화마을 완벽 정복", traffic: 2340, revenue: 29800, rpm: 12735 },
  { title: "부산 광안리 카페 추천 Best 8", traffic: 1980, revenue: 24600, rpm: 12424 },
];

const revenueBreakdown = [
  { source: "Google AdSense", amount: 142000, percentage: 42, color: "#4285F4" },
  { source: "쿠팡 파트너스", amount: 89000, percentage: 26, color: "#FF6B35" },
  { source: "네이버 애드포스트", amount: 58000, percentage: 17, color: "#03C75A" },
  { source: "제휴 마케팅 (CPA)", amount: 35000, percentage: 10, color: "#9C27B0" },
  { source: "기타", amount: 17000, percentage: 5, color: "#888" },
];

const costBreakdown = [
  { item: "AI API 비용 (Claude/GPT)", cost: 45000 },
  { item: "이미지 생성 AI", cost: 15000 },
  { item: "호스팅 (Vercel)", cost: 0 },
  { item: "도메인", cost: 1500 },
  { item: "크롤링 서버", cost: 8000 },
];

export default function MonetizationPage() {
  const [period, setPeriod] = useState("month");

  const currentMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData[monthlyData.length - 2];
  const totalRevenue = monthlyData.reduce((a, b) => a + b.revenue, 0);
  const totalTraffic = monthlyData.reduce((a, b) => a + b.traffic, 0);
  const totalPosts = monthlyData.reduce((a, b) => a + b.posts, 0);
  const totalCost = costBreakdown.reduce((a, b) => a + b.cost, 0);
  const netProfit = currentMonth.revenue - totalCost;

  const revenueGrowth = prevMonth.revenue > 0
    ? Math.round(((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100)
    : 0;

  const maxTraffic = Math.max(...monthlyData.map((d) => d.traffic));

  return (
    <div style={{ fontFamily: "Pretendard, sans-serif", background: "#f8faf9", minHeight: "100vh", color: dark }}>
      <link rel="stylesheet" href={pretendardFontUrl} />

      {/* Header */}
      <div style={{ background: dark, color: "#fff", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/blog-generator" style={{ color: "#fff", textDecoration: "none", fontSize: 14 }}>← 블로그</a>
        <div style={{ fontWeight: 700, fontSize: 18 }}>수익화 대시보드</div>
        <a href="/" style={{ color: mint, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>홈 →</a>
      </div>

      {/* Revenue Hero */}
      <div style={{ background: `linear-gradient(135deg, ${dark} 0%, #1a1a1a 100%)`, margin: 16, borderRadius: 20, padding: 24, color: "#fff" }}>
        <div style={{ fontSize: 13, color: "#aaa", marginBottom: 4 }}>이번 달 총 수익</div>
        <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>
          ₩{currentMonth.revenue.toLocaleString()}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            background: revenueGrowth < 0 ? "rgba(244,67,54,0.15)" : "rgba(76,175,80,0.15)",
            color: revenueGrowth < 0 ? red : accent,
            padding: "3px 8px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
          }}>
            {revenueGrowth >= 0 ? "+" : ""}{revenueGrowth}% vs 지난달
          </span>
          <span style={{ fontSize: 12, color: "#888" }}>
            순이익: ₩{netProfit.toLocaleString()}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#888" }}>누적 수익</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>₩{totalRevenue.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#888" }}>누적 트래픽</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{totalTraffic.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#888" }}>총 포스트</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{totalPosts}개</div>
          </div>
        </div>
      </div>

      {/* Traffic Chart (simple bar) */}
      <div style={{ background: "#fff", margin: "0 16px", borderRadius: 20, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>트래픽 추이</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
          {monthlyData.map((d, idx) => (
            <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 10, color: "#888", fontWeight: 600 }}>
                {(d.traffic / 1000).toFixed(1)}k
              </div>
              <div
                style={{
                  width: "100%",
                  height: `${(d.traffic / maxTraffic) * 90}px`,
                  background: idx === monthlyData.length - 1 ? accent : mint,
                  borderRadius: "6px 6px 0 0",
                  minHeight: 4,
                  transition: "height 0.3s",
                }}
              />
              <div style={{ fontSize: 10, color: "#888" }}>{d.month.slice(5)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div style={{ background: "#fff", margin: "16px", borderRadius: 20, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>수익 구성</div>

        {/* Simple horizontal stacked bar */}
        <div style={{ display: "flex", height: 24, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
          {revenueBreakdown.map((r) => (
            <div
              key={r.source}
              style={{
                width: `${r.percentage}%`,
                background: r.color,
                height: "100%",
              }}
            />
          ))}
        </div>

        {revenueBreakdown.map((r) => (
          <div
            key={r.source}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #f5f5f5",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: r.color }} />
              <span style={{ fontSize: 14 }}>{r.source}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>₩{r.amount.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{r.percentage}%</div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Performing Posts */}
      <div style={{ background: "#fff", margin: "0 16px", borderRadius: 20, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>수익 TOP 포스트</div>
        {topPerformers.map((post, idx) => (
          <div
            key={post.title}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: idx < topPerformers.length - 1 ? "1px solid #f5f5f5" : "none",
            }}
          >
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: idx < 3 ? mint : "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 13,
              marginRight: 12,
              color: dark,
            }}>
              {idx + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {post.title}
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>
                👀 {post.traffic.toLocaleString()} · RPM ₩{post.rpm.toLocaleString()}
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: accent, whiteSpace: "nowrap", marginLeft: 8 }}>
              ₩{post.revenue.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Cost Analysis */}
      <div style={{ background: "#fff", margin: "16px", borderRadius: 20, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>운영 비용 분석</div>
        {costBreakdown.map((item) => (
          <div
            key={item.item}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #f5f5f5",
            }}
          >
            <span style={{ fontSize: 14 }}>{item.item}</span>
            <span style={{ fontWeight: 600, fontSize: 14, color: item.cost === 0 ? accent : dark }}>
              {item.cost === 0 ? "무료" : `₩${item.cost.toLocaleString()}`}
            </span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", fontWeight: 700 }}>
          <span>총 운영비</span>
          <span>₩{totalCost.toLocaleString()}/월</span>
        </div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 0 0",
          fontWeight: 700,
          color: accent,
          fontSize: 16,
        }}>
          <span>순이익</span>
          <span>₩{netProfit.toLocaleString()}/월</span>
        </div>
      </div>

      {/* ROI Insight */}
      <div style={{ background: mint, margin: "0 16px", borderRadius: 20, padding: 20, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>블로그 수익화, 가능할까?</div>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: dark }}>
          SEO 최적화된 블로그의 핵심은 <strong>복리 효과</strong>입니다.
          한 번 발행한 포스트가 검색엔진에 색인되면 꾸준히 트래픽을 가져옵니다.
          <br /><br />
          현재 데이터 기준:
          <br />
          • 포스트당 평균 RPM: ₩12,900
          <br />
          • 포스트당 월 평균 트래픽: 890회
          <br />
          • 포스트 1개의 월 수익: 약 ₩11,500
          <br />
          • 100개 포스트 누적 시: 월 ₩1,150,000 예상
          <br /><br />
          AI로 콘텐츠 생성을 반자동화하면 주 5개 포스트 발행이 가능합니다.
          <strong> 5개월이면 100개 포스트</strong>에 도달할 수 있고,
          이후에는 포스트가 쌓일수록 수익이 복리로 증가합니다.
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div style={{ margin: "0 16px 32px", background: dark, borderRadius: 20, padding: 20, color: "#fff" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>핵심 지표 요약</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "포스트당 비용", value: `₩${Math.round(totalCost / currentMonth.posts).toLocaleString()}`, sub: "AI 생성 기준" },
            { label: "포스트당 수익", value: `₩${Math.round(currentMonth.revenue / currentMonth.posts).toLocaleString()}`, sub: "광고+제휴" },
            { label: "ROI", value: `${Math.round((netProfit / totalCost) * 100)}%`, sub: "이번 달 기준" },
            { label: "손익분기", value: "2개월", sub: "첫 수익까지" },
          ].map((m) => (
            <div key={m.label} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 11, color: "#888" }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: mint }}>{m.value}</div>
              <div style={{ fontSize: 10, color: "#666" }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
