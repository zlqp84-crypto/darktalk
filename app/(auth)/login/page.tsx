"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f4f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        {/* 로고 */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "52px", height: "52px",
            background: "#1a1a2e",
            borderRadius: "14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px",
            fontSize: "24px", fontWeight: "900", color: "#e94560",
          }}>D</div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "800" }}>DarkTalk</h1>
          <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#71717a" }}>직장인 익명 커뮤니티</p>
        </div>

        {/* 폼 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#3f3f46", display: "block", marginBottom: "6px" }}>이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@company.com"
              style={{
                width: "100%", padding: "11px 14px",
                border: "1px solid #e4e4e7", borderRadius: "8px",
                fontSize: "14px", outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#3f3f46", display: "block", marginBottom: "6px" }}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "11px 14px",
                border: "1px solid #e4e4e7", borderRadius: "8px",
                fontSize: "14px", outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button style={{
            width: "100%", padding: "12px",
            background: "#1a1a2e", color: "#fff",
            border: "none", borderRadius: "8px",
            fontSize: "15px", fontWeight: "700",
            cursor: "pointer", marginTop: "4px",
          }}>로그인</button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", fontSize: "13px" }}>
          <Link href="/forgot-password" style={{ color: "#71717a" }}>비밀번호 찾기</Link>
          <Link href="/signup" style={{ color: "#e94560", fontWeight: "600" }}>회원가입 →</Link>
        </div>

        {/* 소셜 로그인 */}
        <div style={{ marginTop: "28px", borderTop: "1px solid #f4f4f5", paddingTop: "24px" }}>
          <p style={{ textAlign: "center", fontSize: "13px", color: "#a1a1aa", margin: "0 0 14px" }}>간편 로그인</p>
          <div style={{ display: "flex", gap: "10px" }}>
            {["카카오", "네이버", "구글"].map(provider => (
              <button key={provider} style={{
                flex: 1, padding: "10px",
                border: "1px solid #e4e4e7", borderRadius: "8px",
                background: "#fff", fontSize: "13px",
                cursor: "pointer", fontWeight: "500",
              }}>{provider}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
