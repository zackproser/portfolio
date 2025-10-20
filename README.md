# Zachary Proser's Portfolio

![Zack Proser's portfolio](./public/zackproser-com-screenshot.png)

Personal website and blog featuring technical writing, tool comparisons, and educational content.

## Quick Start

```bash
npm i
npm run dev
```

## Architecture Overview

### Content Systems

**Reviews** (`src/content/reviews/`)
- Long-form product and API comparisons
- MDX content with metadata.json
- Integrated into blog index with visual differentiation
- Example: [Anthropic vs OpenAI LLM API 2025](/src/content/reviews/anthropic-vs-openai-llm-api-2025/)

**Comparisons** (`src/app/comparisons/`)
- Dynamic comparison pages using manifest data
- Route: `/comparisons/[tool1]/vs/[tool2]`
- Powered by decision engine and YAML manifests

**Tool Manifests** (`manifests/`)
- YAML-based tool specifications with verifiable facts
- Provenance tracking for all data points
- See [`README-manifests.md`](./README-manifests.md) for details

### Content Access Tiers

Three-tier access system for monetization and lead capture:

1. **Public** - Free, no authentication required
2. **Auth-required** - Sign-in required, auto-subscribe to newsletter on first sign-in
3. **Paid** - Purchase required via Stripe

Configured via `commerce` field in metadata.json:
```json
{
  "commerce": {
    "requiresAuth": true,  // Tier 2: requires sign-in
    "isPaid": false,        // Tier 3: requires purchase
    "price": 0
  }
}
```

**Important**: Tier 2 only checks for valid session, NOT subscription status. Users can unsubscribe from newsletter but still access content as long as they're signed in.

### Newsletter System

- **Auto-subscribe**: Users are automatically subscribed to newsletter on first sign-in
- **Database-backed**: Subscription status stored in PostgreSQL via Prisma
- **EmailOctopus integration**: Syncs with EmailOctopus API
- **Graceful**: Users can unsubscribe but retain content access

### Authentication

- NextAuth.js for authentication
- Email provider (passwordless login)
- Auto-subscribe logic in `auth.ts` signIn callback
- Session-based access control

## Operational Documentation

- **OpenGraph Images**: [`docs/og-system.md`](./docs/og-system.md) - OG image generation system
- **Tool Manifests**: [`README-manifests.md`](./README-manifests.md) - YAML manifest system for comparisons
- **Scripts**: [`scripts/README.md`](./scripts/README.md) - General script documentation

## Key Technologies

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Neon) + Prisma ORM
- **Auth**: NextAuth.js
- **Newsletter**: EmailOctopus API
- **Payments**: Stripe
- **Content**: MDX + TypeScript
- **Styling**: Tailwind CSS
