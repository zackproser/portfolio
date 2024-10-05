import { Metadata } from 'next'
import DevToolsPageClient from './DevToolsPageClient'
import { getTools } from '@/lib/getTools'

export const metadata: Metadata = {
  title: 'AI-Assisted Developer Tools',
  description: 'Compare different AI-assisted developer tools to find the best fit for your needs',
}

export default function DevToolsPage() {
  const tools = getTools()
  return <DevToolsPageClient initialTools={tools} />
}