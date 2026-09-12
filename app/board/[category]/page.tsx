"use client";
import { use, useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { supabase } from "@/lib/supabase";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  created_at: string;
}

const categoryMap: Record<string, { label: string; icon: string; desc: string }> = {
  conglomerate: { label: "대기업·중견기업", icon: "🏢", desc: "대기업·중견기업 재직자들의 솔직한 이야기" },
  sme:          { label: "중소기업",        icon: "🏬", desc: "중소기업 재직자들의 현실적인 이야기" },
  startup:      { label: "스타트업",        icon: "🚀", desc: "스타트업 합류·생활·이직에 관한 이야기" },
  freelancer:   { label: "프리랜서",        icon: "💻", desc: "프리랜서·개인사업자를 위한 공간" },
  career:       { label: "취업·이직",       icon: "💼", desc: "취업 준비, 이직 고민, 면접 후기" },
  salary:       { label: "급여·연봉",       icon: "💰", desc: "연봉 협상, 급여 정보, 처우 이야기" },
  worklife:     { label: "직장생활",        icon: "☕", desc: "직장 내 인간관계, 조직문화, 일상" },
  free:         { label: "자유게시판",      icon: "💬", desc: "직장인이라면 누구나 자유롭게" },
};

const sortOptions = ["최신순", "인기순", "댓글순"];

export default function BoardPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const [sort, setSort] = useState(0);
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const info = categoryMap[category] ?? { label: "전체 채널", icon: "🏠", desc: "모든 채널의 게시글" };

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      let query = supabase.from("posts").select("*");

      // 카테고리 필터 (전체는 필터 없음)
      if (categoryMap[category]) {
        query = query.eq("category", categoryMap[category].label);
      }

      // 정렬
      if (sort === 0) {
        query = query.order("created_at", { ascending: false });
      } else if (sort === 1) {
        query = query.order("likes_count", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data } = await query.limit(50);
      setPosts(data ?? []);
      setLoading(false);
    }
    fetchPosts();
  }, [category, sort]);

  const filtered = posts.filter(p =>
    search === "" || p.title.includes(search) || p.content.includes(search)
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "24px 20px", maxWidth: "760px" }}>

          {/* 채널 헤더 */}
          <div style={{
            background: "linear-gradient(135deg, #1a1a2e, #16213e)",
            borderRadius: "14px",
            padding: "22px 26px",
            marginBottom: "20px",
            color: "#fff",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
              <span style={{ fontSize: "28px" }}>{info.icon}</span>
              <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>{info.label}</h1>
            </div>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{info.desc}</p>
            {/* 채널 내 검색 */}
            <div style={{ position: "relative" }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`${info.label} 채널 내 검색...`}
                style={{
                  width: "100%",
                  padding: "10px 16px 10px 36px",
                  borderRadius: "10px",
                  border: "none",
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>🔍</span>
            </div>
          </div>

          {/* 통계 바 */}
          <div style={{
            display: "flex", gap: "20px",
            background: "#fff", border: "1px solid #e4e4e7",
            borderRadius: "10px", padding: "12px 18px",
            marginBottom: "16px", fontSize: "13px",
          }}>
            {[
              { label: "총 게시글", value: posts.length.toLocaleString() },
              { label: "오늘 새 글", value: "284" },
              { label: "지금 접속", value: "1,203" },
            ].map(stat => (
              <div key={stat.label} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ color: "#a1a1aa" }}>{stat.label}</span>
                <span style={{ fontWeight: "700", color: "#1a1a2e", fontFamily: "Inter, sans-serif" }}>{stat.value}</span>
              </div>
            ))}
            <div style={{ marginLeft: "auto" }}>
              <a href="/write" style={{
                display: "inline-block",
                padding: "6px 14px",
                background: "#1a1a2e", color: "#fff",
                borderRadius: "6px", fontSize: "12px", fontWeight: "700",
              }}>✏️ 글쓰기</a>
            </div>
          </div>

          {/* 정렬 탭 */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {sortOptions.map((opt, i) => (
              <button key={opt} onClick={() => setSort(i)} style={{
                padding: "7px 16px", borderRadius: "20px",
                border: `1px solid ${sort === i ? "#1a1a2e" : "#e4e4e7"}`,
                background: sort === i ? "#1a1a2e" : "#fff",
                color: sort === i ? "#fff" : "#52525b",
                fontSize: "13px", fontWeight: sort === i ? "600" : "400",
                cursor: "pointer",
              }}>{opt}</button>
            ))}
          </div>

          {/* 로딩 */}
          {loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "#a1a1aa", fontSize: "14px" }}>
              불러오는 중...
            </div>
          )}

          {/* 게시글 없을 때 */}
          {!loading && filtered.length === 0 && (
            <div style={{
              textAlign: "center", padding: "60px 20px",
              background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px",
            }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
              <p style={{ fontSize: "15px", fontWeight: "600", color: "#3f3f46" }}>
                {search ? "검색 결과가 없어요" : "아직 게시글이 없어요"}
              </p>
              <p style={{ fontSize: "13px", color: "#a1a1aa", marginTop: "4px" }}>
                {search ? "다른 키워드로 검색해보세요" : "첫 번째 글을 작성해보세요!"}
              </p>
            </div>
          )}

          {/* 게시글 목록 */}
          {!loading && filtered.map(post => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* 더보기 */}
          {!loading && filtered.length > 0 && (
            <div style={{ textAlign: "center", marginTop: "8px" }}>
              <button style={{
                padding: "12px 32px",
                background: "#fff", color: "#3f3f46",
                border: "1px solid #e4e4e7", borderRadius: "8px",
                fontSize: "14px", cursor: "pointer", fontWeight: "500",
              }}>더보기</button>
            </div>
          )}
        </main>

        {/* 우측 사이드바 */}
        <aside style={{ width: "280px", flexShrink: 0, padding: "24px 16px" }}>
          {/* 채널 규칙 */}
          <div style={{
            background: "#fff", border: "1px solid #e4e4e7",
            borderRadius: "12px", padding: "20px", marginBottom: "16px",
          }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "700" }}>📌 채널 규칙</h3>
            {[
              "상대방을 존중하는 언어를 사용해주세요",
              "개인정보(이름, 연락처 등)를 공유하지 마세요",
              "허위 사실 유포 시 제재를 받을 수 있어요",
              "광고·홍보성 게시글은 삭제됩니다",
            ].map((rule, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px", fontSize: "12px", color: "#52525b" }}>
                <span style={{ color: "#e94560", fontWeight: "700", flexShrink: 0 }}>{i + 1}.</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>

          {/* 인기 태그 */}
          <div style={{
            background: "#fff", border: "1px solid #e4e4e7",
            borderRadius: "12px", padding: "20px", marginBottom: "16px",
          }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "700" }}>🏷️ 인기 키워드</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {["연봉협상", "이직", "번아웃", "재직증명", "야근", "팀장", "스타트업", "대기업", "연차", "퇴사"].map(tag => (
                <span key={tag} style={{
                  padding: "4px 10px", borderRadius: "20px",
                  background: "#f4f4f5", color: "#3f3f46",
                  fontSize: "12px", cursor: "pointer",
                }}>#{tag}</span>
              ))}
            </div>
          </div>

          {/* 광고 */}
          <div style={{
            background: "#f4f4f5", border: "1px dashed #d4d4d8",
            borderRadius: "12px", padding: "40px 20px", textAlign: "center",
          }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#a1a1aa" }}>광고 영역</p>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
