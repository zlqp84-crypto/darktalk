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
  post_title: string | null;
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
type Gate = "checking" | "not-admin" | "need-enroll" | "need-verify" | "unlocked";

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

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  border: "1px solid #e4e4e7",
  borderRadius: "6px",
  fontSize: "14px",
  boxSizing: "border-box",
};

export default function AdminPage() {
  const router = useRouter();
  const [gate, setGate] = useState<Gate>("checking");
  const [gateError, setGateError] = useState("");

  // MFA enrollment (first-time setup)
  const [qrCode, setQrCode] = useState("");
  const [enrollFactorId, setEnrollFactorId] = useState("");

  // MFA verify (returning admin)
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [tab, setTab] = useState<Tab>("posts");
  const [stats, setStats] = useState({ posts: 0, comments: 0, users: 0 });
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loadingTab, setLoadingTab] = useState(true);

  useEffect(() => {
    async function checkAccess() {
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
        setGate("not-admin");
        return;
      }

      const { data: level } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (level?.currentLevel === "aal2") {
        setGate("unlocked");
        return;
      }

      const { data: factorsData } = await supabase.auth.mfa.listFactors();
      const verifiedTotp = factorsData?.totp.find(f => f.status === "verified");

      if (verifiedTotp) {
        setFactorId(verifiedTotp.id);
        setGate("need-verify");
        return;
      }

      // 최초 설정: QR 코드 발급
      const { data: enrollData, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
      if (error || !enrollData) {
        setGateError(error?.message ?? "OTP 설정에 실패했어요.");
        setGate("not-admin");
        return;
      }
      setQrCode(enrollData.totp.qr_code);
      setEnrollFactorId(enrollData.id);
      setGate("need-enroll");
    }
    checkAccess();
  }, [router]);

  const handleVerifyEnroll = async () => {
    setVerifying(true);
    setGateError("");
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: enrollFactorId });
    if (challengeError || !challenge) {
      setGateError(challengeError?.message ?? "인증에 실패했어요.");
      setVerifying(false);
      return;
    }
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: enrollFactorId,
      challengeId: challenge.id,
      code,
    });
    setVerifying(false);
    if (verifyError) {
      setGateError("코드가 올바르지 않아요. 다시 확인해주세요.");
      return;
    }
    setGate("unlocked");
  };

  const handleVerifyLogin = async () => {
    setVerifying(true);
    setGateError("");
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    if (challengeError || !challenge) {
      setGateError(challengeError?.message ?? "인증에 실패했어요.");
      setVerifying(false);
      return;
    }
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    });
    setVerifying(false);
    if (verifyError) {
      setGateError("코드가 올바르지 않아요. 다시 확인해주세요.");
      return;
    }
    setGate("unlocked");
  };

  useEffect(() => {
    if (gate !== "unlocked") return;

    async function loadStats() {
      const { data, error } = await supabase.rpc("admin_get_stats");
      if (error) {
        setGateError("관리자 통계를 불러오지 못했습니다. 권한과 MFA 인증 상태를 확인해주세요.");
        return;
      }
      setStats(data);
    }
    loadStats();
  }, [gate]);

  useEffect(() => {
    if (gate !== "unlocked") return;

    async function loadTab() {
      setLoadingTab(true);
      // Every management RPC checks admin + aal2 in the database as well.
      const rpc = { posts: "admin_list_posts", comments: "admin_list_comments", users: "admin_list_profiles" }[tab];
      const { data, error } = await supabase.rpc(rpc);
      if (error) {
        setPosts([]);
        setComments([]);
        setUsers([]);
        setGateError("관리자 목록을 불러오지 못했습니다. 권한과 MFA 인증 상태를 확인해주세요.");
      } else if (tab === "posts") {
        setPosts(data ?? []);
      } else if (tab === "comments") {
        setComments(data ?? []);
      } else {
        setUsers(data ?? []);
      }
      setLoadingTab(false);
    }
    loadTab();
  }, [tab, gate]);

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

  if (gate === "checking") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, textAlign: "center", padding: "80px 20px", color: "#a1a1aa" }}>확인 중...</main>
        <Footer />
      </div>
    );
  }

  if (gate === "not-admin") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, textAlign: "center", padding: "80px 20px", color: "#a1a1aa" }}>
          {gateError || "관리자 권한이 없어요."}
        </main>
        <Footer />
      </div>
    );
  }

  if (gate === "need-enroll") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
          <div style={{ ...cardStyle, maxWidth: "360px", width: "100%", textAlign: "center" }}>
            <h2 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "800" }}>🔐 2단계 인증 최초 설정</h2>
            <p style={{ fontSize: "13px", color: "#71717a", margin: "0 0 16px" }}>
              Google Authenticator(또는 Authy 등)로 아래 QR코드를 스캔한 뒤, 앱에 뜨는 6자리 코드를 입력하세요.
            </p>
            {qrCode && <img src={qrCode} alt="OTP QR" style={{ width: "180px", height: "180px", margin: "0 auto 16px" }} />}
            <input
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="6자리 코드"
              inputMode="numeric"
              style={{ ...inputStyle, textAlign: "center", letterSpacing: "4px", fontSize: "18px", marginBottom: "10px" }}
            />
            {gateError && <p style={{ color: "#e94560", fontSize: "13px", marginBottom: "10px" }}>{gateError}</p>}
            <button
              onClick={handleVerifyEnroll}
              disabled={verifying || code.length < 6}
              style={{ width: "100%", padding: "11px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
            >{verifying ? "확인 중..." : "설정 완료"}</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (gate === "need-verify") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
          <div style={{ ...cardStyle, maxWidth: "360px", width: "100%", textAlign: "center" }}>
            <h2 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "800" }}>🔐 인증 코드 입력</h2>
            <p style={{ fontSize: "13px", color: "#71717a", margin: "0 0 16px" }}>Authenticator 앱에 뜨는 6자리 코드를 입력하세요.</p>
            <input
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="6자리 코드"
              inputMode="numeric"
              style={{ ...inputStyle, textAlign: "center", letterSpacing: "4px", fontSize: "18px", marginBottom: "10px" }}
            />
            {gateError && <p style={{ color: "#e94560", fontSize: "13px", marginBottom: "10px" }}>{gateError}</p>}
            <button
              onClick={handleVerifyLogin}
              disabled={verifying || code.length < 6}
              style={{ width: "100%", padding: "11px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
            >{verifying ? "확인 중..." : "확인"}</button>
          </div>
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
        {gateError && <p role="alert" style={{ color: "#e94560" }}>{gateError}</p>}

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
                  <p style={{ margin: 0, fontSize: "11px", color: "#a1a1aa" }}>원글: {c.post_title ?? "(삭제된 글)"}</p>
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
