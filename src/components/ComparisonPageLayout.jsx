import React from 'react';
import ToolComparisonIntro from './ToolComparisonIntro';
import { BarCharts, BusinessInfo, DetailedComparison } from './AIToolComparison';
import NewsletterWrapper from './NewsletterWrapper';
import { SimpleLayout }from '@/components/SimpleLayout'

const ComparisonPageLayout = ({ tool1, tool2, proseParagraphs }) => {
  return (
    <SimpleLayout
      title={`${tool1.name} vs ${tool2.name}`}
      intro="A detailed comparison of AI-assisted developer tools."
    >
      <ToolComparisonIntro tool1={tool1.name} tool2={tool2.name} />
      <h2 className="text-2xl font-bold mt-8 mb-4">Growth at a glance</h2>
      <p>Let's start by breaking down the key metrics of each tool.</p>
      <BarCharts selectedTools={[tool1, tool2]} />
      {proseParagraphs.map((paragraph, index) => (
        <React.Fragment key={index}>
          {paragraph ? <p>{paragraph}</p> : <br />}
          {index === 2 && (
            <NewsletterWrapper 
              title="Stay updated on AI dev tools"
              body="Subscribe for the latest insights and comparisons in AI-assisted development."
            />
          )}
        </React.Fragment>
      ))}
      <BusinessInfo selectedTools={[tool1, tool2]} />
      <DetailedComparison tools={[tool1, tool2]} />
    </SimpleLayout>
  );
};

export default ComparisonPageLayout;