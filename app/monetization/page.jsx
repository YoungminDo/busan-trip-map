
'use client';
import React, { useState } from "react";

const pretendardFontUrl = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css";

const mint = "#B2F1DD";
const dark = "#2C2C2C";
const accent = "#4CAF50";
const red = "#f44336";

// ===== THE BLOG MONEY FORMULA =====
const formulaSteps = [
  {
    id: 1,
    title: "Traffic = Content x SEO x Time",
    formula: "Monthly Traffic",
    desc: "Good articles + SEO optimization compound over time. Every article adds cumulative organic traffic.",
    example: "100 articles x avg 300 visits/mo = 30,000 visits/mo",
    icon: "1",
  },
  {
    id: 2,
    title: "Revenue = Traffic x RPM / 1000",
    formula: "Monthly Revenue",
    desc: "RPM (Revenue Per Mille) = how much you earn per 1,000 page views. Ad networks + affiliate combined.",
    example: "30,000 visits x ₩12,000 RPM / 1000 = ₩360,000/mo",
    icon: "2",
  },
  {
    id: 3,
    title: "Profit = Revenue - Cost",
    formula: "Net Profit",
    desc: "AI automation keeps costs fixed while revenue scales with content volume.",
    example: "₩360,000 - ₩69,500 (AI+hosting) = ₩290,500/mo",
    icon: "3",
  },
  {
    id: 4,
    title: "Scale = Compound Growth",
    formula: "Growth over Time",
    desc: "Blog income compounds: each article earns forever. 200 articles = double the revenue, same effort.",
    example: "Year 1: ₩290K/mo → Year 2: ₩1.2M/mo → Year 3: ₩3M+/mo",
    icon: "4",
  },
];

// Revenue channels detailed
const revenueChannels = [
  {
    name: "Google AdSense",
    type: "Display Ads",
    icon: "G",
    color: "#4285F4",
    rpm: "₩3,000~8,000",
    setup: "Easy (approval required)",
    bestFor: "All articles",
    monthlyEst: 142000,
    tips: [
      "Place ads above the fold",
      "Use responsive ad units",
      "In-article ads have highest RPM",
      "Min 30+ quality articles for approval",
    ],
  },
  {
    name: "Coupang Partners",
    type: "Affiliate (CPS)",
    icon: "C",
    color: "#FF6B35",
    rpm: "₩2,000~15,000",
    setup: "Easy (instant)",
    bestFor: "Product reviews, travel guides",
    monthlyEst: 89000,
    tips: [
      "Link relevant products naturally in content",
      "Use product comparison tables",
      "3% commission on all purchases within 24hrs",
      "Seasonal products = higher conversion",
    ],
  },
  {
    name: "Naver AdPost",
    type: "Display Ads",
    icon: "N",
    color: "#03C75A",
    rpm: "₩1,000~4,000",
    setup: "Medium (Naver Blog only)",
    bestFor: "Korean-focused content",
    monthlyEst: 58000,
    tips: [
      "Naver Blog gets preferential Naver search ranking",
      "Lower RPM but higher Korean traffic",
      "Good for supplementary income",
      "Cross-post from main blog to Naver",
    ],
  },
  {
    name: "Affiliate (CPA)",
    type: "Lead Generation",
    icon: "A",
    color: "#9C27B0",
    rpm: "₩5,000~30,000",
    setup: "Medium (partner approval)",
    bestFor: "Finance, insurance, education",
    monthlyEst: 35000,
    tips: [
      "Highest RPM of all channels",
      "Requires topic-specific content",
      "Travel insurance, hotel booking = good fits",
      "Place CTA buttons strategically",
    ],
  },
];

// Growth simulation
const growthData = [
  { month: 1, articles: 25, totalArticles: 25, traffic: 2500, revenue: 25000, cost: 69500, profit: -44500 },
  { month: 2, articles: 25, totalArticles: 50, traffic: 7500, revenue: 75000, cost: 69500, profit: 5500 },
  { month: 3, articles: 25, totalArticles: 75, traffic: 15000, revenue: 150000, cost: 69500, profit: 80500 },
  { month: 4, articles: 25, totalArticles: 100, traffic: 25000, revenue: 275000, cost: 69500, profit: 205500 },
  { month: 5, articles: 25, totalArticles: 125, traffic: 37500, revenue: 412000, cost: 69500, profit: 342500 },
  { month: 6, articles: 25, totalArticles: 150, traffic: 52000, revenue: 572000, cost: 69500, profit: 502500 },
  { month: 9, articles: 25, totalArticles: 225, traffic: 90000, revenue: 1080000, cost: 69500, profit: 1010500 },
  { month: 12, articles: 25, totalArticles: 300, traffic: 150000, revenue: 1950000, cost: 69500, profit: 1880500 },
];

// Cost structure
const costs = [
  { item: "Claude/GPT API", cost: 45000, note: "~100 articles/mo" },
  { item: "Image AI (DALL-E/Midjourney)", cost: 15000, note: "thumbnails + body" },
  { item: "Hosting (Vercel/Netlify)", cost: 0, note: "Free tier" },
  { item: "Domain (.com)", cost: 1500, note: "annual/12" },
  { item: "Crawling server", cost: 8000, note: "keyword monitoring" },
];

// Key blog formulas to learn
const blogFormulas = [
  {
    title: "The 80/20 Keyword Rule",
    desc: "80% of your revenue will come from 20% of your articles. Focus on high-volume, low-competition keywords.",
    metric: "Keyword Difficulty < 30 + Volume > 5,000 = Golden Keyword",
    tag: "KEYWORD",
  },
  {
    title: "Compound Traffic Effect",
    desc: "Unlike social media, blog traffic compounds. Article written today earns traffic for 2-3 years.",
    metric: "1 article = avg 300 visits/mo for 24+ months = 7,200 lifetime visits",
    tag: "TRAFFIC",
  },
  {
    title: "RPM Optimization Stack",
    desc: "Layer multiple revenue sources on each article. AdSense + Affiliate + CPA = 3x RPM.",
    metric: "Single channel RPM ₩3,000 → Stacked RPM ₩9,000~12,000",
    tag: "REVENUE",
  },
  {
    title: "Content Velocity Formula",
    desc: "The faster you publish quality content, the faster you reach profitability. AI makes 25+/week possible.",
    metric: "Manual: 2/week | AI-assisted: 25/week | 12.5x productivity",
    tag: "SPEED",
  },
  {
    title: "SEO Flywheel",
    desc: "More content → more backlinks → higher domain authority → higher rankings → more traffic → more revenue.",
    metric: "DA 0→20: 6 months | DA 20→40: 12 months | DA 40+: exponential growth",
    tag: "SEO",
  },
  {
    title: "Break-Even Point",
    desc: "With AI automation, the break-even is surprisingly fast. Fixed costs stay flat while revenue scales.",
    metric: "Break-even at ~50 articles (Month 2) with ₩69,500/mo fixed cost",
    tag: "PROFIT",
  },
];

export default function MonetizationPage() {
  const [expandedChannel, setExpandedChannel] = useState(null);
  const maxTraffic = Math.max(...growthData.map(d => d.traffic));
  const totalCost = costs.reduce((a, b) => a + b.cost, 0);

  return (
    <div style={{ fontFamily: "Pretendard, sans-serif", background: "#f8faf9", minHeight: "100vh", color: dark }}>
      <link rel="stylesheet" href={pretendardFontUrl} />

      {/* Header */}
      <div style={{ background: dark, color: "#fff", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/blog-generator" style={{ color: "#fff", textDecoration: "none", fontSize: 14 }}>← Pipeline</a>
        <div style={{ fontWeight: 700, fontSize: 17 }}>Blog Money Formula</div>
        <a href="/" style={{ color: mint, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>Home →</a>
      </div>

      {/* THE FORMULA */}
      <div style={{ margin: 16, background: dark, borderRadius: 20, padding: 20, color: "#fff" }}>
        <div style={{ fontSize: 13, color: mint, fontWeight: 700, marginBottom: 4 }}>STEP 5</div>
        <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>The Blog Revenue Formula</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>The proven formula that makes blogs profitable</div>

        {formulaSteps.map((f, idx) => (
          <div key={f.id} style={{ marginBottom: idx < formulaSteps.length - 1 ? 16 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", background: mint,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 14, color: dark, flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{f.title}</div>
            </div>
            <div style={{ marginLeft: 38, fontSize: 12, color: "#aaa", marginBottom: 4 }}>{f.desc}</div>
            <div style={{ marginLeft: 38, fontSize: 12, color: mint, fontWeight: 600, background: "rgba(178,241,221,0.1)", padding: "6px 10px", borderRadius: 8, display: "inline-block" }}>
              {f.example}
            </div>
            {idx < formulaSteps.length - 1 && (
              <div style={{ marginLeft: 52, fontSize: 16, color: "#555", padding: "4px 0" }}>|</div>
            )}
          </div>
        ))}
      </div>

      {/* Revenue Channels */}
      <div style={{ background: "#fff", margin: "0 16px", borderRadius: 20, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Revenue Channels</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>Click to see implementation tips for each channel</div>

        {revenueChannels.map((ch) => (
          <div key={ch.name} style={{ marginBottom: 8 }}>
            <div
              onClick={() => setExpandedChannel(expandedChannel === ch.name ? null : ch.name)}
              style={{
                display: "flex", alignItems: "center", padding: 12,
                background: expandedChannel === ch.name ? "#f8f8f8" : "#fff",
                borderRadius: 12, cursor: "pointer", border: "1px solid #f0f0f0",
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: ch.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 800, fontSize: 16, marginRight: 12, flexShrink: 0,
              }}>
                {ch.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{ch.name}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{ch.type} | RPM {ch.rpm}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: accent }}>₩{ch.monthlyEst.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: "#888" }}>/month</div>
              </div>
            </div>

            {expandedChannel === ch.name && (
              <div style={{ padding: "12px 12px 12px 60px", background: "#fafafa", borderRadius: "0 0 12px 12px", marginTop: -4 }}>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>Setup: {ch.setup} | Best for: {ch.bestFor}</div>
                {ch.tips.map((tip, idx) => (
                  <div key={idx} style={{ fontSize: 12, color: dark, padding: "3px 0", display: "flex", gap: 6 }}>
                    <span style={{ color: accent }}>-</span> {tip}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Total */}
        <div style={{ marginTop: 12, padding: 14, background: mint, borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Total Monthly Revenue (est.)</div>
          <div style={{ fontWeight: 800, fontSize: 18, color: dark }}>
            ₩{revenueChannels.reduce((a, b) => a + b.monthlyEst, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Growth Simulation */}
      <div style={{ background: "#fff", margin: "16px", borderRadius: 20, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>12-Month Growth Simulation</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>Based on 25 articles/week with AI automation</div>

        {/* Simple bar chart */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100, marginBottom: 12 }}>
          {growthData.map((d) => (
            <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ fontSize: 9, color: d.profit > 0 ? accent : red, fontWeight: 600 }}>
                {d.profit > 0 ? "+" : ""}{(d.profit / 1000).toFixed(0)}k
              </div>
              <div style={{
                width: "100%",
                height: `${(d.traffic / maxTraffic) * 80}px`,
                background: d.profit > 0 ? accent : "#ffcdd2",
                borderRadius: "4px 4px 0 0",
                minHeight: 4,
              }} />
              <div style={{ fontSize: 9, color: "#888" }}>M{d.month}</div>
            </div>
          ))}
        </div>

        {/* Key milestones */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <div style={{ background: "#FFF3E0", borderRadius: 10, padding: 10, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#888" }}>Break-even</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: warning }}>Month 2</div>
            <div style={{ fontSize: 10, color: "#888" }}>50 articles</div>
          </div>
          <div style={{ background: "#E8F5E9", borderRadius: 10, padding: 10, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#888" }}>₩1M/mo</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: accent }}>Month 9</div>
            <div style={{ fontSize: 10, color: "#888" }}>225 articles</div>
          </div>
          <div style={{ background: "#E8F5E9", borderRadius: 10, padding: 10, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#888" }}>₩2M+/mo</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: accent }}>Month 12</div>
            <div style={{ fontSize: 10, color: "#888" }}>300 articles</div>
          </div>
        </div>
      </div>

      {/* Cost Structure */}
      <div style={{ background: "#fff", margin: "0 16px", borderRadius: 20, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Fixed Monthly Costs</div>
        {costs.map((c) => (
          <div key={c.item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{c.item}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{c.note}</div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 13, color: c.cost === 0 ? accent : dark }}>
              {c.cost === 0 ? "Free" : `₩${c.cost.toLocaleString()}`}
            </div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", fontWeight: 700, fontSize: 15 }}>
          <span>Total Fixed Cost</span>
          <span>₩{totalCost.toLocaleString()}/mo</span>
        </div>
        <div style={{ fontSize: 12, color: accent, marginTop: 4, fontWeight: 600 }}>
          Cost per article: ₩{Math.round(totalCost / 100).toLocaleString()} (at 100 articles/mo)
        </div>
      </div>

      {/* Blog Formulas to Learn */}
      <div style={{ margin: "16px" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Profitable Blog Formulas</div>
        {blogFormulas.map((f) => (
          <div key={f.title} style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{f.title}</div>
              <span style={{ fontSize: 10, background: mint, padding: "2px 8px", borderRadius: 4, fontWeight: 700, color: dark, flexShrink: 0 }}>
                {f.tag}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 8, lineHeight: 1.6 }}>{f.desc}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: dark, background: "#f5f5f5", padding: "8px 10px", borderRadius: 8, borderLeft: `3px solid ${accent}` }}>
              {f.metric}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={{ margin: "0 16px 32px", background: dark, borderRadius: 20, padding: 20, color: "#fff", textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Ready to Start?</div>
        <div style={{ fontSize: 13, color: "#aaa", marginBottom: 16 }}>
          AI + SEO + Ads + Consistency = Scalable Blog Income
        </div>
        <a href="/blog-generator" style={{
          display: "inline-block", background: mint, color: dark,
          padding: "14px 32px", borderRadius: 12, fontWeight: 700, fontSize: 14,
          textDecoration: "none",
        }}>
          Go to Pipeline →
        </a>
      </div>
    </div>
  );
}
