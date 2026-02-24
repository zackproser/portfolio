# Writing Rules

## ⛔ BANNED PATTERN — READ THIS FIRST

**"This isn't X, it's Y" / "not just X, it's Y" / "isn't just X, it's Y" / "doesn't just X — it Y"**

This is an Anthropic LLM writing tell. It is immediately recognizable as AI-generated. It is banned in ALL writing for this project — blog posts, email copy, section headings, design proposals, everything. No exceptions.

The fix: state what the thing IS. Drop the contrastive setup entirely.

- ❌ "This isn't hype — here's the video"
- ✅ "Here's the video"
- ❌ "WisprFlow isn't just voice-to-text, it's a thinking accelerator"
- ✅ "WisprFlow accelerates how you think, not just how fast you type"

Before writing any copy, check: does any sentence start with "This isn't", "not just", "isn't just", "doesn't just"? If yes, rewrite it.

## Banned Words and Phrases

Any of these in a draft = rewrite the sentence.

**Buzzwords:** game-changer, unlock (metaphorical), level up, deep dive, seamless/seamlessly, robust (as generic praise), leverage (overused verb), streamline, empower/empowering, cutting-edge, bleeding-edge, pain points, north star, move the needle, paradigm shift, transformative, revolutionary/revolutionize, groundbreaking, unprecedented, holistic, ecosystem (buzzword), landscape (metaphor), synergy, actionable insights, thought leadership, guardrails (non-literal)

**AI-era tells:** "harness the power of", "at the intersection of", "in the age of AI", delve/delve into (strong LLM tell), "co-pilot" (generic)

**Throat-clearing transitions (delete on sight):** Furthermore, Moreover, That being said, It's worth noting, Importantly, Notably, Crucially, To that end, In essence, At its core, Simply put, First and foremost, Last but not least, At the end of the day, Moving forward, Going forward, In conclusion, In summary

**Grandiose filler:** multifaceted, nuanced (filler), tapestry (metaphor), myriad, plethora, undoubtedly, without a doubt, it's clear that

**Performative hedges:** "I'll note that", "I should mention", "It's important to note", "Worth emphasizing"

## Other Banned Patterns

- No dramatic buildup before the point. Lead with the point.
- No "What I didn't expect was..." or "Here's what surprised me:" setups.

## Style

- Keep prose direct and matter-of-fact.
- State what things are. Don't set up what they aren't first.

## Verification Before Committing

**Always run `npm run build` before committing or pushing.** A passing local build is required — never commit untested changes.

Required before every commit:
1. `npm run build` — must compile and type-check with zero errors
2. Run `git status` and verify ALL new files are staged — missing `metadata.json`, images, or supporting files will silently break the Vercel build even when the local build passes

## Common Commands

- `npm run dev` — local dev server at localhost:3000
- `npm run build` — production build
- `npm run og:generate-for -- --slug <slug>` — generate OG image for a specific post
- `npm run og:generate` — generate all OG images

## Blog Posts

- Each post lives in `src/content/blog/{slug}/` with `metadata.json` and `page.mdx`
- Directory name = URL slug = `/blog/{slug}`
- Hero images hosted on Bunny CDN: `https://zackproser.b-cdn.net/images/{name}.webp`
- OG images: `https://zackproser.b-cdn.net/images/og-images/{slug}.png`
- Sitemap auto-discovers posts from the content directory

## Images

- All images served from Bunny CDN (`zackproser.b-cdn.net`)
- Hero images path: `images/{name}.webp`
- OG images path: `images/og-images/{slug}.png`
- Inline diagrams path: `images/{name}.png`

## API Keys

- All API keys live in `.env` — check there before asking the user
