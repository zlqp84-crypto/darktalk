import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DarkTalk - 직장인 익명 커뮤니티",
  description: "직장인들의 솔직한 이야기. 익명으로 자유롭게.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
