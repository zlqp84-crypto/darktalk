import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { mockPosts } from "@/lib/mockData";
import Link from "next/link";

export default function Home() {
  const hotPosts = mockPosts.filter(p => p.isHot);
  const allPosts = mockPosts;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />

        {/* 메인 피드 */}
        <main style={{ flex: 1, padding: "24px 20px", maxWidth: "760px" }}>

          {/* HOT 게시글 배너 */}
          <div style={{
            background: "linear-gradient(135deg, #1a1a2e, #16213e)",
            borderRadius: "14px",
            padding: "20px 24px",
            marginBottom: "20px",
            color: "#fff",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>🔥 지금 뜨는 글</h2>
              <Link href="/board" style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>더보기 →</Link>
            </div>
            {hotPosts.map((post, i) => (
              <Link key={post.id} href={`/post/${post.id}`}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 0",
                  borderBottom: i < hotPosts.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                }}>
                  <span style={{ color: "#e94560", fontWeight: "800", fontSize: "15px", minWidth: "20px" }}>{i + 1}</span>
                  <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)", flex: 1,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {post.title}
                  </span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", flexShrink: 0 }}>❤️ {post.likes}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* 필터 탭 */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {["최신순", "인기순", "댓글순"].map((tab, i) => (
              <button key={tab} style={{
                padding: "7px 16px",
                borderRadius: "20px",
                border: "1px solid " + (i === 0 ? "#1a1a2e" : "#e4e4e7"),
                background: i === 0 ? "#1a1a2e" : "#fff",
                color: i === 0 ? "#fff" : "#52525b",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
              }}>{tab}</button>
            ))}
          </div>

          {/* 게시글 목록 */}
          {allPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </main>

        {/* 우측 사이드바 */}
        <aside style={{ width: "280px", flexShrink: 0, padding: "24px 16px" }}>
          {/* 인증 안내 */}
          <div style={{
            background: "#fff",
            border: "1px solid #e4e4e7",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "16px",
          }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "15px", fontWeight: "700" }}>🔐 직장인 인증</h3>
            <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#71717a", lineHeight: "1.6" }}>
              회사 이메일 또는 건강보험 EDI로 재직을 인증하고 모든 채널에 참여하세요.
            </p>
            <Link href="/verify" style={{
              display: "block",
              textAlign: "center",
              padding: "9px",
              background: "#e94560",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
            }}>인증하기</Link>
          </div>

          {/* 통계 */}
          <div style={{
            background: "#fff",
            border: "1px solid #e4e4e7",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "16px",
          }}>
            <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: "700" }}>📊 오늘의 현황</h3>
            {[
              { label: "오늘 새 글", value: "1,284" },
              { label: "실시간 접속", value: "3,471" },
              { label: "누적 회원", value: "89,200" },
            ].map(stat => (
              <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0",
                borderBottom: "1px solid #f4f4f5", fontSize: "13px" }}>
                <span style={{ color: "#71717a" }}>{stat.label}</span>
                <span style={{ fontWeight: "700", color: "#1a1a2e" }}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* 광고 영역 */}
          <div style={{
            background: "#f4f4f5",
            border: "1px dashed #d4d4d8",
            borderRadius: "12px",
            padding: "40px 20px",
            textAlign: "center",
          }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#a1a1aa" }}>광고 영역</p>
            <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#d4d4d8" }}>광고 문의: advertise@darktalk.kr</p>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
