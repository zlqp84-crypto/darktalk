"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { mockPosts } from "@/lib/mockData";
import { use } from "react";

const mockComments = [
  { id: 1, author: "익명의 마케터", company: "스타트업", time: "5분 전", content: "저도 같은 경험 있어요. 저는 팀장한테 직접 1:1로 이야기했는데 오히려 더 어색해졌어요... 상황이 쉽지 않네요.", likes: 24 },
  { id: 2, author: "익명의 개발자", company: "IT기업", time: "12분 전", content: "다음 번엔 아이디어 제안 전에 미리 메일이나 슬랙으로 기록을 남겨두세요. 그러면 나중에 증거가 됩니다.", likes: 87 },
  { id: 3, author: "익명의 기획자", company: "대기업", time: "34분 전", content: "대기업에서 이런 일은 일상다반사예요... 안타깝지만 위로가 되셨으면 해요. 이직을 고려해보시는 건 어떨까요?", likes: 45 },
];

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const post = mockPosts.find(p => p.id === Number(id)) || mockPosts[0];
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [commentLikes, setCommentLikes] = useState<Record<number, boolean>>({});

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "24px 20px", maxWidth: "760px" }}>

          {/* 게시글 본문 */}
          <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "14px", padding: "28px", marginBottom: "16px" }}>
            {/* 카테고리 */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", background: "#f0f0ff", color: "#1a1a2e", padding: "3px 10px", borderRadius: "20px" }}>{post.category}</span>
              {post.company && <span style={{ fontSize: "12px", color: "#71717a", background: "#f4f4f5", padding: "3px 10px", borderRadius: "20px" }}>{post.company}</span>}
            </div>

            <h1 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "800", lineHeight: "1.4", color: "#18181b" }}>
              {post.title}
            </h1>

            <div style={{ display: "flex", gap: "12px", fontSize: "13px", color: "#a1a1aa", marginBottom: "24px" }}>
              <span>익명</span>
              <span>·</span>
              <span>{post.time}</span>
              <span>·</span>
              <span>조회 1,284</span>
            </div>

            <div style={{ fontSize: "15px", lineHeight: "1.8", color: "#3f3f46", borderTop: "1px solid #f4f4f5", paddingTop: "20px" }}>
              <p>{post.preview}</p>
              <p>여러분들의 경험이나 조언을 듣고 싶어요. 비슷한 상황을 겪으신 분들 계신가요? 어떻게 대처하셨는지 공유해주시면 정말 감사하겠습니다.</p>
              <p>회사 분위기상 HR에 신고하기도 어렵고... 정말 막막한 상황입니다.</p>
            </div>

            {/* 액션 버튼 */}
            <div style={{ display: "flex", gap: "10px", marginTop: "24px", borderTop: "1px solid #f4f4f5", paddingTop: "20px" }}>
              <button
                onClick={() => setLiked(!liked)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "9px 18px", borderRadius: "20px",
                  border: `1px solid ${liked ? "#e94560" : "#e4e4e7"}`,
                  background: liked ? "#fff0f3" : "#fff",
                  color: liked ? "#e94560" : "#71717a",
                  fontSize: "14px", fontWeight: "600", cursor: "pointer",
                }}>
                ❤️ {post.likes + (liked ? 1 : 0)}
              </button>
              <button style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "9px 18px", borderRadius: "20px",
                border: "1px solid #e4e4e7", background: "#fff",
                color: "#71717a", fontSize: "14px", cursor: "pointer",
              }}>💬 {post.comments}</button>
              <button style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "9px 18px", borderRadius: "20px",
                border: "1px solid #e4e4e7", background: "#fff",
                color: "#71717a", fontSize: "14px", cursor: "pointer",
                marginLeft: "auto",
              }}>🚨 신고</button>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "14px", padding: "24px" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700" }}>댓글 {mockComments.length}개</h3>

            {/* 댓글 쓰기 */}
            <div style={{ border: "1px solid #e4e4e7", borderRadius: "10px", padding: "14px", marginBottom: "24px" }}>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="익명으로 댓글을 작성하세요. 존중하는 언어를 사용해주세요."
                rows={3}
                style={{
                  width: "100%", border: "none", outline: "none",
                  fontSize: "14px", resize: "none", color: "#3f3f46",
                  fontFamily: "inherit",
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                <button style={{
                  padding: "8px 20px", background: "#1a1a2e", color: "#fff",
                  border: "none", borderRadius: "6px", fontSize: "13px",
                  fontWeight: "600", cursor: "pointer",
                }}>등록</button>
              </div>
            </div>

            {/* 댓글 목록 */}
            {mockComments.map(c => (
              <div key={c.id} style={{ padding: "16px 0", borderBottom: "1px solid #f4f4f5" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: "#f0f0ff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "14px",
                    }}>👤</div>
                    <div>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#18181b" }}>{c.author}</p>
                      <p style={{ margin: 0, fontSize: "11px", color: "#a1a1aa" }}>{c.company} · {c.time}</p>
                    </div>
                  </div>
                  <button style={{ background: "none", border: "none", color: "#a1a1aa", fontSize: "12px", cursor: "pointer" }}>신고</button>
                </div>
                <p style={{ margin: "0 0 10px", fontSize: "14px", color: "#3f3f46", lineHeight: "1.6" }}>{c.content}</p>
                <button
                  onClick={() => setCommentLikes(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "13px", color: commentLikes[c.id] ? "#e94560" : "#a1a1aa",
                    padding: 0,
                  }}>
                  ❤️ {c.likes + (commentLikes[c.id] ? 1 : 0)}
                </button>
              </div>
            ))}
          </div>
        </main>

        <aside style={{ width: "280px", flexShrink: 0, padding: "24px 16px" }}>
          <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: "700" }}>비슷한 글</h3>
            {mockPosts.filter(p => p.id !== post.id).slice(0, 3).map(p => (
              <a key={p.id} href={`/post/${p.id}`} style={{ display: "block", padding: "10px 0", borderBottom: "1px solid #f4f4f5", textDecoration: "none" }}>
                <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: "500", color: "#18181b", lineHeight: "1.4",
                  overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{p.title}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#a1a1aa" }}>❤️ {p.likes} · 💬 {p.comments}</p>
              </a>
            ))}
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
