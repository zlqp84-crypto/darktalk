import CompanyDirectory from './CompanyDirectory';

export default async function CompanyPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  const query = typeof q === 'string' ? q.slice(0, 100) : '';
  return <CompanyDirectory key={query} initialQuery={query} />;
}
