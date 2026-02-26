import type { Metadata } from "next"
import AITrainingClientPage from "./AITrainingClientPage"

export const metadata: Metadata = {
  title: "AI Training & Claude Cowork | Internal Skills Workshops & 90-Day Programs",
  description: "Hands-on AI training for engineering teams. Cloud internal skills workshops, co-working sessions, and structured 90-day programs. Build real AI workflows your team will actually use.",
  openGraph: {
    title: "AI Training & Claude Cowork | Internal Skills Workshops & 90-Day Programs",
    description: "Hands-on AI training for engineering teams. Cloud internal skills workshops, co-working sessions, and structured 90-day programs. Build real AI workflows your team will actually use.",
    images: [{ url: "/og-ai-training.png" }],
  },
}

export default function AITrainingPage() {
  return <AITrainingClientPage />
} 