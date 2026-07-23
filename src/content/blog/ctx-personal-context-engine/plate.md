## ctx Field Notes — Anatomy of a Good Memory

One `remember()` call, sanitized from a real session. Mid-task, an agent finished a gnarly change to one of my decks and wrote the whole thing down in a single call — the multi-part project state change *and* the durable preference it had just learned about how I like slides handled. One write; the next agent, on any surface and from any vendor, starts knowing both.

### The call

- Endpoint: `POST https://ctx.zackproser.com/mcp`
- Auth: `Authorization: Bearer $CTX_TOKEN` — a write-scoped token (it can push, it cannot read)
- Tool: `remember`
- `idempotency_key`: `masterclass-backstage-2026-07-22`

### The text it stored

The masterclass deck (`myorg/masterclass`, `~/Dev/masterclass`) now has a BACKSTAGE appendix after the closing quote: the actual conference-workshop slides embedded live via iframes from a vendored deck at `slides/public/workshop-deck/` (copied from `partner/ai-native-workshop` `slides/public`). Four jump-only blocks with original speaker notes — B1 Voice (slides 9–13), B2 Loops & Goals (19–30), B3 Verification Gates (36–44), B4 Scheduled Tasks (48–54); `routeAliases` voice / loops / gates / schedule, plus a `backstage` divider (slide ~50). THE MAP (slide 2) has a backstage row linking all four. Purpose: fill the hour, or serve a technical audience with the real animated slides. The main flow (its spine plus re-authored beats) is unchanged and audience-neutral. IMPORTANT preference learned: when I ask for slides FROM a deck, I mean the actual slides — visuals and animations intact — not re-authored approximations.

### What came back

| Field | Value |
|---|---|
| `id` | server-assigned UUID |
| `title` | Masterclass deck now includes a BACKSTAGE appendix with the workshop slides |
| `kind` | `project` |
| `near_dups` | 0 |

The agent supplied only the raw `text` and an idempotency key. The server distilled the title, inferred `kind: project`, embedded the content, and checked for near-duplicates. The agent chose none of that — the write path assembles the row (see § 03).

### Why this is a good memory

- **Specific and self-contained.** It names the repo, the paths, the exact structure, and the slide ranges. A future agent can act on it without asking a single follow-up.
- **Two payloads in one write.** The state change *and* the transferable lesson — "the actual slides, not re-authored approximations" — captured together, so the preference outlives the task that taught it.
- **Idempotent.** The `idempotency_key` makes the write safe to retry; a dropped connection can't create a duplicate.
- **Right altitude.** Durable project state and a preference — not transient chatter, not a secret, not something already in git.

### Write your own

A high-signal memory your future agents will actually use:

- What changed, and where it lives (repo, path): ____
- The structure or details a future agent needs to act: ____
- The durable preference or lesson learned alongside it: ____
- A stable `idempotency_key` (e.g. `topic-YYYY-MM-DD`): ____

---

Never put a secret, a token, or transient task state in a memory. If it belongs in a vault, a `.env`, or git, it does not belong in ctx.
