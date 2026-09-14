"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

interface Post {
  id: string;
  title: string;
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  posts: { title: string } | null;
}

interface Profile {
  id: string;
  nickname: string;
  company: string;
  job_title: string | null;
  is_verified: boolean | null;
  is_admin: boolean;
  created_at: string;
}

type Tab = "posts" | "comments" | "users";

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e4e4e7",
  borderRadius: "12px",
  padding: "16px",
};

const btnDanger: React.CSSProperties = {
  padding: "6px 12px",
  background: "#fff0f3",
  color: "#e94560",
  border: "1px solid #fca5a5",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer",
};

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const [tab, setTab] = useState<Tab>("posts");
  const [stats, setStats] = useState({ posts: 0, comments: 0, users: 0 });
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loadingTab, setLoadingTab] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userData.user.id)
        .single();

      if (!profile?.is_admin) {
        setAllowed(false);
        setChecking(false);
        return;
      }
      setAllowed(true);
      setChecking(false);
    }
    checkAdmin();
  }, [router]);

  useEffect(() => {
    if (!allowed) return;

    async function loadStats() {
      const [{ count: postsCount }, { count: commentsCount }, { count: usersCount }] = await Promise.all([
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);
      setStats({ posts: postsCount ?? 0, comments: commentsCount ?? 0, users: usersCount ?? 0 });
    }
    loadStats();
  }, [allowed]);

  useEffect(() => {
    if (!allowed) return;

    async function loadTab() {
      setLoadingTab(true);
      if (tab === "posts") {
        const { data } = await supabase
          .from("posts")
          .select("id, title, category, likes_count, comments_count, created_at")
          .order("created_at", { ascending: false })
          .limit(50);
        setPosts(data ?? []);
      } else if (tab === "comments") {
        const { data } = await supabase
          .from("comments")
          .select("id, content, created_at, posts(title)")
          .order("created_at", { ascending: false })
          .limit(50);
        setComments((data as unknown as Comment[]) ?? []);
      } else {
        const { data } = await supabase
          .from("profiles")
          .select("id, nickname, company, job_title, is_verified, is_admin, created_at")
          .order("created_at", { ascending: false })
          .limit(50);
        setUsers(data ?? []);
      }
      setLoadingTab(false);
    }
    loadTab();
  }, [tab, allowed]);

  const handleDeletePost = async (id: string) => {
    if (!confirm("이 게시글과 딸린 댓글을 전부 삭제할까요?")) return;
    const { error } = await supabase.rpc("admin_delete_post", { p_post_id: id });
    if (error) {
      alert("삭제 실패: " + error.message);
      return;
    }
    setPosts(prev => prev.filter(p => p.id !== id));
    setStats(prev => ({ ...prev, posts: prev.posts - 1 }));
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm("이 댓글을 삭제할까요?")) return;
    const { error } = await supabase.rpc("admin_delete_comment", { p_comment_id: id });
    if (error) {
      alert("삭제 실패: " + error.message);
      return;
    }
    setComments(prev => prev.filter(c => c.id !== id));
    setStats(prev => ({ ...prev, comments: prev.comments - 1 }));
  };

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, textAlign: "center", padding: "80px 20px", color: "#a1a1aa" }}>확인 중...</main>
        <Footer />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, textAlign: "center", padding: "80px 20px", color: "#a1a1aa" }}>
          관리자 권한이 없어요.
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, padding: "32px 20px", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
        <h1 style={{ margin: "0 0 24px", fontSize: "20px", fontWeight: "800" }}>🛠️ 관리자 페이지</h1>

        {/* 통계 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: "게시글", value: stats.posts },
            { label: "댓글", value: stats.comments },
            { label: "회원", value: stats.users },
          ].map(s => (
            <div key={s.label} style={{ ...cardStyle, textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#1a1a2e" }}>{s.value.toLocaleString()}</div>
              <div style={{ fontSize: "12px", color: "#71717a", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* 탭 */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "16px", background: "#fff", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "4px" }}>
          {([
            { key: "posts", label: "게시글 관리" },
            { key: "comments", label: "댓글 관리" },
            { key: "users", label: "회원 관리" },
          ] as { key: Tab; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: "9px",
              borderRadius: "7px", border: "none",
              background: tab === t.key ? "#1a1a2e" : "transparent",
              color: tab === t.key ? "#fff" : "#71717a",
              fontSize: "13px", fontWeight: tab === t.key ? "700" : "400",
              cursor: "pointer",
            }}>{t.label}</button>
          ))}
        </div>

        {loadingTab && <p style={{ textAlign: "center", color: "#a1a1aa", padding: "20px" }}>불러오는 중...</p>}

        {!loadingTab && tab === "posts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {posts.map(p => (
              <div key={p.id} style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "11px", background: "#f0f0ff", color: "#1a1a2e", padding: "2px 8px", borderRadius: "20px", flexShrink: 0 }}>{p.category}</span>
                <a href={`/post/${p.id}`} target="_blank" rel="noreferrer" style={{ flex: 1, fontSize: "14px", color: "#18181b", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</a>
                <span style={{ fontSize: "12px", color: "#a1a1aa", flexShrink: 0 }}>❤️ {p.likes_count} · 💬 {p.comments_count}</span>
                <button onClick={() => handleDeletePost(p.id)} style={btnDanger}>삭제</button>
              </div>
            ))}
          </div>
        )}

        {!loadingTab && tab === "comments" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {comments.map(c => (
              <div key={c.id} style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#3f3f46", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.content}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: "#a1a1aa" }}>원글: {c.posts?.title ?? "(삭제된 글)"}</p>
                </div>
                <button onClick={() => handleDeleteComment(c.id)} style={btnDanger}>삭제</button>
              </div>
            ))}
          </div>
        )}

        {!loadingTab && tab === "users" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {users.length === 0 && (
              <p style={{ textAlign: "center", color: "#a1a1aa", padding: "20px" }}>가입 완료된 회원이 아직 없어요.</p>
            )}
            {users.map(u => (
              <div key={u.id} style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "600", color: "#18181b" }}>{u.nickname} {u.is_admin && <span style={{ fontSize: "11px", color: "#e94560" }}>(관리자)</span>}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#a1a1aa" }}>{u.company}{u.job_title ? ` · ${u.job_title}` : ""}</p>
                </div>
                {u.is_verified && <span style={{ fontSize: "11px", color: "#16a34a" }}>✅ 인증</span>}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
