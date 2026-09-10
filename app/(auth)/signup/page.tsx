"use client";
import { useState } from "react";
import Link from "next/link";

const steps = ["기본 정보", "직장 인증", "완료"];

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [verifyMethod, setVerifyMethod] = useState<"email" | "edi" | null>(null);

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
        maxWidth: "480px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        {/* 로고 */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "800" }}>🖤 DarkTalk 가입</h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#71717a" }}>직장인 인증 후 모든 기능을 이용할 수 있어요</p>
        </div>

        {/* 스텝 인디케이터 */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "32px" }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: i <= step ? "#1a1a2e" : "#f4f4f5",
                color: i <= step ? "#fff" : "#a1a1aa",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: "700", flexShrink: 0,
              }}>{i + 1}</div>
              <span style={{ fontSize: "12px", marginLeft: "6px", color: i <= step ? "#1a1a2e" : "#a1a1aa", fontWeight: i === step ? "600" : "400" }}>{s}</span>
              {i < steps.length - 1 && <div style={{ flex: 1, height: "1px", background: "#e4e4e7", margin: "0 12px" }} />}
            </div>
          ))}
        </div>

        {/* 스텝 0: 기본 정보 */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#3f3f46", display: "block", marginBottom: "6px" }}>이메일</label>
              <input type="email" placeholder="example@email.com" style={{ width: "100%", padding: "11px 14px", border: "1px solid #e4e4e7", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#3f3f46", display: "block", marginBottom: "6px" }}>비밀번호</label>
              <input type="password" placeholder="8자 이상" style={{ width: "100%", padding: "11px 14px", border: "1px solid #e4e4e7", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#3f3f46", display: "block", marginBottom: "6px" }}>닉네임 (익명)</label>
              <input type="text" placeholder="다른 사용자에게 표시되지 않아요" style={{ width: "100%", padding: "11px 14px", border: "1px solid #e4e4e7", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
            </div>
            <div style={{ background: "#f4f4f5", borderRadius: "8px", padding: "12px 14px", fontSize: "12px", color: "#71717a" }}>
              ✅ 가입 완료 후 직장인 인증을 진행해야 모든 채널을 이용할 수 있습니다.
            </div>
            <button onClick={() => setStep(1)} style={{ width: "100%", padding: "12px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
              다음 단계 →
            </button>
          </div>
        )}

        {/* 스텝 1: 직장 인증 */}
        {step === 1 && (
          <div>
            <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "700" }}>직장인 인증 방법 선택</h3>
            <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#71717a" }}>재직 중인 회사를 인증하면 더 많은 채널을 이용할 수 있어요.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              {/* 회사 이메일 인증 */}
              <div
                onClick={() => setVerifyMethod("email")}
                style={{
                  border: `2px solid ${verifyMethod === "email" ? "#1a1a2e" : "#e4e4e7"}`,
                  borderRadius: "12px", padding: "16px", cursor: "pointer",
                  background: verifyMethod === "email" ? "#f0f0ff" : "#fff",
                }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "24px" }}>📧</span>
                  <div>
                    <p style={{ margin: "0 0 4px", fontWeight: "700", fontSize: "14px" }}>회사 이메일 인증</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#71717a" }}>@회사도메인.com 형태의 이메일로 인증코드를 받아 인증합니다.</p>
                  </div>
                </div>
              </div>

              {/* 건강보험 EDI */}
              <div
                onClick={() => setVerifyMethod("edi")}
                style={{
                  border: `2px solid ${verifyMethod === "edi" ? "#1a1a2e" : "#e4e4e7"}`,
                  borderRadius: "12px", padding: "16px", cursor: "pointer",
                  background: verifyMethod === "edi" ? "#f0f0ff" : "#fff",
                }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "24px" }}>🏥</span>
                  <div>
                    <p style={{ margin: "0 0 4px", fontWeight: "700", fontSize: "14px" }}>건강보험 EDI 인증 <span style={{ background: "#e94560", color: "#fff", fontSize: "10px", padding: "1px 6px", borderRadius: "4px", marginLeft: "4px" }}>추천</span></p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#71717a" }}>프리랜서·개인사업자도 가능. 건강보험공단 직장가입자 확인으로 인증합니다.</p>
                  </div>
                </div>
              </div>
            </div>

            {verifyMethod && (
              <div style={{ background: "#f4f4f5", borderRadius: "8px", padding: "14px", marginBottom: "16px" }}>
                {verifyMethod === "email" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input placeholder="회사 이메일 입력 (예: yourname@company.com)" style={{ padding: "10px 14px", border: "1px solid #e4e4e7", borderRadius: "6px", fontSize: "13px" }} />
                    <button style={{ padding: "9px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>인증코드 발송</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input placeholder="주민등록번호 앞 6자리" style={{ padding: "10px 14px", border: "1px solid #e4e4e7", borderRadius: "6px", fontSize: "13px" }} />
                    <input placeholder="건강보험 EDI 비밀번호" type="password" style={{ padding: "10px 14px", border: "1px solid #e4e4e7", borderRadius: "6px", fontSize: "13px" }} />
                    <p style={{ margin: 0, fontSize: "11px", color: "#a1a1aa" }}>* 입력 정보는 인증 즉시 파기되며 저장되지 않습니다.</p>
                    <button style={{ padding: "9px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>재직 확인하기</button>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setStep(0)} style={{ flex: 1, padding: "11px", background: "#f4f4f5", color: "#52525b", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>← 이전</button>
              <button onClick={() => setStep(2)} style={{ flex: 2, padding: "11px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>인증 완료</button>
            </div>
            <button onClick={() => setStep(2)} style={{ width: "100%", marginTop: "8px", padding: "10px", background: "transparent", color: "#a1a1aa", border: "none", fontSize: "13px", cursor: "pointer" }}>나중에 인증하기</button>
          </div>
        )}

        {/* 스텝 2: 완료 */}
        {step === 2 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "800" }}>가입 완료!</h2>
            <p style={{ margin: "0 0 28px", fontSize: "14px", color: "#71717a", lineHeight: "1.6" }}>
              DarkTalk에 오신 걸 환영해요.<br />
              직장인들의 솔직한 이야기가 기다리고 있어요.
            </p>
            <Link href="/" style={{
              display: "block", padding: "13px",
              background: "#1a1a2e", color: "#fff",
              borderRadius: "8px", fontSize: "15px", fontWeight: "700",
            }}>커뮤니티 시작하기 →</Link>
          </div>
        )}

        {step === 0 && (
          <p style={{ textAlign: "center", fontSize: "13px", color: "#71717a", marginTop: "16px" }}>
            이미 계정이 있으신가요? <Link href="/login" style={{ color: "#e94560", fontWeight: "600" }}>로그인</Link>
          </p>
        )}
      </div>
    </div>
  );
}
