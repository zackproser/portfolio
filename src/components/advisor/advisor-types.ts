export type AdvisorPhase = 'idle' | 'listening' | 'thinking' | 'resolved'

export type AdvisorSignal = {
  phase: AdvisorPhase
  accent?: string
}
