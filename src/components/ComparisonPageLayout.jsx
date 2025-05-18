import React from 'react';
import ToolComparisonIntro from './ToolComparisonIntro';
import { BarCharts, BusinessInfo, DetailedComparison } from './AIToolComparison';
import NewsletterWrapper from './NewsletterWrapper';
import { ArticleLayout } from '@/components/ArticleLayout';

const ComparisonPageLayout = ({ tool1, tool2, proseParagraphs, metadata }) => {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">Growth compared</h2>
      <p>Let&apos;s start by breaking down the key metrics of each tool. You can hover over the chart for more information.</p>
      <BarCharts selectedTools={[tool1, tool2]} />
      <h2 className="text-2xl font-bold mt-8 mb-4">Summary</h2>
      {proseParagraphs.map((paragraph, index) => (
        <React.Fragment key={index}>
          {paragraph ? <p>{paragraph}</p> : <br />}
          {index === 3 && (
            <NewsletterWrapper 
              className="mt-6 mb-6 pt-6 pb-6 max--2xl mx-auto"
              title="The straight dope.  Which AI tools are the future and which are on their way out."
              body="Subscribe for the latest insights and comparisons in AI-assisted development."
            />
          )}
        </React.Fragment>
      ))}
      <BusinessInfo selectedTools={[tool1, tool2]} />
      <ToolComparisonIntro tool1={tool1.name} tool2={tool2.name} />
      <DetailedComparison className="mt-8 p-4 max-w-2xl mx-auto" tools={[tool1, tool2]} />
      <NewsletterWrapper 
        className="mt-8 p-4 max-w-2xl mx-auto"
        title="If you made it this far, you can do anything."
        body="Get honest reviews of AI-assisted development from someone who codes every day."
      />
    </ArticleLayout>
  );
};

export default ComparisonPageLayout;