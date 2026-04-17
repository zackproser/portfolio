'use client'

import dynamic from 'next/dynamic'

const BrainModel = dynamic(
  () =>
    import('./interactive/BrainModel').then((m) => m.BrainModel),
  {
    ssr: false,
    loading: () => (
      <div className="my-8 flex h-64 items-center justify-center rounded-2xl bg-zinc-900/50">
        <p className="text-sm text-zinc-500">Loading 3D brain model…</p>
      </div>
    ),
  }
)

export default BrainModel
