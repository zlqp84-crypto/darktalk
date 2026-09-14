"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [nickname, setNickname] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function loadProfile(userId: string) {
      const { data } = await supabase.from("profiles").select("nickname, is_admin").eq("id", userId).single();
      setNickname(data?.nickname ?? "회원");
      setIsAdmin(data?.is_admin ?? false);
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) loadProfile(data.user.id);
      setCheckingAuth(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setNickname(null);
        setIsAdmin(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setNickname(null);
    setIsAdmin(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header style={{
      background: "#1a1a2e",
      color: "#fff",
      height: "56px",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      gap: "16px",
    }}>
      {/* 로고 */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <div style={{
          width: "32px", height: "32px",
          background: "#e94560",
          borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: "900", fontSize: "16px",
        }}>D</div>
        <span style={{ fontWeight: "800", fontSize: "18px", letterSpacing: "-0.5px" }}>DarkTalk</span>
      </Link>

      {/* 네비 */}
      <nav style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
        {[
          { label: "홈", href: "/" },
          { label: "채널", href: "/board" },
          { label: "기업 리뷰", href: "/company" },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            padding: "6px 14px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            color: "rgba(255,255,255,0.85)",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >{item.label}</Link>
        ))}
      </nav>

      {/* 검색창 */}
      <div style={{ flex: 1, maxWidth: "400px" }}>
        <input
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder="관심있는 내용을 검색해보세요!"
          style={{
            width: "100%",
            padding: "8px 16px",
            borderRadius: "20px",
            border: "none",
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            fontSize: "14px",
            outline: "none",
          }}
        />
      </div>

      {/* 오른쪽 버튼들 */}
      <div style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>
        {checkingAuth ? null : nickname ? (
          <>
            {isAdmin && (
              <Link href="/admin" style={{
                padding: "7px 14px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#fff",
                background: "rgba(233,69,96,0.25)",
              }}>🛠️ 관리자</Link>
            )}
            <Link href="/mypage" style={{
              padding: "7px 14px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#fff",
            }}>👤 {nickname}</Link>
            <button onClick={handleLogout} style={{
              padding: "7px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#fff",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.3)",
              cursor: "pointer",
            }}>로그아웃</button>
          </>
        ) : (
          <>
            <Link href="/login" style={{
              padding: "7px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
            }}>로그인</Link>
            <Link href="/signup" style={{
              padding: "7px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              background: "#e94560",
              color: "#fff",
            }}>회원가입</Link>
          </>
        )}
      </div>
    </header>
  );
}
