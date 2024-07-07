import { SimpleLayout } from '@/components/SimpleLayout'
import { getTools } from '@/lib/getTools'
import DevToolSearch from '@/components/DevToolSearch'

export default async function DevToolsIndex() {
  let tools = getTools()

  return (
    <SimpleLayout
      title="AI-Assisted Developer Tools"
      intro="Compare different AI-assisted developer tools to find the best fit for your needs"
    >
      <DevToolSearch tools={JSON.parse(JSON.stringify(tools))} />
    </SimpleLayout>
  )
}