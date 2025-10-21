# Resend Enhancements & Migration Roadmap

## Executive Summary

**Goal:** Consolidate from EmailOctopus + Postmark → Resend-only for all email (transactional + marketing)

**Benefits:**
- Single platform for all email
- Better developer experience
- PDF attachment support for content delivery
- More powerful webhook system
- Simplified billing (no Postmark credit system issues)
- Cost savings potential

**Timeline:** 8-12 hours total implementation

---

## Phase 1: Replace Postmark with Resend (Transactional Emails)

### Current Postmark Usage

Your site uses Postmark for:
1. **NextAuth Magic Links** - Email verification for login
2. **Purchase Confirmations** - Stripe payment receipts
3. **Free Chapter Delivery** - Content delivery emails
4. **Other transactional emails**

### Migration Steps

#### 1. Update NextAuth Configuration

**File:** `auth.ts`

Replace Postmark SMTP with Resend:

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// In EmailProvider configuration:
EmailProvider({
  server: {
    host: process.env.EMAIL_SERVER_HOST, // REMOVE
    port: process.env.EMAIL_SERVER_PORT, // REMOVE
    auth: { // REMOVE
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD
    }
  },
  from: process.env.EMAIL_FROM,
  sendVerificationRequest: async ({ identifier, url, provider }) => {
    // OLD: uses nodemailer transport with Postmark SMTP

    // NEW: Direct Resend API call
    await resend.emails.send({
      from: 'Zachary Proser <auth@zackproser.com>',
      to: identifier,
      subject: 'Sign in to zackproser.com',
      html: `
        <!DOCTYPE html>
        <html>
        <!-- Your existing email HTML -->
        </html>
      `
    })
  }
})
```

#### 2. Update Purchase Confirmation Emails

**File:** `src/app/api/webhooks/stripe/route.ts`

```typescript
// OLD: Uses Postmark
import { ServerClient } from 'postmark'
const client = new ServerClient(process.env.POSTMARK_API_KEY!)

// NEW: Uses Resend
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

// When handling successful payment:
await resend.emails.send({
  from: 'Zachary Proser <purchases@zackproser.com>',
  to: customerEmail,
  subject: `Your purchase: ${productTitle}`,
  html: purchaseConfirmationHTML,
  // NEW: Can attach PDF!
  attachments: [{
    filename: 'receipt.pdf',
    content: pdfBuffer // We'll generate this
  }]
})
```

#### 3. Update Free Chapter Delivery

**File:** `src/app/api/free-chapters/route.ts`

```typescript
await resend.emails.send({
  from: 'Zachary Proser <content@zackproser.com>',
  to: userEmail,
  subject: `Your free chapter: ${chapterTitle}`,
  html: chapterEmailHTML,
  // NEW: Attach PDF version of chapter!
  attachments: [{
    filename: `${chapterSlug}.pdf`,
    content: await generateChapterPDF(chapterContent)
  }]
})
```

#### 4. Environment Variables

Update `.env`:

```bash
# REMOVE Postmark
# POSTMARK_API_KEY=xxx
# EMAIL_SERVER_HOST=smtp.postmarkapp.com
# EMAIL_SERVER_PORT=587
# EMAIL_SERVER_USER=xxx
# EMAIL_SERVER_PASSWORD=xxx

# Resend already configured
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=Zachary Proser <noreply@zackproser.com>
```

### Benefits of Migration

1. **PDF Attachments** - Send content directly in emails
2. **Better API** - Cleaner, more modern API design
3. **Single Dashboard** - All emails in one place
4. **Better Webhooks** - More granular event tracking
5. **Cost Savings** - Eliminate Postmark subscription

---

## Phase 2: PDF Content Delivery

### Feature: Auto-generate PDF Versions

When users purchase or request free chapters, automatically:
1. Generate PDF from MDX content
2. Attach to confirmation email
3. Track PDF downloads via webhook

### Implementation

#### Install PDF Generation Library

```bash
pnpm add puppeteer-core @sparticuz/chromium
# Or use jsPDF for simpler needs
pnpm add jspdf html2canvas
```

#### Create PDF Generator

**File:** `src/lib/pdf-generator.ts`

```typescript
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export async function generatePDFFromMDX(
  mdxContent: string,
  title: string
): Promise<Buffer> {
  // Launch headless browser
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true
  })

  const page = await browser.newPage()

  // Render MDX to HTML
  const html = await compileMDXToHTML(mdxContent)

  // Set content
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 40px; }
        h1 { font-size: 32px; margin-bottom: 20px; }
        p { line-height: 1.6; margin-bottom: 16px; }
        code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
        pre { background: #f5f5f5; padding: 16px; border-radius: 6px; overflow-x: auto; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      ${html}
    </body>
    </html>
  `)

  // Generate PDF
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '40px', bottom: '40px' }
  })

  await browser.close()

  return Buffer.from(pdf)
}
```

#### Update Purchase Flow

```typescript
// In webhook handler after successful purchase:
const pdfBuffer = await generatePDFFromMDX(
  contentMdx,
  contentTitle
)

await resend.emails.send({
  from: 'Zachary Proser <purchases@zackproser.com>',
  to: customerEmail,
  subject: `Your purchase: ${contentTitle}`,
  html: purchaseHTML,
  attachments: [{
    filename: `${contentSlug}.pdf`,
    content: pdfBuffer,
    type: 'application/pdf'
  }]
})
```

### Use Cases

1. **Free Chapter Requests** → Instant PDF delivery
2. **Purchases** → PDF + web access
3. **Newsletters** → Optional PDF version for archives
4. **Lead Magnets** → PDF downloads for email capture

---

## Phase 3: Enhanced Newsletter Features

### A. Newsletter PDF Archives

Allow subscribers to get PDF version of each newsletter:

```typescript
// Add to send endpoint
const newsletterPDF = await generatePDFFromMDX(
  newsletter.contentMdx,
  newsletter.title
)

await resend.emails.send({
  from: 'Zachary Proser <newsletter@zackproser.com>',
  to: audienceId,
  subject: newsletter.title,
  html: emailHtml,
  attachments: [{
    filename: `${newsletter.slug}.pdf`,
    content: newsletterPDF,
    type: 'application/pdf'
  }]
})
```

**User Experience:**
- Email contains full HTML content
- Also includes PDF attachment for archiving/offline reading
- Subscribers can save PDFs to Notion, Readwise, etc.

### B. Newsletter Scheduling

Add scheduled send capability:

**Prisma Update:**
```prisma
model Newsletter {
  // ... existing fields
  scheduledFor  DateTime?  @map("scheduled_for")
}
```

**API Endpoint:** `POST /api/admin/newsletter/[id]/schedule`

```typescript
export async function POST(req: NextRequest) {
  const { scheduledFor } = await req.json()

  await prisma.newsletter.update({
    where: { id: params.id },
    data: {
      status: 'scheduled',
      scheduledFor: new Date(scheduledFor)
    }
  })

  // Trigger Vercel Cron or use QStash for scheduling
  return NextResponse.json({ success: true })
}
```

**Cron Job:** `src/app/api/cron/send-scheduled-newsletters/route.ts`

```typescript
export async function GET(req: NextRequest) {
  // Verify cron secret
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const now = new Date()

  const scheduledNewsletters = await prisma.newsletter.findMany({
    where: {
      status: 'scheduled',
      scheduledFor: {
        lte: now
      }
    }
  })

  for (const newsletter of scheduledNewsletters) {
    // Send newsletter
    await sendNewsletter(newsletter.id)
  }

  return NextResponse.json({ sent: scheduledNewsletters.length })
}
```

**Vercel Cron:** `vercel.json`

```json
{
  "crons": [{
    "path": "/api/cron/send-scheduled-newsletters",
    "schedule": "*/15 * * * *"
  }]
}
```

### C. A/B Testing Subject Lines

Test different subject lines to optimize open rates:

```prisma
model NewsletterVariant {
  id             String   @id @default(cuid())
  newsletterId   String   @map("newsletter_id")
  newsletter     Newsletter @relation(fields: [newsletterId])
  subject        String
  testPercentage Int      // 10 = 10% of audience
  emailsSent     Int      @default(0)
  emailsOpened   Int      @default(0)
  isWinner       Boolean  @default(false)

  @@map("newsletter_variants")
}
```

**Split test workflow:**
1. Create 2-3 subject line variants
2. Send to 10% of audience (split between variants)
3. Wait 2 hours
4. Automatically send winning variant to remaining 90%

---

## Phase 4: Customer Lifecycle Webhooks

### Resend Webhook Events to Implement

Resend sends webhooks for many events. Here's what to track:

#### Email Delivery Events

**Already implemented:**
- ✅ `email.sent` - Track sends
- ✅ `email.delivered` - Track deliveries
- ✅ `email.opened` - Track opens
- ✅ `email.clicked` - Track clicks
- ✅ `email.bounced` - Track bounces

**New to add:**
- `email.complained` - User marked as spam
- `email.delivery_delayed` - Temporary delivery failure

#### Contact Lifecycle Events

**Already implemented:**
- ✅ `contact.created` - New subscriber
- ✅ `contact.deleted` - Unsubscribed

**New to add:**
- `contact.updated` - Contact details changed

### Enhanced Webhook Handler

**File:** `src/app/api/resend/webhooks/route.ts`

Add these new handlers:

```typescript
case 'email.complained':
  await handleSpamComplaint(payload.data)
  break

case 'email.delivery_delayed':
  await handleDeliveryDelay(payload.data)
  break
```

### Customer Lifecycle Tracking

Create a comprehensive customer journey tracker:

**New Prisma Model:**

```prisma
model CustomerJourneyEvent {
  id          String   @id @default(cuid())
  email       String
  eventType   String   // "subscribed", "opened_first_email", "clicked_link", "purchased", etc.
  eventData   Json?    // Additional context
  source      String?  // "newsletter", "transactional", "marketing"
  createdAt   DateTime @default(now()) @map("created_at")

  @@index([email, createdAt])
  @@map("customer_journey_events")
}
```

**Track Key Lifecycle Moments:**

1. **Subscription:** `subscribed`
2. **First Email Open:** `opened_first_email` (within 24h)
3. **Engaged:** `clicked_newsletter_link`
4. **Highly Engaged:** `opened_3_newsletters`
5. **Converted:** `made_purchase`
6. **At Risk:** `no_opens_30_days`
7. **Churned:** `unsubscribed`

**Use Cases:**

```typescript
// Trigger re-engagement campaign
const atRiskSubscribers = await prisma.newsletterSubscription.findMany({
  where: {
    status: 'SUBSCRIBED',
    lastOpenedAt: {
      lt: subDays(new Date(), 30)
    }
  }
})

// Send win-back email
for (const subscriber of atRiskSubscribers) {
  await sendWinBackEmail(subscriber.email)
}
```

### Automated Sequences Based on Behavior

**Example: Welcome Sequence**

```prisma
model AutomationSequence {
  id          String   @id @default(cuid())
  name        String
  trigger     String   // "contact.created"
  isActive    Boolean  @default(true)
  steps       AutomationStep[]
}

model AutomationStep {
  id           String   @id @default(cuid())
  sequenceId   String
  sequence     AutomationSequence @relation(fields: [sequenceId])
  order        Int
  delayHours   Int      // Wait time after previous step
  emailType    String   // "welcome", "tips", "case_study"
  subject      String
  content      String   @db.Text
}
```

**Welcome Sequence Example:**

1. **Day 0:** Welcome email + best content roundup
2. **Day 3:** Tips for getting the most value
3. **Day 7:** Case study or success story
4. **Day 14:** Invitation to purchase or upgrade

---

## Phase 5: Analytics Dashboard

### Real-time Newsletter Analytics

Build a dashboard to visualize:

1. **Overall Performance**
   - Total sends (last 30 days)
   - Average open rate
   - Average click rate
   - Subscriber growth

2. **Newsletter Comparison**
   - Compare performance across newsletters
   - Identify best-performing topics
   - Track trends over time

3. **Subscriber Engagement**
   - Most engaged subscribers
   - At-risk subscribers
   - Recent unsubscribes

**Implementation:**

```typescript
// src/app/admin/analytics/page.tsx

export default async function AnalyticsPage() {
  const stats = await prisma.newsletter.aggregate({
    where: {
      status: 'sent',
      sentAt: {
        gte: subDays(new Date(), 30)
      }
    },
    _sum: {
      emailsSent: true,
      emailsOpened: true,
      emailsClicked: true
    },
    _avg: {
      emailsOpened: true,
      emailsClicked: true
    }
  })

  return (
    <AnalyticsDashboard stats={stats} />
  )
}
```

---

## Cost Analysis: Resend-Only

### Current Costs

- EmailOctopus: ~$24/mo (2,700 contacts)
- Postmark: ~$10-15/mo (credits)
- **Total: ~$34-39/mo**

### New Costs (Resend Only)

**Email Plan (Marketing):**
- $40/mo for 5,000 contacts
- Unlimited sends

**Transactional Emails:**
- Included in same plan
- No separate pricing for transactional

**PDF Generation (Vercel):**
- ~$0.01 per PDF generation (serverless function)
- Negligible cost

**Total: $40/mo + minimal PDF costs**

### ROI

- **Cost:** ~$40/mo (vs $34-39/mo) = +$1-6/mo
- **Value:**
  - PDF attachments (new capability)
  - Better analytics
  - Single platform (time savings)
  - No Postmark credit issues
  - Room to grow (5K contacts vs 2.7K)

**Verdict:** Worth the $1-6/mo premium for better features + simplicity

---

## Implementation Priority

### Phase 1: Core (Complete) ✅
- Newsletter system
- AI expansion
- Mobile admin UI
- Resend broadcasts integration

### Phase 2: Transactional Migration (Next - 4 hours)
- Replace Postmark with Resend in NextAuth
- Update purchase confirmation emails
- Update free chapter delivery

### Phase 3: PDF Features (4-6 hours)
- PDF generator utility
- Attach PDFs to newsletters
- Attach PDFs to purchases
- Track PDF downloads

### Phase 4: Lifecycle Automation (6-8 hours)
- Enhanced webhook handlers
- Customer journey tracking
- Automated welcome sequence
- Re-engagement campaigns

### Phase 5: Advanced Features (8-10 hours)
- Newsletter scheduling
- A/B testing
- Analytics dashboard
- Segmentation

---

## Next Steps

1. ✅ **Complete admin UI** (in progress)
2. **Test newsletter workflow end-to-end**
3. **Migrate NextAuth to Resend** (remove Postmark dependency)
4. **Add PDF generation for purchases**
5. **Implement customer lifecycle tracking**
6. **Build analytics dashboard**

---

**Questions for prioritization:**

1. Should we migrate transactional emails (Postmark replacement) immediately or after newsletter system is proven?
2. Do you want PDF attachments for newsletters right away, or focus on purchases first?
3. Which lifecycle events are most important to track for your business?

