import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. 수집하는 개인정보 항목",
    content: `DarkTalk은 서비스 제공을 위해 최소한의 개인정보만 수집합니다.\n\n[회원가입 시]\n• 이메일 주소 (계정 식별 용도)\n• 비밀번호 (암호화 저장)\n\n[재직 인증 시 — 즉시 파기]\n• 건강보험 EDI 조회 결과 (재직 여부만 확인 후 즉시 삭제)\n• 회사 이메일 인증 코드 (인증 완료 후 즉시 삭제)\n\n※ 재직 인증에 사용된 모든 정보는 인증 완료 즉시 서버에서 파기되며, 어떠한 형태로도 저장되지 않습니다.`,
  },
  {
    title: "2. 개인정보 수집 및 이용 목적",
    content: `• 회원 가입 및 서비스 이용 관리\n• 재직 여부 확인 (인증 즉시 파기)\n• 불법 활동 방지 및 서비스 보안 유지\n• 공지사항 및 서비스 변경 안내`,
  },
  {
    title: "3. 개인정보 보유 및 이용 기간",
    content: `회원 탈퇴 시 모든 개인정보를 즉시 파기합니다.\n단, 관련 법령에 따라 아래 정보는 보관합니다.\n\n• 계약 또는 청약 철회에 관한 기록: 5년 (전자상거래법)\n• 소비자 불만 또는 분쟁 처리에 관한 기록: 3년 (전자상거래법)\n• 서비스 이용 관련 로그 기록: 3개월 (통신비밀보호법)`,
  },
  {
    title: "4. 개인정보의 제3자 제공",
    content: `DarkTalk은 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.\n\n다만, 아래의 경우는 예외로 합니다.\n• 이용자가 사전에 동의한 경우\n• 법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우`,
  },
  {
    title: "5. 익명 게시물의 처리",
    content: `DarkTalk의 모든 게시물은 익명으로 처리됩니다.\n\n• 게시물과 작성자 계정은 분리 저장됩니다\n• 운영자도 특정 게시물의 작성자를 조회할 수 없습니다\n• 단, 법원의 영장이 발부된 경우 관련 법률에 따라 최소한의 정보를 제공할 수 있습니다`,
  },
  {
    title: "6. 이용자의 권리",
    content: `이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다.\n\n• 개인정보 열람 요청\n• 개인정보 정정·삭제 요청\n• 개인정보 처리 정지 요청\n• 회원 탈퇴 (즉시 처리)\n\n위 권리 행사는 마이페이지 > 계정 설정에서 직접 처리하거나, privacy@darktalk.kr로 요청할 수 있습니다.`,
  },
  {
    title: "7. 쿠키 사용",
    content: `DarkTalk은 로그인 유지, 서비스 이용 편의를 위해 쿠키를 사용합니다. 브라우저 설정에서 쿠키 저장을 거부할 수 있으나, 일부 서비스 이용이 제한될 수 있습니다.`,
  },
  {
    title: "8. 개인정보 보호책임자",
    content: `개인정보 처리에 관한 업무를 총괄하는 책임자는 다음과 같습니다.\n\n• 성명: 개인정보 보호팀\n• 이메일: privacy@darktalk.kr\n• 처리 기간: 영업일 기준 3일 이내`,
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, maxWidth: "760px", margin: "0 auto", padding: "48px 20px", width: "100%" }}>
        <div style={{ marginBottom: "36px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: "#e94560", letterSpacing: "0.08em", textTransform: "uppercase" }}>Legal</p>
          <h1 style={{ margin: "0 0 8px", fontSize: "28px", fontWeight: "900", color: "#1a1a2e" }}>개인정보 처리방침</h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#a1a1aa" }}>시행일: 2025년 1월 1일 · 최종 수정: 2025년 9월 1일</p>
        </div>

        {/* 핵심 원칙 */}
        <div style={{
          background: "linear-gradient(135deg, #1a1a2e, #16213e)",
          borderRadius: "14px", padding: "24px", marginBottom: "36px", color: "#fff",
        }}>
          <h3 style={{ margin: "0 0 14px", fontSize: "16px", fontWeight: "700" }}>🔐 DarkTalk의 프라이버시 원칙</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { icon: "🚫", text: "재직 인증 정보 즉시 파기" },
              { icon: "🔒", text: "게시물-계정 분리 저장" },
              { icon: "👁️", text: "운영자도 작성자 확인 불가" },
              { icon: "📵", text: "제3자 정보 제공 없음" },
            ].map(p => (
              <div key={p.text} style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "13px" }}>
                <span>{p.icon}</span><span style={{ color: "rgba(255,255,255,0.85)" }}>{p.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 본문 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {sections.map(sec => (
            <div key={sec.title} style={{ borderTop: "1px solid #f4f4f5", paddingTop: "24px" }}>
              <h2 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "700", color: "#1a1a2e" }}>{sec.title}</h2>
              <p style={{ margin: 0, fontSize: "14px", color: "#3f3f46", lineHeight: "1.9", whiteSpace: "pre-line" }}>{sec.content}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "48px", padding: "20px", background: "#f8f8fa", borderRadius: "10px", fontSize: "13px", color: "#71717a" }}>
          개인정보 관련 문의: <a href="mailto:privacy@darktalk.kr" style={{ color: "#1a1a2e", fontWeight: "600" }}>privacy@darktalk.kr</a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
