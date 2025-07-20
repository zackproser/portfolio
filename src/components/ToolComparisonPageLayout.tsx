import React from 'react';
import { ArticleLayout } from './ArticleLayout'; // Intentionally not commenting this out
// import Image from 'next/image'; // Keep commented if not used in debug view
import type { ExtendedMetadata } from '@/types'; // Import ExtendedMetadata

// Define a basic type for the tool. You'll likely want to expand this based on your actual JSON structure.
interface AiTool {
  name: string;
  logoId?: string; // Example property
  // Add other properties that might be in your tool1/tool2 objects from the JSON
  // For instance, if your JSON has `homepage_link` for tools:
  homepage_link?: string;
  documentation_link?: string;
}

interface ToolComparisonPageLayoutProps {
  tool1: AiTool;
  tool2: AiTool;
  proseParagraphs: string[]; // Array of HTML strings
  metadata: ExtendedMetadata; // Use ExtendedMetadata type
}

export const ToolComparisonPageLayout: React.FC<ToolComparisonPageLayoutProps> = ({
  tool1,
  tool2,
  proseParagraphs,
  metadata,
}) => {
  const enableDebugView = true; // Set to false to render original content

  if (enableDebugView) {
    return (
      <div>
        <h1>Testing Layout: {metadata.title || `${tool1.name} vs ${tool2.name}`}</h1>
        <p>ToolComparisonPageLayout is rendering.</p>
        <hr />
        <h3>Metadata:</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#f0f0f0', padding: '10px' }}>
          {JSON.stringify(metadata, null, 2)}
        </pre>
        <hr />
        <h3>Tool 1:</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#f0f0f0', padding: '10px' }}>
          {JSON.stringify(tool1, null, 2)}
        </pre>
        <hr />
        <h3>Tool 2:</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#f0f0f0', padding: '10px' }}>
          {JSON.stringify(tool2, null, 2)}
        </pre>
        <hr />
        <h3>Prose Paragraphs:</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#f0f0f0', padding: '10px' }}>
          {JSON.stringify(proseParagraphs, null, 2)}
        </pre>
      </div>
    );
  }

  // Original content (will only be reached if enableDebugView is false)
  // const tool1Logo = tool1.logoId ? `/images/logos/tools/${tool1.logoId}.svg` : '/images/placeholder-logo.svg';
  // const tool2Logo = tool2.logoId ? `/images/logos/tools/${tool2.logoId}.svg` : '/images/placeholder-logo.svg';

  return (
    <ArticleLayout metadata={metadata}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          {/* Optional: Display tool logos if you have them and want to show them
          <div className="flex justify-center items-center space-x-8 mb-4">
            <div className="w-20 h-20 md:w-24 md:h-24 relative">
              {tool1.logoId && <Image src={tool1Logo} alt={`${tool1.name} logo`} fill style={{ objectFit: "contain" }} />}
            </div>
            <span className="text-3xl md:text-4xl font-bold">vs</span>
            <div className="w-20 h-20 md:w-24 md:h-24 relative">
              {tool2.logoId && <Image src={tool2Logo} alt={`${tool2.name} logo`} fill style={{ objectFit: "contain" }} />}
            </div>
          </div>
          */}
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{metadata.title || `${tool1.name} vs ${tool2.name}`}</h1>
          {metadata.description && (
            <p className="text-md md:text-lg text-gray-600 dark:text-gray-400">
              {metadata.description}
            </p>
          )}
        </header>

        <div className="prose dark:prose-invert max-w-none my-8">
          {proseParagraphs.map((paragraph, index) => (
            // Assuming paragraphs are HTML strings. If plain text, use <p>{paragraph}</p>
            <div key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}
        </div>
        
        {/* Optional: Links section for tools */}
        {(tool1.homepage_link || tool1.documentation_link || tool2.homepage_link || tool2.documentation_link) && (
          <section className="my-8">
            <h2 className="text-2xl font-semibold mb-4">Links</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {(tool1.homepage_link || tool1.documentation_link) && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">{tool1.name}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {tool1.homepage_link && <li><a href={tool1.homepage_link} target="_blank" rel="noopener noreferrer">Homepage</a></li>}
                    {tool1.documentation_link && <li><a href={tool1.documentation_link} target="_blank" rel="noopener noreferrer">Documentation</a></li>}
                  </ul>
                </div>
              )}
              {(tool2.homepage_link || tool2.documentation_link) && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">{tool2.name}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {tool2.homepage_link && <li><a href={tool2.homepage_link} target="_blank" rel="noopener noreferrer">Homepage</a></li>}
                    {tool2.documentation_link && <li><a href={tool2.documentation_link} target="_blank" rel="noopener noreferrer">Documentation</a></li>}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </ArticleLayout>
  );
}; 