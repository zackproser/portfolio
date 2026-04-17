'use client'

import dynamic from 'next/dynamic'
import type { BrainMap3DProps } from './BrainMap3D'

const BrainMap3D = dynamic(() => import('./BrainMap3D'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full my-8 rounded-2xl overflow-hidden" style={{ minHeight: '500px' }}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0118] via-[#1a0a2e] to-[#0a0118] flex items-center justify-center">
        <p className="text-sm font-mono text-amber-400/60">Loading 3D brain visualization...</p>
      </div>
    </div>
  )
})

export default function BrainMap3DWrapper(props: BrainMap3DProps = {}) {
  return <BrainMap3D {...props} />
}
