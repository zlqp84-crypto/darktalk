import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* 히어로 */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        color: "#fff",
        padding: "72px 20px",
        textAlign: "center",
      }}>
        <div style={{
          width: "64px", height: "64px", background: "#e94560",
          borderRadius: "16px", margin: "0 auto 20px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "30px", fontWeight: "900",
        }}>D</div>
        <h1 style={{ margin: "0 0 12px", fontSize: "36px", fontWeight: "900", letterSpacing: "-1px" }}>
          DarkTalk
        </h1>
        <p style={{ margin: "0 auto", fontSize: "18px", color: "rgba(255,255,255,0.7)", maxWidth: "480px", lineHeight: "1.7" }}>
          직장인들의 솔직한 이야기.<br />익명으로, 자유롭게, 서로를 존중하며.
        </p>
      </div>

      <main style={{ flex: 1, maxWidth: "720px", margin: "0 auto", padding: "56px 20px", width: "100%" }}>

        {/* 미션 */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "16px", color: "#1a1a2e" }}>우리의 미션</h2>
          <p style={{ fontSize: "16px", color: "#3f3f46", lineHeight: "1.8" }}>
            DarkTalk은 대한민국 모든 직장인이 회사 규모와 업종에 관계없이
            동등하게 목소리를 낼 수 있는 공간을 만들기 위해 탄생했습니다.
            대기업 직원도, 중소기업 직원도, 스타트업 구성원도, 프리랜서도 —
            누구나 익명의 보호 아래 솔직한 이야기를 나눌 수 있어야 한다고 믿습니다.
          </p>
        </section>

        {/* 특징 3개 */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "24px", color: "#1a1a2e" }}>DarkTalk의 특징</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {[
              { icon: "🔒", title: "완전한 익명성", desc: "작성자 신원은 운영자도 확인할 수 없습니다. 진짜 익명이에요." },
              { icon: "✅", title: "재직자 인증", desc: "건강보험 EDI 또는 회사 이메일로 재직을 인증한 사람만 참여합니다." },
              { icon: "🛡️", title: "엄격한 모더레이션", desc: "혐오 표현, 허위 사실, 개인정보 노출에 대해 즉각 조치합니다." },
            ].map(f => (
              <div key={f.title} style={{
                background: "#fff",
                border: "1px solid #e4e4e7",
                borderRadius: "14px",
                padding: "24px",
              }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{f.icon}</div>
                <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "700" }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#71717a", lineHeight: "1.6" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 차별점 */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "16px", color: "#1a1a2e" }}>블라인드와 다른 점</h2>
          <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "14px", overflow: "hidden" }}>
            {[
              { item: "대상", darktalk: "대기업·중소기업·스타트업·프리랜서 모두", blind: "주로 대기업·IT 업계" },
              { item: "인증 방식", darktalk: "건강보험 EDI (프리랜서 포함)", blind: "회사 이메일 중심" },
              { item: "커뮤니티 관리", darktalk: "적극적인 모더레이션, 존중 문화", blind: "상대적으로 느슨한 관리" },
              { item: "연봉 정보", darktalk: "직급별 범위 + 익명 제보", blind: "회사별 평균 위주" },
            ].map((row, i) => (
              <div key={row.item} style={{
                display: "grid", gridTemplateColumns: "120px 1fr 1fr",
                borderBottom: i < 3 ? "1px solid #f4f4f5" : "none",
              }}>
                <div style={{ padding: "14px 16px", fontSize: "12px", fontWeight: "700", color: "#71717a", background: "#f8f8fa" }}>{row.item}</div>
                <div style={{ padding: "14px 16px", fontSize: "13px", color: "#1a1a2e", fontWeight: "600", borderLeft: "1px solid #f4f4f5" }}>
                  <span style={{ fontSize: "10px", background: "#e94560", color: "#fff", padding: "1px 5px", borderRadius: "3px", marginRight: "6px" }}>DarkTalk</span>
                  {row.darktalk}
                </div>
                <div style={{ padding: "14px 16px", fontSize: "13px", color: "#71717a", borderLeft: "1px solid #f4f4f5" }}>{row.blind}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: "center", padding: "40px", background: "#f8f8fa", borderRadius: "16px" }}>
          <h2 style={{ margin: "0 0 12px", fontSize: "22px", fontWeight: "800" }}>지금 바로 시작하세요</h2>
          <p style={{ margin: "0 0 24px", fontSize: "15px", color: "#71717a" }}>재직 인증 후 모든 채널을 자유롭게 이용할 수 있어요.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link href="/signup" style={{
              padding: "12px 28px", background: "#1a1a2e", color: "#fff",
              borderRadius: "8px", fontSize: "15px", fontWeight: "700",
            }}>가입하기</Link>
            <Link href="/" style={{
              padding: "12px 28px", background: "#fff", color: "#1a1a2e",
              border: "1px solid #e4e4e7", borderRadius: "8px", fontSize: "15px", fontWeight: "600",
            }}>둘러보기</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
