import { getDatabases, getCategories, getFeatures } from '@/lib/getDatabases';
import ComparePageClient from './ComparePageClient';
import { Database } from '@/lib/shared-types';

export default function ComparePage({ searchParams }: { searchParams: { dbs?: string } }) {
  const allDatabases = getDatabases() as Database[];
  const categories = getCategories();
  const features = getFeatures();
  const selectedDbNames = searchParams.dbs ? searchParams.dbs.split(',') : [];
  const selectedDatabases = selectedDbNames
    .map(name => allDatabases.find((db) => db.name === name))
    .filter((db): db is Database => db !== undefined);

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