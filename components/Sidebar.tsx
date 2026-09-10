"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { label: "전체", href: "/", icon: "🏠" },
  { label: "대기업·중견기업", href: "/board/conglomerate", icon: "🏢" },
  { label: "중소기업", href: "/board/sme", icon: "🏬" },
  { label: "스타트업", href: "/board/startup", icon: "🚀" },
  { label: "프리랜서", href: "/board/freelancer", icon: "💻" },
  { label: "취업·이직", href: "/board/career", icon: "💼" },
  { label: "급여·연봉", href: "/board/salary", icon: "💰" },
  { label: "직장생활", href: "/board/worklife", icon: "☕" },
  { label: "자유게시판", href: "/board/free", icon: "💬" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: "220px",
      flexShrink: 0,
      background: "#fff",
      borderRight: "1px solid #e4e4e7",
      minHeight: "calc(100vh - 56px)",
      padding: "16px 0",
    }}>
      {/* 글쓰기 버튼 */}
      <div style={{ padding: "0 12px 16px" }}>
        <Link href="/write" style={{
          display: "block",
          textAlign: "center",
          padding: "10px",
          background: "#1a1a2e",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: "600",
          fontSize: "14px",
        }}>✏️ 글쓰기</Link>
      </div>

      {/* 카테고리 */}
      <div style={{ padding: "0 8px" }}>
        <p style={{ fontSize: "11px", fontWeight: "700", color: "#71717a", padding: "4px 8px 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>채널</p>
        {categories.map(cat => {
          const active = pathname === cat.href;
          return (
            <Link key={cat.href} href={cat.href} style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 10px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: active ? "600" : "400",
              background: active ? "#f0f0ff" : "transparent",
              color: active ? "#1a1a2e" : "#3f3f46",
              transition: "background 0.1s",
            }}>
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </Link>
          );
        })}
      </div>

      {/* 하단 */}
      <div style={{ padding: "20px 12px 0", borderTop: "1px solid #e4e4e7", marginTop: "16px" }}>
        <p style={{ fontSize: "12px", color: "#a1a1aa", lineHeight: "1.8" }}>
          <Link href="/terms" style={{ display: "block" }}>이용약관</Link>
          <Link href="/privacy" style={{ display: "block" }}>개인정보 처리방침</Link>
          <Link href="/report-guide" style={{ display: "block" }}>신고가이드</Link>
          <Link href="/advertise" style={{ display: "block" }}>광고 문의하기</Link>
        </p>
        <p style={{ fontSize: "11px", color: "#d4d4d8", marginTop: "12px" }}>© 2025 DarkTalk</p>
      </div>
    </aside>
  );
}
