# Writing Rules

## Banned Patterns

- **NEVER use the "not just X, it's Y" / "isn't just X, it's Y" / "doesn't just X — it Y" pattern.** This is a known Anthropic LLM writing tell. Rewrite to state what the thing *is* directly, without the contrastive setup.

## Style

- Keep prose direct and matter-of-fact. Avoid dramatic buildup.
- State what things are. Don't set up what they aren't first.

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
