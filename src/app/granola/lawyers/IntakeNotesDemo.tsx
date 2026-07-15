'use client'

import { useState } from 'react'

type DemoView = 'consult' | 'record' | 'recheck'

const views: Array<{ id: DemoView; number: string; label: string }> = [
  { id: 'consult', number: '01', label: 'Consult snippet' },
  { id: 'record', number: '02', label: 'Intake record' },
  { id: 'recheck', number: '03', label: 'Live re-check' },
]

const recordFields = [
  {
    label: 'Matter',
    value: 'Potential services contract dispute',
  },
  {
    label: 'Key dates',
    value: 'Agreement signed April 2 · Delivery due May 15 · Renewal August 1',
  },
  {
    label: 'Amount',
    value: '$18,400 vendor invoice',
  },
  {
    label: 'Client ask',
    value: 'Assess the response and next communication before the renewal date',
  },
]

export default function IntakeNotesDemo() {
  const [view, setView] = useState<DemoView>('consult')

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
      <div className="border-b border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/70 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row" role="tablist" aria-label="Illustrative intake workflow">
          {views.map((item) => {
            const selected = view === item.id
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`intake-panel-${item.id}`}
                id={`intake-tab-${item.id}`}
                onClick={() => setView(item.id)}
                className={`flex flex-1 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                  selected
                    ? 'bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950'
                    : 'text-zinc-600 hover:bg-white hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
                }`}
              >
                <span className={`font-mono text-xs ${selected ? 'text-teal-300 dark:text-teal-700' : 'text-zinc-400'}`}>
                  {item.number}
                </span>
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="min-h-[430px] p-5 sm:p-8">
        <div
          role="tabpanel"
          id="intake-panel-consult"
          aria-labelledby="intake-tab-consult"
          hidden={view !== 'consult'}
          className="mx-auto max-w-3xl"
        >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                  Illustrative consult
                </p>
                <h3 className="mt-2 text-xl font-bold text-zinc-950 dark:text-white">Initial client intake</h3>
              </div>
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-950/30 dark:text-red-300 dark:ring-red-900">
                Capture on
              </span>
            </div>

            <div className="space-y-4 rounded-2xl bg-zinc-50 p-5 dark:bg-zinc-900 sm:p-6">
              <div className="grid grid-cols-[68px_1fr] gap-3 text-sm leading-6">
                <span className="font-semibold text-zinc-500">Client</span>
                <p className="text-zinc-800 dark:text-zinc-200">
                  I signed the services agreement on April 2. The vendor was supposed to deliver the final files by May 15.
                </p>
              </div>
              <div className="grid grid-cols-[68px_1fr] gap-3 text-sm leading-6">
                <span className="font-semibold text-zinc-500">Attorney</span>
                <p className="text-zinc-800 dark:text-zinc-200">What happened after the delivery date?</p>
              </div>
              <div className="grid grid-cols-[68px_1fr] gap-3 text-sm leading-6">
                <span className="font-semibold text-zinc-500">Client</span>
                <p className="text-zinc-800 dark:text-zinc-200">
                  The files never arrived, but they invoiced us for $18,400. I need to know what to send them before the agreement renews on August 1.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setView('record')}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-600"
            >
            View the intake record <span aria-hidden="true">→</span>
          </button>
        </div>

        <div
          role="tabpanel"
          id="intake-panel-record"
          aria-labelledby="intake-tab-record"
          hidden={view !== 'record'}
          className="mx-auto max-w-3xl"
        >
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                  Illustrative structured notes
                </p>
                <h3 className="mt-2 text-xl font-bold text-zinc-950 dark:text-white">New matter intake</h3>
              </div>
              <span className="text-xs text-zinc-500">Review before saving or sharing</span>
            </div>

            <dl className="grid gap-px overflow-hidden rounded-2xl bg-zinc-200 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-800 sm:grid-cols-2">
              {recordFields.map((field) => (
                <div key={field.label} className="bg-white p-5 dark:bg-zinc-950">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{field.label}</dt>
                  <dd className="mt-2 text-sm leading-6 text-zinc-900 dark:text-zinc-100">{field.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 rounded-2xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-900 dark:bg-teal-950/20">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-800 dark:text-teal-300">Action items</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-teal-950 dark:text-teal-100">
                <li>Request the signed agreement, invoice, and delivery correspondence from the client.</li>
                <li>Review delivery, renewal, and notice terms.</li>
                <li>Confirm the next client call before August 1.</li>
            </ul>
          </div>
        </div>

        <div
          role="tabpanel"
          id="intake-panel-recheck"
          aria-labelledby="intake-tab-recheck"
          hidden={view !== 'recheck'}
          className="mx-auto max-w-3xl"
        >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
              Illustrative live transcript query
            </p>
            <h3 className="mt-2 text-xl font-bold text-zinc-950 dark:text-white">Quietly confirm what you heard</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Ask the transcript for a detail while the consultation is still running. The answer should always be checked against the source transcript.
            </p>

            <div className="mt-8 space-y-4">
              <div className="ml-auto max-w-xl rounded-2xl rounded-br-md bg-zinc-950 px-5 py-4 text-sm text-white dark:bg-zinc-800">
                What amount did the client say the vendor invoiced?
              </div>
              <div className="max-w-xl rounded-2xl rounded-bl-md border border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">$18,400.</p>
                <p className="mt-2 border-l-2 border-teal-500 pl-3 text-sm italic leading-6 text-zinc-600 dark:text-zinc-400">
                  “The files never arrived, but they invoiced us for $18,400.”
                </p>
              </div>
            </div>

            <p className="mt-8 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/20 dark:text-amber-200 dark:ring-amber-900">
            Fictional example. Generated notes and answers depend on the meeting audio and your note template; verify dates, amounts, names, and legal facts before relying on them.
          </p>
        </div>
      </div>
    </div>
  )
}
