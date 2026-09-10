"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Link from "next/link";

const mockNotifications = [
  { id: 1, type: "comment", message: "내 게시글에 새 댓글이 달렸어요", detail: "\"연봉협상 어떻게 하셨어요?\"에 익명의 개발자님이 댓글을 달았습니다.", time: "5분 전", read: false, link: "/post/1" },
  { id: 2, type: "like", message: "내 게시글이 인기를 얻고 있어요 🔥", detail: "\"팀장이 제 아이디어를 자기 공으로...\" 글이 HOT 게시판에 올랐습니다.", time: "22분 전", read: false, link: "/post/3" },
  { id: 3, type: "comment", message: "내 댓글에 좋아요가 눌렸어요", detail: "익명의 기획자님이 내 댓글을 좋아합니다.", time: "1시간 전", read: false, link: "/post/2" },
  { id: 4, type: "system", message: "직장인 인증이 완료됐어요 ✅", detail: "건강보험 EDI 인증이 완료되었습니다. 모든 채널을 이용할 수 있습니다.", time: "3시간 전", read: true, link: "/mypage" },
  { id: 5, type: "comment", message: "내 게시글에 새 댓글이 달렸어요", detail: "\"스타트업 vs 대기업 솔직히...\"에 익명의 마케터님이 댓글을 달았습니다.", time: "5시간 전", read: true, link: "/post/2" },
  { id: 6, type: "system", message: "DarkTalk에 오신 것을 환영합니다 👋", detail: "첫 게시글을 작성해보세요! 익명으로 자유롭게 이야기할 수 있어요.", time: "2일 전", read: true, link: "/" },
];

const iconMap: Record<string, string> = {
  comment: "💬",
  like: "❤️",
  system: "🔔",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const displayed = filter === "unread" ? notifications.filter(n => !n.read) : notifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "24px 20px", maxWidth: "640px" }}>
          {/* 헤더 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <h1 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "800" }}>
                🔔 알림
                {unreadCount > 0 && (
                  <span style={{
                    display: "inline-block", marginLeft: "8px",
                    background: "#e94560", color: "#fff",
                    borderRadius: "20px", fontSize: "12px", fontWeight: "700",
                    padding: "2px 8px", verticalAlign: "middle",
                  }}>{unreadCount}</span>
                )}
              </h1>
              <p style={{ margin: 0, fontSize: "13px", color: "#a1a1aa" }}>내 활동에 대한 알림을 확인하세요</p>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{
                padding: "8px 14px", background: "#f4f4f5",
                border: "none", borderRadius: "7px",
                fontSize: "12px", color: "#52525b", cursor: "pointer", fontWeight: "500",
              }}>모두 읽음</button>
            )}
          </div>

          {/* 필터 탭 */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {(["all", "unread"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "7px 16px", borderRadius: "20px",
                border: `1px solid ${filter === f ? "#1a1a2e" : "#e4e4e7"}`,
                background: filter === f ? "#1a1a2e" : "#fff",
                color: filter === f ? "#fff" : "#52525b",
                fontSize: "13px", fontWeight: filter === f ? "600" : "400", cursor: "pointer",
              }}>
                {f === "all" ? "전체" : `안 읽음 ${unreadCount}`}
              </button>
            ))}
          </div>

          {/* 알림 목록 */}
          <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "14px", overflow: "hidden" }}>
            {displayed.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔕</div>
                <p style={{ fontSize: "15px", fontWeight: "600", color: "#3f3f46" }}>읽지 않은 알림이 없어요</p>
              </div>
            ) : displayed.map((notif, i) => (
              <Link key={notif.id} href={notif.link} onClick={() => markRead(notif.id)}>
                <div style={{
                  display: "flex", gap: "14px", padding: "16px 20px",
                  borderBottom: i < displayed.length - 1 ? "1px solid #f4f4f5" : "none",
                  background: notif.read ? "#fff" : "#fafafe",
                  cursor: "pointer", transition: "background 0.1s",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#f8f8fc"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = notif.read ? "#fff" : "#fafafe"}
                >
                  {/* 아이콘 */}
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: notif.read ? "#f4f4f5" : "#f0f0ff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", flexShrink: 0,
                  }}>{iconMap[notif.type]}</div>

                  {/* 내용 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: notif.read ? "500" : "700", color: "#18181b" }}>
                        {notif.message}
                      </p>
                      {!notif.read && (
                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#e94560", flexShrink: 0 }} />
                      )}
                    </div>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#71717a", lineHeight: "1.5" }}>
                      {notif.detail}
                    </p>
                    <span style={{ fontSize: "11px", color: "#a1a1aa" }}>{notif.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        <aside style={{ width: "280px", flexShrink: 0, padding: "24px 16px" }}>
          <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "700" }}>⚙️ 알림 설정</h3>
            {[
              { label: "내 글에 댓글", on: true },
              { label: "내 댓글에 좋아요", on: true },
              { label: "HOT 게시판 등록", on: true },
              { label: "공지 및 시스템", on: true },
              { label: "마케팅 알림", on: false },
            ].map(setting => (
              <div key={setting.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "9px 0", borderBottom: "1px solid #f4f4f5",
              }}>
                <span style={{ fontSize: "13px", color: "#3f3f46" }}>{setting.label}</span>
                <div style={{
                  width: "36px", height: "20px", borderRadius: "10px",
                  background: setting.on ? "#1a1a2e" : "#d4d4d8",
                  position: "relative", cursor: "pointer",
                }}>
                  <div style={{
                    width: "16px", height: "16px", borderRadius: "50%",
                    background: "#fff",
                    position: "absolute", top: "2px",
                    left: setting.on ? "18px" : "2px",
                    transition: "left 0.2s",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
