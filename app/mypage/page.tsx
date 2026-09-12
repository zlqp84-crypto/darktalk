"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Link from "next/link";

type Tab = "posts" | "comments" | "likes" | "settings";

export default function MyPage() {
  const [tab, setTab] = useState<Tab>("posts");

  const tabs: { key: Tab; label: string }[] = [
    { key: "posts", label: "내 게시글" },
    { key: "comments", label: "내 댓글" },
    { key: "likes", label: "좋아요한 글" },
    { key: "settings", label: "계정 설정" },
  ];

  const mockComments = [
    { id: 1, content: "다음 번엔 아이디어 제안 전에 미리 메일이나 슬랙으로 기록을 남겨두세요. 증거가 됩니다.", postTitle: "팀장이 제 아이디어를 자기 공으로 발표했어요", time: "12분 전", likes: 87 },
    { id: 2, content: "저도 같은 경험 있어요. 이직을 고려해보시는 건 어떨까요?", postTitle: "연봉협상 어떻게 하셨어요?", time: "3시간 전", likes: 24 },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "24px 20px", maxWidth: "760px" }}>

          {/* 프로필 카드 */}
          <div style={{
            background: "linear-gradient(135deg, #1a1a2e, #16213e)",
            borderRadius: "14px", padding: "24px", marginBottom: "16px", color: "#fff",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* 아바타 */}
              <div style={{
                width: "60px", height: "60px", borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px", flexShrink: 0,
              }}>👤</div>

              <div style={{ flex: 1 }}>
                <h2 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "800" }}>익명 사용자</h2>
                <div style={{ display: "flex", gap: "10px", fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>
                  <span>가입일: 2025.01.15</span>
                  <span>·</span>
                  <span>게시글 8개</span>
                  <span>·</span>
                  <span>댓글 24개</span>
                </div>
              </div>

              {/* 인증 뱃지 */}
              <div style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px", padding: "10px 14px",
                textAlign: "center", flexShrink: 0,
              }}>
                <div style={{ fontSize: "18px", marginBottom: "2px" }}>✅</div>
                <div style={{ fontSize: "11px", fontWeight: "700" }}>직장인 인증</div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginTop: "1px" }}>건강보험 EDI</div>
              </div>
            </div>

            {/* 활동 통계 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginTop: "16px" }}>
              {[
                { label: "게시글", value: "8" },
                { label: "댓글", value: "24" },
                { label: "받은 좋아요", value: "312" },
                { label: "좋아요한 글", value: "17" },
              ].map(stat => (
                <div key={stat.label} style={{ background: "rgba(255,255,255,0.08)", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "18px", fontWeight: "800", fontFamily: "Inter, sans-serif" }}>{stat.value}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 탭 */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "16px", background: "#fff", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "4px" }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                flex: 1, padding: "9px",
                borderRadius: "7px", border: "none",
                background: tab === t.key ? "#1a1a2e" : "transparent",
                color: tab === t.key ? "#fff" : "#71717a",
                fontSize: "13px", fontWeight: tab === t.key ? "700" : "400",
                cursor: "pointer",
              }}>{t.label}</button>
            ))}
          </div>

          {/* 내 게시글 */}
          {tab === "posts" && (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📝</div>
              <p style={{ fontSize: "15px", fontWeight: "600", color: "#3f3f46" }}>아직 작성한 게시글이 없어요</p>
              <p style={{ fontSize: "13px", color: "#a1a1aa", marginTop: "4px" }}>첫 번째 글을 작성해보세요!</p>
              <a href="/write" style={{
                display: "inline-block", marginTop: "16px", padding: "10px 24px",
                background: "#1a1a2e", color: "#fff", borderRadius: "8px",
                fontSize: "14px", fontWeight: "600",
              }}>✏️ 글쓰기</a>
            </div>
          )}

          {/* 내 댓글 */}
          {tab === "comments" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {mockComments.map(c => (
                <div key={c.id} style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", padding: "18px 20px" }}>
                  <p style={{ margin: "0 0 10px", fontSize: "14px", color: "#3f3f46", lineHeight: "1.6" }}>
                    {c.content}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#a1a1aa" }}>
                    <span>❤️ {c.likes}</span>
                    <span>·</span>
                    <span>{c.time}</span>
                    <span>·</span>
                    <Link href="/post/1" style={{ color: "#71717a" }}>원글: {c.postTitle}</Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 좋아요한 글 */}
          {tab === "likes" && (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>❤️</div>
              <p style={{ fontSize: "15px", fontWeight: "600", color: "#3f3f46" }}>좋아요한 글이 없어요</p>
              <p style={{ fontSize: "13px", color: "#a1a1aa", marginTop: "4px" }}>마음에 드는 글에 좋아요를 눌러보세요</p>
            </div>
          )}

          {/* 계정 설정 */}
          {tab === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

              {/* 인증 현황 */}
              <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", padding: "20px" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: "700" }}>🔐 인증 현황</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "#f0fff4", borderRadius: "8px" }}>
                  <span style={{ fontSize: "24px" }}>✅</span>
                  <div>
                    <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "700", color: "#16a34a" }}>직장인 인증 완료</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#71717a" }}>건강보험 EDI · 2025.01.15 인증</p>
                  </div>
                </div>
              </div>

              {/* 이메일 변경 */}
              <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", padding: "20px" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: "700" }}>📧 계정 정보</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#71717a", display: "block", marginBottom: "5px" }}>이메일</label>
                    <div style={{ padding: "10px 14px", background: "#f4f4f5", borderRadius: "7px", fontSize: "13px", color: "#3f3f46" }}>
                      example@email.com
                    </div>
                  </div>
                  <button style={{
                    padding: "10px", background: "#f4f4f5", border: "none",
                    borderRadius: "7px", fontSize: "13px", fontWeight: "500",
                    color: "#3f3f46", cursor: "pointer", textAlign: "left",
                  }}>🔒 비밀번호 변경</button>
                </div>
              </div>

              {/* 알림 설정 */}
              <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", padding: "20px" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: "700" }}>🔔 알림 설정</h3>
                <Link href="/notifications" style={{
                  display: "block", padding: "10px 14px",
                  background: "#f4f4f5", borderRadius: "7px",
                  fontSize: "13px", color: "#3f3f46",
                }}>알림 설정 관리 →</Link>
              </div>

              {/* 위험 영역 */}
              <div style={{ background: "#fff", border: "1px solid #fce4e4", borderRadius: "12px", padding: "20px" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: "700", color: "#e94560" }}>⚠️ 계정 관리</h3>
                <button style={{
                  width: "100%", padding: "10px",
                  background: "transparent", border: "1px solid #fca5a5",
                  borderRadius: "7px", fontSize: "13px",
                  color: "#e94560", cursor: "pointer", fontWeight: "500",
                }}>회원 탈퇴</button>
              </div>
            </div>
          )}
        </main>

        <aside style={{ width: "280px", flexShrink: 0, padding: "24px 16px" }}>
          <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "700" }}>🚀 DarkTalk PRO</h3>
            <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#71717a", lineHeight: "1.6" }}>
              PRO 회원은 게시글 조회 통계, 댓글 작성자 업종 분석, 광고 없는 환경을 이용할 수 있어요.
            </p>
            <button style={{
              width: "100%", padding: "10px",
              background: "#e94560", color: "#fff",
              border: "none", borderRadius: "8px",
              fontSize: "13px", fontWeight: "700", cursor: "pointer",
            }}>PRO 시작하기</button>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
