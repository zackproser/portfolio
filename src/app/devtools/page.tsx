import { Metadata } from 'next'
import DevToolsPageClient from './DevToolsPageClient'
import { getTools } from '@/lib/getTools'
import { createMetadata } from '@/utils/createMetadata'

export const metadata: Metadata = createMetadata({
  title: 'AI-Assisted Developer Tools Compared',
  description: 'Compare different AI-assisted developer tools to find the best fit for your needs',
});

export default function DevToolsPage() {
  const tools = getTools()
  return <DevToolsPageClient initialTools={tools} />
}