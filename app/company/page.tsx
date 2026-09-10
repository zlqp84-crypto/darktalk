"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Link from "next/link";

const mockCompanies = [
  { id: "samsung", name: "삼성전자", industry: "IT·전자", size: "대기업", rating: 4.2, salary: "6,800만원", reviews: 1284, recommend: 78 },
  { id: "kakao", name: "카카오", industry: "IT·인터넷", size: "대기업", rating: 3.9, salary: "7,200만원", reviews: 892, recommend: 71 },
  { id: "naver", name: "네이버", industry: "IT·인터넷", size: "대기업", rating: 4.1, salary: "7,500만원", reviews: 1047, recommend: 74 },
  { id: "coupang", name: "쿠팡", industry: "이커머스", size: "대기업", rating: 3.5, salary: "6,200만원", reviews: 673, recommend: 58 },
  { id: "kakaobank", name: "카카오뱅크", industry: "핀테크", size: "중견기업", rating: 4.0, salary: "6,900만원", reviews: 428, recommend: 72 },
  { id: "krafton", name: "크래프톤", industry: "게임", size: "중견기업", rating: 4.3, salary: "8,100만원", reviews: 312, recommend: 82 },
  { id: "woori", name: "우리은행", industry: "금융", size: "대기업", rating: 3.7, salary: "7,800만원", reviews: 534, recommend: 63 },
  { id: "hyundai", name: "현대자동차", industry: "자동차", size: "대기업", rating: 3.8, salary: "7,100만원", reviews: 941, recommend: 67 },
];

function StarRating({ value }: { value: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ fontSize: "12px", color: s <= Math.round(value) ? "#f59e0b" : "#d4d4d8" }}>★</span>
      ))}
      <span style={{ fontSize: "13px", fontWeight: "700", marginLeft: "4px", fontFamily: "Inter, sans-serif" }}>{value.toFixed(1)}</span>
    </div>
  );
}

export default function CompanyPage() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("전체");

  const industries = ["전체", "IT·전자", "IT·인터넷", "이커머스", "핀테크", "게임", "금융", "자동차"];

  const filtered = mockCompanies.filter(c =>
    (industry === "전체" || c.industry === industry) &&
    (search === "" || c.name.includes(search))
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "24px 20px", maxWidth: "760px" }}>

          {/* 헤더 */}
          <div style={{
            background: "linear-gradient(135deg, #1a1a2e, #16213e)",
            borderRadius: "14px", padding: "22px 26px", marginBottom: "20px", color: "#fff",
          }}>
            <h1 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: "800" }}>🏢 기업 리뷰</h1>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
              재직자·전직자의 솔직한 기업 리뷰. 연봉, 복지, 조직문화를 확인하세요.
            </p>
            <div style={{ position: "relative" }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="회사명으로 검색..."
                style={{
                  width: "100%", padding: "10px 16px 10px 36px",
                  borderRadius: "10px", border: "none",
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff", fontSize: "14px", outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>🔍</span>
            </div>
          </div>

          {/* 업종 필터 */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            {industries.map(ind => (
              <button key={ind} onClick={() => setIndustry(ind)} style={{
                padding: "6px 14px", borderRadius: "20px",
                border: `1px solid ${industry === ind ? "#1a1a2e" : "#e4e4e7"}`,
                background: industry === ind ? "#1a1a2e" : "#fff",
                color: industry === ind ? "#fff" : "#52525b",
                fontSize: "12px", fontWeight: industry === ind ? "600" : "400",
                cursor: "pointer",
              }}>{ind}</button>
            ))}
          </div>

          {/* 기업 카드 목록 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.map(company => (
              <Link key={company.id} href={`/company/${company.id}`}>
                <div style={{
                  background: "#fff", border: "1px solid #e4e4e7",
                  borderRadius: "12px", padding: "18px 20px",
                  cursor: "pointer", transition: "box-shadow 0.15s, border-color 0.15s",
                  display: "flex", alignItems: "center", gap: "16px",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#c4c4c7";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#e4e4e7";
                  }}
                >
                  {/* 로고 자리 */}
                  <div style={{
                    width: "52px", height: "52px", borderRadius: "12px",
                    background: "#f0f0ff", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px", fontWeight: "800", color: "#1a1a2e",
                  }}>
                    {company.name[0]}
                  </div>

                  {/* 회사 정보 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "700", color: "#18181b" }}>{company.name}</span>
                      <span style={{ fontSize: "11px", background: "#f4f4f5", color: "#71717a", padding: "2px 7px", borderRadius: "4px" }}>{company.size}</span>
                      <span style={{ fontSize: "11px", color: "#a1a1aa" }}>{company.industry}</span>
                    </div>
                    <StarRating value={company.rating} />
                    <div style={{ display: "flex", gap: "16px", marginTop: "6px", fontSize: "12px", color: "#71717a" }}>
                      <span>💰 평균 연봉 <strong style={{ color: "#18181b" }}>{company.salary}</strong></span>
                      <span>📝 리뷰 {company.reviews.toLocaleString()}개</span>
                      <span>👍 추천 {company.recommend}%</span>
                    </div>
                  </div>

                  <div style={{ fontSize: "18px", color: "#d4d4d8", flexShrink: 0 }}>›</div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏢</div>
              <p style={{ fontSize: "15px", fontWeight: "600", color: "#3f3f46" }}>검색 결과가 없어요</p>
              <p style={{ fontSize: "13px", color: "#a1a1aa", marginTop: "4px" }}>리뷰를 작성해서 첫 번째 기여자가 되어보세요!</p>
            </div>
          )}
        </main>

        {/* 우측 사이드바 */}
        <aside style={{ width: "280px", flexShrink: 0, padding: "24px 16px" }}>
          <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "700" }}>⭐ 이번 주 TOP 리뷰</h3>
            {mockCompanies.sort((a, b) => b.rating - a.rating).slice(0, 4).map((c, i) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: "1px solid #f4f4f5" }}>
                <span style={{ fontWeight: "800", color: i < 3 ? "#e94560" : "#a1a1aa", fontFamily: "Inter, sans-serif", minWidth: "16px" }}>{i + 1}</span>
                <span style={{ fontSize: "13px", fontWeight: "600", flex: 1 }}>{c.name}</span>
                <span style={{ fontSize: "12px", color: "#f59e0b", fontFamily: "Inter, sans-serif" }}>★ {c.rating}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: "700" }}>✏️ 리뷰 작성하기</h3>
            <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#71717a", lineHeight: "1.6" }}>
              재직 중이거나 퇴직한 회사의 솔직한 리뷰를 남겨주세요. 익명으로 처리됩니다.
            </p>
            <Link href="/company/write" style={{
              display: "block", textAlign: "center",
              padding: "9px", background: "#e94560", color: "#fff",
              borderRadius: "8px", fontSize: "13px", fontWeight: "600",
            }}>리뷰 작성</Link>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
