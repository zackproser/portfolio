'use client'

import dynamic from 'next/dynamic'
import type { DistractionSimulatorProps } from './interactive/DistractionSimulator'

const DistractionSimulator = dynamic(
  () =>
    import('./interactive/DistractionSimulator').then(
      (m) => m.DistractionSimulator
    ),
  {
    ssr: false,
    loading: () => (
      <div className="my-8 flex h-64 items-center justify-center rounded-2xl bg-zinc-900/50">
        <p className="text-sm text-zinc-500">Loading simulation…</p>
      </div>
    ),
  }
)

export default function DistractionSimulatorWrapper(
  props: DistractionSimulatorProps = {},
) {
  return <DistractionSimulator {...props} />
}
