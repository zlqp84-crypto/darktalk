export const COMPANY_TYPES = { large: '대기업', mid_sized: '중견기업', small: '중소기업', public_enterprise: '공기업', public_institution: '공공기관', government: '공무원·행정기관', other: '기타 기관' } as const;
export const COMPANY_TAGS = { startup: '스타트업', foreign_owned: '외국계', listed: '상장기업' } as const;
export const COMPANY_FIELDS = 'id,slug,name,source_system,source_url,source_updated_on,checked_on,website_url';
export const COMPANY_SELECT = `${COMPANY_FIELDS},company_classifications(dimension,value,source_url,reference_date),company_rankings(ranking_year,position,basis,publisher,source_url,reference_date)`;
export interface Classification { dimension: 'type' | 'tag' | 'industry' | 'region'; value: string; source_url: string; reference_date: string }
export interface Ranking { ranking_year: number; position: number; basis: string; publisher: string; source_url: string; reference_date: string }
export interface Company { id: string; slug: string; name: string; source_system: string; source_url: string; source_updated_on: string; checked_on: string; website_url: string | null; company_classifications: Classification[]; company_rankings: Ranking[] }
export function classificationLabel(fact: Classification): string {
 if(fact.dimension === 'type') return COMPANY_TYPES[fact.value as keyof typeof COMPANY_TYPES] ?? '분류 확인 중';
 if(fact.dimension === 'tag') return COMPANY_TAGS[fact.value as keyof typeof COMPANY_TAGS] ?? fact.value;
 return fact.value;
}
export function safeExternalUrl(value: string | null): string | null {
 if(!value) return null;
 try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export const LEGACY_COMPANY_NAMES: Record<string,string> = { samsung:'삼성전자',kakao:'카카오',naver:'네이버',coupang:'쿠팡',kakaobank:'카카오뱅크',krafton:'크래프톤',woori:'우리은행',hyundai:'현대자동차' };
