import type { Metadata } from "next"
import AITrainingClientPage from "./AITrainingClientPage"

export const metadata: Metadata = {
  title: "AI Engineer Training Program | Ship AI Features in 90 Days",
  description: "Comprehensive training program for development teams to build and deploy production-ready AI features in 90 days or your money back.",
  openGraph: {
    title: "AI Engineer Training Program | Ship AI Features in 90 Days",
    description: "Comprehensive training program for development teams to build and deploy production-ready AI features in 90 days or your money back.",
    images: [{ url: "/og-ai-training.png" }],
  },
}

export default function AITrainingPage() {
  return <AITrainingClientPage />
} 