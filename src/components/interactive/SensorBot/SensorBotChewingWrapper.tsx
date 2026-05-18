'use client'

import dynamic from 'next/dynamic'

const SensorBotChewing = dynamic(
  () =>
    import('./SensorBotChewing').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="my-8 flex h-[520px] items-center justify-center rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <p className="text-sm text-zinc-500 font-mono">LOCK ACQUIRING...</p>
      </div>
    ),
  }
)

export default function SensorBotChewingWrapper() {
  return <SensorBotChewing />
}