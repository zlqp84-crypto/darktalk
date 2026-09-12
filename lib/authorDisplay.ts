export interface AuthorProfile {
  nickname: string | null;
  company: string | null;
  job_title?: string | null;
  is_verified?: boolean | null;
}

export function maskNickname(nickname: string): string {
  if (!nickname) return "";
  return nickname[0] + "*".repeat(Math.max(nickname.length - 1, 0));
}

export function formatAuthor(profile: AuthorProfile | null | undefined): string {
  if (!profile || !profile.nickname) return "익명";
  const masked = maskNickname(profile.nickname);
  return profile.company ? `${profile.company} · ${masked}` : masked;
}
