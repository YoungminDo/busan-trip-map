
'use client';
import React, { useState } from "react";

const pretendardFontUrl = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css";

const mint = "#B2F1DD";
const dark = "#2C2C2C";
const accent = "#4CAF50";

const systemSteps = [
  { step: 1, title: "Trend Keywords", desc: "AI finds high-volume, low-competition keywords daily", icon: "1" },
  { step: 2, title: "Auto Article", desc: "Generate SEO-optimized articles in 5 minutes", icon: "2" },
  { step: 3, title: "SEO Optimize", desc: "Meta tags, Schema, OG, internal links - all automated", icon: "3" },
  { step: 4, title: "Ad Placement", desc: "AdSense + Coupang Partners auto-injected at optimal spots", icon: "4" },
  { step: 5, title: "Learn Formula", desc: "Master the blog revenue formula and scale", icon: "5" },
];

const quickStats = [
  { label: "Production Speed", value: "100/mo", sub: "articles with AI" },
  { label: "Cost per Article", value: "₩695", sub: "at scale" },
  { label: "Revenue per Article", value: "₩11,700", sub: "/month avg" },
  { label: "Break-even", value: "Month 2", sub: "~50 articles" },
];

const products = [
  { id: 1, name: "AdSense", desc: "Display Banner Ads", revenue: "₩142K/mo", color: "#4285F4" },
  { id: 2, name: "Coupang", desc: "Affiliate Links", revenue: "₩89K/mo", color: "#FF6B35" },
  { id: 3, name: "Naver", desc: "AdPost", revenue: "₩58K/mo", color: "#03C75A" },
  { id: 4, name: "CPA", desc: "Lead Generation", revenue: "₩35K/mo", color: "#9C27B0" },
];

const leaderboard = [
  { id: 1, name: "Compound Traffic", desc: "Blog traffic grows even when you stop writing", points: "Core" },
  { id: 2, name: "RPM Stacking", desc: "Layer AdSense + Affiliate + CPA = 3x revenue", points: "Revenue" },
  { id: 3, name: "80/20 Keywords", desc: "20% of articles generate 80% of revenue", points: "Focus" },
  { id: 4, name: "SEO Flywheel", desc: "More content → higher DA → better rankings → more traffic", points: "Growth" },
  { id: 5, name: "AI Velocity", desc: "25 articles/week vs 2/week manually = 12.5x speed", points: "Speed" },
];

export default function Page() {
  return (
    <div style={{ fontFamily: "Pretendard, sans-serif", background: "#fff", minHeight: "100vh", color: dark }}>
      <link rel="stylesheet" href={pretendardFontUrl} />

      {/* Hero Section */}
      <div style={{ background: dark, borderRadius: 24, padding: 24, margin: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', color: "#fff" }}>
        <div style={{ fontSize: 13, color: mint, fontWeight: 700, marginBottom: 4 }}>BLOG AUTOMATION SYSTEM</div>
        <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 4, textAlign: "center" }}>Can You Make Money<br/>with Auto Blog?</div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 16, textAlign: "center" }}>
          Keyword Research → Article → SEO → Ads → Publish<br/>All automated. 20 minutes per article.
        </div>
        <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 360 }}>
          <a href="/blog-generator" style={{
            flex: 1, background: mint, color: dark, padding: "14px 0",
            borderRadius: 12, fontWeight: 700, fontSize: 14, textAlign: "center",
            textDecoration: "none",
          }}>
            Start Pipeline
          </a>
          <a href="/monetization" style={{
            flex: 1, background: "rgba(255,255,255,0.1)", color: "#fff", padding: "14px 0",
            borderRadius: 12, fontWeight: 700, fontSize: 14, textAlign: "center",
            textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)",
          }}>
            Learn Formula
          </a>
        </div>
      </div>

      {/* 5-Step System */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ fontWeight: 700, fontSize: 18, margin: '24px 0 12px 4px' }}>5-Step Money System</div>
        {systemSteps.map((s, idx) => (
          <a
            key={s.step}
            href={s.step <= 4 ? "/blog-generator" : "/monetization"}
            style={{ textDecoration: "none", color: dark }}
          >
            <div style={{
              display: "flex", alignItems: "center", gap: 14, padding: 14, marginBottom: 8,
              background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0",
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: mint, display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 18, color: dark, flexShrink: 0,
              }}>
                {s.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Step {s.step}. {s.title}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{s.desc}</div>
              </div>
              <div style={{ color: "#ccc", fontSize: 18 }}>→</div>
            </div>
          </a>
        ))}
      </div>

      {/* Quick Stats */}
      <div style={{ padding: '0 16px', marginTop: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 18, margin: '0 0 12px 4px' }}>Key Numbers</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {quickStats.map((s) => (
            <div key={s.label} style={{
              background: "#fff", borderRadius: 14, padding: 14,
              border: "1px solid #f0f0f0", boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
            }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: dark }}>{s.value}</div>
              <div style={{ fontSize: 11, color: accent, fontWeight: 600 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Channels */}
      <div style={{ padding: '0 16px', marginTop: 28 }}>
        <div style={{ fontWeight: 700, fontSize: 18, margin: '0 0 12px 4px' }}>Revenue Channels</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {products.map((p) => (
            <a key={p.id} href="/monetization" style={{ textDecoration: "none" }}>
              <div style={{
                background: '#fff', borderRadius: 14, padding: 14,
                border: "1px solid #f0f0f0", boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: p.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 14, marginBottom: 8,
                }}>
                  {p.name[0]}
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: dark }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{p.desc}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: accent }}>{p.revenue}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Blog Formulas */}
      <div style={{ padding: '0 16px', marginTop: 28, marginBottom: 32 }}>
        <div style={{ fontWeight: 700, fontSize: 18, margin: '0 0 12px 4px' }}>Profitable Blog Rules</div>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(44,44,44,0.06)', padding: 14 }}>
          {leaderboard.map((item, idx) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: idx < leaderboard.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: mint, display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 13, marginRight: 12, color: dark, flexShrink: 0,
              }}>
                {idx + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{item.desc}</div>
              </div>
              <span style={{
                fontSize: 10, background: "#f5f5f5", padding: "3px 8px",
                borderRadius: 6, fontWeight: 600, color: "#666",
              }}>
                {item.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
