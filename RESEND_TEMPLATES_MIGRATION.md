# Resend Templates Migration Plan

## Current Status: Beta (Not Ready Yet)

Resend Templates are in **private beta** - APIs may change before GA. Once they're stable, this would be a good upgrade.

---

## Current Approach vs Resend Templates

### Current (React Email + Render)

```typescript
// What we do now:
import { render } from '@react-email/render'
import NewsletterEmail from '@/emails/NewsletterTemplate'

const emailHtml = await render(
  NewsletterEmail({
    title: newsletter.title,
    contentHtml,
    newsletterSlug: newsletter.slug
  })
)

await resend.emails.send({
  from: 'newsletter@zackproser.com',
  to: audienceId,
  subject: newsletter.title,
  html: emailHtml
})
```

**Pros:**
- ✅ Full control over template in your codebase
- ✅ Version controlled
- ✅ TypeScript type safety
- ✅ Can test locally
- ✅ No external dependencies

**Cons:**
- ❌ Template rendering happens in API route (compute time)
- ❌ Can't edit template without deploying
- ❌ Non-technical users can't modify template

---

### Future (Resend Templates)

```typescript
// What we'll do with Resend Templates:
await resend.emails.send({
  from: 'newsletter@zackproser.com',
  to: audienceId,
  subject: newsletter.title,
  template_id: 'newsletter-template-v1', // Template in Resend dashboard
  template_variables: {
    title: newsletter.title,
    content_html: contentHtml,
    newsletter_slug: newsletter.slug,
    unsubscribe_url: '{{RESEND_UNSUBSCRIBE_URL}}'
  }
})
```

**Pros:**
- ✅ No rendering in API route (faster, cheaper)
- ✅ Can edit template in Resend dashboard (no deploy needed)
- ✅ Non-technical users can tweak design
- ✅ A/B test templates easily
- ✅ Template versioning in Resend
- ✅ Up to 20 variables per template

**Cons:**
- ❌ Template not in your codebase (less control)
- ❌ Need Resend dashboard access to edit
- ❌ Currently in beta (API may change)

---

## When to Migrate

### ✅ Migrate When:
1. **Resend Templates exit beta** and APIs are stable
2. **You want non-technical editing** - Team members need to tweak templates
3. **You need A/B testing** - Multiple template variants
4. **Performance matters** - Want to reduce API route compute time

### ❌ Don't Migrate If:
1. **Templates are stable** - Not changing frequently
2. **You prefer version control** - Want templates in Git
3. **You need complex logic** - React Email components with conditional rendering
4. **Beta concerns** - API might change

---

## Migration Steps (When Ready)

### Phase 1: Prepare Template

**Option A: Export Current React Email Template**

1. Create production build of your newsletter email:
```typescript
// scripts/export-email-template.ts
import { render } from '@react-email/render'
import NewsletterEmail from '@/emails/NewsletterTemplate'

const html = await render(
  NewsletterEmail({
    title: '{{title}}',
    contentHtml: '{{content_html}}',
    newsletterSlug: '{{newsletter_slug}}'
  })
)

// Save to file for upload to Resend
fs.writeFileSync('newsletter-template.html', html)
```

2. Upload to Resend dashboard
3. Configure variables (title, content_html, newsletter_slug)

**Option B: Use Resend Dashboard Editor**

1. Go to Resend Templates dashboard
2. Create new template from scratch
3. Add your design using their no-code editor
4. Add variable placeholders

### Phase 2: Update Send Endpoint

```typescript
// src/app/api/admin/newsletter/[id]/send/route.ts

// OLD: Render locally
const emailHtml = await render(
  NewsletterEmail({
    title: newsletter.title,
    contentHtml,
    newsletterSlug: newsletter.slug
  })
)

await resend.emails.send({
  html: emailHtml,
  // ...
})

// NEW: Use Resend Template
await resend.emails.send({
  from: 'Zachary Proser <newsletter@zackproser.com>',
  to: audienceId,
  subject: newsletter.title,
  template_id: process.env.RESEND_NEWSLETTER_TEMPLATE_ID!,
  template_variables: {
    title: newsletter.title,
    content_html: contentHtml,
    newsletter_slug: newsletter.slug,
    preview_text: newsletter.description || newsletter.title,
    year: new Date().getFullYear().toString()
  }
})
```

### Phase 3: Environment Variables

```bash
# Add to .env
RESEND_NEWSLETTER_TEMPLATE_ID=template_xxx
RESEND_TRANSACTIONAL_TEMPLATE_ID=template_yyy  # For purchase emails, etc.
```

### Phase 4: Gradual Rollout

1. **Keep both systems** initially
2. **Feature flag** to switch between old/new:
```typescript
const USE_RESEND_TEMPLATES = process.env.USE_RESEND_TEMPLATES === 'true'

if (USE_RESEND_TEMPLATES) {
  // New: Resend Templates
  await sendWithTemplate(...)
} else {
  // Old: React Email render
  await sendWithReactEmail(...)
}
```
3. **Test with small audience** first
4. **Monitor deliverability** and open rates
5. **Full cutover** when confident

---

## Template Variable Strategy

### Newsletter Template Variables

```typescript
{
  // Core content
  title: string,
  content_html: string,
  preview_text: string,

  // Links
  newsletter_slug: string,
  web_url: string,

  // Footer
  year: string,
  unsubscribe_url: string,  // Resend provides this

  // Optional
  author_name: string,
  author_image_url: string,
  featured_image_url: string
}
```

### Transactional Email Template Variables

```typescript
// Purchase confirmation
{
  customer_name: string,
  product_title: string,
  purchase_date: string,
  amount: string,
  download_url: string,
  receipt_url: string
}

// Welcome email
{
  first_name: string,
  verification_url: string,
  getting_started_url: string
}
```

---

## Benefits for Your Use Case

### 1. Newsletter System
- **Faster sends** - No server-side rendering
- **Template tweaks** - Change design without deploying
- **Seasonal updates** - Holiday themes, special editions

### 2. Transactional Emails
- **Purchase confirmations** - Consistent branding
- **Magic links** - Unified template for NextAuth
- **Notifications** - Product updates, alerts

### 3. Testing & Optimization
- **A/B test designs** - Multiple template variants
- **Preview in dashboard** - See changes instantly
- **Analytics** - Track performance per template

---

## Template Management Best Practices

### Version Control Strategy

Since templates won't be in Git, maintain documentation:

```typescript
// src/emails/template-specs.ts

/**
 * Resend Template Specifications
 * These templates are managed in Resend dashboard
 * Last updated: 2025-01-15
 */

export const RESEND_TEMPLATES = {
  newsletter: {
    id: 'template_newsletter_v1',
    name: 'Newsletter - Main',
    variables: {
      title: 'Newsletter title',
      content_html: 'HTML content from MDX',
      newsletter_slug: 'URL slug for web version',
      preview_text: 'Email preview text'
    },
    notes: 'Main newsletter template with responsive layout'
  },

  purchase: {
    id: 'template_purchase_v1',
    name: 'Purchase Confirmation',
    variables: {
      customer_name: 'Customer first name',
      product_title: 'Product name',
      download_url: 'Direct download link'
    }
  }
} as const
```

### Testing Templates

```typescript
// scripts/test-resend-template.ts

async function testNewsletterTemplate() {
  const result = await resend.emails.send({
    from: 'test@zackproser.com',
    to: 'your-test-email@gmail.com',
    subject: '[TEST] Newsletter Template',
    template_id: RESEND_TEMPLATES.newsletter.id,
    template_variables: {
      title: 'Test Newsletter',
      content_html: '<h2>Test Content</h2><p>This is a test.</p>',
      newsletter_slug: 'test-newsletter',
      preview_text: 'Testing the template'
    }
  })

  console.log('Test email sent:', result.id)
}
```

---

## Migration Checklist

### Pre-Migration
- [ ] Resend Templates exit beta
- [ ] Review GA pricing (if different)
- [ ] Test templates with sample data
- [ ] Document all variables needed
- [ ] Create backup of current React Email templates

### Migration
- [ ] Create templates in Resend dashboard
- [ ] Add template IDs to environment variables
- [ ] Update send endpoint to use templates
- [ ] Add feature flag for gradual rollout
- [ ] Test with small audience (10-50 emails)

### Post-Migration
- [ ] Monitor deliverability rates
- [ ] Compare open/click rates to baseline
- [ ] Document template specifications
- [ ] Remove old React Email code (or keep as fallback)
- [ ] Update documentation

---

## Cost Considerations

**Current Approach:**
- API route compute time for rendering
- ~10-50ms per email to render
- Vercel function execution cost

**Resend Templates:**
- No compute time (rendering done by Resend)
- Potentially faster sends
- May have template storage costs (TBD when GA)

**Verdict:** Likely small savings on compute, but main benefit is convenience.

---

## Recommendation

### Short Term (Now - 6 months)
✅ **Keep current React Email approach**
- It's working great
- Full control
- No beta dependencies
- Version controlled

### Medium Term (6-12 months)
🔄 **Evaluate Resend Templates**
- Check if out of beta
- Review GA features & pricing
- Consider for transactional emails first (lower risk)

### Long Term (12+ months)
✅ **Migrate newsletters to templates**
- Once proven with transactional emails
- If you want non-technical editing
- If performance matters

---

## Alternative: Hybrid Approach

You could use **both** systems:

```typescript
// Newsletters: React Email (full control, complex layouts)
if (emailType === 'newsletter') {
  await sendWithReactEmail(...)
}

// Transactional: Resend Templates (simple, consistent)
if (emailType === 'transactional') {
  await sendWithTemplate(...)
}
```

**Best of both worlds:**
- Complex newsletters stay in code
- Simple transactional emails use templates
- Team can edit templates without deploy

---

## Summary

**Current approach is solid.** Don't rush to migrate. When Resend Templates are GA and stable:

1. Start with **transactional emails** (lower risk)
2. Test thoroughly with small audience
3. Consider **hybrid approach** (newsletters in code, transactional in templates)
4. Only migrate newsletters if **non-technical editing** is needed

**Your React Email setup is production-ready and will serve you well until Templates are stable.**

