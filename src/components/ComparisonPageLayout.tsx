import React from 'react';
import type { Database } from '@/types/database';
// We might need to define these types or import them if they exist elsewhere
// For now, inline simple definitions based on getCategories/getFeatures from getDatabases.ts
import Image from 'next/image';
import { ProsConsDisplay } from './ProsConsDisplay';
import { ComparisonSummaryTable } from './ComparisonSummaryTable';
// import { DetailedFeatureComparison } from './DetailedFeatureComparison'; // Placeholder for now
import { ArticleLayout } from './ArticleLayout'; // Or use a more basic wrapper
import CrossLinkCallout from './CrossLinkCallout'; // Existing component

// Define simple types for Category and Feature for now
// These would ideally come from a shared types file and match getCategories/getFeatures return structure
interface CategoriesFromLib {
  [key: string]: {
    description: string;
    importance: string;
  };
}

interface FeaturesFromLib {
  [key: string]: {
    description: string;
  };
}
interface ComparisonPageLayoutProps {
  db1: Database | any;
  db2: Database | any;
  categories?: CategoriesFromLib;
  features?: FeaturesFromLib;
  metadata: any; // For ArticleLayout or SEO
  children?: React.ReactNode; // To pass through MDX content if any
  tool1?: any; // For tool comparisons
  tool2?: any; // For tool comparisons
  proseParagraphs?: string[]; // For tool comparisons
}

export const ComparisonPageLayout: React.FC<ComparisonPageLayoutProps> = ({
  db1,
  db2,
  categories,
  features,
  metadata,
  children,
  tool1,
  tool2,
  proseParagraphs
}) => {
  // Use tools data if provided, otherwise use database data
  const item1 = tool1 || db1;
  const item2 = tool2 || db2;

  // Handle missing data gracefully
  if (!item1 || !item2) {
    return (
      <ArticleLayout metadata={metadata}>
        <div className="container mx-auto px-4 py-8">
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-md text-yellow-700 dark:text-yellow-200">
            <p><strong>Error:</strong> Missing data for comparison. Please check the page configuration.</p>
          </div>
          {children}
        </div>
      </ArticleLayout>
    );
  }

  // Placeholder for logo fetching logic - assuming logoId maps to a path in /public/images/logos/ or similar
  // Add fallbacks for missing logoId
  const item1Logo = item1.logoId ? `/images/logos/${item1.logoId}.svg` : 
                   (item1.icon ? (item1.icon.startsWith('@') ? item1.icon.substring(2) : item1.icon) : '/images/placeholder-logo.svg');
  const item2Logo = item2.logoId ? `/images/logos/${item2.logoId}.svg` : 
                   (item2.icon ? (item2.icon.startsWith('@') ? item2.icon.substring(2) : item2.icon) : '/images/placeholder-logo.svg');

  return (
    <ArticleLayout metadata={metadata}> {/* Using ArticleLayout as the base for now */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Top Section: Logos and Title */}
        <header className="mb-8 text-center">
          <div className="flex justify-center items-center space-x-8 mb-4">
            {/* Ensure images are not too large - adjust w-h as needed */}
            <div className="w-20 h-20 md:w-24 md:h-24 relative"><Image src={item1Logo} alt={`${item1.name} logo`} layout="fill" objectFit="contain" /></div>
            <span className="text-3xl md:text-4xl font-bold">vs</span>
            <div className="w-20 h-20 md:w-24 md:h-24 relative"><Image src={item2Logo} alt={`${item2.name} logo`} layout="fill" objectFit="contain" /></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{`${item1.name} vs ${item2.name}`}</h1>
          <p className="text-md md:text-lg text-gray-600 dark:text-gray-400">
            A detailed comparison to help you choose the best {categories ? 'vector database' : 'tool'} for your needs.
          </p>
        </header>

        {categories && (
          <div className="mb-8">
            <CrossLinkCallout
              title="Compare Vector Databases Dynamically"
              description={`Use my interactive tool to compare ${item1.name}, ${item2.name}, and other vector databases side by side.`}
              linkText={`Compare ${item1.name} and ${item2.name} now`}
              linkHref={`/vectordatabases/compare?dbs=${encodeURIComponent(item1.name)},${encodeURIComponent(item2.name)}`}
              variant="info"
            />
          </div>
        )}

        {/* Prose paragraphs for tool comparisons */}
        {proseParagraphs && proseParagraphs.length > 0 && (
          <section className="my-8 prose dark:prose-invert max-w-none">
            {proseParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </section>
        )}

        {/* At-a-Glance Summary */}
        {categories && <ComparisonSummaryTable db1={item1} db2={item2} />}

        {/* Pros and Cons Section */}
        {(item1.pros || item2.pros || item1.cons || item2.cons) && (
          <section className="my-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-center md:text-left">{item1.name}</h3>
                <ProsConsDisplay database={item1} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-center md:text-left">{item2.name}</h3>
                <ProsConsDisplay database={item2} />
              </div>
            </div>
          </section>
        )}
        
        {/* MDX Content (if any passed down from the page) */}
        {children && <div className="prose dark:prose-invert max-w-none my-8">{children}</div>}

        {/* Detailed Feature Comparison (Placeholder for now) */}
        {categories && features && (
          <section className="my-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Detailed Feature Comparison</h2>
            {/* <DetailedFeatureComparison db1={item1} db2={item2} categories={categories} features={features} /> */}
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-md text-yellow-700 dark:text-yellow-200">
              <p><strong>Note:</strong> The detailed feature-by-feature breakdown component is under construction. The existing accordion-style comparison will be shown below for now until this new section is complete.</p>
            </div>
          </section>
        )}

        {/* TODO: Eventually, the old VectorDBComparison component or its refactored version (DetailedFeatureComparison)
             will be placed here. For now, the MDX generated by the script will still include
             the old <VectorDBComparison ... /> call, which will appear after this layout's content.
             We'll address this when we modify the script.
        */}

      </div>
    </ArticleLayout>
  );
}; 