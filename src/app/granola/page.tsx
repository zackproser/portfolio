import { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata } from '@/utils/createMetadata'
import { getAffiliateLink } from '@/lib/affiliate'
import { GranolaCaptureForm } from './GranolaCaptureForm'
import {
  JumpBarScrollSpy,
  ReadingProgress,
  TimeSavedBar,
} from './GranolaInteractivity'

// ────────────────────────────────────────────────────────────────────────
// Granola pillar review — implementation of the Claude Design handoff.
//
// Layout follows the design HTML 1:1, with these adaptations for the
// production Next.js site:
//   - Site nav comes from the layout, so the design's <header class=nav>
//     is dropped.
//   - The "tweaks" panel + theme toggle are prototype-only — site has
//     its own dark-mode handling. Dropped.
//   - All CTAs route through getAffiliateLink({ campaign: 'granola-pillar',
//     medium: 'blog', placement, term }) so the Granola dashboard can
//     split conversions by section.
//   - Form posts to /api/form with the standard tags (interest:granola,
//     interest:meetings, source:granola-pillar) — see GranolaCaptureForm.
//   - Interactive elements (reading progress, jump-bar scroll-spy, the
//     time-saved bar) live in GranolaInteractivity.tsx as client
//     components.
// ────────────────────────────────────────────────────────────────────────

const PAGE_URL = 'https://zackproser.com/granola'
const PAGE_IMAGE = 'https://zackproser.b-cdn.net/images/granola-applied-ai-workos-hero.webp'
const PUBLISHED_AT = '2026-05-13'
const MODIFIED_AT = '2026-05-14'

export const metadata: Metadata = {
  title:
    'Granola review — the AI notetaker I actually use every meeting, 12 months in',
  description:
    'A long-form review of Granola from twelve months of daily use across exec syncs, customer calls, hiring screens, and external strategy. The four meeting shapes I run it for, the prompt pack I have refined, the comparison vs calendar bots and cloud recorders, the cost, and the limits I keep.',
  authors: [{ name: 'Zachary Proser', url: 'https://zackproser.com' }],
  keywords: [
    'Granola',
    'Granola AI',
    'Granola review',
    'Granola AI review',
    'AI meeting notes',
    'AI notetaker',
    'AI notetaker review',
    'meeting workflow',
    'local audio capture',
    'no-bot meeting notes',
    'Granola vs Otter',
    'Granola vs Fireflies',
    'Granola vs Zoom AI Companion',
    'Granola pricing',
    'Applied AI',
    'WorkOS Applied AI',
  ],
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'article',
    url: PAGE_URL,
    title: 'Granola review — the AI notetaker I actually use, every meeting, 12 months in',
    description:
      'Twelve months of daily use. Four meeting shapes, the prompt pack, the comparison, the cost, the limits. The first AI tool whose absence would measurably raise my baseline.',
    siteName: 'Zachary Proser',
    publishedTime: `${PUBLISHED_AT}T00:00:00.000Z`,
    modifiedTime: `${MODIFIED_AT}T00:00:00.000Z`,
    authors: ['Zachary Proser'],
    images: [
      {
        url: PAGE_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Granola running on a Mac during a live meeting — local capture, structured notes, transcript on the right.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Granola review — 12 months in',
    description:
      'Long-form review · four meeting shapes · prompt pack · comparison · pricing · the limits I keep. Local audio capture, no bot ever joins.',
    images: [PAGE_IMAGE],
    creator: '@zackproser',
  },
}

// ---- Affiliate URLs --------------------------------------------------------

const CAMPAIGN = 'granola-pillar'
const MEDIUM = 'blog' as const

function gLink(placement: 'hero-card' | 'sticky-cta' | 'text-link' | 'inline-cta' | 'compact-card', term: string) {
  return getAffiliateLink({ product: 'granola', campaign: CAMPAIGN, medium: MEDIUM, placement, term })
}

const links = {
  s02EarlyCta: gLink('hero-card', 's02-early-cta'),
  pricingFree: gLink('text-link', 'pricing-free'),
  pricingIndividual: gLink('sticky-cta', 'pricing-individual'),
  pricingBusiness: gLink('text-link', 'pricing-business'),
  s10MidCta: gLink('hero-card', 's10-mid-cta'),
  s15FinalCta: gLink('hero-card', 's15-final-cta'),
  sideRailPrimary: gLink('sticky-cta', 'side-rail-primary'),
  sideRailSkipEmail: gLink('text-link', 'side-rail-skip-email'),
} as const

// ---- JSON-LD ---------------------------------------------------------------

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Review',
      '@id': `${PAGE_URL}#review`,
      url: PAGE_URL,
      name: 'Granola — twelve months of daily use, reviewed',
      headline:
        'Granola review — the AI notetaker I actually use every meeting, 12 months in',
      datePublished: PUBLISHED_AT,
      dateModified: MODIFIED_AT,
      inLanguage: 'en-US',
      author: {
        '@type': 'Person',
        name: 'Zachary Proser',
        url: 'https://zackproser.com',
        jobTitle: 'Applied AI engineer',
        worksFor: { '@type': 'Organization', name: 'WorkOS' },
      },
      publisher: {
        '@type': 'Person',
        name: 'Zachary Proser',
        url: 'https://zackproser.com',
      },
      image: { '@type': 'ImageObject', url: PAGE_IMAGE, width: 1200, height: 630 },
      reviewBody:
        'Twelve months running Granola through every meeting on my calendar — exec syncs, customer calls, hiring screens, external strategy. Local-audio capture, no bot joins the call. Templates per meeting shape. The first AI tool whose absence would measurably raise my baseline.',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '4.6',
        bestRating: '5',
        worstRating: '1',
      },
      itemReviewed: {
        '@type': 'SoftwareApplication',
        '@id': 'https://granola.ai#app',
        name: 'Granola',
        url: 'https://granola.ai',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'macOS, Windows, iOS',
        description:
          'A desktop AI notetaker that captures meeting audio locally on your machine without joining the call as a bot.',
        offers: [
          { '@type': 'Offer', name: 'Basic', price: '0', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Business', price: '14', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Enterprise', price: '35', priceCurrency: 'USD' },
        ],
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Writing',
          item: 'https://zackproser.com/blog',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tool reviews',
          item: 'https://zackproser.com/blog?tag=review',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Partnerships',
          item: 'https://zackproser.com/partnerships',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Granola — 12 months',
          item: PAGE_URL,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Does Granola join the meeting as a bot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'No. Granola captures the audio locally on your machine without joining the call as a participant. The other side does not see a bot in the meeting.',
          },
        },
        {
          '@type': 'Question',
          name: 'What does Granola cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'As of May 2026, Granola has three tiers: Basic (free), Business ($14/user/month), and Enterprise ($35/user/month). Confirm current pricing on granola.ai.',
          },
        },
        {
          '@type': 'Question',
          name: 'What platforms does Granola run on?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Granola has a desktop app for macOS and Windows, plus an iOS app for phone-call capture on the go.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where does Granola not work well?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Capture quality drops in cold-room transcription (multiple people through a single speakerphone), with heavily overlapping speakers, and in non-English meetings beyond Spanish and French. The first week of use is also a tax until you have templates set up.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is Granola different from Otter, Fireflies, or the Zoom AI Companion?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Granola is the only one of the four that captures audio locally without joining the meeting as a bot. It also works on personal devices without calendar integration, supports user-defined templates per meeting shape, and lets you chat against the transcript afterward to produce derived artifacts like Slack updates and CRM rows.',
          },
        },
      ],
    },
  ],
}

// ---- Page ------------------------------------------------------------------

export default function GranolaPillarPage() {
  return (
    <div className="granola-pillar" data-density="comfortable">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />

      {/* ============ JUMP NAV ============ */}
      <div className="g-jumpbar" id="jumpbar">
        <div className="gx-container g-jumpbar-inner">
          <span className="label">§ Sections</span>
          <a href="#s01">01 Verdict</a><span className="sep">·</span>
          <a href="#s03">03 Shapes</a><span className="sep">·</span>
          <a href="#s05">05 Templates</a><span className="sep">·</span>
          <a href="#s08">08 Comparison</a><span className="sep">·</span>
          <a href="#s10">10 Pricing</a><span className="sep">·</span>
          <a href="#s11">11 Prompts</a><span className="sep">·</span>
          <a href="#s12">12 Where it breaks</a><span className="sep">·</span>
          <a href="#s14">14 The take</a><span className="sep">·</span>
          <a href="#cta-trial">Try free →</a>
        </div>
      </div>
      <JumpBarScrollSpy />

      <main>
        {/* ============ BREADCRUMB ============ */}
        <div className="gx-container">
          <div className="post-crumbs">
            <Link href="/blog">Writing</Link><span className="sep">/</span>
            <span>Tool reviews</span><span className="sep">/</span>
            <Link href="/partnerships">Partnerships</Link><span className="sep">/</span>
            <span className="current">Granola — 12 months</span>
          </div>
        </div>

        {/* ============ HERO ============ */}
        <section className="hdr-A g-hero" id="hero">
          <div className="gx-container">
            <div className="hdr-A-grid">
              <div>
                <div className="post-kicker">
                  § 00 · 12 months daily use
                </div>
                <h1 className="post-title">
                  The first AI tool whose <em>absence</em> would measurably raise my anxiety level.
                </h1>
                <p className="post-dek">
                  Twelve months running Granola through every meeting on my calendar. The honest review — what it is, what it is not, the templates I have refined, the cost, the limits I keep. Written long because Granola is the one I would write long about.
                </p>

                <dl className="verdict">
                  <div>
                    <dt>Daily use</dt>
                    <dd>12<span className="unit">months</span></dd>
                  </div>
                  <div>
                    <dt>Meetings logged</dt>
                    <dd>~420</dd>
                  </div>
                  <div>
                    <dt>Score</dt>
                    <dd className="score">4.6<span className="small">/ 5</span></dd>
                  </div>
                  <div>
                    <dt>Verdict</dt>
                    <dd>Keep</dd>
                  </div>
                </dl>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <div className="g-plate" aria-hidden="true">
                  <div className="g-plate-meta">
                    <span>Plate I</span>
                    <span>2026 · ZP</span>
                  </div>
                  <div className="g-glyph">G</div>
                  <div className="g-plate-caption">
                    <span>Granola</span>
                    <span>local-audio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PROS/CONS GLANCE ============ */}
        <div className="gx-container">
          <div className="post-measure">
            <div className="g-verdict-table" id="s01">
              <div className="g-vt-head">
                <div className="pro">+ What it does that nothing else does</div>
                <div className="con">− Where I would not reach for it</div>
              </div>
              <div className="g-vt-body">
                <div className="col pro">
                  <ul>
                    <li>Local-audio capture means I never invite a bot, never break a calendar policy, never explain a recorder.</li>
                    <li>Live transcript, then a re-write — the notes I get back are structured to my templates, not a verbatim wall.</li>
                    <li>The chat-with-your-meeting layer turns one capture into a Slack update, CRM row, follow-up email, internal doc.</li>
                    <li>Templates are mine, not the vendor&apos;s. I edited each one for ~3 weeks and they have stayed stable since.</li>
                  </ul>
                </div>
                <div className="col con">
                  <ul>
                    <li>Personal calls where consent is unclear. Local-audio is technically silent, not ethically silent.</li>
                    <li>Pasting verbatim transcripts back at people. The summary is for me; what I send is something I wrote.</li>
                    <li>Pretending it is doing the listening for me. It captures. I still have to think.</li>
                    <li>Multi-party recordings where one party uses a strict no-AI policy. I run the script aloud and skip.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ § 01 LEDE ============ */}
        <div className="gx-container">
          <article className="post-measure post-body">
            <h2 className="g-section-head" id="s01-thirty">
              <span className="post-kicker">§ 01 · Thirty seconds</span>
            </h2>
            <h2 style={{ marginTop: 0 }}>Thirty seconds to say it first.</h2>
            <p className="g-lede">
              Twelve months ago I would not have written a 5,000-word review of a meeting tool. Six months ago I would have. The thing that changed is that the meeting tool stopped being the thing I was reviewing and started being the substrate everything else sits on — the Slack update, the CRM row, the follow-up email, the internal doc, the prompt I run at the end of the week to ask what I have actually been working on. Granola is the layer that turns my week of meetings into structured text I can edit and forward. It earned that position by being silently good at the boring part, and by getting out of the way for everything downstream.
            </p>

            <h2 className="g-section-head" id="s02">
              <span className="post-kicker">§ 02 · Definition</span>
            </h2>
            <h2 style={{ marginTop: 0 }}>What Granola is, in one paragraph.</h2>
            <div className="g-prose">
              <p>
                Granola is a desktop notetaker — Mac, Windows, iOS — that captures the audio of whatever meeting you are in <em>locally</em>, on your machine, without joining the call as a bot. It transcribes in real time, writes notes to whichever template you point it at, and lets you chat against the resulting transcript afterward to produce derived artifacts. There is no calendar bot, no shared recording link, no &ldquo;Hi everyone, I&apos;m an AI notetaker.&rdquo; The tradeoff is honest: it cannot capture audio from people not in the room with you unless your machine can hear them, which is exactly the same condition you already operate under as the human in the meeting.
              </p>
            </div>
          </article>
        </div>

        {/* ============ CTA #1 (early — for the convinced) ============ */}
        <div className="gx-container">
          <div className="post-measure">
            <div className="g-cta" id="cta-trial">
              <div className="g-cta-head">
                <span className="left">§ 02 · Try it on next week&apos;s calendar</span>
                <span className="right">~5 min setup · cancel anytime</span>
              </div>
              <h3>Run Granola through one meeting this week. Decide on Friday.</h3>
              <p>
                Free trial, no credit card. The fastest way to know if it works for you is to put it on one meeting and read the output back. That is what I did. I have not switched in 12 months.
              </p>
              <ul>
                <li>Free plan available — no credit card to try</li>
                <li>~5 minute setup, runs in the background</li>
                <li>Cancel anytime · Mac, Windows, iOS clients</li>
              </ul>
              <div className="g-cta-actions">
                <a
                  className="g-btn g-btn-primary"
                  href={links.s02EarlyCta}
                  rel="sponsored noopener"
                  target="_blank"
                >
                  Start your free trial <span aria-hidden="true">↗</span>
                </a>
                <a className="g-btn g-btn-secondary" href="#s15">
                  Send me the workflow guide first ↓
                </a>
              </div>
              <div className="g-cta-foot">
                <span>Mac</span><span className="dot">·</span>
                <span>Windows</span><span className="dot">·</span>
                <span>iOS</span><span className="dot">·</span>
                <span>Free plan available</span><span className="dot">·</span>
                <span>No credit card to try</span><span className="dot">·</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ LAPTOP FIGURE ============ */}
        <div className="gx-container">
          <div className="post-wide g-laptop-figure">
            <div className="g-laptop" aria-hidden="true">
              <div className="g-laptop-screen">
                <div className="g-laptop-bar">
                  <div className="dots"><span /><span /><span /></div>
                  <div className="tab">Tue · 2:00pm — Quarterly review</div>
                  <div className="right">⌘N · ⌘K · ⌘E</div>
                </div>
                <div className="g-laptop-body">
                  <aside className="g-laptop-side">
                    <div className="sec">Today</div>
                    <div className="item active"><span className="dot" />Quarterly review<span className="live">LIVE</span></div>
                    <div className="item"><span className="dot" />1:1 with Priya</div>
                    <div className="item"><span className="dot" />Eng standup</div>
                    <div className="sec">Yesterday</div>
                    <div className="item"><span className="dot" />Customer · Acme</div>
                    <div className="item"><span className="dot" />Hiring debrief</div>
                    <div className="item"><span className="dot" />Prep · roadmap</div>
                    <div className="sec">Templates</div>
                    <div className="item"><span className="dot" />1:1 (engineer)</div>
                    <div className="item"><span className="dot" />Customer call</div>
                    <div className="item"><span className="dot" />Hiring · screen</div>
                  </aside>
                  <div className="g-laptop-main">
                    <div className="meta">
                      <span className="live">Recording locally</span>
                      <span>00:14:32</span>
                      <span>Template · 1:1 engineer</span>
                    </div>
                    <div className="title">Q3 review with Priya · what shipped, what slipped, what we need next quarter</div>
                    <div className="h">What we shipped this quarter</div>
                    <div className="skel w9" /><div className="skel w7" /><div className="skel w5" />
                    <div className="h">What slipped, and the honest reason</div>
                    <div className="skel w9" /><div className="skel w7" /><div className="skel w9" /><div className="skel w5" />
                    <div className="h">Asks for next quarter</div>
                    <div className="skel w7" /><div className="skel w9" />
                  </div>
                </div>
              </div>
            </div>
            <div className="g-laptop-caption">
              <span className="num">FIG · 01</span>
              <span className="cap">
                Granola during a meeting — local recording, live transcript, structured notes anchored to a template I wrote.
              </span>
            </div>
          </div>
        </div>

        {/* ============ § 03 MEETING SHAPES ============ */}
        <div className="gx-container">
          <article className="post-measure post-body">
            <h2 className="g-section-head" id="s03">
              <span className="post-kicker">§ 03 · How I use it</span>
            </h2>
            <h2 style={{ marginTop: 0 }}>The four meeting shapes that drive my week.</h2>
            <div className="g-prose">
              <p>
                I do not believe a meeting tool is general. I believe a meeting tool is good at the four or five meeting shapes you actually attend. Mine are below. Yours are different, and Granola will only work if you spend a week noticing yours and writing templates against them.
              </p>
            </div>
          </article>

          <div className="post-wide">
            <div className="g-shapes">
              <div className="g-shape">
                <div className="icon">1:1</div>
                <h4>Direct-report 1:1</h4>
                <div className="meta">Weekly · 30 min</div>
                <p>Two columns: what they brought, what I asked. A row at the bottom for anything I owe back by Friday. The transcript exists; the notes I send do not quote it.</p>
                <div className="freq">~6 / week</div>
              </div>
              <div className="g-shape">
                <div className="icon">CX</div>
                <h4>Customer call</h4>
                <div className="meta">Ad-hoc · 30–45 min</div>
                <p>Use case, friction, the line they said that I want my PM to read verbatim, the asks I am taking back. CRM row gets written from the same transcript.</p>
                <div className="freq">~4 / week</div>
              </div>
              <div className="g-shape">
                <div className="icon">HR</div>
                <h4>Hiring screen</h4>
                <div className="meta">Calendar · 45 min</div>
                <p>Signals against my rubric. Quote two lines. Recommendation. Granola removes the part where I lose two of the four signals to writing speed.</p>
                <div className="freq">~3 / week</div>
              </div>
              <div className="g-shape">
                <div className="icon">EXT</div>
                <h4>External strategy</h4>
                <div className="meta">Ad-hoc · 60 min</div>
                <p>Who is in the room, what each one is anchored on, what was decided, what is parked. Granola is most useful here because I am most useful when I do not write.</p>
                <div className="freq">~2 / week</div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ § 04 TEMPLATE YAML ============ */}
        <div className="gx-container">
          <article className="post-measure post-body">
            <h2 className="g-section-head" id="s04">
              <span className="post-kicker">§ 04 · Templates as YAML</span>
            </h2>
            <h2 style={{ marginTop: 0 }}>How I structure a template — the shape, not the prose.</h2>
            <div className="g-prose">
              <p>
                I write templates as a list of section headings with a one-line instruction underneath. The model fills the body; I edit the body to match how I would have written it. The structure does not change between meetings of the same shape. Stability is the point.
              </p>
            </div>

            <div className="post-code">
              <div className="post-code-chrome">
                <div className="dot" /><div className="dot" /><div className="dot" />
                <div className="label">~/granola/templates/1-1-engineer.yml</div>
              </div>
              <pre className="post-code-body">
                <span className="cm"># 1:1 with an engineer · weekly · 30 min</span>{'\n'}
                <span className="kw">template</span>: <span className="st">&quot;1:1 · engineer&quot;</span>{'\n'}
                <span className="kw">sections</span>:{'\n'}
                {'  '}- <span className="kw">heading</span>: <span className="st">&quot;What they brought&quot;</span>{'\n'}
                {'    '}<span className="kw">instruct</span>: <span className="st">&quot;Bullet what THEY raised. Do not editorialize.&quot;</span>{'\n'}
                {'  '}- <span className="kw">heading</span>: <span className="st">&quot;What I asked&quot;</span>{'\n'}
                {'    '}<span className="kw">instruct</span>: <span className="st">&quot;Questions I asked + the answer in one line each.&quot;</span>{'\n'}
                {'  '}- <span className="kw">heading</span>: <span className="st">&quot;Career / growth thread&quot;</span>{'\n'}
                {'    '}<span className="kw">instruct</span>: <span className="st">&quot;Any growth signal — promotion, scope, scope-loss.&quot;</span>{'\n'}
                {'  '}- <span className="kw">heading</span>: <span className="st">&quot;Risks they flagged&quot;</span>{'\n'}
                {'    '}<span className="kw">instruct</span>: <span className="st">&quot;Project risks, team risks, dependencies.&quot;</span>{'\n'}
                {'  '}- <span className="kw">heading</span>: <span className="st">&quot;What I owe by Friday&quot;</span>{'\n'}
                {'    '}<span className="kw">instruct</span>: <span className="st">&quot;Action items I committed to. Owner = me. Due = Fri.&quot;</span>{'\n'}
                <span className="kw">style</span>:{'\n'}
                {'  '}<span className="kw">voice</span>: <span className="st">&quot;first-person, short, no jargon&quot;</span>{'\n'}
                {'  '}<span className="kw">verbatim_quotes</span>: <span className="nm">true</span>   <span className="cm"># keep the line that mattered</span>
              </pre>
            </div>

            <div className="g-prose">
              <p>
                That template runs ~6 times a week. It does not change. When it does change, it is because the meeting shape changed underneath me, which is rare and worth noticing.
              </p>
            </div>
          </article>
        </div>

        {/* ============ § 05 TEMPLATES LIST ============ */}
        <div className="gx-container">
          <article className="post-measure post-body">
            <h2 className="g-section-head" id="s05">
              <span className="post-kicker">§ 05 · The list</span>
            </h2>
            <h2 style={{ marginTop: 0 }}>A list of templates I run more than once a week.</h2>
            <div className="g-prose">
              <ul className="def-list">
                <li><strong>1:1 (engineer).</strong> The one above. Six instances a week. The most-edited template I own.</li>
                <li><strong>1:1 (manager).</strong> Same shape, an extra section for org context. Two instances a week.</li>
                <li><strong>Customer call (discovery).</strong> Use case, friction, quote, ask, follow-up. Feeds the CRM row.</li>
                <li><strong>Customer call (escalation).</strong> Same plus a strict timeline section and a who-owns-it row.</li>
                <li><strong>Hiring screen.</strong> Rubric signals + two verbatim quotes + recommendation. No editorializing.</li>
                <li><strong>External strategy.</strong> Room map at the top, decisions in the middle, parked items at the bottom.</li>
                <li><strong>Internal review.</strong> What shipped, what slipped, the honest reason, asks for next quarter.</li>
                <li><strong>Pre-mortem.</strong> One section per failure mode. Three lines: how it happens, how we catch it, what we do.</li>
              </ul>
            </div>

            <p className="g-pullquote">
              Eight templates cover roughly 95% of my calendar. The other 5% is unstructured enough that imposing a template would have removed the meeting&apos;s point.
            </p>
          </article>
        </div>

        <div className="g-dots">· · ·</div>

        {/* ============ § 06 BEFORE / AFTER WORKFLOW ============ */}
        <div className="gx-container">
          <article className="post-measure post-body">
            <h2 className="g-section-head" id="s06">
              <span className="post-kicker">§ 06 · The shift</span>
            </h2>
            <h2 style={{ marginTop: 0 }}>The before-and-after that justified keeping it.</h2>
            <div className="g-prose">
              <p>
                I have run a meeting tool before. Two, actually. Both got uninstalled inside a month. The difference here is not capture quality — capture quality has been roughly fine across the category for two years. The difference is what happens to the capture after the meeting ends.
              </p>
            </div>
          </article>

          <div className="post-wide">
            <div className="g-3up">
              <div className="col">
                <div className="num">→ 01 · Capture</div>
                <h4>Local audio, never a bot.</h4>
                <p>I hit ⌘N at the top of a call. Granola starts recording the audio my machine can hear. No invites, no calendar policy, no &ldquo;this call is being recorded.&rdquo;</p>
              </div>
              <div className="col featured">
                <div className="num">→ 02 · Structure</div>
                <h4>Re-write to my template.</h4>
                <p>When the call ends, Granola rewrites the transcript into the template I pointed it at. The output is roughly the doc I would have written if I had been writing instead of listening.</p>
              </div>
              <div className="col">
                <div className="num">→ 03 · Distribute</div>
                <h4>Chat for derived artifacts.</h4>
                <p>I ask: write the Slack update; the CRM row; the follow-up to the customer; what I owe by Friday. One capture, four artifacts, none of them verbatim.</p>
              </div>
            </div>

            <div className="g-plates-row">
              <div className="g-mini-plate">
                <span className="label">Plate II</span>
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                  <rect x="14" y="20" width="72" height="46" rx="4" />
                  <rect x="40" y="66" width="20" height="6" />
                  <rect x="30" y="72" width="40" height="3" rx="1" />
                  <circle cx="50" cy="43" r="6" />
                  <path d="M50 30v3M50 53v3M67 43h3M30 43h3" />
                </svg>
                <span className="caption">The capture · ⌘N</span>
              </div>
              <div className="g-mini-plate">
                <span className="label">Plate III</span>
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                  <rect x="22" y="14" width="56" height="72" rx="3" />
                  <path d="M30 28h40M30 38h32M30 48h36M30 58h24" />
                  <path d="M30 70h28M30 76h20" />
                </svg>
                <span className="caption">The structure · template</span>
              </div>
              <div className="g-mini-plate">
                <span className="label">Plate IV</span>
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                  <circle cx="50" cy="50" r="6" />
                  <circle cx="22" cy="28" r="5" />
                  <circle cx="78" cy="28" r="5" />
                  <circle cx="22" cy="72" r="5" />
                  <circle cx="78" cy="72" r="5" />
                  <path d="M44 47L26 31M56 47l18-16M44 53L26 69M56 53l18 16" />
                </svg>
                <span className="caption">The distribution · four ways</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ § 07 PREMISE ============ */}
        <div className="gx-container">
          <article className="post-measure post-body">
            <h2 className="g-section-head" id="s07">
              <span className="post-kicker">§ 07 · The premise</span>
            </h2>
            <h2 style={{ marginTop: 0 }}>What lives in the meeting itself.</h2>
            <div className="g-prose">
              <p>
                I have a quiet belief that the meeting is the cheapest place to put a piece of organizational state. It is also the most lossy place. Granola is interesting because it raises the floor of the lossy place without making the meeting itself worse. The model is not in the room. Nobody is performing for it.
              </p>
              <p className="g-pullquote">
                The default outcome of any meeting I attend is a paragraph in something downstream of it. Granola makes that paragraph cheaper to write, harder to skip, and easier to revise the day after.
              </p>
            </div>
          </article>
        </div>

        {/* ============ § 08 COMPARISON TABLE ============ */}
        <div className="gx-container">
          <article className="post-measure post-body">
            <h2 className="g-section-head" id="s08">
              <span className="post-kicker">§ 08 · Side-by-side</span>
            </h2>
            <h2 style={{ marginTop: 0 }}>No-one ever joins the meeting.</h2>
            <div className="g-prose">
              <p>
                The single most-asked question I get about Granola is whether it sends a bot. It does not. The single most-useful comparison I can make is against the two architectures that do — the calendar bot, and the screen-share recorder. Each does some things Granola cannot. Granola does the one thing each of those cannot.
              </p>
            </div>
          </article>

          <div className="post-wide">
            <div className="g-table-label">
              Table · 01 — Architecture comparison · how the three approaches differ on the things I care about
            </div>
            <table className="g-table">
              <thead>
                <tr>
                  <th>What it does</th>
                  <th className="spotlight">
                    Granola{' '}
                    <span style={{ fontWeight: 500, color: 'var(--fg-subtle)' }}>· local audio</span>
                  </th>
                  <th>
                    Calendar bot{' '}
                    <span style={{ fontWeight: 500, color: 'var(--fg-subtle)' }}>· joins call</span>
                  </th>
                  <th>
                    Cloud recorder{' '}
                    <span style={{ fontWeight: 500, color: 'var(--fg-subtle)' }}>· screen capture</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="row-label">
                    Joins the call as a bot
                    <span className="sub">Visible to participants</span>
                  </td>
                  <td className="spot-cell"><span className="check">No</span></td>
                  <td><span className="x">Yes</span></td>
                  <td><span className="check">No</span></td>
                </tr>
                <tr>
                  <td className="row-label">
                    Requires consent disclosure
                    <span className="sub">Per most company AI-use policies</span>
                  </td>
                  <td className="spot-cell">Same as a human listener</td>
                  <td>Yes · explicit</td>
                  <td>Yes · explicit</td>
                </tr>
                <tr>
                  <td className="row-label">
                    Captures audio from off-screen people
                    <span className="sub">e.g. a phone next to your laptop</span>
                  </td>
                  <td className="spot-cell">Only if your mic hears it</td>
                  <td>Yes</td>
                  <td>Only on screen-share</td>
                </tr>
                <tr>
                  <td className="row-label">
                    Works on personal devices
                    <span className="sub">No calendar integration needed</span>
                  </td>
                  <td className="spot-cell"><span className="check">Yes</span></td>
                  <td><span className="x">No</span></td>
                  <td><span className="check">Yes</span></td>
                </tr>
                <tr>
                  <td className="row-label">
                    Templates per meeting shape
                    <span className="sub">User-defined structure</span>
                  </td>
                  <td className="spot-cell"><span className="check">First-class</span></td>
                  <td>Limited</td>
                  <td>Limited</td>
                </tr>
                <tr>
                  <td className="row-label">
                    Post-meeting chat against transcript
                    <span className="sub">Generate Slack updates, CRM rows, follow-ups</span>
                  </td>
                  <td className="spot-cell"><span className="check">Yes</span></td>
                  <td><span className="check">Yes</span></td>
                  <td>Some</td>
                </tr>
                <tr>
                  <td className="row-label">
                    Honest answer to &ldquo;is this recording?&rdquo;
                    <span className="sub">From the perspective of other participants</span>
                  </td>
                  <td className="spot-cell">&ldquo;I am taking notes with a tool&rdquo;</td>
                  <td>&ldquo;Yes — see the bot&rdquo;</td>
                  <td>&ldquo;Yes — see the indicator&rdquo;</td>
                </tr>
              </tbody>
            </table>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '.08em',
                color: 'var(--fg-subtle)',
                textTransform: 'uppercase',
                margin: '14px 0 0',
              }}
            >
              Last reviewed · 2026-05 · my install only · your mileage on integrations may vary
            </p>
          </div>
        </div>

        <div className="g-dots">· · ·</div>

        {/* ============ § 09 DOWNSTREAM ============ */}
        <div className="gx-container">
          <article className="post-measure post-body">
            <h2 className="g-section-head" id="s09">
              <span className="post-kicker">§ 09 · The downstream</span>
            </h2>
            <h2 style={{ marginTop: 0 }}>Capture is the input layer for everything downstream.</h2>
            <div className="g-prose">
              <p>
                I keep finding that the meeting is not what I am paid for; what I am paid for is what happens between the meeting and the next one. That gap used to be where my notes degraded, my memory blurred, and my Friday turned into a re-creation exercise. Granola sits in that gap. Each transcript is the input layer for the four things I had to write anyway.
              </p>
              <p>
                I shipped a{' '}
                <a
                  href="https://workos.com/blog/cloudflare-workers-workflows-ai-blog-bot"
                  target="_blank"
                  rel="noopener"
                >
                  blog bot at WorkOS
                </a>{' '}
                — Cloudflare Workers + Workflows + Slack + Webflow CMS — that is now used org-wide. Once that pipeline existed, every other Applied AI internal feature I wanted to build became cheaper because the scaffolding was already in place. Granola plugs into that pipeline directly: &ldquo;draft our perspective on the customer questions from this morning&apos;s Acme call&rdquo; stops being a thirty-minute writing task. The capture is a means to an end, and the end is that the same hour produces four artifacts instead of zero.
              </p>
            </div>
          </article>
        </div>

        {/* ============ § 10 PRICING ============ */}
        <div className="gx-container">
          <article className="post-measure post-body">
            <h2 className="g-section-head" id="s10">
              <span className="post-kicker">§ 10 · The cost</span>
            </h2>
            <h2 style={{ marginTop: 0 }}>The cost of Granola, honestly broken down.</h2>
            <div className="g-prose">
              <p>
                I pay for the Business plan ($14/user/month). I had Basic for the first six weeks; I moved up because I wanted unlimited meeting history and the better integrations. The comparison below is current as of May 2026 — confirm on granola.ai for the latest.
              </p>
            </div>
          </article>

          <div className="post-wide">
            <div className="g-pricing">
              <div className="g-tier">
                <div className="g-tier-label"><span>Basic</span></div>
                <div className="g-tier-name">Basic</div>
                <div className="g-tier-price">$0<span className="per">/ mo</span></div>
                <p className="g-tier-sub">For trying it on a week of meetings without committing.</p>
                <ul>
                  <li>AI meeting notes</li>
                  <li>Limited meeting history</li>
                  <li>Chat within and across meetings</li>
                  <li>Templates · shared folders</li>
                  <li>Mac, Windows, iOS</li>
                </ul>
                <a
                  className="g-btn g-btn-secondary"
                  href={links.pricingFree}
                  rel="sponsored noopener"
                  target="_blank"
                >
                  Try free →
                </a>
              </div>
              <div className="g-tier featured">
                <div className="g-tier-label">
                  <span>Business</span>
                  <span className="tag">My plan</span>
                </div>
                <div className="g-tier-name">Business</div>
                <div className="g-tier-price">$14<span className="per">/ user / mo</span></div>
                <p className="g-tier-sub">If you have a calendar that fills up. This is what I run.</p>
                <ul>
                  <li>Everything in Basic</li>
                  <li>Unlimited meeting history</li>
                  <li>Advanced AI thinking models</li>
                  <li>Integrations · Attio, Notion, Slack, HubSpot, Affinity, Zapier</li>
                  <li>Personal API access</li>
                </ul>
                <a
                  className="g-btn g-btn-primary"
                  href={links.pricingIndividual}
                  rel="sponsored noopener"
                  target="_blank"
                >
                  Start free trial
                </a>
              </div>
              <div className="g-tier">
                <div className="g-tier-label">
                  <span>Enterprise</span>
                </div>
                <div className="g-tier-name">Enterprise</div>
                <div className="g-tier-price">$35<span className="per">/ user / mo</span></div>
                <p className="g-tier-sub">When more than one person on your team is also doing this and IT cares.</p>
                <ul>
                  <li>Everything in Business</li>
                  <li>Single sign-on (SSO)</li>
                  <li>Org-wide auto-deletion · admin controls</li>
                  <li>Enterprise API access</li>
                  <li>Priority support · usage analytics</li>
                </ul>
                <a
                  className="g-btn g-btn-secondary"
                  href={links.pricingBusiness}
                  rel="sponsored noopener"
                  target="_blank"
                >
                  See enterprise →
                </a>
              </div>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '.08em',
                color: 'var(--fg-subtle)',
                textTransform: 'uppercase',
                margin: '14px 0 0',
              }}
            >
              Pricing as of May 2026 — confirm on granola.ai
            </p>
          </div>

          {/* Interactive time-saved bar */}
          <article className="post-measure post-body">
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                fontSize: 24,
                letterSpacing: '-.01em',
                margin: '48px 0 12px',
              }}
            >
              Time I save by not having to listen the whole time.
            </h3>
            <div className="g-prose">
              <p>
                The honest math: I spend about an hour a day writing artifacts that derive from meetings — Slack updates, CRM rows, follow-ups, internal docs. Granola does not remove that hour; it shifts where the time lands. The bar below scales to your meeting load. Move it.
              </p>
            </div>

            <TimeSavedBar />

            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '.08em',
                color: 'var(--fg-subtle)',
                textTransform: 'uppercase',
                margin: '6px 0 0',
              }}
            >
              Model · before = 100% of meeting time spent on parallel writing · after = 40% of meeting time spent on editing
            </p>
          </article>
        </div>

        {/* ============ MID CTA ============ */}
        <div className="gx-container">
          <div className="post-measure">
            <div className="g-cta">
              <div className="g-cta-head">
                <span className="left">§ 10 · The plan I use</span>
                <span className="right">$14 / mo · my recommended starting tier</span>
              </div>
              <h3>Try the plan I use — Individual, free for the first week.</h3>
              <p>
                If you want to follow the exact configuration I run — unlimited templates, the four shapes above, the prompt pack below — Individual is the tier. Free trial first, then $14/mo, then cancel any month it stops earning its line item.
              </p>
              <div className="g-cta-actions">
                <a
                  className="g-btn g-btn-primary"
                  href={links.s10MidCta}
                  rel="sponsored noopener"
                  target="_blank"
                >
                  Start free trial <span aria-hidden="true">↗</span>
                </a>
                <a className="g-btn g-btn-secondary" href="#s15">
                  Get the workflow guide ↓
                </a>
              </div>
              <div className="g-cta-foot">
                <span>Affiliate link</span><span className="dot">·</span>
                <span>Commission if you stay past trial</span><span className="dot">·</span>
                <span>I would recommend it either way</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ § 11 PROMPT PACK ============ */}
        <div className="gx-container">
          <article className="post-measure post-body">
            <h2 className="g-section-head" id="s11">
              <span className="post-kicker">§ 11 · My prompt pack</span>
            </h2>
            <h2 style={{ marginTop: 0 }}>My prompt pack.</h2>
            <div className="g-prose">
              <p>
                These are the chat prompts I run against a finished transcript. None of them are clever. They are the operations I used to do by hand at the end of the day. I have refined each over twelve months by deleting the parts that did not survive into the doc I actually sent.
              </p>
              <ul className="def-list">
                <li>
                  <strong>The Slack update.</strong>{' '}
                  <em>&ldquo;Write a four-bullet Slack update to my team about this meeting. Lead with what we decided. Use my voice — short, first-person, no jargon.&rdquo;</em>
                </li>
                <li>
                  <strong>The CRM row.</strong>{' '}
                  <em>&ldquo;Output a single-row update for our CRM with these fields: Use case · Friction · Verbatim quote · Asks · Next step. One line each.&rdquo;</em>
                </li>
                <li>
                  <strong>The follow-up email.</strong>{' '}
                  <em>&ldquo;Draft a follow-up to [name] that thanks them, restates the two decisions, and asks for the one thing I committed to ask. Six sentences max.&rdquo;</em>
                </li>
                <li>
                  <strong>The Friday review.</strong>{' '}
                  <em>&ldquo;Across all meetings tagged #1:1 this week, list every commitment I made with an owner of &lsquo;me&rsquo; and a due date. Sort by due date.&rdquo;</em>
                </li>
                <li>
                  <strong>The pre-mortem rewrite.</strong>{' '}
                  <em>&ldquo;Re-read this pre-mortem. For each failure mode, write the one sentence we would say in the retro if it happened.&rdquo;</em>
                </li>
              </ul>
              <p>
                The prompts are not the value. The constraint behind each prompt is — knowing the shape of the artifact I want before I ask for it. That part transfers.
              </p>
            </div>
          </article>
        </div>

        {/* ============ § 12 WHERE IT BREAKS DOWN ============ */}
        <div className="gx-container">
          <article className="post-measure post-body">
            <h2 className="g-section-head" id="s12">
              <span className="post-kicker">§ 12 · Where it breaks down</span>
            </h2>
            <h2 style={{ marginTop: 0 }}>Where it breaks down.</h2>
            <div className="g-prose">
              <ul className="def-list">
                <li><strong>Cold-room transcription.</strong> A conference room with three people, one phone speaker, one whiteboard — capture quality drops. The fix is to be the person near the speakerphone, not to expect magic.</li>
                <li><strong>Overlapping speakers.</strong> Three voices on top of each other get collapsed. The transcript reads like the loudest person was the only person. Granola does not fix the meeting, only the writing about the meeting.</li>
                <li><strong>The first week is a tax.</strong> You will not have templates yet. You will not have a sense for which prompts produce which artifacts. By week two it stops being a tax. By week four it stops being noticed.</li>
                <li><strong>Multi-language meetings.</strong> The current capture is strong in English, decent in Spanish and French, weaker elsewhere. If half your meetings are bilingual, test it on yours.</li>
                <li><strong>Stretching it past meetings.</strong> I have tried to use Granola for long phone calls with vendors. It works, but the output is rougher because the meeting shape is rougher. The tool is honest about that.</li>
              </ul>
            </div>
          </article>
        </div>

        {/* ============ § 13 HOW TO START ============ */}
        <div className="gx-container">
          <article className="post-measure post-body">
            <h2 className="g-section-head" id="s13">
              <span className="post-kicker">§ 13 · How to actually start</span>
            </h2>
            <h2 style={{ marginTop: 0 }}>How to actually start using it — the first week.</h2>
            <div className="g-prose">
              <ul className="def-list">
                <li><strong>Install before Sunday.</strong> Open it once. Click through the onboarding. Do not write a template yet. Let it sit there.</li>
                <li><strong>Run it on your first meeting Monday.</strong> Use the default template. Read the output. Notice what is missing.</li>
                <li><strong>Write one template Monday evening.</strong> The shape of the meeting you have the most of. Five sections, a one-line instruction under each. Twenty minutes.</li>
                <li><strong>Expand after a week.</strong> Add a second meeting type. Add a third. Build your prompt pack one template at a time, anchored to a meeting shape you actually attend.</li>
                <li><strong>Tell people.</strong> The local-audio architecture lets you be silent. That doesn&apos;t mean you should be. &ldquo;I&apos;m taking notes with an AI tool&rdquo; is one sentence. It costs nothing. It also closes the consent loop and you stop having to think about it.</li>
              </ul>
              <p>
                The first week of running Granola is the only week where it&apos;s a tax. By week two you stop noticing it&apos;s there, except for the part where you start noticing how much less you&apos;re carrying.
              </p>
            </div>
          </article>
        </div>

        <div className="g-dots">· · ·</div>

        {/* ============ § 14 LIMITS ============ */}
        <div className="gx-container">
          <article className="post-measure post-body">
            <h2 className="g-section-head" id="s14">
              <span className="post-kicker">§ 14 · The limits I keep</span>
            </h2>
            <h2 style={{ marginTop: 0 }}>What I do not use it for.</h2>
            <div className="g-prose">
              <ul className="def-list">
                <li><strong>Calls where consent is unclear.</strong> Personal capture is one thing. Recording someone who has not understood that capture is happening is another. The local-audio architecture makes it technically silent. That does not make it ethically silent. I tell people.</li>
                <li><strong>Pasting raw transcripts back at people.</strong> The summary is for me. The transcript is for me. What goes to my manager, a customer, a partner is something I wrote, informed by the record, not pulled from it verbatim.</li>
                <li><strong>Pretending the AI is doing the listening for me.</strong> It captures. I still have to think, still have to remember, still have to actually be in the meeting. Granola removed the part of meetings I was bad at; it did not remove the part I have to do.</li>
              </ul>
            </div>
          </article>
        </div>

        <div className="g-dots">· · ·</div>

        {/* ============ § 15 THE TAKE ============ */}
        <div className="gx-container">
          <article className="post-measure post-body">
            <h2 className="g-section-head" id="s15">
              <span className="post-kicker">§ 15 · The take</span>
            </h2>
            <h2 style={{ marginTop: 0 }}>If you only read one paragraph of this page.</h2>
            <blockquote
              style={{
                margin: '24px 0',
                padding: '4px 0 4px 22px',
                borderLeft: '3px solid var(--accent)',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 22,
                lineHeight: 1.4,
                color: 'var(--fg)',
              }}
            >
              Granola is the meeting tool I&apos;d build if I were going to build one. It removes the part of meetings I was bad at, leaves the part I have to do, and makes everything downstream of the meeting — Slack updates, CRM rows, follow-up docs, internal AI features — cheaper to wire together. Twelve months in, it is the first AI tool whose absence would measurably raise my baseline.
            </blockquote>
            <div className="g-prose">
              <p>The card below opens Granola directly. The form further down sends my workflow guide first. Either path works.</p>
            </div>
          </article>
        </div>

        {/* ============ FINAL CTA ============ */}
        <div className="gx-container">
          <div className="post-measure">
            <div className="g-cta">
              <div className="g-cta-head">
                <span className="left">§ 15 · Try it on next week&apos;s calendar</span>
                <span className="right">12 mo daily use · Zachary Proser</span>
              </div>
              <h3>Run Granola through one meeting this week. Decide on Friday.</h3>
              <p>
                Free trial, no credit card. Twelve months in I have not found a reason to switch. The fastest way to find out if it works for you is to put it on a real meeting this week.
              </p>
              <ul>
                <li>Free plan available — no credit card to try</li>
                <li>~5 minute setup, runs in the background</li>
                <li>Cancel anytime · iOS, Mac, and Windows clients</li>
              </ul>
              <div className="g-cta-actions">
                <a
                  className="g-btn g-btn-primary"
                  href={links.s15FinalCta}
                  rel="sponsored noopener"
                  target="_blank"
                >
                  Start your free trial <span aria-hidden="true">↗</span>
                </a>
                <a className="g-btn g-btn-secondary" href="#s15">
                  Send me the workflow guide first ↓
                </a>
              </div>
              <div className="g-cta-foot">
                <span>Mac</span><span className="dot">·</span>
                <span>Windows</span><span className="dot">·</span>
                <span>iOS</span><span className="dot">·</span>
                <span>Free plan available</span><span className="dot">·</span>
                <span>No credit card to try</span><span className="dot">·</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ § 16 EMAIL CAPTURE + RELATED ============ */}
        <div className="gx-container">
          <div className="g-capture" id="s16">
            <div>
              <div className="kicker">
                <span className="num">§ 16</span> The meeting workflow guide
              </div>
              <h2>The meeting workflow guide.</h2>
              <p>
                Drop your email and I will send you the meeting workflow guide I actually run: which templates I use for which meeting shapes, the prompt pack I&apos;ve refined over twelve months, and what I do after the call. Roughly one email, then nothing.
              </p>
              <GranolaCaptureForm />
              <p className="disclosure">
                <strong>Affiliate disclosure.</strong> Granola pays me a commission if you stay on past the trial. It is the meeting tool I would recommend either way; the commission is what makes the time to write at this length economic. The take is mine. No edit rights granted.
              </p>
            </div>
            <aside className="g-aside">
              <h4>Try Granola</h4>
              <a
                className="glink"
                href={links.sideRailPrimary}
                rel="sponsored noopener"
                target="_blank"
              >
                granola.ai <span aria-hidden="true">→</span>
              </a>
              <p>
                No email, no workflow guide, no follow-up. The form lets me send the workflow I&apos;d otherwise have to write twice.{' '}
                <a
                  href={links.sideRailSkipEmail}
                  rel="sponsored noopener"
                  target="_blank"
                >
                  Skip the email →
                </a>
              </p>

              <div className="related">
                <h4>Related reading</h4>
                <ol>
                  <li>
                    <span className="num"><span className="arrow">→</span> 01</span>
                    <div className="body">
                      <Link className="title" href="/blog/adhd-meeting-notes-strategy">
                        <span>ADHD &amp; meeting notes</span>
                        <span className="sub">why &ldquo;listen + write&rdquo; was always wrong</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <span className="num"><span className="arrow">→</span> 02</span>
                    <div className="body">
                      <Link className="title" href="/blog/note-taking-system-after-audhd-diagnosis">
                        <span>Note-taking after AuDHD</span>
                        <span className="sub">the system I run now</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <span className="num"><span className="arrow">→</span> 03</span>
                    <div className="body">
                      <Link className="title" href="/blog/how-i-prep-for-1-1s-as-an-engineer">
                        <span>1:1 prep as an engineer</span>
                        <span className="sub">how Granola fits the loop</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <span className="num"><span className="arrow">→</span> 04</span>
                    <div className="body">
                      <Link className="title" href="/blog/2026-ai-engineer-setup">
                        <span>My 2026 setup</span>
                        <span className="sub">where Granola fits the rest</span>
                      </Link>
                    </div>
                  </li>
                </ol>
              </div>
            </aside>
          </div>
        </div>

        {/* ============ FOOT META ============ */}
        <div className="gx-container">
          <div className="post-measure">
            <div className="g-foot-meta">
              <div className="col">
                <h5>Review provenance</h5>
                <p>
                  Twelve months of daily use on a Mac (M3 Pro) and an iPad. ~420 meetings logged across 1:1s, customer calls, hiring, and strategy. No edit rights granted to Granola; affiliate disclosure above.
                </p>
              </div>
              <div className="col">
                <h5>Last reviewed</h5>
                <p>2026-05-13 · Granola v3.4 · pricing current at time of writing · will be re-checked quarterly.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
