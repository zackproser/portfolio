import type { Metadata } from "next"
import { Calculator } from "@/components/calculator"

export const metadata: Metadata = {
  title: "Project Cost Calculator | Next.js & AI Development",
  description: "Calculate the cost of your custom Next.js and AI development project with our interactive pricing calculator.",
  openGraph: {
    title: "Project Cost Calculator | Next.js & AI Development",
    description: "Calculate the cost of your custom Next.js and AI development project with our interactive pricing calculator.",
    images: [{ url: "/og-calculator.png" }],
  },
}

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Custom Next.js Development Calculator</h1>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
            Build your custom Next.js project with our expertise in Generative AI applications and RAG chatbots deployed
            on Vercel.
          </p>
        </div>

        <Calculator />
      </div>
    </main>
  )
} 