"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ReportButton from "@/components/ReportButton";
import { supabase } from "@/lib/supabase";
import { ensureProfile } from "@/lib/ensureProfile";
import {
  PUBLIC_POST_COLUMNS, PUBLIC_COMMENT_COLUMNS, toPublicPost, toPublicComment,
  type PublicPost as Post, type PublicComment as Comment,
} from "@/lib/publicContent";

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
  const [likeBusy, setLikeBusy] = useState(false);
  const [comment, setComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: postData } = await supabase
        .from("posts")
        .select(PUBLIC_POST_COLUMNS)
        .eq("id", id)
        .single();

      if (!postData) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setPost(toPublicPost(postData));
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
        const { data: ownLike } = await supabase.rpc("my_post_like", { p_post_id: id });
        setLiked(ownLike === true);
      } else setLiked(false);

      const { data: countedViews } = await supabase.rpc("record_post_view", { p_post_id: id });
      const nextViews = typeof countedViews === 'number' ? countedViews : (postData.views_count ?? 0);

      const [{ data: commentData }, { data: similarData }] = await Promise.all([
        supabase.from("comments").select(PUBLIC_COMMENT_COLUMNS).eq("post_id", id).order("created_at", { ascending: true }),
        supabase.from("posts").select(PUBLIC_POST_COLUMNS).eq("category", postData.category).neq("id", id).limit(3),
      ]);

      setComments((commentData ?? []).map(toPublicComment));
      setSimilarPosts((similarData ?? []).map(toPublicPost));
      setPost({ ...toPublicPost(postData), views_count: nextViews });
      setLoading(false);
    }
    load();
  }, [id]);

  const handleLike = async () => {
    if (!post || likeBusy) return;
    setLikeBusy(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) { router.push('/login'); return; }
      const { data, error } = await supabase.rpc("set_post_like", { p_post_id: post.id, p_liked: !liked });
      if (error || !data) { alert('추천을 저장하지 못했어요. 잠시 후 다시 시도해주세요.'); return; }
      setLiked(data.liked);
      setPost(prev => prev ? { ...prev, likes_count: data.likes_count } : prev);
    } finally { setLikeBusy(false); }
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
    if (!(await ensureProfile())) {
      setCommentSubmitting(false);
      alert('계정 정보를 준비하지 못했어요. 다시 로그인해주세요.');
      return;
    }
    const { data, error } = await supabase
      .from("comments")
      .insert({ post_id: post.id, user_id: userData.user.id, content: comment.trim() })
      .select(PUBLIC_COMMENT_COLUMNS)
      .single();
    setCommentSubmitting(false);

    if (error || !data) {
      alert("댓글 등록에 실패했어요.");
      return;
    }

    setComments(prev => [...prev, toPublicComment(data)]);
    setComment("");

    const nextCommentsCount = post.comments_count + 1;
    setPost({ ...post, comments_count: nextCommentsCount });
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

            {post.image_urls && post.image_urls.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
                {post.image_urls.map((url, i) => (
                  <img key={i} src={url} alt="" style={{ maxWidth: "100%", borderRadius: "10px", border: "1px solid #f4f4f5" }} />
                ))}
              </div>
            )}

            {/* 액션 버튼 */}
            <div style={{ display: "flex", gap: "10px", marginTop: "24px", borderTop: "1px solid #f4f4f5", paddingTop: "20px" }}>
              <button
                onClick={handleLike}
                disabled={likeBusy}
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
              <ReportButton type="post" id={post.id} />
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
                  <ReportButton type="comment" id={c.id} />
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
