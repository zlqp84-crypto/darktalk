"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
}

interface Comment {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  const day = Math.floor(hour / 24);
  if (day < 7) return `${day}일 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [similarPosts, setSimilarPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: postData } = await supabase.from("posts").select("*").eq("id", id).single();

      if (!postData) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setPost(postData);

      const nextViews = (postData.views_count ?? 0) + 1;
      supabase.rpc("increment_post_views", { p_post_id: id }).then();

      const [{ data: commentData }, { data: similarData }] = await Promise.all([
        supabase.from("comments").select("*").eq("post_id", id).order("created_at", { ascending: true }),
        supabase.from("posts").select("*").eq("category", postData.category).neq("id", id).limit(3),
      ]);

      setComments(commentData ?? []);
      setSimilarPosts(similarData ?? []);
      setPost({ ...postData, views_count: nextViews });
      setLoading(false);
    }
    load();
  }, [id]);

  const handleLike = async () => {
    if (!post) return;
    const nextLiked = !liked;
    const nextCount = post.likes_count + (nextLiked ? 1 : -1);
    setLiked(nextLiked);
    setPost({ ...post, likes_count: nextCount });
    await supabase.rpc("increment_post_likes", { p_post_id: post.id, p_delta: nextLiked ? 1 : -1 });
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim() || !post) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      alert("로그인 후 댓글을 작성할 수 있어요.");
      router.push("/login");
      return;
    }

    setCommentSubmitting(true);
    const { data, error } = await supabase
      .from("comments")
      .insert({ post_id: post.id, user_id: userData.user.id, content: comment.trim() })
      .select("*")
      .single();
    setCommentSubmitting(false);

    if (error || !data) {
      alert("댓글 등록에 실패했어요.");
      return;
    }

    setComments(prev => [...prev, data]);
    setComment("");

    const nextCommentsCount = post.comments_count + 1;
    setPost({ ...post, comments_count: nextCommentsCount });
    await supabase.rpc("increment_post_comments_count", { p_post_id: post.id, p_delta: 1 });
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, textAlign: "center", padding: "80px 20px", color: "#a1a1aa" }}>불러오는 중...</main>
        <Footer />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, textAlign: "center", padding: "80px 20px", color: "#a1a1aa" }}>게시글을 찾을 수 없어요.</main>
        <Footer />
      </div>
    );
  }

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
            </div>

            <h1 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "800", lineHeight: "1.4", color: "#18181b" }}>
              {post.title}
            </h1>

            <div style={{ display: "flex", gap: "12px", fontSize: "13px", color: "#a1a1aa", marginBottom: "24px" }}>
              <span>익명</span>
              <span>·</span>
              <span>{timeAgo(post.created_at)}</span>
              <span>·</span>
              <span>조회 {post.views_count.toLocaleString()}</span>
            </div>

            <div style={{ fontSize: "15px", lineHeight: "1.8", color: "#3f3f46", borderTop: "1px solid #f4f4f5", paddingTop: "20px", whiteSpace: "pre-wrap" }}>
              {post.content}
            </div>

            {/* 액션 버튼 */}
            <div style={{ display: "flex", gap: "10px", marginTop: "24px", borderTop: "1px solid #f4f4f5", paddingTop: "20px" }}>
              <button
                onClick={handleLike}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "9px 18px", borderRadius: "20px",
                  border: `1px solid ${liked ? "#e94560" : "#e4e4e7"}`,
                  background: liked ? "#fff0f3" : "#fff",
                  color: liked ? "#e94560" : "#71717a",
                  fontSize: "14px", fontWeight: "600", cursor: "pointer",
                }}>
                ❤️ {post.likes_count}
              </button>
              <button style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "9px 18px", borderRadius: "20px",
                border: "1px solid #e4e4e7", background: "#fff",
                color: "#71717a", fontSize: "14px", cursor: "pointer",
              }}>💬 {comments.length}</button>
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
            <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700" }}>댓글 {comments.length}개</h3>

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
                <button
                  onClick={handleCommentSubmit}
                  disabled={commentSubmitting || !comment.trim()}
                  style={{
                    padding: "8px 20px", background: "#1a1a2e", color: "#fff",
                    border: "none", borderRadius: "6px", fontSize: "13px",
                    fontWeight: "600", cursor: "pointer",
                  }}>{commentSubmitting ? "등록 중..." : "등록"}</button>
              </div>
            </div>

            {/* 댓글 목록 */}
            {comments.length === 0 && (
              <p style={{ textAlign: "center", color: "#a1a1aa", fontSize: "13px", padding: "20px 0" }}>첫 댓글을 남겨보세요!</p>
            )}
            {comments.map(c => (
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
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#18181b" }}>익명</p>
                      <p style={{ margin: 0, fontSize: "11px", color: "#a1a1aa" }}>{timeAgo(c.created_at)}</p>
                    </div>
                  </div>
                  <button style={{ background: "none", border: "none", color: "#a1a1aa", fontSize: "12px", cursor: "pointer" }}>신고</button>
                </div>
                <p style={{ margin: 0, fontSize: "14px", color: "#3f3f46", lineHeight: "1.6" }}>{c.content}</p>
              </div>
            ))}
          </div>
        </main>

        <aside style={{ width: "280px", flexShrink: 0, padding: "24px 16px" }}>
          <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: "700" }}>비슷한 글</h3>
            {similarPosts.length === 0 && (
              <p style={{ fontSize: "12px", color: "#a1a1aa" }}>비슷한 글이 없어요.</p>
            )}
            {similarPosts.map(p => (
              <a key={p.id} href={`/post/${p.id}`} style={{ display: "block", padding: "10px 0", borderBottom: "1px solid #f4f4f5", textDecoration: "none" }}>
                <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: "500", color: "#18181b", lineHeight: "1.4",
                  overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{p.title}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#a1a1aa" }}>❤️ {p.likes_count}</p>
              </a>
            ))}
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
