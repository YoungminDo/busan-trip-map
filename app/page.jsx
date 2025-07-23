
'use client';
import React, { useState } from "react";

const pretendardFontUrl = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css";

const mint = "#B2F1DD";
const dark = "#2C2C2C";

const products = [
  { id: 1, name: "제로콜라", participants: 321, img: "https://via.placeholder.com/80x80?text=제로콜라" },
  { id: 2, name: "아몬드브리즈", participants: 210, img: "https://via.placeholder.com/80x80?text=아몬드" },
  { id: 3, name: "프로틴바", participants: 98, img: "https://via.placeholder.com/80x80?text=프로틴바" },
  { id: 4, name: "저당요거트", participants: 150, img: "https://via.placeholder.com/80x80?text=요거트" },
  { id: 5, name: "단백질쉐이크", participants: 87, img: "https://via.placeholder.com/80x80?text=쉐이크" },
  { id: 6, name: "저당초콜릿", participants: 65, img: "https://via.placeholder.com/80x80?text=초콜릿" },
  { id: 7, name: "저당쿠키", participants: 44, img: "https://via.placeholder.com/80x80?text=쿠키" },
  { id: 8, name: "저당빵", participants: 32, img: "https://via.placeholder.com/80x80?text=빵" },
  { id: 9, name: "저당우유", participants: 29, img: "https://via.placeholder.com/80x80?text=우유" },
];

const banners = [
  { id: 1, topic: "제로콜라 실험 중!", cta: "바로 실험 참여하기" },
  { id: 2, topic: "아몬드브리즈 실험 중!", cta: "바로 실험 참여하기" },
  { id: 3, topic: "단백질바 실험 중!", cta: "바로 실험 참여하기" },
];

const leaderboard = [
  { id: 1, name: "슈가헌터", count: 42, points: 1200, avatar: "https://via.placeholder.com/40x40?text=1" },
  { id: 2, name: "혈당지기", count: 39, points: 1100, avatar: "https://via.placeholder.com/40x40?text=2" },
  { id: 3, name: "실험왕", count: 35, points: 1050, avatar: "https://via.placeholder.com/40x40?text=3" },
  { id: 4, name: "오늘도당", count: 30, points: 980, avatar: "https://via.placeholder.com/40x40?text=4" },
  { id: 5, name: "건강러버", count: 28, points: 950, avatar: "https://via.placeholder.com/40x40?text=5" },
];

export default function Page() {
  const [search, setSearch] = useState("");
  const filteredProducts = products.filter(
    (p) => p.name.includes(search)
  );

  return (
    <div style={{ fontFamily: "Pretendard, sans-serif", background: "#fff", minHeight: "100vh", color: dark }}>
      <link rel="stylesheet" href={pretendardFontUrl} />
      {/* Hero Section */}
      <div style={{ background: mint, borderRadius: 24, padding: 24, margin: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🧪</div>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>현재 실험 중인 제품 수: <span style={{ color: dark }}>24개</span> / 참여자 수: <span style={{ color: dark }}>13,492명</span></div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="제품명 또는 바코드 입력하기"
          style={{
            width: '100%',
            maxWidth: 340,
            padding: '12px 16px',
            borderRadius: 12,
            border: `1.5px solid ${mint}`,
            fontSize: 16,
            outline: 'none',
            marginTop: 8,
            background: '#fff',
            color: dark
          }}
        />
      </div>

      {/* Section 1: 실험 가능한 제품 */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ fontWeight: 700, fontSize: 18, margin: '24px 0 12px 4px' }}>실험 가능한 제품</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {filteredProducts.map((p) => (
            <div key={p.id} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(44,44,44,0.06)', padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', border: `1px solid ${mint}` }}>
              <img src={p.img} alt={p.name} style={{ width: 60, height: 60, borderRadius: 12, marginBottom: 8, objectFit: 'cover', background: mint }} />
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: mint, marginBottom: 8 }}>참여자 {p.participants}명</div>
              <button style={{ background: mint, color: dark, border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginTop: 'auto' }}>실험 참여하기</button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: 기획 실험 */}
      <div style={{ padding: '0 16px', marginTop: 32 }}>
        <div style={{ fontWeight: 700, fontSize: 18, margin: '0 0 12px 4px' }}>기획 실험</div>
        <div style={{ display: 'flex', overflowX: 'auto', gap: 16 }}>
          {banners.map((b) => (
            <div key={b.id} style={{ minWidth: 240, background: mint, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', boxShadow: '0 1px 4px rgba(44,44,44,0.06)' }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{b.topic}</div>
              <button style={{ background: dark, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{b.cta}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: 실험자 랭킹 */}
      <div style={{ padding: '0 16px', marginTop: 32, marginBottom: 32 }}>
        <div style={{ fontWeight: 700, fontSize: 18, margin: '0 0 12px 4px' }}>실험자 랭킹</div>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(44,44,44,0.06)', padding: 12 }}>
          {leaderboard.map((user, idx) => (
            <div key={user.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: idx < leaderboard.length - 1 ? `1px solid #eee` : 'none' }}>
              <img src={user.avatar} alt={user.name} style={{ width: 36, height: 36, borderRadius: '50%', marginRight: 12, background: mint }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{user.name}</div>
                <div style={{ fontSize: 13, color: '#888' }}>실험 {user.count}회 · {user.points}pt</div>
              </div>
              <div style={{ fontWeight: 700, color: mint, fontSize: 18 }}>{idx + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
