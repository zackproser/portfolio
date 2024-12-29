import { getTools } from '@/lib/getTools';
import ComparePage from './ComparePage';

export async function generateMetadata(props) {
  const searchParams = await props.searchParams;
  const allTools = getTools();
  const selectedToolNames = searchParams.tools 
    ? searchParams.tools.split(',').map(name => name.trim())
    : [];
  const selectedTools = selectedToolNames.map(name => 
    allTools.find(tool => tool.name === name)
  ).filter(Boolean);

  const toolNames = selectedTools.length > 0
    ? selectedTools.map(tool => tool.name).join(', ')
    : 'Developer Tools';

  return {
    title: `Compare ${toolNames} - AI Developer Tools`,
    description: `Compare features and specifications of ${toolNames} for developers.`,
    openGraph: {
      title: `Compare ${toolNames} - Developer Tools Comparison`,
      description: `Compare features and specifications of ${toolNames} for developers.`,
      type: 'website',
      url: `https://zackproser.com/devtools/compare?tools=${selectedToolNames.join(',')}`,
      images: [
        {
          url: 'https://zackproser.com/api/og',
          width: 1200,
          height: 630,
          alt: 'Developer Tools Comparison',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Compare ${toolNames} - Developer Tools Comparison`,
      description: `Compare features and specifications of ${toolNames} for developers. Find the best tools for your development needs.`,
      images: ['https://zackproser.com/api/og/'],
    },
  };
}

export default async function Page(props) {
  const searchParams = await props.searchParams;
  const allTools = getTools();
  return <ComparePage searchParams={searchParams} allTools={allTools} />;
}