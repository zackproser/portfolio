import { getDatabases, getCategories, getFeatures } from '@/lib/getDatabases';
import ComparePageClient from './ComparePageClient';

export default function ComparePage({ searchParams }: { searchParams: { dbs?: string } }) {
  const allDatabases = getDatabases();
  const categories = getCategories();
  const features = getFeatures();
  const selectedDbNames = searchParams.dbs ? searchParams.dbs.split(',') : [];
  const selectedDatabases = selectedDbNames.map(name => allDatabases.find(db => db.name === name)).filter(Boolean);

  return (
    <ComparePageClient 
      allDatabases={allDatabases}
      categories={categories}
      features={features}
      selectedDatabases={selectedDatabases}
      selectedDbNames={selectedDbNames}
    />
  );
}
