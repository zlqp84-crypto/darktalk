"use client";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  preview: string;
  category: string;
  company?: string;
  likes: number;
  comments: number;
  time: string;
  isHot?: boolean;
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/post/${post.id}`}>
      <div style={{
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
          {post.company && (
            <span style={{
              fontSize: "11px", color: "#71717a",
              background: "#f4f4f5", padding: "2px 8px", borderRadius: "20px",
            }}>{post.company}</span>
          )}
          {post.isHot && (
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
        <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#71717a", lineHeight: "1.5",
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const,
        }}>
          {post.preview}
        </p>

        {/* 하단 */}
        <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#a1a1aa", alignItems: "center" }}>
          <span>❤️ {post.likes}</span>
          <span>💬 {post.comments}</span>
          <span style={{ marginLeft: "auto" }}>{post.time}</span>
        </div>
      </div>
    </Link>
  );
}
