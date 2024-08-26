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
      <h2 className="text-2xl font-bold mt-8 mb-4">Growth compared</h2>
      <p>Let&apos;s start by breaking down the key metrics of each tool. You can hover over the chart for more information.</p>
      <BarCharts selectedTools={[tool1, tool2]} />
      <h2 className="text-2xl font-bold mt-8 mb-4">Summary</h2>
      {proseParagraphs.map((paragraph, index) => (
        <React.Fragment key={index}>
          {paragraph ? <p>{paragraph}</p> : <br />}
          {index === 3 && (
            <NewsletterWrapper 
              className="mt-4 p-4 max--2xl mx-auto"
              title="The straight dope.  Which AI tools are the future and which are on their way out?"
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