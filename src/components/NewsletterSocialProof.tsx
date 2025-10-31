import { Container } from '@/components/Container'
import { Users, Sparkles, CheckCircle2 } from 'lucide-react'

export function NewsletterSocialProof() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-950 via-gray-900 to-indigo-900 dark:from-gray-950 dark:via-blue-950/80 dark:to-indigo-950/80 text-white">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-blue-400/30 bg-gradient-to-br from-blue-900/70 via-indigo-900/50 to-purple-900/70 shadow-2xl">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" aria-hidden="true" />

          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-blue-100">
                <Sparkles className="h-4 w-4" />
                Social Proof
              </span>

              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Join 3,000+ Engineers Reading the Newsletter
              </h2>

              <p className="max-w-3xl text-lg md:text-xl text-blue-100/80">
                Trusted by senior ICs, founders, and AI teams shipping production systems. Every issue distills what&apos;s working right now?tools, architectures, and workflows you can apply immediately.
              </p>

              <div className="mt-12 grid w-full gap-8 md:grid-cols-3">
                <div className="rounded-2xl border border-blue-400/40 bg-blue-900/30 p-6 text-left shadow-lg">
                  <Users className="mb-4 h-10 w-10 text-blue-200" />
                  <h3 className="text-xl font-semibold">Engineer-First Insights</h3>
                  <p className="mt-2 text-blue-100/80">
                    Built for builders. Concrete tactics, stack breakdowns, and live demos from real client work.
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-400/40 bg-blue-900/30 p-6 text-left shadow-lg">
                  <CheckCircle2 className="mb-4 h-10 w-10 text-emerald-200" />
                  <h3 className="text-xl font-semibold">Actionable Systems</h3>
                  <p className="mt-2 text-blue-100/80">
                    Repeatable playbooks for RAG pipelines, eval harnesses, agent orchestration, and developer tooling.
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-400/40 bg-blue-900/30 p-6 text-left shadow-lg">
                  <Sparkles className="mb-4 h-10 w-10 text-violet-200" />
                  <h3 className="text-xl font-semibold">Signals Before Hype</h3>
                  <p className="mt-2 text-blue-100/80">
                    Get the vetted experiments, benchmark data, and shipping patterns before they trend on social.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
