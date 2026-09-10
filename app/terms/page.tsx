import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "제1조 (목적)",
    content: `본 약관은 DarkTalk(이하 "서비스")가 제공하는 익명 직장인 커뮤니티 서비스의 이용에 관한 조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.`,
  },
  {
    title: "제2조 (정의)",
    content: `① "서비스"란 DarkTalk이 제공하는 익명 커뮤니티 플랫폼 및 관련 제반 서비스를 의미합니다.\n② "이용자"란 본 약관에 동의하고 서비스를 이용하는 회원 및 비회원을 말합니다.\n③ "회원"이란 서비스에 가입하여 이용자 아이디(ID)를 부여받은 자로, 계속적으로 서비스를 이용할 수 있는 자를 말합니다.\n④ "익명 게시물"이란 작성자 신원이 공개되지 않는 방식으로 게시된 모든 텍스트, 이미지 등의 콘텐츠를 말합니다.`,
  },
  {
    title: "제3조 (서비스 이용)",
    content: `① 서비스는 재직 인증을 완료한 회원에게 모든 채널 이용 권한을 부여합니다.\n② 재직 인증 수단은 회사 이메일 인증 또는 국민건강보험공단 EDI 확인 방식으로 진행됩니다.\n③ 인증 과정에서 수집된 개인정보는 인증 완료 즉시 파기되며 서버에 저장되지 않습니다.`,
  },
  {
    title: "제4조 (이용자의 의무)",
    content: `이용자는 다음 행위를 해서는 안 됩니다.\n① 타인의 신원을 특정하거나 개인정보를 공유하는 행위\n② 허위 사실을 유포하거나 타인의 명예를 훼손하는 행위\n③ 특정 집단에 대한 혐오 표현, 차별적 발언을 하는 행위\n④ 광고·홍보 목적의 게시물을 무단으로 작성하는 행위\n⑤ 서비스의 정상적인 운영을 방해하는 행위`,
  },
  {
    title: "제5조 (게시물 관리)",
    content: `① 서비스는 커뮤니티 가이드라인에 위배되는 게시물을 사전 통보 없이 삭제할 수 있습니다.\n② 반복적인 규정 위반 시 이용이 제한될 수 있습니다.\n③ 법령에 근거한 수사기관의 요청이 있을 경우, 관련 법률에 따라 최소한의 정보를 제공할 수 있습니다. 단, 익명성 보호 원칙을 최대한 준수합니다.`,
  },
  {
    title: "제6조 (서비스 변경 및 중단)",
    content: `① 서비스는 상당한 이유가 있는 경우 서비스의 전부 또는 일부를 변경할 수 있습니다.\n② 서비스 내용의 변경, 중단으로 인해 이용자가 입은 손해에 대해 서비스는 책임을 지지 않습니다. 단, 서비스의 고의 또는 중과실로 인한 경우는 제외합니다.`,
  },
  {
    title: "제7조 (약관의 변경)",
    content: `① 서비스는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지 또는 이메일을 통해 사전 고지합니다.\n② 변경 고지 후 7일 이내에 거부 의사를 표명하지 않으면 약관 변경에 동의한 것으로 간주합니다.`,
  },
];

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, maxWidth: "760px", margin: "0 auto", padding: "48px 20px", width: "100%" }}>
        <div style={{ marginBottom: "36px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: "#e94560", letterSpacing: "0.08em", textTransform: "uppercase" }}>Legal</p>
          <h1 style={{ margin: "0 0 8px", fontSize: "28px", fontWeight: "900", color: "#1a1a2e" }}>이용약관</h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#a1a1aa" }}>시행일: 2025년 1월 1일 · 최종 수정: 2025년 9월 1일</p>
        </div>

        {/* 요약 박스 */}
        <div style={{
          background: "#f0f0ff", border: "1px solid #d4d4f7",
          borderRadius: "12px", padding: "20px 24px", marginBottom: "36px",
        }}>
          <h3 style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: "700", color: "#1a1a2e" }}>📌 핵심 요약</h3>
          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#3f3f46", lineHeight: "2" }}>
            <li>모든 게시글은 완전 익명으로 처리됩니다</li>
            <li>재직 인증 정보는 인증 즉시 파기되며 저장하지 않습니다</li>
            <li>타인 비방, 혐오 표현, 허위 사실 유포는 금지됩니다</li>
            <li>반복 위반 시 서비스 이용이 제한될 수 있습니다</li>
          </ul>
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
          문의: <a href="mailto:legal@darktalk.kr" style={{ color: "#1a1a2e", fontWeight: "600" }}>legal@darktalk.kr</a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
