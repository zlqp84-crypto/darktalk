import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const plans = [
  {
    key: "free",
    name: "Free",
    price: "무료",
    priceDetail: "",
    desc: "기본 커뮤니티 기능",
    color: "#71717a",
    bg: "#fff",
    border: "#e4e4e7",
    features: [
      { text: "모든 채널 읽기", ok: true },
      { text: "게시글 작성 (일 5개)", ok: true },
      { text: "댓글 작성", ok: true },
      { text: "좋아요", ok: true },
      { text: "광고 없는 환경", ok: false },
      { text: "내 게시글 조회 통계", ok: false },
      { text: "댓글 작성자 업종 분석", ok: false },
      { text: "연봉 상세 데이터", ok: false },
      { text: "북마크 무제한", ok: false },
      { text: "우선 고객 지원", ok: false },
    ],
    cta: "현재 이용 중",
    ctaStyle: { background: "#f4f4f5", color: "#71717a" },
  },
  {
    key: "pro",
    name: "PRO",
    price: "₩4,900",
    priceDetail: "/ 월",
    desc: "파워 유저를 위한 프리미엄",
    color: "#fff",
    bg: "linear-gradient(135deg, #1a1a2e, #16213e)",
    border: "transparent",
    badge: "추천",
    features: [
      { text: "모든 채널 읽기", ok: true },
      { text: "게시글 작성 무제한", ok: true },
      { text: "댓글 작성", ok: true },
      { text: "좋아요", ok: true },
      { text: "광고 없는 환경", ok: true },
      { text: "내 게시글 조회 통계", ok: true },
      { text: "댓글 작성자 업종 분석", ok: true },
      { text: "연봉 상세 데이터", ok: true },
      { text: "북마크 무제한", ok: true },
      { text: "우선 고객 지원", ok: true },
    ],
    cta: "PRO 시작하기",
    ctaStyle: { background: "#e94560", color: "#fff" },
  },
];

const proFeatures = [
  {
    icon: "📊",
    title: "게시글 조회 통계",
    desc: "내 글이 얼마나 많이 읽혔는지, 어떤 시간대에 조회가 집중됐는지 확인하세요.",
  },
  {
    icon: "🎯",
    title: "댓글 작성자 업종 분석",
    desc: "내 글에 달린 댓글이 어떤 업종·규모의 직장인들에게서 왔는지 분석해드립니다.",
  },
  {
    icon: "💰",
    title: "연봉 상세 데이터",
    desc: "직급별 상세 연봉 분포, 인상률 트렌드, 회사별 비교 데이터를 열람하세요.",
  },
  {
    icon: "🚫",
    title: "광고 없는 환경",
    desc: "배너, 중간광고 없이 콘텐츠에만 집중할 수 있는 클린한 환경을 제공합니다.",
  },
];

export default function ProPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* 히어로 */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        color: "#fff",
        padding: "64px 20px",
        textAlign: "center",
      }}>
        <span style={{
          display: "inline-block", marginBottom: "14px",
          fontSize: "11px", fontWeight: "800", letterSpacing: "0.12em",
          background: "#e94560", color: "#fff",
          padding: "4px 12px", borderRadius: "20px", textTransform: "uppercase",
        }}>DarkTalk PRO</span>
        <h1 style={{ margin: "0 0 14px", fontSize: "36px", fontWeight: "900", letterSpacing: "-1px" }}>
          더 깊이 파고들고 싶다면
        </h1>
        <p style={{ margin: "0 auto", fontSize: "16px", color: "rgba(255,255,255,0.65)", maxWidth: "460px", lineHeight: "1.7" }}>
          광고 없이, 통계와 함께, 더 스마트하게.<br />
          DarkTalk PRO와 함께 커뮤니티를 제대로 활용하세요.
        </p>
      </div>

      <main style={{ flex: 1, maxWidth: "820px", margin: "0 auto", padding: "56px 20px", width: "100%" }}>

        {/* 요금제 비교 */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={{ margin: "0 0 28px", fontSize: "22px", fontWeight: "800", color: "#1a1a2e", textAlign: "center" }}>요금제 비교</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {plans.map(plan => (
              <div key={plan.key} style={{
                background: plan.bg, border: `1px solid ${plan.border}`,
                borderRadius: "16px", padding: "28px",
                color: plan.color === "#fff" ? "#fff" : "#1a1a2e",
                position: "relative",
              }}>
                {plan.badge && (
                  <span style={{
                    position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                    background: "#e94560", color: "#fff",
                    fontSize: "11px", fontWeight: "800", padding: "4px 14px",
                    borderRadius: "20px",
                  }}>{plan.badge}</span>
                )}
                <p style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: "600", opacity: 0.65 }}>{plan.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "32px", fontWeight: "900", fontFamily: "Inter, sans-serif" }}>{plan.price}</span>
                  {plan.priceDetail && <span style={{ fontSize: "14px", opacity: 0.65 }}>{plan.priceDetail}</span>}
                </div>
                <p style={{ margin: "0 0 20px", fontSize: "13px", opacity: 0.65 }}>{plan.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                  {plan.features.map(f => (
                    <div key={f.text} style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "13px" }}>
                      <span style={{ flexShrink: 0, opacity: f.ok ? 1 : 0.3 }}>{f.ok ? "✅" : "✗"}</span>
                      <span style={{ opacity: f.ok ? 1 : 0.4 }}>{f.text}</span>
                    </div>
                  ))}
                </div>
                <button style={{
                  width: "100%", padding: "12px",
                  borderRadius: "8px", border: "none",
                  fontSize: "14px", fontWeight: "700",
                  cursor: plan.key === "free" ? "default" : "pointer",
                  ...plan.ctaStyle,
                }}>{plan.cta}</button>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: "14px", fontSize: "12px", color: "#a1a1aa" }}>
            연간 결제 시 20% 할인 (₩46,800/년) · 언제든지 해지 가능
          </p>
        </section>

        {/* PRO 기능 상세 */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={{ margin: "0 0 24px", fontSize: "22px", fontWeight: "800", color: "#1a1a2e" }}>PRO 전용 기능</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
            {proFeatures.map(f => (
              <div key={f.title} style={{
                background: "#fff", border: "1px solid #e4e4e7",
                borderRadius: "14px", padding: "22px",
              }}>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{f.icon}</div>
                <h3 style={{ margin: "0 0 8px", fontSize: "15px", fontWeight: "700" }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#71717a", lineHeight: "1.6" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "22px", fontWeight: "800", color: "#1a1a2e" }}>자주 묻는 질문</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {[
              { q: "결제는 어떻게 하나요?", a: "카카오페이, 신용카드, 계좌이체를 지원합니다. 정기 구독은 매월 동일 날짜에 자동 결제됩니다." },
              { q: "환불 정책이 어떻게 되나요?", a: "구독 후 7일 이내에는 전액 환불이 가능합니다. 이후에는 남은 기간에 비례하여 환불해드립니다." },
              { q: "해지하면 데이터가 삭제되나요?", a: "해지 후에도 작성하신 게시글과 댓글은 유지됩니다. PRO 전용 기능만 비활성화됩니다." },
              { q: "기업 단체 구독이 가능한가요?", a: "10인 이상 단체 구독은 ads@darktalk.kr으로 문의해주세요. 별도 할인 혜택을 제공합니다." },
            ].map((item, i) => (
              <div key={item.q} style={{
                padding: "18px 0",
                borderBottom: i < 3 ? "1px solid #f4f4f5" : "none",
              }}>
                <p style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: "700", color: "#1a1a2e" }}>Q. {item.q}</p>
                <p style={{ margin: 0, fontSize: "13px", color: "#71717a", lineHeight: "1.7" }}>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{
          background: "linear-gradient(135deg, #1a1a2e, #16213e)",
          borderRadius: "16px", padding: "40px", textAlign: "center", color: "#fff",
        }}>
          <h2 style={{ margin: "0 0 10px", fontSize: "22px", fontWeight: "800" }}>지금 PRO를 시작하세요</h2>
          <p style={{ margin: "0 0 24px", fontSize: "14px", color: "rgba(255,255,255,0.65)" }}>
            첫 달 무료 체험 · 언제든지 해지 가능
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button style={{
              padding: "13px 32px", background: "#e94560", color: "#fff",
              border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "700", cursor: "pointer",
            }}>PRO 무료 체험 시작</button>
            <Link href="/" style={{
              padding: "13px 24px", background: "rgba(255,255,255,0.1)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", fontSize: "15px",
            }}>Free로 계속하기</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
