// Server-side registry of DETACHABLE PLATE assets. The delivery
// endpoint resolves file URLs from here — never from the client — so
// the email exchange can't be repurposed to advertise arbitrary
// links. Add one entry per gated artifact.

export interface BlueprintAsset {
  /** Human name shown in emails/logs, e.g. "Circuit Tracing Field Sheet" */
  name: string
  /** Drawing that carries it, e.g. "TDD-010" */
  drawingCode: string
  /** Delivered file (Bunny CDN, treated as shareable) */
  fileUrl: string
}

export const ASSET_REGISTRY: Record<string, BlueprintAsset> = {
  'bp-010-circuit-tracing': {
    name: 'Circuit Tracing Field Sheet',
    drawingCode: 'TDD-010',
    fileUrl: 'https://zackproser.b-cdn.net/plates/bp-010-circuit-tracing.pdf',
  },
}
