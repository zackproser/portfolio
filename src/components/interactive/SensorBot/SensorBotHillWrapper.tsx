'use client'

import dynamic from 'next/dynamic'

const SensorBotHill = dynamic(
  () =>
    import('./SensorBotHill').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="my-8 flex h-[480px] items-center justify-center rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <p className="text-sm text-zinc-500 font-mono">ON THE HILL...</p>
      </div>
    ),
  }
)

export default function SensorBotHillWrapper() {
  return <SensorBotHill />
}