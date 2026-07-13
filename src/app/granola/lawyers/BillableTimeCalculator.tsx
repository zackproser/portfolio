'use client'

import { useId, useMemo, useState } from 'react'

type CalculatorFieldProps = {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  suffix: string
  onChange: (value: number) => void
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function CalculatorField({
  id,
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: CalculatorFieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
      <span className="flex items-center overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-sm focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-950">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value)
            onChange(Number.isFinite(next) ? next : 0)
          }}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base font-semibold tabular-nums text-zinc-950 outline-none dark:text-white"
        />
        <span className="border-l border-zinc-200 bg-zinc-50 px-3 py-3 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          {suffix}
        </span>
      </span>
    </label>
  )
}

export default function BillableTimeCalculator() {
  const baseId = useId()
  const [hourlyRate, setHourlyRate] = useState(350)
  const [meetingsPerWeek, setMeetingsPerWeek] = useState(10)
  const [reconstructionMinutes, setReconstructionMinutes] = useState(10)
  const [reviewMinutes, setReviewMinutes] = useState(3)
  const [workingWeeks, setWorkingWeeks] = useState(50)

  const result = useMemo(() => {
    const meetingsPerYear = meetingsPerWeek * workingWeeks
    const reconstructionHours = (meetingsPerYear * reconstructionMinutes) / 60
    const reviewHours = (meetingsPerYear * reviewMinutes) / 60
    const reconstructionValue = reconstructionHours * hourlyRate
    const reviewValue = reviewHours * hourlyRate

    return {
      meetingsPerYear,
      reconstructionHours,
      reviewHours,
      reconstructionValue,
      reviewValue,
      difference: reconstructionValue - reviewValue,
      hoursDifference: reconstructionHours - reviewHours,
    }
  }, [hourlyRate, meetingsPerWeek, reconstructionMinutes, reviewMinutes, workingWeeks])

  const fields = [
    {
      id: `${baseId}-rate`,
      label: 'Hourly rate',
      value: hourlyRate,
      min: 0,
      max: 5000,
      step: 25,
      suffix: '$ / hour',
      onChange: setHourlyRate,
    },
    {
      id: `${baseId}-meetings`,
      label: 'Client meetings each week',
      value: meetingsPerWeek,
      min: 0,
      max: 100,
      step: 1,
      suffix: 'meetings',
      onChange: setMeetingsPerWeek,
    },
    {
      id: `${baseId}-rebuild`,
      label: 'Reconstructing notes after each call',
      value: reconstructionMinutes,
      min: 0,
      max: 120,
      step: 1,
      suffix: 'minutes',
      onChange: setReconstructionMinutes,
    },
    {
      id: `${baseId}-review`,
      label: 'Reading structured notes after each call',
      value: reviewMinutes,
      min: 0,
      max: 120,
      step: 1,
      suffix: 'minutes',
      onChange: setReviewMinutes,
    },
    {
      id: `${baseId}-weeks`,
      label: 'Working weeks each year',
      value: workingWeeks,
      min: 1,
      max: 52,
      step: 1,
      suffix: 'weeks',
      onChange: setWorkingWeeks,
    },
  ] satisfies CalculatorFieldProps[]

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/70 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold text-zinc-950 dark:text-white">Your practice assumptions</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Sample starting values — edit every field</p>
        </div>
      </div>

      <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((field, index) => (
            <div key={field.id} className={index === fields.length - 1 ? 'sm:col-span-2' : ''}>
              <CalculatorField {...field} />
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl bg-zinc-950 p-5 text-white dark:bg-zinc-900 sm:p-6"
          aria-live="polite"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">
            Annual billable-equivalent value
          </p>
          <div className="mt-5 space-y-4">
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-zinc-400">Reconstructing notes</p>
                <p className="mt-1 text-xs text-zinc-500">{result.reconstructionHours.toFixed(1)} hours</p>
              </div>
              <p className="text-2xl font-bold tabular-nums">{currency.format(result.reconstructionValue)}</p>
            </div>
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-zinc-400">Reading structured notes</p>
                <p className="mt-1 text-xs text-zinc-500">{result.reviewHours.toFixed(1)} hours</p>
              </div>
              <p className="text-2xl font-bold tabular-nums text-teal-300">{currency.format(result.reviewValue)}</p>
            </div>
            <div className="rounded-xl bg-teal-400/10 p-4 ring-1 ring-inset ring-teal-300/20">
              <p className="text-xs text-teal-200">Estimated annual difference</p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-teal-300">
                {currency.format(result.difference)}
              </p>
              <p className="mt-2 text-xs leading-5 text-zinc-400">
                {result.hoursDifference.toFixed(1)} hours across {result.meetingsPerYear.toLocaleString('en-US')} meetings.
                A positive number means less billable-equivalent time spent on note work.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 px-5 py-4 text-xs leading-5 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:px-8">
        This is arithmetic, not a promised saving: hourly rate × meetings × working weeks × minutes ÷ 60.
        It does not include software cost, taxes, collection rate, or time spent correcting notes.
      </div>
    </div>
  )
}
