import Header from "@/components/Header";
import Footer from "@/components/Footer";

const adProducts = [
  {
    icon: "📌",
    title: "메인 배너 광고",
    desc: "메인 피드 상단 노출. 일 평균 12만 UV에게 브랜드를 알리세요.",
    price: "월 300만원~",
    tag: "인기",
    tagColor: "#e94560",
  },
  {
    icon: "📢",
    title: "채널 스폰서십",
    desc: "특정 채널(대기업, 스타트업 등) 상단 고정 노출. 타겟 업종 집중 공략.",
    price: "월 150만원~",
    tag: "추천",
    tagColor: "#7c3aed",
  },
  {
    icon: "🔔",
    title: "알림 푸시 광고",
    desc: "인증된 직장인 회원에게 푸시 알림으로 직접 도달. 높은 클릭률.",
    price: "1회 50만원~",
    tag: null,
    tagColor: "",
  },
  {
    icon: "🏢",
    title: "기업 프로필 프리미엄",
    desc: "기업 페이지 최상단 노출 + 브랜드 컬러 적용 + 공식 배지.",
    price: "월 200만원~",
    tag: null,
    tagColor: "",
  },
  {
    icon: "📊",
    title: "채용 공고 노출",
    desc: "구직 중인 직장인 타겟 채용 공고. 피드 자연스럽게 삽입.",
    price: "건당 30만원~",
    tag: null,
    tagColor: "",
  },
  {
    icon: "✉️",
    title: "뉴스레터 광고",
    desc: "주 1회 발송 뉴스레터 내 광고 슬롯. 오픈율 42% 이상.",
    price: "회당 80만원~",
    tag: null,
    tagColor: "",
  },
];

const stats = [
  { value: "12만+", label: "일 순방문자(UV)" },
  { value: "38만+", label: "월 활성 사용자" },
  { value: "4.2분", label: "평균 체류 시간" },
  { value: "91%", label: "재직 인증 회원 비율" },
];

export default function AdvertisePage() {
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
        <p style={{ margin: "0 0 10px", fontSize: "12px", fontWeight: "700", color: "#e94560", letterSpacing: "0.1em", textTransform: "uppercase" }}>Advertise</p>
        <h1 style={{ margin: "0 0 14px", fontSize: "34px", fontWeight: "900", letterSpacing: "-0.5px" }}>검증된 직장인에게<br />브랜드를 전달하세요</h1>
        <p style={{ margin: "0 auto", fontSize: "16px", color: "rgba(255,255,255,0.65)", maxWidth: "480px", lineHeight: "1.7" }}>
          DarkTalk의 모든 회원은 재직 인증을 완료한 실제 직장인입니다.<br />
          낭비 없는 타겟 광고로 더 높은 ROI를 경험하세요.
        </p>
        <a href="mailto:ads@darktalk.kr" style={{
          display: "inline-block", marginTop: "28px",
          padding: "13px 32px", background: "#e94560",
          color: "#fff", borderRadius: "8px",
          fontSize: "15px", fontWeight: "700",
        }}>광고 문의하기</a>
      </div>

      <main style={{ flex: 1, maxWidth: "860px", margin: "0 auto", padding: "56px 20px", width: "100%" }}>

        {/* 주요 지표 */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={{ margin: "0 0 24px", fontSize: "22px", fontWeight: "800", color: "#1a1a2e", textAlign: "center" }}>DarkTalk 주요 지표</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px" }}>
            {stats.map(s => (
              <div key={s.label} style={{
                background: "#fff", border: "1px solid #e4e4e7",
                borderRadius: "14px", padding: "24px 16px", textAlign: "center",
              }}>
                <div style={{ fontSize: "28px", fontWeight: "900", color: "#e94560", fontFamily: "Inter, sans-serif", marginBottom: "6px" }}>{s.value}</div>
                <div style={{ fontSize: "13px", color: "#71717a" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 광고 상품 */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={{ margin: "0 0 24px", fontSize: "22px", fontWeight: "800", color: "#1a1a2e" }}>광고 상품 안내</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "14px" }}>
            {adProducts.map(p => (
              <div key={p.title} style={{
                background: "#fff", border: "1px solid #e4e4e7",
                borderRadius: "14px", padding: "22px",
                display: "flex", flexDirection: "column", gap: "8px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "24px" }}>{p.icon}</span>
                  <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>{p.title}</h3>
                  {p.tag && (
                    <span style={{ fontSize: "10px", fontWeight: "700", background: p.tagColor, color: "#fff", padding: "2px 7px", borderRadius: "4px", flexShrink: 0 }}>{p.tag}</span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: "13px", color: "#71717a", lineHeight: "1.6" }}>{p.desc}</p>
                <p style={{ margin: "4px 0 0", fontSize: "14px", fontWeight: "700", color: "#1a1a2e" }}>{p.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 타겟 분석 */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "22px", fontWeight: "800", color: "#1a1a2e" }}>회원 구성</h2>
          <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "14px", padding: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {[
                {
                  title: "직군",
                  items: [
                    { label: "IT·개발", pct: 34 },
                    { label: "마케팅·기획", pct: 22 },
                    { label: "영업·관리", pct: 18 },
                    { label: "제조·생산", pct: 14 },
                    { label: "기타", pct: 12 },
                  ],
                },
                {
                  title: "기업 규모",
                  items: [
                    { label: "대기업·그룹사", pct: 28 },
                    { label: "중견기업", pct: 25 },
                    { label: "중소기업", pct: 24 },
                    { label: "스타트업", pct: 15 },
                    { label: "프리랜서", pct: 8 },
                  ],
                },
              ].map(group => (
                <div key={group.title}>
                  <p style={{ margin: "0 0 12px", fontSize: "13px", fontWeight: "700", color: "#1a1a2e" }}>{group.title}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {group.items.map(item => (
                      <div key={item.label}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#71717a", marginBottom: "3px" }}>
                          <span>{item.label}</span><span>{item.pct}%</span>
                        </div>
                        <div style={{ height: "5px", background: "#f4f4f5", borderRadius: "3px" }}>
                          <div style={{ height: "100%", width: `${item.pct}%`, background: "#e94560", borderRadius: "3px" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 문의 */}
        <div style={{
          background: "#f8f8fa", borderRadius: "16px",
          padding: "36px", textAlign: "center",
        }}>
          <h2 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: "800" }}>맞춤 광고 제안 받기</h2>
          <p style={{ margin: "0 0 20px", fontSize: "14px", color: "#71717a", lineHeight: "1.7" }}>
            예산과 목표를 말씀해 주시면 최적의 광고 플랜을 제안드립니다.<br />
            영업일 기준 24시간 이내 답변드립니다.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:ads@darktalk.kr" style={{
              padding: "12px 28px", background: "#1a1a2e", color: "#fff",
              borderRadius: "8px", fontSize: "14px", fontWeight: "700",
            }}>ads@darktalk.kr</a>
            <a href="https://open.kakao.com" style={{
              padding: "12px 28px", background: "#FEE500", color: "#1a1a2e",
              borderRadius: "8px", fontSize: "14px", fontWeight: "700",
            }}>카카오 채널 문의</a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
