const BLOCKED_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'naver.com',
  'daum.net',
  'hanmail.net',
  'kakao.com',
  'nate.com',
  'hotmail.com',
  'outlook.com',
  'outlook.kr',
  'live.com',
  'msn.com',
  'yahoo.com',
  'yahoo.co.kr',
  'icloud.com',
  'me.com',
  'mac.com',
  'protonmail.com',
  'proton.me',
  'aol.com',
  'gmx.com',
  'zoho.com',
  'yandex.com',
  'mail.com',
  'qq.com',
  '163.com',
  '126.com',
])

export function getEmailDomain(email: string): string {
  return email.trim().toLowerCase().split('@')[1] ?? ''
}

export function isCompanyEmail(email: string): boolean {
  const domain = getEmailDomain(email)
  if (!domain) return false
  return !BLOCKED_EMAIL_DOMAINS.has(domain)
}
