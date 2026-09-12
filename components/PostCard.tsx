"use client";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  const day = Math.floor(hour / 24);
  if (day < 7) return `${day}일 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

export default function PostCard({ post }: { post: Post }) {
  const isHot = post.likes_count >= 100;

  return (
    <Link href={`/post/${post.id}`}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #e4e4e7",
          borderRadius: "12px",
          padding: "18px 20px",
          marginBottom: "8px",
          cursor: "pointer",
          transition: "box-shadow 0.15s, border-color 0.15s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "#c4c4c7";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          (e.currentTarget as HTMLDivElement).style.borderColor = "#e4e4e7";
        }}
      >
        {/* 상단 뱃지 */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "10px", alignItems: "center" }}>
          <span style={{
            fontSize: "11px", fontWeight: "600",
            background: "#f0f0ff", color: "#1a1a2e",
            padding: "2px 8px", borderRadius: "20px",
          }}>{post.category}</span>
          {isHot && (
            <span style={{
              fontSize: "11px", fontWeight: "700",
              background: "#fff0f3", color: "#e94560",
              padding: "2px 8px", borderRadius: "20px",
            }}>🔥 HOT</span>
          )}
        </div>

        {/* 제목 */}
        <h3 style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: "600", color: "#18181b", lineHeight: "1.4" }}>
          {post.title}
        </h3>

        {/* 미리보기 */}
        <p style={{
          margin: "0 0 14px", fontSize: "13px", color: "#71717a", lineHeight: "1.5",
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const,
        }}>
          {post.content}
        </p>

        {/* 하단 */}
        <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#a1a1aa", alignItems: "center" }}>
          <span>❤️ {post.likes_count}</span>
          <span style={{ marginLeft: "auto" }}>{timeAgo(post.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
