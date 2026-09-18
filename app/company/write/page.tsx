import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from '../company.module.css';
export default function CompanyWritePage() {
  return <><Header /><main className={styles.main}><section className={styles.empty}><h1>기업 리뷰 작성을 준비하고 있습니다.</h1><p className={styles.note}>현재는 회사·기관 목록과 기본정보를 먼저 제공합니다.<br />작성·승인·열람권 기능이 준비되면 안내하겠습니다.</p><Link className={styles.button} href="/company">회사·기관 찾아보기</Link></section></main><Footer /></>;
}
