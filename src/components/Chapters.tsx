interface ChapterSection {
  title: string
  subsections?: string[]
}

interface ChaptersProps {
  sections: ChapterSection[]
  sectionTitle?: string
  sectionSubtitle?: string
}

export function Chapters({
  sections,
  sectionTitle = "What you'll learn",
  sectionSubtitle = 'A concise outline of the major sections in this product',
}: ChaptersProps) {
  if (!sections || sections.length === 0) return null

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {sectionTitle}
          </h2>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">{sectionSubtitle}</p>
        </div>

        <div className="mt-10 grid gap-6 sm:gap-8 lg:grid-cols-2">
          {sections.map((section, index) => (
            <div
              key={`${section.title}-${index}`}
              className="group rounded-2xl border border-slate-200/70 bg-white p-6 ring-1 ring-transparent transition-all hover:border-blue-200 hover:ring-blue-200 dark:border-slate-700/60 dark:bg-slate-900/40 dark:hover:border-blue-900/40"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm ring-1 ring-white/20 dark:ring-black/30">
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
                    {section.title}
                  </h3>
                  {section.subsections && section.subsections.length > 0 && (
                    <ul className="mt-3 grid gap-1 text-slate-700 dark:text-slate-300">
                      {section.subsections.map((s, i) => (
                        <li key={`${section.title}-${i}`} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400/80 group-hover:bg-blue-600" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


