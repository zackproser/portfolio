import { getVectorDatabasesFromDb, getDataQualitySummaryFromDb } from "@/lib/vector-database-service"
import { getDatabases } from "@/lib/getDatabases"
import { DatabaseComparisonTool } from "@/app/vectordatabases/DatabaseComparisonTool"
import { ChatInterface } from "@/components/chat-interface"
import VectorDatabasesWrapper from "./vectordatabases-wrapper"

// Use dynamic rendering to fetch fresh data from database
export const dynamic = 'force-dynamic'

export default async function Page() {
  // Try to fetch from database first, fall back to static data
  let databases;
  let dataQuality;

  try {
    databases = await getVectorDatabasesFromDb();
    dataQuality = await getDataQualitySummaryFromDb();
  } catch (error) {
    // Fall back to static data if database is unavailable
    console.warn('Database unavailable, using static data:', error);
    databases = getDatabases();
    dataQuality = null;
  }

  return (
    <VectorDatabasesWrapper dataQuality={dataQuality}>
      <DatabaseComparisonTool databases={databases} />
      <ChatInterface />
    </VectorDatabasesWrapper>
  )
}
