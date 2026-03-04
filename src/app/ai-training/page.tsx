import type { Metadata } from "next"
import AITrainingClientPage from "./AITrainingClientPage"

export const metadata: Metadata = {
  title: "AI Training for Engineering Teams | Claude Cowork & Internal Skills Workshops",
  description: "Hands-on AI training that turns strong engineers into faster ones. Claude Cowork sessions, Internal Skills workshops, and full 90-day programs. Your stack, your problems, real code.",
  openGraph: {
    title: "AI Training for Engineering Teams | Claude Cowork & Internal Skills Workshops",
    description: "Hands-on AI training that turns strong engineers into faster ones. Claude Cowork sessions, Internal Skills workshops, and full 90-day programs. Your stack, your problems, real code.",
    images: [{ url: "/og-ai-training.png" }],
  },
}

export default function AITrainingPage() {
  return <AITrainingClientPage />
} 
