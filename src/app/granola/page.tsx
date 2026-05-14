import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createMetadata } from '@/utils/createMetadata'
import { getAffiliateLink } from '@/lib/affiliate'
import { GranolaCompactCTA, GranolaHeroCTA, GranolaInlineCTA } from './CTACards'
import {
  Byline,
  ComparisonTable,
  ExampleOutput,
  MathPanel,
  Ornament,
  PipelineDiagram,
  VerdictCard,
} from './EditorialBlocks'
import { GranolaLandingClient } from './GranolaLandingClient'

// --- Affiliate placements in this pillar -------------------------------
//
// All cards/links go through `getAffiliateLink({ product: 'granola',
// campaign: 'granola-pillar', ... })` so the Granola dashboard groups
// them under one campaign. The `placement` and `term` fields then split
// the conversions by where on the page the reader was when they clicked.
// Adding a new placement: pick a section tag like "s07-prompt-pack" and
// it'll start showing up in utm_term immediately.

const CAMPAIGN = 'granola-pillar'

export const metadata: Metadata = createMetadata({
  title: 'Granola — the AI notetaker I actually use, every meeting, for 12 months',
  description:
    'A pillar review of Granola from twelve months of daily use across WorkOS exec syncs, customer calls, consulting calls, and friend catch-ups — what it changed, the four meeting shapes I run it for, the prompt pack, and where it breaks down.',
  author: 'Zachary Proser',
  keywords: [
    'Granola',
    'Granola AI',
    'AI meeting notes',
    'AI notetaker',
    'meeting workflow',
    'Applied AI',
    'WorkOS Applied AI',
  ],
})

const directLink = getAffiliateLink({
  product: 'granola',
  campaign: CAMPAIGN,
  medium: 'blog',
  placement: 'text-link',
  term: 'side-rail-skip-email',
})

const stickyLink = getAffiliateLink({
  product: 'granola',
  campaign: CAMPAIGN,
  medium: 'blog',
  placement: 'sticky-cta',
  term: 'side-rail-primary',
})

// --- Editorial typography helpers --------------------------------------
//
// Reusable inline styles for the pillar-essay body. They reference the same
// CSS custom properties the partnerships / contact pages use, so heading
// faces and accent colors stay coherent across the site.

const sectionNumberStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono, 'JetBrains Mono'), ui-monospace, monospace",
  fontSize: 11,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
  color: 'var(--accent)',
  fontWeight: 600,
  marginBottom: 12,
  display: 'block',
}

const h2Style: React.CSSProperties = {
  fontFamily: "var(--font-serif, 'Crimson Pro'), Georgia, serif",
  fontSize: 'clamp(28px, 3.5vw, 36px)',
  fontWeight: 500,
  letterSpacing: '-.02em',
  color: 'var(--ink)',
  lineHeight: 1.15,
  margin: '0 0 24px',
}

const h3Style: React.CSSProperties = {
  fontFamily: "var(--font-serif, 'Crimson Pro'), Georgia, serif",
  fontSize: 'clamp(20px, 2.5vw, 24px)',
  fontWeight: 600,
  letterSpacing: '-.01em',
  color: 'var(--ink)',
  lineHeight: 1.2,
  margin: '32px 0 14px',
}

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif, 'Crimson Pro'), Georgia, serif",
  fontSize: 'clamp(17px, 1.6vw, 19px)',
  lineHeight: 1.65,
  color: 'var(--ink)',
  margin: '0 0 20px',
}

const pullStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif, 'Crimson Pro'), Georgia, serif",
  fontSize: 'clamp(20px, 2.2vw, 24px)',
  lineHeight: 1.4,
  color: 'var(--ink)',
  borderLeft: '3px solid var(--accent)',
  paddingLeft: 20,
  margin: '32px 0',
  fontStyle: 'italic',
}

const figcapStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans, 'Inter'), system-ui, sans-serif",
  fontSize: 13,
  lineHeight: 1.5,
  color: 'var(--ink-dim)',
  marginTop: 10,
  textAlign: 'center',
  fontStyle: 'italic',
}

const inlineAccentLink: React.CSSProperties = {
  color: 'var(--accent)',
  textDecoration: 'none',
  borderBottom: '1px solid var(--accent)',
}

// --- Image library used in the body ------------------------------------
//
// These all already live on Bunny CDN — reusing them keeps the page fast
// and visually consistent with the rest of the site. Placeholder swaps
// (the figure captions document what they're standing in for) can be
// done per-section without restructuring.

const IMG = {
  laptopHero: 'https://zackproser.b-cdn.net/images/granola-applied-ai-workos-hero.webp',
  uiShot: 'https://zackproser.b-cdn.net/images/granola-pillar-ui-shot.webp',
  fourShapes: 'https://zackproser.b-cdn.net/images/granola-pillar-four-shapes.webp',
}

export default function GranolaLandingPage() {
  return (
    <main className="contact-page partnerships-page granola-page editorial-home min-h-screen text-charcoal-50 dark:text-parchment-100">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="post-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span className="current">Granola</span>
        </div>
      </div>

      {/* ───── HERO ──────────────────────────────────────────────── */}

      <section className="c-hero">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="kicker">
            § G · <em>Granola</em> · 12 months in · personal review
          </div>

          <div className="dispatch">
            <div>
              <div className="brand-lockup">
                <b>Zackproser</b> <span className="slash">/</span>{' '}
                <em>granola</em> <span className="slash">·</span> the AI tool I would actually notice
              </div>
              <h1 className="dispatch-display">
                The first AI tool whose <em>absence</em> would measurably raise
                my anxiety level.
              </h1>
              <p className="dispatch-lead">
                I&apos;ve been running Granola in every meeting for twelve months. WorkOS exec syncs, customer calls, consulting calls, friend catch-ups, the lot. This is the full review — what changed, the four meeting shapes I run it for, the prompt pack I&apos;ve refined, where it breaks down, and what to try first if you&apos;re going to try it at all.
              </p>
            </div>
            <aside className="dispatch-side">
              <span className="label">Issued</span>
              <div className="a-plate">ZP</div>
              <div className="who">Zachary Proser</div>
              <div className="role">
                Applied AI · WorkOS · Brooklyn, NY · daily Granola user
              </div>
            </aside>
          </div>

          <div className="aud-slab">
            <div className="aud-cell">
              <div className="aud-k">Meetings captured</div>
              <div className="aud-v">
                100<span className="unit">% / 12 mo</span>
              </div>
              <div className="aud-sub">Work, consulting, personal — every call I take</div>
            </div>
            <div className="aud-cell">
              <div className="aud-k">Bots in the call</div>
              <div className="aud-v">
                0<span className="unit">ever</span>
              </div>
              <div className="aud-sub">Local audio capture. Nothing announced to the other side.</div>
            </div>
            <div className="aud-cell">
              <div className="aud-k">Summaries I&apos;ve corrected</div>
              <div className="aud-v">
                ~0<span className="unit">/ mo</span>
              </div>
              <div className="aud-sub">Down from &ldquo;almost every meeting&rdquo; on every other tool I tried</div>
            </div>
            <div className="aud-cell">
              <div className="aud-k">Anxiety baseline</div>
              <div className="aud-v"><em>Lower</em></div>
              <div className="aud-sub">The first section below is exactly how.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── VERDICT SCORECARD ─────────────────────────────────── */}

      <section style={{ padding: '56px 0 0', borderTop: '1px solid var(--rule)' }}>
        <div className="container mx-auto max-w-3xl px-4 md:px-6">
          <VerdictCard />
        </div>
      </section>

      {/* ───── PILLAR BODY ───────────────────────────────────────── */}

      <section style={{ padding: '72px 0 88px' }}>
        <div className="container mx-auto max-w-3xl px-4 md:px-6">
          <Byline />
          <article>
            {/* Drop-cap styling for the lede paragraph */}
            <style>{`
              .granola-lede::first-letter {
                float: left;
                font-family: var(--font-serif, 'Crimson Pro'), Georgia, serif;
                font-size: 5.2em;
                line-height: 0.82;
                padding: 4px 12px 0 0;
                color: var(--accent);
                font-weight: 500;
              }
            `}</style>

            {/* § 01 — The lead */}
            <span style={sectionNumberStyle}>§ 01 · the lead</span>
            <h2 style={h2Style}>The thing I wanted to say first.</h2>

            <p className="granola-lede" style={bodyStyle}>
              Live syncs are the part of my job I find hardest. Not because I struggle to communicate — I&apos;ve spent a career driving customer calls, complex AWS deployments, live triage, planning sessions, software-delivery hand-offs, friend catch-ups. It is just that I carry a low-grade hum of anxiety around speaking with someone live anyway. It is just there.
            </p>

            <p style={bodyStyle}>
              The single biggest thing Granola did for me was lower that hum. Note-taking is gone as a concern. Before the call starts, before anything has been said, the knowledge that capture is handled is — on its own — regulating. The rest of this page is about what Granola does. The thing I wanted to say first is what it changed for me.
            </p>

            <p style={pullStyle}>
              I&apos;m an Applied AI lead at WorkOS. My calendar is exec syncs, customer calls, and design reviews three days a week, with technical 1:1s and async standups filling the gaps. For twelve months, Granola has been the layer that turns those conversations into the artifacts that drive the rest of my week.
            </p>

            <Ornament />

            {/* § 02 — What it is */}
            <span style={sectionNumberStyle}>§ 02 · what it is</span>
            <h2 style={h2Style}>What Granola is, in one paragraph.</h2>

            <p style={bodyStyle}>
              Granola is a Mac app that records the audio on your machine — your microphone and the system output, both — without joining the call as a participant. There is no bot in the meeting. There is no notification to the other side. After the call ends, Granola produces a structured summary based on a template you pick, with the full transcript one click away. It connects to your calendar and prompts you to start capture a minute before each meeting. iOS and Windows versions exist. The one on my laptop is the one I live in.
            </p>

            <p style={bodyStyle}>
              That is all it does. Most of what makes it good is what it does <em>not</em> do.
            </p>

            <div style={{ margin: '32px 0' }}>
              <GranolaCompactCTA
                term="s02-what-it-is"
                headline="Granola — the app I just described."
                sub="Free trial · Mac, Windows, iOS · ~5 minute setup."
              />
            </div>

            <figure>
              <Image
                src={IMG.uiShot}
                alt="Stylized Granola notes panel: decisions, action items, follow-ups, with a transcript indicator on the right"
                width={1200}
                height={1200}
                className="rounded-lg"
                style={{ width: '100%', height: 'auto' }}
              />
              <figcaption style={figcapStyle}>
                The shape of a Granola note: three regions — decisions, action items, follow-ups — and the transcript one click away.
              </figcaption>
            </figure>

            <Ornament />

            {/* § 03 — The four shapes */}
            <span style={sectionNumberStyle}>§ 03 · the four shapes</span>
            <h2 style={h2Style}>The four meeting shapes that drive my week.</h2>

            <p style={bodyStyle}>
              I run Granola in everything, but four shapes account for the overwhelming majority of meetings on my calendar, and each one rewards a slightly different Granola template and post-call workflow. The shapes:
            </p>

            {/* Exec syncs */}
            <h3 style={h3Style}>1. Exec syncs</h3>
            <p style={bodyStyle}>
              These are thirty-minute cadences with peers and VPs. The shape is dense: status across multiple initiatives, decisions queued for input, surfaces where I need air cover, places I need to pull on a thread someone else owns. The cost of missing a commitment in an exec sync is high — it shows up as the same conversation, repeated, two weeks later, with worse vibes.
            </p>
            <p style={bodyStyle}>
              Granola is excellent at the structural parts. Decisions land in the summary cleanly. Owner assignments come through with names attached. Follow-ups read like they were written by someone who was actually in the room — which, in a way, they were.
            </p>
            <p style={bodyStyle}>
              The part I still do by hand is org-chart context. Granola can&apos;t infer that the person committing to a thing is the right owner versus the wrong owner. I&apos;ll skim the summary, move a couple of items to different names, and ship it to the relevant Slack channel. Two minutes of cleanup on a thirty-minute meeting.
            </p>

            <ExampleOutput
              meta="exec sync · 2026-05-12 · 30 min"
              blocks={[
                {
                  heading: '── DECISIONS TAKEN',
                  lines: [
                    '• Approve Q3 hiring plan as scoped',
                    '• Defer infrastructure migration to Q4',
                    '• Pull Maya off auth project to support customer escalation',
                  ],
                },
                {
                  heading: '── COMMITMENTS BY OWNER',
                  lines: [
                    '• Zack    — circulate scoped Q3 plan by Friday',
                    '• Priya   — schedule eng kickoff for auth backfill',
                    '• Maya    — close current sprint, move to customer',
                  ],
                },
                {
                  heading: '── OPEN THREADS TO CHASE',
                  lines: [
                    '• Headcount approval for two senior engineers (finance)',
                    '• Sales motion on enterprise tier (marketing)',
                  ],
                },
              ]}
              caption="A real exec sync summary, shape-preserved, names sanitized. Granola produces this within seconds of the call ending. The transcript is one click away if I need it."
            />

            {/* 1:1s */}
            <h3 style={h3Style}>2. 1:1s</h3>
            <p style={bodyStyle}>
              A different shape entirely. Less about decisions, more about context: how someone is doing, what they&apos;re stuck on, what they&apos;re going to want my air cover for in the next two weeks. The notes I want from a 1:1 are not the same notes I want from an exec sync.
            </p>
            <p style={bodyStyle}>
              I keep notes minimal in the moment — almost zero — and let Granola do the structural lifting. After the call, I separate the output into two pieces: <em>what we decided</em> (which I&apos;ll reference next time) and <em>what we discussed</em> (which is for me, often archived after a read-through). The &ldquo;decided&rdquo; half lives in my prep doc for the next 1:1. The &ldquo;discussed&rdquo; half lives in my weekly review.
            </p>
            <p style={bodyStyle}>
              I do not share the raw transcript back with the person I just spoke to. The summary is for me. What gets surfaced back to them — in Slack, in a follow-up email, in the next 1:1 — is something I wrote, informed by the record. The record is private. The reflection is the thing I share.
            </p>

            {/* Customer calls */}
            <h3 style={h3Style}>3. Customer calls</h3>
            <p style={bodyStyle}>
              The compliance and consent shape. The local-audio architecture is what makes this work — there is no third-party bot joining, which means no third-party data path to disclose. That changes what I can responsibly capture in calls with customers who haven&apos;t signed something specific about a vendor in the loop.
            </p>
            <p style={bodyStyle}>
              I still tell people. The point is not to capture covertly; the point is that the <em>technical</em> footprint is small enough that telling them lands as &ldquo;I&apos;m taking notes&rdquo; rather than &ldquo;I&apos;ve added a recording bot to our meeting.&rdquo; People understand the first sentence. The second sentence has historically gotten me asked to turn things off.
            </p>
            <p style={bodyStyle}>
              The post-call workflow is straightforward: read the summary, lift the top items into a Slack thread for the account team, and update the CRM. Five minutes for a thirty-minute call, on a good day.
            </p>

            {/* Design reviews */}
            <h3 style={h3Style}>4. Technical design reviews</h3>
            <p style={bodyStyle}>
              This is where Granola is weakest, and the place I&apos;m most willing to say it out loud.
            </p>
            <p style={bodyStyle}>
              Architecture conversations don&apos;t reduce well into bullet summaries. The shape of the thing — <em>we considered X, we ruled it out for these failure modes, we landed on Y because of these constraints</em> — is exactly the kind of structured reasoning that an LLM summarizer flattens. You end up with a list of statements that are individually true and collectively useless, because the <em>order</em> and <em>because</em> are gone.
            </p>
            <p style={bodyStyle}>
              What I do instead: Granola captures, like always, but I write the Architecture Decision Record by hand using the transcript as source material. The transcript is good — I can search for the moment someone said &ldquo;the consistency model breaks if we do that&rdquo; and pull the surrounding two minutes. The summary is the wrong granularity for an ADR. The transcript is exactly the right granularity. Granola is the input; the document is mine.
            </p>

            <p style={bodyStyle}>
              If those four shapes look like your week, the short version is:{' '}
              <GranolaInlineCTA term="s03-end-of-shapes">
                start a free trial of Granola
              </GranolaInlineCTA>{' '}
              and run it through one or two of them this week. The rest of this page is how I actually use it; the link above is the easiest way to follow along live.
            </p>

            <figure>
              <Image
                src={IMG.fourShapes}
                alt="A 2x2 grid of the four meeting types: exec sync, 1:1, customer call, design review"
                width={1200}
                height={1200}
                className="rounded-lg"
                style={{ width: '100%', height: 'auto' }}
              />
              <figcaption style={figcapStyle}>
                Four shapes, four templates. The post-call workflow looks different for each one.
              </figcaption>
            </figure>

            <Ornament />

            {/* § 04 — Live query */}
            <span style={sectionNumberStyle}>§ 04 · the rescue</span>
            <h2 style={h2Style}>What lives in the meeting itself.</h2>

            <p style={bodyStyle}>
              There&apos;s a thing that doesn&apos;t fit cleanly under a meeting shape because it&apos;s not about a particular call — it&apos;s about <em>being</em> in any call.
            </p>
            <p style={bodyStyle}>
              I lose the thread mid-meeting. Especially at work, where I&apos;m juggling six projects, four codebases, and twelve open Linear tickets across two teams, the cognitive load of holding the conversation plus the rest of the day in working memory is real. I miss things. Used to be: smile, nod, hope it shakes out by the time I&apos;m supposed to weigh in.
            </p>
            <p style={bodyStyle}>
              Granola has a live query feature — ask it, in-call, <em>what was just said</em>, or <em>clarify that last phrase I missed</em>, and it answers. Not from the eventual summary; from the running transcript, live, while the meeting is still happening.
            </p>
            <p style={pullStyle}>
              The cost of momentary distraction drops from &ldquo;I just missed something I&apos;ll need in twenty minutes&rdquo; to &ldquo;I&apos;ll re-read the last sixty seconds and rejoin.&rdquo; That second cost is fine. The first cost is what made meetings feel expensive.
            </p>

            <Ornament />

            {/* § 05 — Pipeline */}
            <span style={sectionNumberStyle}>§ 05 · the input layer</span>
            <h2 style={h2Style}>Capture is the input layer for everything downstream.</h2>

            <p style={bodyStyle}>
              The deeper change isn&apos;t at the meeting level. It&apos;s what becomes possible <em>after</em> the meeting because the meeting now produces a structured artifact every time, with the transcript attached.
            </p>
            <p style={bodyStyle}>
              I shipped a{' '}
              <a
                href="https://workos.com/blog/cloudflare-workers-workflows-ai-blog-bot"
                target="_blank"
                rel="noopener"
                style={inlineAccentLink}
              >
                blog bot at WorkOS
              </a>{' '}
              — Cloudflare Workers + Workflows + Slack + Webflow CMS — that&apos;s now used org-wide for drafting and publishing. Once that pipeline existed, every other Applied AI internal feature I wanted to build became cheaper, because the input/output/auth/Slack-bot scaffolding was already in place.
            </p>
            <p style={bodyStyle}>
              Granola plugs into that pipeline directly. &ldquo;Draft our perspective on the customer questions from this morning&apos;s Acme call&rdquo; stops being a thirty-minute writing task. It becomes a few-minute slash-command, because the transcript is already structured, my voice is already a known input to the blog bot, and the output is already going to land in a Webflow draft. Meeting capture is no longer a sink. It&apos;s the start of a pipeline.
            </p>
            <p style={bodyStyle}>
              That, more than any single feature inside Granola, is the bet. If you&apos;re building internal AI tooling, the layer that captures <em>what was actually said in conversation</em> is the layer most starved for good plumbing. Granola is the plumbing.
            </p>

            <PipelineDiagram />

            <Ornament />

            {/* § 06 — No bot */}
            <span style={sectionNumberStyle}>§ 06 · the etiquette</span>
            <h2 style={h2Style}>No bot ever joins the meeting.</h2>

            <p style={bodyStyle}>
              Loom recorders and the Google / Zoom AI Companions are heavy-handed. The other person&apos;s first introduction to the tooling is &ldquo;there is a robot listening to us,&rdquo; which immediately changes how they speak. Voices get tighter. Asides disappear. The meeting becomes more rehearsed.
            </p>
            <p style={bodyStyle}>
              Granola is silent. There is no bot. Audio is captured locally. People stay relaxed, talk naturally, and the recording I get back is closer to the conversation that would have happened without any tooling in the room. The compounding effect of that across hundreds of meetings is hard to overstate. People are more themselves on calls I&apos;m on, because nothing in the meeting is shouting <em>this is being recorded</em>.
            </p>
            <p style={bodyStyle}>
              I still tell people. The technical silence is what gives me the option to disclose like a human, not like compliance theater.
            </p>

            <div style={{ margin: '40px 0' }}>
              <ComparisonTable />
            </div>

            <p style={bodyStyle}>
              The table is the part of the argument most people accept without writing it down. Granola is the only one I keep going back to, and the architecture explains why.
            </p>

            <div style={{ margin: '40px 0' }}>
              <GranolaHeroCTA
                term="s06-after-etiquette"
                kicker="§ 06 · No bot · The product"
                headline="Try the silent-capture meeting tool I just described."
                sub="Twelve months of daily use across exec syncs, customer calls, design reviews, and friend catch-ups. Audio captured locally. No bot ever joins the conversation."
                benefits={[
                  'No bot joins the call · local audio only',
                  'Structured summary in seconds, transcript one click away',
                  'Templates per meeting shape · live-query mid-call',
                ]}
                ctaLabel="Start your free trial"
                secondaryLabel="Get the workflow guide"
              />
            </div>

            <Ornament />

            {/* § 07 — Prompt pack */}
            <span style={sectionNumberStyle}>§ 07 · the templates</span>
            <h2 style={h2Style}>My prompt pack.</h2>

            <p style={bodyStyle}>
              Six templates I actually use. Granola lets you set a default template per meeting type or override per-meeting. These are the ones I&apos;ve refined over a year, in the order I added them:
            </p>

            <ol style={{ ...bodyStyle, paddingLeft: 24 }}>
              <li style={{ marginBottom: 12 }}>
                <strong>Exec sync</strong> — three sections: <em>decisions taken</em>, <em>commitments by owner</em>, <em>open threads to chase</em>. No prose. Action items get bolded. Anything tagged &ldquo;open&rdquo; gets carried to the next sync if it isn&apos;t closed before.
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>1:1 with a report</strong> — two sections: <em>what we discussed</em> and <em>what was committed</em>. The second section is what I bring to the next 1:1. The first section gets archived.
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>1:1 with my manager</strong> — same structure as the report 1:1, plus a third section: <em>what I asked for</em> (air cover, headcount, context I need from elsewhere in the org). That third section is the most useful one for me as I track what I&apos;m repeatedly asking for.
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Customer call</strong> — <em>what they care about</em>, <em>what they pushed back on</em>, <em>what we owe them</em>, <em>what the account team should know</em>. The last bucket goes to Slack within the hour.
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Design review</strong> — short summary plus a <em>decisions to capture in the ADR</em> block. The full transcript is the actual source for the doc.
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Catch-up with a friend</strong> — yes, I run it for these. Single section: <em>things to follow up on next time</em>. That is the whole template. It has made me a meaningfully better friend.
              </li>
            </ol>

            <p style={bodyStyle}>
              The last one is the one most people are surprised by. I&apos;m the most surprised by how much I depend on it.
            </p>

            <Ornament />

            {/* § 08 — Breakdown */}
            <span style={sectionNumberStyle}>§ 08 · the honest section</span>
            <h2 style={h2Style}>Where it breaks down.</h2>

            <p style={bodyStyle}>
              The honest section. Things I&apos;ve noticed over twelve months that I don&apos;t see covered in most reviews.
            </p>

            <p style={bodyStyle}>
              <strong>Long technical whiteboarding.</strong> When the conversation depends on a diagram that&apos;s being drawn, the transcript loses the shape. The references to &ldquo;this box&rdquo; and &ldquo;that arrow&rdquo; produce a summary that&apos;s about as useful as nothing.
            </p>
            <p style={bodyStyle}>
              <strong>Multi-speaker debates without clear turn-taking.</strong> Three or four engineers all making the same point at the same time, with disagreement on the second point that overlaps with agreement on the third — Granola gets the words but loses who-said-what enough that I can&apos;t reconstruct the negotiation. I treat these meetings as &ldquo;transcript only, no summary.&rdquo;
            </p>
            <p style={bodyStyle}>
              <strong>Calls in languages other than English.</strong> I&apos;ve had a handful of consulting calls in Spanish and the summary quality drops sharply. Transcript is OK. Summary is generic. I assume this will close over time.
            </p>
            <p style={bodyStyle}>
              <strong>Meetings where the substantive content was a screen share.</strong> Granola hears what was said about the demo. It does not see the demo. For &ldquo;did the click-through feel right&rdquo; conversations, the summary is structurally insufficient.
            </p>
            <p style={bodyStyle}>
              None of these are deal-breakers. They&apos;re shapes where I treat Granola as &ldquo;transcript-only&rdquo; and write the artifact myself.
            </p>

            <Ornament />

            {/* § 09 — Math */}
            <span style={sectionNumberStyle}>§ 09 · the math</span>
            <h2 style={h2Style}>The cost-benefit math.</h2>

            <p style={bodyStyle}>
              I pay for it personally, even though I could probably expense it. The reason is that I use it in personal contexts — friend catch-ups, consulting calls, family calls — that I don&apos;t want overlapping with any work data plane. The paid tier is something like the cost of two coffees a week. The math isn&apos;t close.
            </p>
            <p style={bodyStyle}>
              If you want the spreadsheet version: a thirty-minute meeting used to cost me ~ten minutes of post-meeting cleanup time, on average. With Granola, it costs ~two minutes. I do something like twenty captured meetings a week. The arithmetic is roughly two and a half hours back, every week, against a few dollars in subscription cost. The arithmetic stopped being the interesting part somewhere in month two.
            </p>
            <p style={pullStyle}>
              The interesting part is the bigger effect. Meetings I would have previously dreaded — three back-to-back exec syncs, a customer call, a 1:1 — stopped feeling like cognitive overhead I had to budget for. The hum dropped. The hum was always the budget item that was hardest to plan around.
            </p>

            <MathPanel />

            <div style={{ margin: '40px 0' }}>
              <GranolaCompactCTA
                term="s09-after-math"
                headline="Two coffees a week. Two and a half hours back."
                sub="Free plan to start. The paid tier is roughly the cost of two coffees per week."
                ctaLabel="Try Granola free"
              />
            </div>

            <Ornament />

            {/* § 10 — Onboarding */}
            <span style={sectionNumberStyle}>§ 10 · how to start</span>
            <h2 style={h2Style}>How to try it without losing the week.</h2>

            <p style={bodyStyle}>
              If you&apos;re going to install Granola today, don&apos;t do what I did and try to capture everything from day one. The week-one play that actually works:
            </p>

            <ol style={{ ...bodyStyle, paddingLeft: 24 }}>
              <li style={{ marginBottom: 12 }}>
                <strong>Pick one meeting type to start with.</strong> I&apos;d say 1:1s. They&apos;re short, low-stakes, and the structure of the output is easy to evaluate.
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Use the default template.</strong> Don&apos;t build your own prompt pack yet. You don&apos;t know what you want from the output until you&apos;ve seen a week of defaults.
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Read every summary the day it lands.</strong> Build an opinion. If something is consistently missing or wrong, that&apos;s the shape of your eventual custom template.
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Expand after a week.</strong> Add a second meeting type. Add a third. Build your prompt pack one template at a time, anchored to a meeting shape you actually attend.
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Tell people.</strong> The local-audio architecture lets you be silent. That doesn&apos;t mean you should be. &ldquo;I&apos;m taking notes with an AI tool&rdquo; is one sentence. It costs nothing. It also closes the consent loop and you stop having to think about it.
              </li>
            </ol>

            <p style={bodyStyle}>
              The first week of running Granola is the only week where it&apos;s a tax. By week two you stop noticing it&apos;s there, except for the part where you start noticing how much less you&apos;re carrying.
            </p>

            <Ornament />

            {/* § 11 — What I won't use it for */}
            <span style={sectionNumberStyle}>§ 11 · the limits I keep</span>
            <h2 style={h2Style}>What I do not use it for.</h2>

            <p style={bodyStyle}>
              <strong>Calls where consent is unclear.</strong> Personal capture is one thing. Recording someone who has not understood that capture is happening is another. The local-audio architecture makes it technically silent. That does not make it ethically silent. I tell people.
            </p>
            <p style={bodyStyle}>
              <strong>Pasting raw transcripts back at people.</strong> The summary is for me. The transcript is for me. What goes to my manager, a customer, a partner is something I wrote, informed by the record, not pulled from it verbatim.
            </p>
            <p style={bodyStyle}>
              <strong>Pretending the AI is doing the listening for me.</strong> It captures. I still have to think, still have to remember, still have to actually be in the meeting. Granola removed the part of meetings I was bad at; it did not remove the part I have to do.
            </p>

            <Ornament />

            {/* § 12 — The take */}
            <span style={sectionNumberStyle}>§ 12 · the take</span>
            <h2 style={h2Style}>If you only read one paragraph of this page.</h2>

            <p style={pullStyle}>
              Granola is the meeting tool I&apos;d build if I were going to build one. It removes the part of meetings I was bad at, leaves the part I have to do, and makes everything downstream of the meeting — Slack updates, CRM rows, follow-up docs, internal AI features — cheaper to wire together. Twelve months in, it is the first AI tool whose absence would measurably raise my baseline.
            </p>

            <p style={bodyStyle}>
              The card below opens Granola directly. The form further down sends my workflow guide first. Either path works.
            </p>

            <div style={{ margin: '40px 0 0' }}>
              <GranolaHeroCTA
                term="s12-the-take"
                kicker="§ 12 · Try it on next week's calendar"
                headline="Run Granola through one meeting this week. Decide on Friday."
                sub="Free trial, no credit card. Twelve months in I have not found a reason to switch. The fastest way to find out if it works for you is to put it on a real meeting this week."
                benefits={[
                  'Free plan available — no credit card to try',
                  '~5 minute setup, runs in the background',
                  'Cancel anytime · iOS, Mac, and Windows clients',
                ]}
                ctaLabel="Start your free trial"
                secondaryLabel="Send me the workflow guide first"
              />
            </div>
          </article>
        </div>
      </section>

      {/* ───── FORM + SIDE RAIL ──────────────────────────────────── */}

      <section id="claim">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 intake-wrap">
          <div className="intake-grid">
            <div>
              <div className="db-head" style={{ marginBottom: 16 }}>
                <div className="num">§ 13</div>
                <h3>The meeting workflow guide.</h3>
              </div>
              <p className="intake-lead">
                Drop your email and I will send you the meeting workflow I actually run: which templates I use for which meeting shapes, the prompt pack I&apos;ve refined over twelve months, and what I do after the call. Roughly one email, then nothing.
              </p>
              <GranolaLandingClient />
              <p
                style={{
                  marginTop: 18,
                  fontSize: 12.5,
                  lineHeight: 1.6,
                  color: 'var(--ink-dim)',
                  fontFamily: "var(--font-sans, 'Inter'), system-ui, sans-serif",
                  maxWidth: '54ch',
                }}
              >
                <strong>Affiliate disclosure.</strong> Granola pays me a commission if you stay on past the trial. It is the meeting tool I would recommend either way; the commission is what makes the time to write at this length economic. The take is mine. No edit rights granted.
              </p>
            </div>

            <aside className="intake-side">
              <div>
                <h4>Try Granola</h4>
                <p className="direct">
                  <a href={stickyLink} rel="sponsored noopener" target="_blank">
                    granola.ai →
                  </a>
                </p>
                <p>
                  No email, no workflow guide, no follow-up. The form lets me send the workflow I&apos;d otherwise have to write twice.{' '}
                  <a href={directLink} rel="sponsored noopener" target="_blank" style={{ color: 'var(--accent)' }}>
                    Skip the email →
                  </a>
                </p>
              </div>

              <div>
                <h4>Related reading</h4>
                <ul className="proof-links">
                  <li>
                    <Link href="/blog/adhd-meeting-notes-strategy">
                      <span className="pl-num">→ 01</span>
                      <span className="pl-name">ADHD &amp; meeting notes</span>
                      <span className="pl-meta">why &quot;listen + write&quot; was always wrong</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog/note-taking-system-after-audhd-diagnosis">
                      <span className="pl-num">→ 02</span>
                      <span className="pl-name">Note-taking after AuDHD</span>
                      <span className="pl-meta">the system I run now</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog/how-i-prep-for-1-1s-as-an-engineer">
                      <span className="pl-num">→ 03</span>
                      <span className="pl-name">1:1 prep as an engineer</span>
                      <span className="pl-meta">how Granola fits the loop</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog/2026-ai-engineer-setup">
                      <span className="pl-num">→ 04</span>
                      <span className="pl-name">My 2026 setup</span>
                      <span className="pl-meta">where Granola fits the rest</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
