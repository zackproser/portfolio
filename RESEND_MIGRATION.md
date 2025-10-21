# Resend Migration Guide

This guide explains how to migrate from EmailOctopus to Resend and use the new newsletter system.

## Environment Variables

Add these to your `.env` file:

```bash
# Resend (new system)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_AUDIENCE_ID=aud_xxxxxxxxxxxxxxxxxxxx

# Anthropic (for AI content expansion)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxx

# EmailOctopus (keep during migration for safety)
EMAIL_OCTOPUS_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
EMAIL_OCTOPUS_LIST_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Setup Steps

### 1. Set up Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your domain (`zackproser.com`)
   - Add DNS records as instructed by Resend
   - Wait for verification (usually 5-10 minutes)
3. Get your API key from the dashboard
4. Create an audience:
   ```bash
   # Via dashboard or API
   curl -X POST 'https://api.resend.com/audiences' \
     -H 'Authorization: Bearer YOUR_API_KEY' \
     -H 'Content-Type: application/json' \
     -d '{"name": "Newsletter Subscribers"}'
   ```
5. Save the `audience_id` from the response

### 2. Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Add to `.env` as `ANTHROPIC_API_KEY`

### 3. Run Database Migration

```bash
npx prisma migrate dev --name add_newsletter_system
npx prisma generate
```

If you encounter drift errors (existing `audience_segment` column):
```bash
# The migration will handle this automatically
npx prisma migrate dev
```

### 4. Export Contacts from EmailOctopus

```bash
tsx scripts/newsletter/export-emailoctopus-contacts.ts
```

This will:
- Export all contacts to `scripts/newsletter/emailoctopus-contacts.csv`
- Sync contacts to your Prisma database as backup
- Show statistics about exported contacts

### 5. Import Contacts to Resend

```bash
tsx scripts/newsletter/import-to-resend.ts
```

This will:
- Read contacts from the CSV
- Import SUBSCRIBED contacts to Resend
- Update Prisma with Resend contact IDs
- Respect rate limits (50 contacts per batch, 2s between batches)

## Migration Timeline

**Recommended: Parallel Operation (1-2 weeks)**

1. ✅ Export contacts (Day 1)
2. ✅ Import to Resend (Day 1)
3. ✅ Send test newsletter via Resend to small segment (Day 2-3)
4. ✅ Monitor deliverability & open rates (Week 1)
5. ✅ Full cutover when confident (Week 2)
6. ✅ Keep EmailOctopus active for 30 days as backup

**Alternative: Immediate Cutover**

If you want to switch immediately:
1. Run export + import scripts
2. Test with a small audience first
3. Send your next newsletter via Resend

## Using the Newsletter System

### Create a Newsletter Draft

```typescript
// POST /api/admin/newsletter/create
{
  "title": "The Future of AI Coding Tools",
  "bulletPoints": [
    "Cursor has become the default for most engineers",
    "Claude Sonnet 4 changed the game for code review",
    "GitHub Copilot falling behind",
    "New players like Windsurf emerging"
  ]
}
```

### Expand with AI

```typescript
// POST /api/admin/newsletter/{id}/expand
// No body required - uses bullet points from newsletter
```

### Preview

```typescript
// GET /api/admin/newsletter/{id}/preview
// Returns HTML preview
```

### Send

```typescript
// POST /api/admin/newsletter/{id}/send
// Publishes to website + sends via Resend
```

## Mobile Admin Interface

Access at: `/admin/newsletter`

Features:
- ✅ Mobile-optimized UI
- ✅ Voice input support (use WisprFlow or native dictation)
- ✅ One-tap AI expansion
- ✅ Live preview
- ✅ Quick send
- ✅ Real-time analytics

## Webhooks Setup

Resend will send webhook events to your site for tracking:

1. In Resend dashboard, go to Webhooks
2. Add webhook URL: `https://zackproser.com/api/resend/webhooks`
3. Select events:
   - `email.sent`
   - `email.delivered`
   - `email.opened`
   - `email.clicked`
   - `email.bounced`
   - `contact.created`
   - `contact.deleted`

## Pricing Comparison

| Provider | Your Cost | Limits |
|----------|-----------|--------|
| EmailOctopus | ~$24/mo | 2,700 contacts, limited sends |
| Resend | $40/mo | 5,000 contacts, unlimited sends |
| Anthropic (Claude) | ~$0.05/newsletter | Pay per use |
| **Total** | **~$45/mo** | Room to grow to 5K contacts |

**ROI:** Save 40-50 minutes per newsletter = 3-6 hours/month at 1-2 newsletters/week

## Troubleshooting

### Database Migration Issues

If you see drift errors:
```bash
# Pull current schema
npx prisma db pull

# Review changes
git diff prisma/schema.prisma

# Create migration
npx prisma migrate dev
```

### Resend Rate Limits

The import script respects rate limits, but if you hit issues:
- Reduce batch size in `import-to-resend.ts` (change `chunk(subscribedContacts, 50)` to `30`)
- Increase delay between batches (change `sleep(2000)` to `sleep(3000)`)

### Contact Already Exists

This is normal during re-runs. The script treats this as success.

### Database Connection Issues

If database is unavailable during export/import:
- CSV export will still work
- Database sync can be run later
- Prisma will log warnings but continue

## Migration Rollback

If you need to roll back to EmailOctopus:

1. Your EmailOctopus list is unchanged
2. Keep using existing `/api/waitinglist-subscribe` endpoint
3. Remove Resend environment variables
4. Newsletter admin UI will be non-functional but site continues working

## Next Steps After Migration

1. **Week 1:** Monitor deliverability
   - Check spam scores
   - Compare open rates to EmailOctopus baseline
   - Watch for bounces

2. **Week 2:** Optimize
   - Refine AI expansion prompts
   - Adjust email template styling
   - Test mobile admin workflow

3. **Week 3:** Scale
   - Increase newsletter frequency
   - Experiment with voice input
   - Track time savings

4. **Week 4:** Archive EmailOctopus
   - Export final backup
   - Cancel subscription
   - Remove EmailOctopus environment variables

## Support

- Resend docs: https://resend.com/docs
- Anthropic Claude docs: https://docs.anthropic.com
- Issues: Check the scripts output for detailed error messages

---

**Status:** Ready for migration. All infrastructure is in place. Just need Resend account setup.
