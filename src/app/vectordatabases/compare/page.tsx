import { Metadata } from 'next'
import { Database } from '@/types';
import { getDatabases, getCategories, getFeatures } from '@/lib/getDatabases';
import ComparePageClient from './ComparePageClient';

export default async function ComparePage(props: { searchParams: Promise<{ dbs?: string }> }) {
  const searchParams = await props.searchParams;
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
