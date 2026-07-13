'use client'

import { useState } from 'react'

type CaptureMode = 'bot' | 'local'

const dialogue: Record<
  CaptureMode,
  Array<{ speaker: 'System' | 'Therapist' | 'Client'; text: string }>
> = {
  bot: [
    { speaker: 'System', text: 'Recording bot has joined the call.' },
    { speaker: 'Therapist', text: 'Before we start, how has your week been?' },
    { speaker: 'Client', text: 'Fine, I guess. Nothing major.' },
    { speaker: 'Therapist', text: 'Take your time.' },
    {
      speaker: 'Client',
      text: 'I would rather keep this general while that bot is here.',
    },
  ],
  local: [
    { speaker: 'Therapist', text: 'Before we start, how has your week been?' },
    { speaker: 'Client', text: 'I had a rough conversation with my sister.' },
    { speaker: 'Therapist', text: 'Take your time.' },
    { speaker: 'Client', text: 'I keep replaying what she said afterward.' },
  ],
}

export function CaptureComparison() {
  const [mode, setMode] = useState<CaptureMode>('bot')
  const isLocal = mode === 'local'

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
            Illustrative comparison
          </p>
          <h3 className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">
            The opening minute, with and without a bot participant
          </h3>
        </div>

        <div
          className="inline-flex w-fit rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-700 dark:bg-zinc-950"
          role="group"
          aria-label="Choose a session capture example"
        >
          <button
            type="button"
            onClick={() => setMode('bot')}
            aria-pressed={mode === 'bot'}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              mode === 'bot'
                ? 'bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Visible bot
          </button>
          <button
            type="button"
            onClick={() => setMode('local')}
            aria-pressed={mode === 'local'}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              mode === 'local'
                ? 'bg-teal-700 text-white shadow-sm dark:bg-teal-600'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            No bot participant
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-[#faf9f6] p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:p-5">
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Illustrative telehealth session
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              isLocal
                ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200'
                : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
            }`}
          >
            {isLocal ? 'Granola runs on your device' : '3 participants shown'}
          </span>
        </div>

        <div className="space-y-4" aria-live="polite">
          {dialogue[mode].map((line, index) => (
            <div
              key={`${mode}-${index}`}
              className={
                line.speaker === 'System'
                  ? 'rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center dark:border-amber-900 dark:bg-amber-950/50'
                  : 'grid grid-cols-[5.5rem_1fr] gap-3'
              }
            >
              {line.speaker === 'System' ? (
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                  {line.text}
                </p>
              ) : (
                <>
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {line.speaker}
                  </span>
                  <p className="text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                    {line.text}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        This dialogue is illustrative. Local capture removes the extra meeting
        participant; it does not remove your responsibility to disclose the tool
        and obtain the consent your practice requires.
      </p>
    </div>
  )
}

export function DocumentationCalculator() {
  const [sessions, setSessions] = useState(20)
  const [minutes, setMinutes] = useState(8)
  const monthlyMinutes = sessions * minutes * 4
  const monthlyHours = monthlyMinutes / 60

  return (
    <div className="rounded-3xl border border-zinc-200 bg-zinc-950 p-5 text-white shadow-sm dark:border-zinc-800 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">
        After-hours documentation calculator
      </p>
      <h3 className="mt-2 text-xl font-semibold">
        How much time is sitting behind your last session?
      </h3>
      <p className="mt-3 text-sm leading-6 text-zinc-300">
        Use your current numbers. The estimate uses four weeks per month to keep
        the result conservative.
      </p>

      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="flex items-center justify-between text-sm font-medium">
            Sessions per week
            <output className="rounded-md bg-white/10 px-2 py-1 font-mono text-teal-200">
              {sessions}
            </output>
          </span>
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={sessions}
            onChange={(event) => setSessions(Number(event.target.value))}
            className="mt-4 w-full accent-teal-400"
          />
        </label>

        <label className="block">
          <span className="flex items-center justify-between text-sm font-medium">
            Minutes after each
            <output className="rounded-md bg-white/10 px-2 py-1 font-mono text-teal-200">
              {minutes}
            </output>
          </span>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={minutes}
            onChange={(event) => setMinutes(Number(event.target.value))}
            className="mt-4 w-full accent-teal-400"
          />
        </label>
      </div>

      <div className="mt-7 rounded-2xl border border-teal-400/30 bg-teal-400/10 p-5">
        <p className="text-sm text-teal-100">
          Documentation time in play each month
        </p>
        <p className="mt-1 text-4xl font-semibold tracking-tight text-white">
          {monthlyHours.toFixed(1)} hours
        </p>
        <p className="mt-2 text-sm leading-6 text-zinc-300">
          That is the upper bound you could reclaim by moving from writing notes
          from scratch to reviewing captured notes. Your actual result depends
          on your required format and review process.
        </p>
      </div>
    </div>
  )
}
