import { Container } from '@/components/Container'
import { Users, Sparkles, CheckCircle2 } from 'lucide-react'

export function NewsletterSocialProof() {
  return (
    <section className="py-24 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-white text-slate-900 shadow-2xl dark:border-blue-400/30 dark:bg-gradient-to-br dark:from-blue-900/70 dark:via-indigo-900/60 dark:to-purple-900/70 dark:text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 dark:hidden" aria-hidden="true" />
          <div className="absolute inset-0 hidden bg-gradient-to-br from-blue-950 via-slate-950 to-indigo-950 opacity-90 dark:block" aria-hidden="true" />
          <div className="absolute -top-24 -right-24 hidden h-64 w-64 rounded-full bg-blue-500/30 blur-3xl dark:block" aria-hidden="true" />
          <div className="absolute -bottom-24 -left-24 hidden h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl dark:block" aria-hidden="true" />

          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20">
            <div className="flex flex-col items-center gap-5 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-blue-900 dark:bg-blue-500/20 dark:text-blue-100">
                <Sparkles className="h-4 w-4" />
                Why Subscribe?
              </span>

              <h2 className="text-4xl font-extrabold leading-tight text-blue-900 sm:text-5xl dark:text-white">
                Join 3,000+ Engineers Reading the Newsletter
              </h2>

              <p className="max-w-3xl text-lg md:text-xl text-slate-600 dark:text-blue-100/80">
                Trusted by senior ICs, founders, and AI teams shipping production systems. Every issue distills what&apos;s working right now--tools, architectures, and workflows you can apply immediately.
              </p>

              <div className="mt-12 grid w-full gap-8 md:grid-cols-3">
                <div className="rounded-2xl border border-blue-200 bg-white p-6 text-left shadow-lg dark:border-blue-400/40 dark:bg-blue-900/30">
                  <Users className="mb-4 h-10 w-10 text-blue-600 dark:text-blue-200" />
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-white">Engineer-First Insights</h3>
                  <p className="mt-2 text-slate-600 dark:text-blue-100/80">
                    Built for builders. Concrete tactics, stack breakdowns, and live demos from real client work.
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-200 bg-white p-6 text-left shadow-lg dark:border-blue-400/40 dark:bg-blue-900/30">
                  <CheckCircle2 className="mb-4 h-10 w-10 text-emerald-600 dark:text-emerald-200" />
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-white">Actionable Systems</h3>
                  <p className="mt-2 text-slate-600 dark:text-blue-100/80">
                    Repeatable playbooks for RAG pipelines, eval harnesses, agent orchestration, and developer tooling.
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-200 bg-white p-6 text-left shadow-lg dark:border-blue-400/40 dark:bg-blue-900/30">
                  <Sparkles className="mb-4 h-10 w-10 text-purple-600 dark:text-violet-200" />
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-white">Signals Before Hype</h3>
                  <p className="mt-2 text-slate-600 dark:text-blue-100/80">
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
