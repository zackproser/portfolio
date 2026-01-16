import { getDatabases } from "@/lib/getDatabases"
import { DatabaseComparisonTool } from "@/app/vectordatabases/DatabaseComparisonTool"
import { ChatInterface } from "@/components/chat-interface"
import VectorDatabasesWrapper from "./vectordatabases-wrapper"

export default function Page() {
  const databases = getDatabases();

  return (
    <VectorDatabasesWrapper>
      <DatabaseComparisonTool databases={databases} />
      <ChatInterface />
    </VectorDatabasesWrapper>
  )
}
