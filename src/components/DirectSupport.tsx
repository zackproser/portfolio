import { Mail, CheckCircle2 } from 'lucide-react'

interface DirectSupportProps {
  title?: string
  description?: string
  bullets?: string[]
  hook?: string
}

export function DirectSupport({
  title = 'Direct Email Support',
  description = "Ask me your questions as you build. I’ll review issues, point you to the right patterns, and help you get to a working, production‑ready result.",
  bullets = [
    'Fast answers to unblock you',
    'Code-level guidance and patterns',
    'Included with purchase — no extra fees',
  ],
  hook = "Afraid you'll get stuck?",
}: DirectSupportProps) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-2xl bg-slate-50 p-8 ring-1 ring-slate-900/5 dark:bg-slate-800/60 dark:ring-white/10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="shrink-0">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-blue-500/40">
                <Mail className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">{hook}</p>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {title}
              </h3>
              <p className="mt-2 text-lg leading-7 text-slate-600 dark:text-slate-300">
                {description}
              </p>
              <ul className="mt-4 grid gap-2 text-slate-700 dark:text-slate-300">
                {bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


