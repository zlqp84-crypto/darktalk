"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { COMPANY_SELECT, COMPANY_TYPES, COMPANY_TAGS, classificationLabel, type Company } from '@/lib/companies';
import styles from './company.module.css';

const initial = { query: '', type: '', tag: '', industry: '', region: '', year: '' };
export default function CompanyDirectory({ initialQuery = '' }: { initialQuery?: string }) {
  const [draft, setDraft] = useState({ ...initial, query: initialQuery });
  const [filters, setFilters] = useState({ ...initial, query: initialQuery });
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    async function fetchCompanies() {
      setLoading(true); setError(false);
      const { data, error } = await supabase.rpc('search_companies', {
        p_query: filters.query.trim(), p_type: filters.type, p_tag: filters.tag,
        p_industry: filters.industry.trim(), p_region: filters.region.trim(),
        p_ranking_year: filters.year ? Number(filters.year) : null, p_offset: page * 24,
      }).select(COMPANY_SELECT);
      if (!active) return;
      setRows(error ? [] : (data as unknown as Company[]) ?? []);
      setError(!!error); setLoading(false);
    }
    void fetchCompanies();
    return () => { active = false; };
  }, [filters, page, retry]);
  const hasFilters = Object.values(filters).some(Boolean);
  return <><Header /><main className={styles.main}>
    <section className={styles.hero}>
      <div className={styles.eyebrow}>COMPANY DIRECTORY</div>
      <h1>회사와 기관, 기준을 보고 찾으세요</h1>
      <p>기업·공공기관·행정기관의 기본정보와 분류 출처를 확인하세요.<br />리뷰와 평점은 실제 작성된 정보가 있을 때만 제공합니다.</p>
    </section>
    <form className={styles.filters} onSubmit={e => { e.preventDefault(); setPage(0); setFilters({ ...draft }); }}>
      <div className={styles.search}>
        <input aria-label="회사·기관명" placeholder="회사 또는 기관 이름을 검색하세요" maxLength={100} value={draft.query} onChange={e => setDraft({ ...draft, query: e.target.value })} />
        <button className={styles.button} type="submit">검색</button>
      </div>
      <div className={styles.filterGrid}>
        <label>회사·기관 유형<select value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value })}><option value="">전체 유형</option>{Object.entries(COMPANY_TYPES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
        <label>추가 태그<select value={draft.tag} onChange={e => setDraft({ ...draft, tag: e.target.value })}><option value="">전체 태그</option>{Object.entries(COMPANY_TAGS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
        <label>국내 1,000대 기업 기준연도<input type="number" min={2000} max={2100} placeholder="전체 · 연도 입력 시 순위 필터" value={draft.year} onChange={e => setDraft({ ...draft, year: e.target.value })} /></label>
        <label>업종<input placeholder="등록된 업종명" maxLength={100} value={draft.industry} onChange={e => setDraft({ ...draft, industry: e.target.value })} /></label>
        <label>지역<input placeholder="예: 서울" maxLength={100} value={draft.region} onChange={e => setDraft({ ...draft, region: e.target.value })} /></label>
      </div>
      <div className={styles.note}>분류와 순위는 출처가 확인된 항목만 검색됩니다. 순위의 기준·발행기관은 상세 화면에 표시합니다.</div>
      {hasFilters && <button type="button" className={styles.button} onClick={() => { setDraft(initial); setFilters(initial); setPage(0); }}>필터 초기화</button>}
    </form>
    {loading ? <div role="status" className={styles.empty}>회사·기관 정보를 불러오고 있습니다.</div> : error ? <div role="alert" className={styles.error}>목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요. <button className={styles.button} onClick={() => setRetry(retry + 1)}>다시 시도</button></div> : rows.length === 0 ? <div className={styles.empty}><strong>{hasFilters ? '조건에 맞는 회사·기관이 없습니다.' : '회사·기관 정보를 준비하고 있습니다.'}</strong><p className={styles.note}>{hasFilters ? '검색어를 줄이거나 분류 조건을 변경해보세요.' : '출처가 확인된 정보부터 등록합니다. 확인되지 않은 평점이나 연봉은 표시하지 않습니다.'}</p></div> : <div className={styles.grid}>{rows.slice(0, 24).map(company => <Link className={styles.card} key={company.id} href={`/company/${company.slug}`}>
      <h2>{company.name}</h2><div className={styles.badges}>
        {!company.company_classifications.some(f => f.dimension === 'type') && <span className={styles.badge}>분류 확인 중</span>}
        {company.company_classifications.map(f => <span className={styles.badge} key={`${f.dimension}-${f.value}`}>{classificationLabel(f)}</span>)}
      </div><p className={styles.note}>기본정보 확인일 {company.checked_on}<br />리뷰 작성·승인 후 본문 열람</p><span className={styles.source}>기본정보 및 출처 보기 →</span>
    </Link>)}</div>}
    {!loading && !error && (page > 0 || rows.length > 24) && <nav aria-label="회사 목록 페이지" className={styles.pager}><button className={styles.button} disabled={page === 0} onClick={() => setPage(page - 1)}>이전</button><span>{page + 1}페이지</span><button className={styles.button} disabled={rows.length <= 24} onClick={() => setPage(page + 1)}>다음</button></nav>}
  </main><Footer /></>;
}
