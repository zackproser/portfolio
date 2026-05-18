'use client'

import dynamic from 'next/dynamic'
import type { SensorBotSceneProps } from './SensorBotScene'

const SensorBotScene = dynamic(() => import('./SensorBotScene'), {
  ssr: false,
  loading: () => (
    <div
      className="relative w-full my-8 rounded-2xl overflow-hidden border border-cyan-400/15"
      style={{ height: 380 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0418] via-[#1a0a35] to-[#08081a] flex items-center justify-center">
        <p className="font-mono text-[10px] tracking-widest uppercase text-cyan-200/60">
          loading scene…
        </p>
      </div>
    </div>
  ),
})

export default function SensorBotSceneWrapper(props: SensorBotSceneProps) {
  return <SensorBotScene {...props} />
}
