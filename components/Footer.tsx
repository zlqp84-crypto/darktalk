import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      background: "#fff",
      borderTop: "1px solid #e4e4e7",
      padding: "24px 40px",
      textAlign: "center",
    }}>
      <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginBottom: "12px" }}>
        {[
          { label: "서비스 소개", href: "/about" },
          { label: "이용약관", href: "/terms" },
          { label: "디렉토리", href: "/directory" },
          { label: "개인정보 처리방침", href: "/privacy" },
          { label: "인재채용", href: "/jobs" },
          { label: "신고가이드", href: "/report-guide" },
          { label: "DarkTalk PRO", href: "/pro" },
          { label: "광고 문의하기", href: "/advertise" },
          { label: "기업서비스", href: "/enterprise" },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            fontSize: "13px",
            color: item.label === "DarkTalk PRO" ? "#e94560" : "#52525b",
            fontWeight: item.label === "DarkTalk PRO" ? "700" : "400",
          }}>{item.label}</Link>
        ))}
      </div>
      <p style={{ fontSize: "12px", color: "#a1a1aa" }}>© 2025 DarkTalk Inc. All rights reserved.</p>
    </footer>
  );
}
