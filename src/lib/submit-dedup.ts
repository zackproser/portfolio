/**
 * Tiny in-memory dedup for signup-style POST handlers.
 *
 * Each route instantiates its own cache (separate namespaces — a regular
 * signup and a waitlist signup for the same email should NOT collide). The
 * Map is module-scoped to the route file: warm Vercel lambdas share state
 * across invocations, which is where slow-connection double-clicks land.
 * Cold starts won't dedup, but that's a vanishingly small slice of real
 * double-submits (same browser tab → same TCP connection → typically same
 * warm lambda).
 *
 * Not a substitute for the client-side `useRef` synchronous guard — that
 * catches the React-batching race before the request ever fires. This is
 * defense in depth.
 */

type Cached = { result: unknown; at: number }

export type SubmitDedup = {
  get(key: string): unknown | null
  remember(key: string, result: unknown): void
}

export function createSubmitDedup(ttlMs: number = 30_000): SubmitDedup {
  const cache = new Map<string, Cached>()
  return {
    get(key: string): unknown | null {
      const hit = cache.get(key)
      if (!hit) return null
      if (Date.now() - hit.at > ttlMs) {
        cache.delete(key)
        return null
      }
      return hit.result
    },
    remember(key: string, result: unknown): void {
      cache.set(key, { result, at: Date.now() })
      // Lazy eviction so the Map can't grow unbounded under sustained traffic.
      if (cache.size > 1000) {
        const cutoff = Date.now() - ttlMs
        for (const [k, v] of cache) {
          if (v.at < cutoff) cache.delete(k)
        }
      }
    },
  }
}
