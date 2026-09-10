"use client";
import { useState, use } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Link from "next/link";

const mockReviews = [
  {
    id: 1, rating: 5, title: "좋은 복지와 수평적인 문화",
    pros: "자율 출퇴근제와 재택근무가 잘 되어 있고, 개인 성장을 위한 지원이 많습니다. 동료들이 실력 있고 배울 점이 많아요.",
    cons: "빠른 성장에 따른 업무량이 많아지는 추세이고, 부서마다 문화 차이가 있어요.",
    position: "소프트웨어 엔지니어", period: "재직 중", time: "2주 전", recommend: true,
  },
  {
    id: 2, rating: 3, title: "안정적이지만 성장 기회가 적음",
    pros: "업계 평균 이상의 연봉과 복지혜택. 워라밸이 비교적 잘 지켜집니다.",
    cons: "연차가 쌓여도 업무 범위가 비슷하고, 승진 기회가 제한적이에요. 보수적인 의사결정 구조.",
    position: "마케팅 기획", period: "퇴직 (1년 미만)", time: "1달 전", recommend: false,
  },
  {
    id: 3, rating: 4, title: "도전적인 환경, 빠른 성장 가능",
    pros: "어려운 문제를 풀 수 있는 환경이고 실력자가 많아요. 복지도 좋고 연봉도 괜찮습니다.",
    cons: "업무 강도가 높고 야근이 종종 있어요. 프로젝트에 따라 편차가 큽니다.",
    position: "프로덕트 매니저", period: "재직 중", time: "3달 전", recommend: true,
  },
];

function StarRating({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: "1px" }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ fontSize: `${size}px`, color: s <= Math.round(value) ? "#f59e0b" : "#d4d4d8" }}>★</span>
      ))}
    </div>
  );
}

export default function CompanyDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "salary">("overview");

  const companyName = name.charAt(0).toUpperCase() + name.slice(1);

  const ratings = [
    { label: "워라밸", value: 4.1 },
    { label: "연봉·복지", value: 4.3 },
    { label: "사내문화", value: 3.9 },
    { label: "경영진", value: 3.7 },
    { label: "성장기회", value: 4.0 },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "24px 20px", maxWidth: "760px" }}>

          {/* 회사 헤더 카드 */}
          <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "14px", padding: "24px", marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "20px" }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "14px",
                background: "#f0f0ff", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px", fontWeight: "800", color: "#1a1a2e",
              }}>{companyName[0]}</div>
              <div>
                <h1 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "800" }}>{companyName}</h1>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", background: "#f4f4f5", color: "#71717a", padding: "2px 8px", borderRadius: "4px" }}>대기업</span>
                  <span style={{ fontSize: "12px", color: "#a1a1aa" }}>IT·인터넷</span>
                  <span style={{ fontSize: "12px", color: "#a1a1aa" }}>서울 성남시</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <StarRating value={4.1} size={16} />
                  <span style={{ fontSize: "20px", fontWeight: "800", fontFamily: "Inter, sans-serif" }}>4.1</span>
                  <span style={{ fontSize: "13px", color: "#a1a1aa" }}>/ 리뷰 {mockReviews.length}개</span>
                </div>
              </div>
              <Link href="/company/write" style={{
                marginLeft: "auto", padding: "9px 16px",
                background: "#e94560", color: "#fff",
                borderRadius: "8px", fontSize: "13px", fontWeight: "600", flexShrink: 0,
              }}>리뷰 작성</Link>
            </div>

            {/* 요약 지표 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {[
                { label: "평균 연봉", value: "7,200만원", icon: "💰" },
                { label: "추천율", value: "74%", icon: "👍" },
                { label: "재직자 비율", value: "61%", icon: "🏢" },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: "#f8f8fa", borderRadius: "10px", padding: "14px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "20px", marginBottom: "4px" }}>{stat.icon}</div>
                  <div style={{ fontSize: "16px", fontWeight: "800", color: "#18181b", fontFamily: "Inter, sans-serif" }}>{stat.value}</div>
                  <div style={{ fontSize: "11px", color: "#a1a1aa", marginTop: "2px" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 탭 */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "16px", background: "#fff", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "4px" }}>
            {(["overview", "reviews", "salary"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: "9px",
                borderRadius: "7px", border: "none",
                background: activeTab === tab ? "#1a1a2e" : "transparent",
                color: activeTab === tab ? "#fff" : "#71717a",
                fontSize: "13px", fontWeight: activeTab === tab ? "700" : "400",
                cursor: "pointer",
              }}>
                {tab === "overview" ? "종합 평가" : tab === "reviews" ? "리뷰" : "연봉 정보"}
              </button>
            ))}
          </div>

          {/* 탭 컨텐츠 */}
          {activeTab === "overview" && (
            <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", padding: "22px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "700" }}>항목별 평점</h3>
              {ratings.map(r => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "13px", color: "#52525b", minWidth: "70px" }}>{r.label}</span>
                  <div style={{ flex: 1, height: "8px", background: "#f4f4f5", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${(r.value / 5) * 100}%`, height: "100%", background: "#1a1a2e", borderRadius: "4px" }} />
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: "700", minWidth: "28px", textAlign: "right", fontFamily: "Inter, sans-serif" }}>{r.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {mockReviews.map(review => (
                <div key={review.id} style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div>
                      <StarRating value={review.rating} />
                      <h4 style={{ margin: "6px 0 4px", fontSize: "14px", fontWeight: "700" }}>{review.title}</h4>
                      <div style={{ fontSize: "12px", color: "#a1a1aa" }}>{review.position} · {review.period} · {review.time}</div>
                    </div>
                    <span style={{
                      padding: "4px 10px", borderRadius: "20px", height: "fit-content",
                      background: review.recommend ? "#f0fff4" : "#fff0f3",
                      color: review.recommend ? "#16a34a" : "#e94560",
                      fontSize: "11px", fontWeight: "600",
                    }}>{review.recommend ? "👍 추천" : "👎 비추천"}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ background: "#f8f8fa", borderRadius: "8px", padding: "12px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#16a34a", marginBottom: "6px" }}>✅ 장점</div>
                      <p style={{ margin: 0, fontSize: "13px", color: "#3f3f46", lineHeight: "1.6" }}>{review.pros}</p>
                    </div>
                    <div style={{ background: "#f8f8fa", borderRadius: "8px", padding: "12px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#e94560", marginBottom: "6px" }}>⚠️ 단점</div>
                      <p style={{ margin: 0, fontSize: "13px", color: "#3f3f46", lineHeight: "1.6" }}>{review.cons}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "salary" && (
            <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", padding: "22px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "700" }}>직급별 평균 연봉</h3>
              {[
                { level: "신입 (1~3년)", avg: "4,800만원", range: "4,200 ~ 5,500만원" },
                { level: "대리급 (4~6년)", avg: "6,200만원", range: "5,500 ~ 7,000만원" },
                { level: "과장급 (7~9년)", avg: "7,800만원", range: "7,000 ~ 9,000만원" },
                { level: "차장급 (10년+)", avg: "9,500만원", range: "8,500 ~ 1.1억원" },
                { level: "팀장·임원", avg: "1.3억원+", range: "비공개" },
              ].map(row => (
                <div key={row.level} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0", borderBottom: "1px solid #f4f4f5",
                }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#18181b" }}>{row.level}</div>
                    <div style={{ fontSize: "11px", color: "#a1a1aa", marginTop: "2px" }}>범위: {row.range}</div>
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "800", color: "#1a1a2e", fontFamily: "Inter, sans-serif" }}>{row.avg}</div>
                </div>
              ))}
              <p style={{ margin: "16px 0 0", fontSize: "11px", color: "#a1a1aa" }}>* 익명 제보 기반 추정치입니다. 실제와 다를 수 있습니다.</p>
            </div>
          )}
        </main>

        <aside style={{ width: "280px", flexShrink: 0, padding: "24px 16px" }}>
          <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "700" }}>💬 관련 게시글</h3>
            {[
              "연봉협상 팁 공유합니다",
              "면접 후기 (합격)",
              "복지 실제로 어떤가요?",
            ].map((title, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid #f4f4f5", fontSize: "13px", color: "#3f3f46" }}>
                {title}
              </div>
            ))}
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
