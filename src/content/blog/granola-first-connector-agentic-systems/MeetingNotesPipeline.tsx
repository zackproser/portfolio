'use client'

import { useState, type ReactNode } from 'react'

type TransformationKey = 'post' | 'actions' | 'email'

type Transformation = {
  label: string
  command: string
  eyebrow: string
  title: string
  body: ReactNode
}

const transformations: Record<TransformationKey, Transformation> = {
  post: {
    label: 'Draft a post',
    command: '@blog bot, draft a post',
    eyebrow: 'Draft artifact',
    title: 'Meeting notes are source material for agents',
    body: (
      <div className="space-y-3">
        <p>
          Most agent workflows begin with a prompt someone has to write. A meeting already contains the
          prompt: the problem, the constraints, the decisions, and the language people used to explain
          them.
        </p>
        <p>
          Route that record into an agent as soon as the call ends and it can produce a reviewable draft
          while the context is still current.
        </p>
      </div>
    ),
  },
  actions: {
    label: 'Extract action items',
    command: '@ops bot, extract action items',
    eyebrow: 'Structured task output',
    title: '3 action items found',
    body: (
      <ul className="space-y-3">
        <li className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-950">
          <span className="font-medium text-zinc-950 dark:text-zinc-100">Zachary</span>
          <span className="text-zinc-500 dark:text-zinc-400"> · before publishing</span>
          <p className="mt-1">Review the draft for technical accuracy.</p>
        </li>
        <li className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-950">
          <span className="font-medium text-zinc-950 dark:text-zinc-100">Maya</span>
          <span className="text-zinc-500 dark:text-zinc-400"> · Friday</span>
          <p className="mt-1">Add post, ticket, and email destinations to the router.</p>
        </li>
        <li className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-950">
          <span className="font-medium text-zinc-950 dark:text-zinc-100">Agent</span>
          <span className="text-zinc-500 dark:text-zinc-400"> · next run</span>
          <p className="mt-1">Attach source notes to every generated artifact.</p>
        </li>
      </ul>
    ),
  },
  email: {
    label: 'Write the follow-up email',
    command: '@follow-up bot, write the email',
    eyebrow: 'Email draft',
    title: 'Subject: Agent output routing — decisions and next steps',
    body: (
      <div className="space-y-3">
        <p>Hi team,</p>
        <p>
          We agreed to treat the meeting record as source material and route it into three initial output
          types: a post draft, owned action items, and a follow-up email.
        </p>
        <p>
          Maya will add those destinations by Friday. I will review the technical claims before anything
          is published. Generated artifacts will retain a link back to the source notes.
        </p>
        <p>Zachary</p>
      </div>
    ),
  },
}

const pipelineSteps = [
  { number: '01', label: 'Call', detail: 'Conversation ends' },
  { number: '02', label: 'Granola', detail: 'Notes + transcript' },
  { number: '03', label: 'Connector', detail: 'Typed handoff' },
  { number: '04', label: 'Agent', detail: 'Reviewable artifact' },
]

export default function MeetingNotesPipeline() {
  const [activeKey, setActiveKey] = useState<TransformationKey>('post')
  const active = transformations[activeKey]

  return (
    <section
      aria-labelledby="pipeline-demo-title"
      className="my-10 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 text-zinc-100 shadow-xl shadow-zinc-950/10 dark:border-zinc-700"
    >
      <div className="border-b border-zinc-800 bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.14),_transparent_42%)] px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
              Interactive architecture sketch
            </p>
            <h2 id="pipeline-demo-title" className="mb-0 mt-2 text-xl font-semibold text-white sm:text-2xl">
              Call → notes → agent
            </h2>
          </div>
          <span className="w-fit rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
            Illustrative data
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {pipelineSteps.map((step, index) => (
            <div key={step.number} className="relative rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-amber-400">{step.number}</span>
                <span className="text-sm font-semibold text-white">{step.label}</span>
              </div>
              <p className="mb-0 mt-1 text-xs text-zinc-500">{step.detail}</p>
              {index < pipelineSteps.length - 1 ? (
                <span className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 text-zinc-600 lg:block" aria-hidden="true">
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-zinc-800 p-5 sm:p-7 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Source note</p>
            <span className="font-mono text-[11px] text-emerald-400">meeting.complete</span>
          </div>

          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="border-b border-zinc-800 pb-3">
              <p className="m-0 font-semibold text-white">Content system routing</p>
              <p className="mb-0 mt-1 text-xs text-zinc-500">31 min · Zachary, Maya · Illustrative</p>
            </div>

            <div className="mt-4 space-y-4 text-sm leading-6 text-zinc-300">
              <div>
                <p className="m-0 text-xs font-semibold uppercase tracking-wide text-amber-400">Decision</p>
                <p className="mb-0 mt-1">Use the meeting record as source material for agent outputs.</p>
              </div>
              <div>
                <p className="m-0 text-xs font-semibold uppercase tracking-wide text-amber-400">First outputs</p>
                <p className="mb-0 mt-1">Post draft, owned action items, and follow-up email.</p>
              </div>
              <div>
                <p className="m-0 text-xs font-semibold uppercase tracking-wide text-amber-400">Constraint</p>
                <p className="mb-0 mt-1">Keep a human review step before publishing or sending.</p>
              </div>
              <div>
                <p className="m-0 text-xs font-semibold uppercase tracking-wide text-amber-400">Owners</p>
                <p className="mb-0 mt-1">Maya: routing by Friday. Zachary: technical review.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Choose an agent task</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3" role="tablist" aria-label="Agent transformations">
            {(Object.keys(transformations) as TransformationKey[]).map((key) => {
              const item = transformations[key]
              const selected = key === activeKey

              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="agent-transformation-output"
                  onClick={() => setActiveKey(key)}
                  className={`rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                    selected
                      ? 'border-amber-400/70 bg-amber-400/10 text-amber-200'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          <div className="mt-4 rounded-lg border border-zinc-800 bg-black/30 px-3 py-2 font-mono text-xs text-emerald-400">
            <span className="mr-2 text-zinc-600">›</span>
            {active.command}
          </div>

          <div
            id="agent-transformation-output"
            role="tabpanel"
            aria-live="polite"
            className="mt-4 min-h-[290px] rounded-xl border border-zinc-700 bg-zinc-100 p-4 text-sm leading-6 text-zinc-700 shadow-inner sm:p-5 dark:bg-zinc-100 dark:text-zinc-700"
          >
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">{active.eyebrow}</p>
            <h3 className="mb-4 mt-2 text-base font-semibold leading-6 text-zinc-950">{active.title}</h3>
            {active.body}
          </div>
        </div>
      </div>
    </section>
  )
}
