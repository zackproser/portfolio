# Email Marketing Playbook: Affiliate Conversion Engine

This playbook documents the exact EmailOctopus automations, email sequences, and segmentation strategy to convert newsletter subscribers into affiliate revenue for WisprFlow and Granola.

## Architecture Overview

```
[Signup] → /api/form → EmailOctopus (auto-tagged by referrer)
                              ↓
                    [Tag-based Automations]
                     /        |        \
          Welcome      Vertical      Behavioral
          Sequence     Nurture       Re-engage
                              ↓
           [Email Links] → /api/click → Tag + Redirect → Affiliate URL
```

### How It Works

1. **Signup**: Visitor subscribes from a blog post, demo, or homepage
2. **Auto-tagging**: `/api/form` runs `getTagsFromReferrer()` to automatically tag the subscriber with interest and vertical tags (e.g., `interest:voice-ai`, `vertical:real-estate`)
3. **Automations fire**: EmailOctopus tag-based automations send targeted email sequences
4. **Click tracking**: Email links route through `/api/click` which adds behavioral tags (e.g., `clicked:wisprflow`) and redirects to the affiliate URL with UTM params
5. **Segmentation deepens**: Each click adds more tags, enabling increasingly targeted follow-ups

---

## Tag Taxonomy

### Auto-applied at signup (via referrer)

| Tag | Meaning | Applied when referrer contains |
|-----|---------|-------------------------------|
| `interest:voice-ai` | Interested in voice AI tools | "voice", "wisprflow", "dictat" |
| `interest:wisprflow` | Specifically interested in WisprFlow | "wisprflow" |
| `interest:granola` | Specifically interested in Granola | "granola" |
| `interest:meetings` | Interested in meeting tools | "meeting", "transcribe" |
| `interest:ai-engineering` | Developer/AI builder | "rag", "vector", "openai", "codex" |
| `vertical:real-estate` | Real estate professional | "realtor", "real-estate", "listing" |
| `vertical:property-mgmt` | Property manager | "property-manager" |
| `vertical:mortgage` | Mortgage broker | "mortgage" |
| `vertical:legal` | Lawyer/legal professional | "lawyer", "legal" |
| `vertical:accounting` | Accountant/CPA | "accountant", "cpa" |
| `vertical:insurance` | Insurance agent | "insurance" |
| `vertical:small-business` | Small business owner | "small-business" |
| `intent:comparison` | High purchase intent (comparison page) | "vs-" |
| `source:blog` | Signed up from blog | "/blog/" |
| `source:demo` | Signed up from demo page | "/demos/" |
| `source:homepage` | Signed up from homepage | "/" |

### Applied via email clicks (via /api/click)

| Tag | Meaning |
|-----|---------|
| `clicked:wisprflow` | Clicked a WisprFlow affiliate link |
| `clicked:granola` | Clicked a Granola affiliate link |
| `email:welcome-1` | Opened/clicked in welcome email 1 |
| `email:welcome-2` | Opened/clicked in welcome email 2 |
| `email:welcome-3` | Opened/clicked in welcome email 3 |
| `email:nurture-voice` | Engaged with voice AI nurture content |
| `email:nurture-realestate` | Engaged with real estate content |

---

## Automation 1: Welcome Sequence (All Subscribers)

**Trigger**: Contact added to list
**Goal**: Introduce yourself, deliver value, soft-pitch affiliate tools

### Email 1: Welcome (Immediate)

**Subject**: Welcome — here's what I actually use every day
**Delay**: Send immediately

```
Hey {{FirstName}},

Thanks for joining. I'm Zack — I write about AI tools that actually
save time (not just the ones that make good demos).

Here's the one thing I wish someone told me earlier:

The biggest productivity unlock isn't a better app. It's switching
from typing to speaking. I write 4x faster now, and my meeting notes
take themselves.

Two tools made that happen:

→ WisprFlow — voice-to-text that works everywhere on your Mac
[LINK: /api/click?e={{EmailAddress}}&tag=clicked:wisprflow&tag=email:welcome-1&r=WISPRFLOW_AFFILIATE_URL]

→ Granola — invisible AI meeting notes (no bot joins your call)
[LINK: /api/click?e={{EmailAddress}}&tag=clicked:granola&tag=email:welcome-1&r=GRANOLA_AFFILIATE_URL]

Both have free trials. I'll share more about how I use them this week.

— Zack
```

### Email 2: Social proof + use case (Day 2)

**Subject**: How I wrote a 2,000-word article in 12 minutes
**Delay**: 2 days after Email 1

```
{{FirstName}},

Last week I dictated a full technical article — 2,000 words — in
12 minutes flat using WisprFlow.

Typing it would have taken 45+ minutes.

Here's the thing most people miss about voice-to-text: it's not
just faster typing. It changes HOW you think. When you speak, you
explain things more naturally. Less overthinking, more flow.

I wrote about the exact workflow here:
[LINK: /api/click?e={{EmailAddress}}&tag=email:welcome-2&r=https://zackproser.com/blog/wisprflow-review]

If you try it, reply and tell me your WPM. I hit 179.

— Zack

P.S. WisprFlow has a free trial — no credit card needed:
[LINK: /api/click?e={{EmailAddress}}&tag=clicked:wisprflow&tag=email:welcome-2&r=WISPRFLOW_AFFILIATE_URL]
```

### Email 3: Meeting notes angle (Day 5)

**Subject**: The meeting tool nobody sees coming
**Delay**: 3 days after Email 2

```
{{FirstName}},

Quick question: how many hours do you spend on meeting notes per week?

Most people say 3-5 hours. I spent zero last week.

Granola runs invisibly during calls. No bot joins. No "Otter is
requesting to join" notification. Your clients/colleagues never
know it's there.

After each meeting, you get structured notes with action items.

I compared it head-to-head with Otter.ai:
[LINK: /api/click?e={{EmailAddress}}&tag=email:welcome-3&r=https://zackproser.com/blog/granola-vs-otter-which-is-better]

If you do meetings, this will change your workflow:
[LINK: /api/click?e={{EmailAddress}}&tag=clicked:granola&tag=email:welcome-3&r=GRANOLA_AFFILIATE_URL]

— Zack
```

---

## Automation 2: Real Estate Vertical Nurture

**Trigger**: Tag added → `vertical:real-estate`
**Goal**: Send real-estate-specific content that positions WisprFlow and Granola for agents

### Email 1: Agent-specific hook (Day 1 after tag)

**Subject**: The listing description trick top agents use
**Delay**: 1 day after trigger

```
{{FirstName}},

I've been writing about how voice AI tools are changing real estate.

Here's the move: walk the property, dictate what you see room by
room, and have a polished MLS description before you leave.

300 words in 2 minutes instead of 15 minutes typing at your desk.

Full walkthrough:
[LINK: /api/click?e={{EmailAddress}}&tag=email:nurture-realestate&tag=clicked:content:listing-desc&r=https://zackproser.com/blog/ai-listing-description-generator]

The tool that makes it work:
[LINK: /api/click?e={{EmailAddress}}&tag=clicked:wisprflow&tag=email:nurture-realestate&r=WISPRFLOW_AFFILIATE_URL]

— Zack
```

### Email 2: CRM + meetings angle (Day 4)

**Subject**: Stop updating your CRM at 9 PM
**Delay**: 3 days after Email 1

```
{{FirstName}},

Most agents update their CRM at the end of the day. By then, half
the details from showings are gone.

Two changes that fix this:

1. Dictate CRM notes between showings (WisprFlow works with every
   CRM — if you can type in it, you can dictate in it)

2. Auto-capture client call notes (Granola records calls invisibly
   and gives you structured notes with action items)

I wrote a complete guide for real estate CRM voice workflows:
[LINK: /api/click?e={{EmailAddress}}&tag=email:nurture-realestate&r=https://zackproser.com/blog/voice-crm-for-real-estate]

Try WisprFlow free:
[LINK: /api/click?e={{EmailAddress}}&tag=clicked:wisprflow&tag=email:nurture-realestate&r=WISPRFLOW_AFFILIATE_URL]

Try Granola free:
[LINK: /api/click?e={{EmailAddress}}&tag=clicked:granola&tag=email:nurture-realestate&r=GRANOLA_AFFILIATE_URL]

— Zack
```

### Email 3: Complete guide (Day 8)

**Subject**: The 2 tools every agent needs in 2026 (complete guide)
**Delay**: 4 days after Email 2

```
{{FirstName}},

I put together a complete guide on voice AI tools for real estate:

→ Best Voice Tools for Realtors 2026
[LINK: /api/click?e={{EmailAddress}}&tag=email:nurture-realestate&r=https://zackproser.com/blog/best-voice-tools-for-realtors-2026]

It covers:
- MLS listing descriptions (2 min instead of 15)
- Client email dictation
- Invisible meeting notes for buyer consultations
- CRM voice updates between showings
- Weekly time savings breakdown (11+ hours)

If you only try one thing, start with WisprFlow for listings:
[LINK: /api/click?e={{EmailAddress}}&tag=clicked:wisprflow&tag=email:nurture-realestate&r=WISPRFLOW_AFFILIATE_URL]

— Zack
```

---

## Automation 3: Voice AI Interest Nurture

**Trigger**: Tag added → `interest:voice-ai` (AND NOT `vertical:real-estate`)
**Goal**: General voice AI content for non-vertical subscribers

### Email 1: Best tools overview (Day 1)

**Subject**: The 2 voice AI tools I use every day
**Delay**: 1 day after trigger

```
{{FirstName}},

Since you're interested in voice AI, here are the two tools I
actually use daily:

**WisprFlow** — System-level voice-to-text for Mac. Works in every
app. I dictate at 179 WPM (vs. 45 WPM typing).
[LINK: /api/click?e={{EmailAddress}}&tag=clicked:wisprflow&tag=email:nurture-voice&r=WISPRFLOW_AFFILIATE_URL]

**Granola** — Invisible AI meeting notes. No bot joins your call.
After each meeting, you get structured notes + action items.
[LINK: /api/click?e={{EmailAddress}}&tag=clicked:granola&tag=email:nurture-voice&r=GRANOLA_AFFILIATE_URL]

Full comparison and review:
[LINK: /api/click?e={{EmailAddress}}&tag=email:nurture-voice&r=https://zackproser.com/blog/wisprflow-review]

Both have free trials. Let me know what you think.

— Zack
```

### Email 2: Deep dive + demo (Day 4)

**Subject**: See voice-to-text in action (live demo)
**Delay**: 3 days after Email 1

```
{{FirstName}},

I built an interactive demo showing how voice AI pipelines work
under the hood:

→ Voice AI Demo
[LINK: /api/click?e={{EmailAddress}}&tag=email:nurture-voice&tag=clicked:content:demo&r=https://zackproser.com/demos/voice-ai]

It walks through the full pipeline — from speech capture to
formatted text — and shows where tools like WisprFlow and Granola
fit in.

Worth 5 minutes if you're evaluating voice tools.

— Zack
```

---

## Automation 4: High-Intent Re-engage

**Trigger**: Tag added → `clicked:wisprflow` OR `clicked:granola`
**Condition**: Wait 7 days, then check if they've been tagged with the OTHER product
**Goal**: Cross-sell the second tool to people who clicked the first

### Email 1: Cross-sell (7 days after click)

**For WisprFlow clickers who haven't clicked Granola:**

**Subject**: You're dictating faster — now automate your meetings too
**Delay**: 7 days after trigger

```
{{FirstName}},

Since you checked out WisprFlow for voice-to-text, I wanted to
share the other half of my voice workflow.

WisprFlow handles everything I type. But Granola handles everything
I say in meetings.

It runs invisibly during calls and gives me structured notes with
action items. No bot joins. No one knows it's running.

I compared it to Otter.ai here:
[LINK: /api/click?e={{EmailAddress}}&tag=clicked:granola&tag=email:cross-sell&r=GRANOLA_AFFILIATE_URL]

Together, WisprFlow + Granola cover every word — typed and spoken.

— Zack
```

---

## Automation 5: Comparison Page Converter

**Trigger**: Tag added → `intent:comparison`
**Goal**: People on comparison pages have HIGH purchase intent. Strike fast.

### Email 1: Decision helper (Immediate)

**Subject**: Quick comparison to help you decide
**Delay**: Send immediately

```
{{FirstName}},

Looks like you're evaluating voice/meeting tools. Here's my quick take:

**If you need voice-to-text (dictation):**
WisprFlow is the best option for Mac. It's system-level, so it works
in every app. 179 WPM in my testing.
→ Try it free: [WISPRFLOW LINK]

**If you need meeting notes:**
Granola beats Otter.ai for one reason: no bot joins your call. It
runs invisibly and produces better-structured notes.
→ Try it free: [GRANOLA LINK]

**If you need both:** Start with whichever pain point is bigger.
Both have free trials.

Full comparison articles:
- WisprFlow vs Whisper: [LINK]
- WisprFlow vs Dragon: [LINK]
- Granola vs Otter.ai: [LINK]

— Zack
```

---

## Setting Up in EmailOctopus

### Step 1: Create the Tags

Go to your list → Tags and create all tags from the taxonomy above. The `/api/form` and `/api/click` routes will also auto-create tags, but pre-creating them makes automation setup easier.

### Step 2: Create Automations

For each automation above:

1. Go to **Automations** → **Create automation**
2. Select the trigger type:
   - Welcome Sequence: **Contact added**
   - Vertical Nurtures: **Contact tag added** → select the tag
   - Behavioral: **Contact tag added** → select the click tag
3. Add **Wait** steps between emails (days specified above)
4. Add **Send email** steps with the content above
5. For conditional automations (like cross-sell), use **Condition** steps to check for tags

### Step 3: Build Email Links

Every link in your emails should route through `/api/click` for behavioral tagging.

**Pattern for affiliate links:**
```
https://zackproser.com/api/click?e={{EmailAddress}}&tag=clicked:PRODUCT&tag=email:SEQUENCE-NAME&r=AFFILIATE_URL_WITH_UTM
```

**Pattern for content links:**
```
https://zackproser.com/api/click?e={{EmailAddress}}&tag=email:SEQUENCE-NAME&r=https://zackproser.com/blog/SLUG
```

### Step 4: Generate Links Programmatically

Use the utilities in `src/lib/subscriber-tags.ts`:

```typescript
import { getEmailAffiliateLink, getEmailContentLink } from '@/lib/subscriber-tags'

// Affiliate link for WisprFlow in welcome sequence
getEmailAffiliateLink(
  'https://zackproser.com',
  'wisprflow',
  'welcome-sequence',
  ['email:welcome-1']
)

// Content link to a blog post
getEmailContentLink(
  'https://zackproser.com',
  '/blog/wisprflow-review',
  ['email:welcome-2']
)
```

---

## Pre-built Link Reference

### WisprFlow Affiliate Links for Emails

**Welcome Sequence:**
```
Email 1: https://zackproser.com/api/click?e={{EmailAddress}}&tag=clicked%3Awisprflow&tag=email%3Awelcome-1&r=https%3A%2F%2Fref.wisprflow.ai%2Fzack-proser%3Futm_source%3Dzackproser%26utm_medium%3Dnewsletter%26utm_campaign%3Dwelcome-sequence%26utm_content%3Demail-cta

Email 2: https://zackproser.com/api/click?e={{EmailAddress}}&tag=clicked%3Awisprflow&tag=email%3Awelcome-2&r=https%3A%2F%2Fref.wisprflow.ai%2Fzack-proser%3Futm_source%3Dzackproser%26utm_medium%3Dnewsletter%26utm_campaign%3Dwelcome-sequence%26utm_content%3Demail-cta

Email 3: https://zackproser.com/api/click?e={{EmailAddress}}&tag=clicked%3Awisprflow&tag=email%3Awelcome-3&r=https%3A%2F%2Fref.wisprflow.ai%2Fzack-proser%3Futm_source%3Dzackproser%26utm_medium%3Dnewsletter%26utm_campaign%3Dwelcome-sequence%26utm_content%3Demail-cta
```

**Real Estate Nurture:**
```
Email 1: https://zackproser.com/api/click?e={{EmailAddress}}&tag=clicked%3Awisprflow&tag=email%3Anurture-realestate&r=https%3A%2F%2Fref.wisprflow.ai%2Fzack-proser%3Futm_source%3Dzackproser%26utm_medium%3Dnewsletter%26utm_campaign%3Drealestate-nurture%26utm_content%3Demail-cta

Email 2: https://zackproser.com/api/click?e={{EmailAddress}}&tag=clicked%3Awisprflow&tag=email%3Anurture-realestate&r=https%3A%2F%2Fref.wisprflow.ai%2Fzack-proser%3Futm_source%3Dzackproser%26utm_medium%3Dnewsletter%26utm_campaign%3Drealestate-nurture%26utm_content%3Demail-cta
```

### Granola Affiliate Links for Emails

**Welcome Sequence:**
```
Email 1: https://zackproser.com/api/click?e={{EmailAddress}}&tag=clicked%3Agranola&tag=email%3Awelcome-1&r=https%3A%2F%2Fgo.granola.ai%2Fzack-proser%3Futm_source%3Dzackproser%26utm_medium%3Dnewsletter%26utm_campaign%3Dwelcome-sequence%26utm_content%3Demail-cta

Email 3: https://zackproser.com/api/click?e={{EmailAddress}}&tag=clicked%3Agranola&tag=email%3Awelcome-3&r=https%3A%2F%2Fgo.granola.ai%2Fzack-proser%3Futm_source%3Dzackproser%26utm_medium%3Dnewsletter%26utm_campaign%3Dwelcome-sequence%26utm_content%3Demail-cta
```

### Content Links for Emails

```
WisprFlow Review: https://zackproser.com/api/click?e={{EmailAddress}}&tag=email%3Awelcome-2&r=https%3A%2F%2Fzackproser.com%2Fblog%2Fwisprflow-review

Granola vs Otter: https://zackproser.com/api/click?e={{EmailAddress}}&tag=email%3Awelcome-3&r=https%3A%2F%2Fzackproser.com%2Fblog%2Fgranola-vs-otter-which-is-better

Listing Description Guide: https://zackproser.com/api/click?e={{EmailAddress}}&tag=email%3Anurture-realestate&r=https%3A%2F%2Fzackproser.com%2Fblog%2Fai-listing-description-generator

Voice CRM Guide: https://zackproser.com/api/click?e={{EmailAddress}}&tag=email%3Anurture-realestate&r=https%3A%2F%2Fzackproser.com%2Fblog%2Fvoice-crm-for-real-estate

Best Realtor Tools: https://zackproser.com/api/click?e={{EmailAddress}}&tag=email%3Anurture-realestate&r=https%3A%2F%2Fzackproser.com%2Fblog%2Fbest-voice-tools-for-realtors-2026

Voice AI Demo: https://zackproser.com/api/click?e={{EmailAddress}}&tag=email%3Anurture-voice&tag=clicked%3Acontent%3Ademo&r=https%3A%2F%2Fzackproser.com%2Fdemos%2Fvoice-ai
```

---

## Metrics to Track

### EmailOctopus Segments to Create

Create these segments for ongoing monitoring:

| Segment | Condition | What it tells you |
|---------|-----------|-------------------|
| Voice AI Interested | Has tag `interest:voice-ai` | Total voice AI audience |
| Real Estate Vertical | Has tag `vertical:real-estate` | Real estate segment size |
| Clicked WisprFlow | Has tag `clicked:wisprflow` | WisprFlow funnel |
| Clicked Granola | Has tag `clicked:granola` | Granola funnel |
| Clicked Both | Has tags `clicked:wisprflow` AND `clicked:granola` | Cross-sell success |
| High Intent | Has tag `intent:comparison` | Ready-to-buy segment |
| Demo Visitors | Has tag `source:demo` | Demo-driven signups |

### Key Metrics

- **Welcome sequence completion rate**: % who receive all 3 emails
- **Affiliate click rate per email**: clicks on affiliate links / emails sent
- **Cross-sell rate**: % of single-product clickers who click the other product
- **Vertical nurture engagement**: open/click rates for vertical sequences
- **Tag-to-conversion time**: days between first tag and first affiliate click

---

## Revenue Projections

Based on current data:
- 4,000 subscribers
- ~30% open rate (industry average for tech newsletters)
- ~3-5% click rate on affiliate links in emails
- Voice AI demo converts at 28.6% click-through

### Conservative Estimate

```
4,000 subscribers
× 30% open welcome sequence
× 5% click affiliate link
= 60 affiliate clicks per welcome cohort

With ongoing nurture sequences:
× 2-3 additional touchpoints
= 120-180 total affiliate clicks

At even 5% conversion to paid:
= 6-9 new paying customers per cohort
```

As the list grows to 10,000+ and sequences are optimized, this becomes a meaningful recurring revenue stream.

---

## Implementation Checklist

- [x] Auto-tag subscribers at signup based on referrer (`/api/form` + `subscriber-tags.ts`)
- [x] Click tracking infrastructure for email links (`/api/click`)
- [x] Affiliate link generator for email templates (`getEmailAffiliateLink()`)
- [x] Content link generator for email templates (`getEmailContentLink()`)
- [ ] Create tags in EmailOctopus dashboard
- [ ] Set up Welcome Sequence automation (3 emails)
- [ ] Set up Real Estate Nurture automation (3 emails)
- [ ] Set up Voice AI Nurture automation (2 emails)
- [ ] Set up High-Intent Comparison automation (1 email)
- [ ] Set up Cross-sell automation (1 email)
- [ ] Create EmailOctopus segments for monitoring
- [ ] Test all click-through links in staging
- [ ] Monitor first week of data and iterate
