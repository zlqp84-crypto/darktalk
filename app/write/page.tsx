"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const categories = ["대기업·중견기업", "중소기업", "스타트업", "프리랜서", "취업·이직", "급여·연봉", "직장생활", "자유게시판"];

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, padding: "32px 20px", maxWidth: "720px", margin: "0 auto", width: "100%" }}>
        <h1 style={{ margin: "0 0 24px", fontSize: "20px", fontWeight: "800" }}>✏️ 글쓰기</h1>

        <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "14px", padding: "28px" }}>
          {/* 카테고리 */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#3f3f46", display: "block", marginBottom: "10px" }}>채널 선택</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} style={{
                  padding: "7px 14px", borderRadius: "20px",
                  border: `1px solid ${category === cat ? "#1a1a2e" : "#e4e4e7"}`,
                  background: category === cat ? "#1a1a2e" : "#fff",
                  color: category === cat ? "#fff" : "#52525b",
                  fontSize: "13px", cursor: "pointer", fontWeight: category === cat ? "600" : "400",
                }}>{cat}</button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div style={{ marginBottom: "16px" }}>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={100}
              style={{
                width: "100%", padding: "12px 0",
                border: "none", borderBottom: "2px solid #e4e4e7",
                fontSize: "18px", fontWeight: "600", outline: "none",
                boxSizing: "border-box",
              }}
            />
            <p style={{ textAlign: "right", fontSize: "11px", color: "#a1a1aa", margin: "4px 0 0" }}>{title.length}/100</p>
          </div>

          {/* 본문 */}
          <div style={{ marginBottom: "20px" }}>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="내용을 입력하세요. 익명으로 게시됩니다.&#10;&#10;• 타인을 비방하거나 개인정보를 포함하지 마세요.&#10;• 허위 사실 유포 시 제재를 받을 수 있어요."
              rows={14}
              style={{
                width: "100%", border: "none", outline: "none",
                fontSize: "14px", lineHeight: "1.8", resize: "none",
                color: "#3f3f46", fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* 익명 안내 */}
          <div style={{ background: "#f4f4f5", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", display: "flex", gap: "8px", alignItems: "center" }}>
            <span>🔒</span>
            <p style={{ margin: 0, fontSize: "12px", color: "#71717a" }}>
              모든 게시글은 <strong>익명</strong>으로 게시됩니다. 작성자의 신원은 운영자도 확인할 수 없어요.
            </p>
          </div>

          {/* 버튼 */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button style={{ padding: "11px 24px", background: "#f4f4f5", color: "#52525b", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>취소</button>
            <button style={{ padding: "11px 28px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>게시하기</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
