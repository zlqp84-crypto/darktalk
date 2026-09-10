import Header from "@/components/Header";
import Footer from "@/components/Footer";

const reportTypes = [
  {
    icon: "🚫",
    title: "혐오 표현 · 차별",
    desc: "성별, 나이, 지역, 직업 등을 이유로 한 혐오 표현, 비하, 차별 발언",
    action: "즉시 삭제 + 경고",
  },
  {
    icon: "👤",
    title: "개인정보 노출",
    desc: "실명, 연락처, 직장 특정 가능한 정보 등 타인의 개인정보를 무단 공개",
    action: "즉시 삭제 + 이용 제한",
  },
  {
    icon: "📰",
    title: "허위 사실 유포",
    desc: "사실 확인이 되지 않은 정보를 사실인 것처럼 유포하여 타인을 비방",
    action: "검토 후 삭제 또는 경고",
  },
  {
    icon: "📢",
    title: "스팸 · 광고",
    desc: "영리 목적의 광고, 홍보, 반복적인 동일 내용 게시",
    action: "즉시 삭제",
  },
  {
    icon: "⚠️",
    title: "성적 콘텐츠",
    desc: "음란하거나 성적으로 부적절한 내용",
    action: "즉시 삭제 + 영구 제재",
  },
  {
    icon: "🔪",
    title: "폭력 · 위협",
    desc: "타인에 대한 직접적인 위협, 폭력 조장 발언",
    action: "즉시 삭제 + 법적 조치 검토",
  },
];

const steps = [
  { step: "01", title: "신고 버튼 클릭", desc: "게시글이나 댓글 우측 하단의 '🚨 신고' 버튼을 클릭하세요." },
  { step: "02", title: "신고 유형 선택", desc: "위의 신고 유형 중 해당하는 항목을 선택하세요." },
  { step: "03", title: "사유 작성 (선택)", desc: "추가 설명이 있다면 간략히 작성해주세요. 더 정확한 처리에 도움이 됩니다." },
  { step: "04", title: "신고 완료", desc: "접수된 신고는 운영팀이 영업일 기준 24시간 이내 검토합니다." },
];

export default function ReportGuidePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, maxWidth: "760px", margin: "0 auto", padding: "48px 20px", width: "100%" }}>
        <div style={{ marginBottom: "36px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: "#e94560", letterSpacing: "0.08em", textTransform: "uppercase" }}>Community</p>
          <h1 style={{ margin: "0 0 12px", fontSize: "28px", fontWeight: "900", color: "#1a1a2e" }}>신고 가이드</h1>
          <p style={{ margin: 0, fontSize: "15px", color: "#71717a", lineHeight: "1.7" }}>
            DarkTalk은 모든 직장인이 안전하고 존중받는 환경에서 이야기를 나눌 수 있도록
            적극적인 커뮤니티 관리를 합니다. 부적절한 게시물을 발견하면 즉시 신고해주세요.
          </p>
        </div>

        {/* 신고 대상 */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "20px", fontWeight: "800", color: "#1a1a2e" }}>신고 대상 유형</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            {reportTypes.map(r => (
              <div key={r.title} style={{
                background: "#fff", border: "1px solid #e4e4e7",
                borderRadius: "12px", padding: "18px",
              }}>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>{r.icon}</div>
                <h3 style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: "700" }}>{r.title}</h3>
                <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#71717a", lineHeight: "1.6" }}>{r.desc}</p>
                <span style={{
                  fontSize: "11px", fontWeight: "600",
                  background: "#f0f0ff", color: "#1a1a2e",
                  padding: "3px 8px", borderRadius: "4px",
                }}>처리: {r.action}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 신고 방법 */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "20px", fontWeight: "800", color: "#1a1a2e" }}>신고 방법</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {steps.map((s, i) => (
              <div key={s.step} style={{ display: "flex", gap: "16px", paddingBottom: i < steps.length - 1 ? "24px" : "0" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "#1a1a2e", color: "#e94560",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: "800", fontFamily: "Inter, sans-serif",
                  }}>{s.step}</div>
                  {i < steps.length - 1 && <div style={{ width: "2px", flex: 1, background: "#e4e4e7", margin: "6px 0" }} />}
                </div>
                <div style={{ paddingTop: "8px", paddingBottom: i < steps.length - 1 ? "16px" : "0" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "700" }}>{s.title}</h3>
                  <p style={{ margin: 0, fontSize: "14px", color: "#71717a", lineHeight: "1.6" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 제재 기준 */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "20px", fontWeight: "800", color: "#1a1a2e" }}>제재 기준</h2>
          <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", overflow: "hidden" }}>
            {[
              { level: "경고", desc: "경미한 규정 위반 1회", color: "#f59e0b", bg: "#fffbeb" },
              { level: "7일 이용 제한", desc: "동일 위반 2회 또는 중도 위반 1회", color: "#f97316", bg: "#fff7ed" },
              { level: "30일 이용 제한", desc: "동일 위반 3회 또는 심각한 위반", color: "#e94560", bg: "#fff0f3" },
              { level: "영구 이용 제한", desc: "개인정보 유포, 폭력·협박, 반복적 중대 위반", color: "#7f1d1d", bg: "#fef2f2" },
            ].map((row, i) => (
              <div key={row.level} style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "14px 18px",
                borderBottom: i < 3 ? "1px solid #f4f4f5" : "none",
                background: row.bg,
              }}>
                <span style={{
                  fontSize: "12px", fontWeight: "700", color: row.color,
                  background: "#fff", border: `1px solid ${row.color}`,
                  padding: "3px 10px", borderRadius: "20px", flexShrink: 0, whiteSpace: "nowrap",
                }}>{row.level}</span>
                <span style={{ fontSize: "13px", color: "#3f3f46" }}>{row.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 직접 문의 */}
        <div style={{
          background: "#f8f8fa", borderRadius: "12px",
          padding: "24px", textAlign: "center",
        }}>
          <p style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: "700" }}>직접 문의하기</p>
          <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#71717a" }}>긴급하거나 복잡한 사안은 이메일로 문의해주세요. 영업일 기준 24시간 이내 답변드립니다.</p>
          <a href="mailto:report@darktalk.kr" style={{
            display: "inline-block", padding: "10px 24px",
            background: "#1a1a2e", color: "#fff",
            borderRadius: "8px", fontSize: "14px", fontWeight: "600",
          }}>report@darktalk.kr</a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
