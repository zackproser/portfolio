import NewsletterAnalytics from "@/components/newsletter-admin/newsletter-analytics"

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-12 text-white">
        <h1 className="text-5xl font-bold mb-4">Newsletter Analytics</h1>
        <p className="text-xl opacity-80">Track and analyze your newsletter performance</p>
      </div>
      <NewsletterAnalytics />
    </div>
  )
} 