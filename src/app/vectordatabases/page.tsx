import { getDatabases } from "@/lib/getDatabases"
import { DatabaseComparisonTool } from "@/app/vectordatabases/DatabaseComparisonTool"
import { ChatInterface } from "@/components/chat-interface"

export default function Page() {
  const databases = getDatabases();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-slate-900 dark:text-white">
          Vector Database Comparison
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
          Compare leading vector databases across company metrics, features, performance, security, algorithms, and
          capabilities
        </p>

        <DatabaseComparisonTool databases={databases} />
      </div>
      {/* Add the chat interface */}
      <ChatInterface />
    </main>
  )
}
