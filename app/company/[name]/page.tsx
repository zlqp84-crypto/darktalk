"use client";
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { COMPANY_SELECT, LEGACY_COMPANY_NAMES, classificationLabel, safeExternalUrl, type Company } from '@/lib/companies';
import styles from '../company.module.css';
import CompanyReviews from '../CompanyReviews';
function Source({ url, children }: { url: string | null; children: React.ReactNode }) {
  const href = safeExternalUrl(url);
  return href ? <a className={styles.source} href={href} target="_blank" rel="noopener noreferrer">{children} ↗</a> : <span>{children}</span>;
}
export default function CompanyDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true); setError(false);
      const { data, error } = await supabase.from('companies').select(COMPANY_SELECT).eq('slug', name).maybeSingle();
      if (!active) return;
      setCompany(data as unknown as Company | null); setError(!!error); setLoading(false);
    }
    void load(); return () => { active = false; };
  }, [name]);
  const legacyName = LEGACY_COMPANY_NAMES[name];
  return <><Header /><main className={styles.main}>
    <Link className={styles.back} href="/company">← 회사·기관 목록</Link>
    {loading ? <div className={styles.empty} role="status">기본정보를 불러오고 있습니다.</div> : error ? <div className={styles.error} role="alert">정보를 불러오지 못했습니다. 잠시 후 다시 접속해주세요.</div> : !company ? <div className={styles.empty}><h1>회사·기관 정보를 찾을 수 없습니다.</h1><p className={styles.note}>공식 정보를 확인한 회사부터 등록하고 있습니다.</p>{legacyName && <Link className={styles.source} href={`/company?q=${encodeURIComponent(legacyName)}`}>{legacyName} 검색하기</Link>}</div> : <>
      <section className={styles.hero}><div className={styles.eyebrow}>COMPANY / INSTITUTION</div><h1>{company.name}</h1><p>출처와 기준일을 함께 확인하는 기업·기관 정보</p></section>
      <section className={styles.card}><h2>기본정보</h2><dl className={styles.facts}>
        <dt>회사·기관명</dt><dd>{company.name}</dd>
        <dt>홈페이지</dt><dd>{safeExternalUrl(company.website_url) ? <Source url={company.website_url}>홈페이지 방문</Source> : '확인 중'}</dd>
        <dt>정보 출처</dt><dd><Source url={company.source_url}>{company.source_system === 'dart' ? '금융감독원 DART' : '원문 확인'}</Source></dd>
        <dt>출처 변경일</dt><dd>{company.source_updated_on}</dd><dt>정보 확인일</dt><dd>{company.checked_on}</dd>
      </dl></section>
      <section className={`${styles.card} ${styles.section}`}><h2>유형·업종·지역</h2>
        {!company.company_classifications.some(f => f.dimension === 'type') && <p className={styles.note}>회사·기관 유형은 확인 중입니다. 상장 여부만으로 대기업·중견기업을 판단하지 않습니다.</p>}
        {company.company_classifications.map(f => <p key={`${f.dimension}-${f.value}`}><span className={styles.badge}>{classificationLabel(f)}</span> <span className={styles.note}>{f.reference_date} 기준 · </span><Source url={f.source_url}>분류 근거</Source></p>)}
      </section>
      {company.company_rankings.length > 0 && <section className={`${styles.card} ${styles.section}`}><h2>국내 1,000대 기업</h2>{company.company_rankings.map(r => <p key={`${r.ranking_year}-${r.publisher}-${r.basis}`}><strong>{r.ranking_year}년 · {r.position}위</strong><br /><span className={styles.note}>{r.publisher} · {r.basis} · {r.reference_date} 기준</span><br /><Source url={r.source_url}>순위 출처</Source></p>)}</section>}
      <CompanyReviews companyId={company.id} />
    </>}
  </main><Footer /></>;
}
