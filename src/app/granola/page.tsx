import { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata } from '@/utils/createMetadata'
import { getAffiliateLink } from '@/lib/affiliate'
import { GranolaLandingClient } from './GranolaLandingClient'

export const metadata: Metadata = createMetadata({
  title: 'Granola — the AI notetaker I actually use, every meeting, for 12 months',
  description:
    'A personal walkthrough of why Granola runs in every meeting I take — WorkOS exec syncs, customer calls, consulting calls, friend catch-ups. The five things that made it stick, plus my partner link.',
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
  campaign: 'granola-landing',
  medium: 'homepage',
  placement: 'text-link',
})

const stickyLink = getAffiliateLink({
  product: 'granola',
  campaign: 'granola-landing',
  medium: 'homepage',
  placement: 'sticky-cta',
})

const pillars = [
  {
    pn: 'A',
    title: 'The anxiety floor drops by default.',
    body: [
      "Live syncs are the part of the job I find hardest. Not because I struggle to communicate — I've spent a career driving customer calls, complex AWS deployments, live triage, planning sessions, software-delivery hand-offs — but because I carry a low-grade hum of anxiety around speaking with someone live anyway. It is just there.",
      "Granola removes one specific source: I am not also responsible for the record. Note-taking is gone as a concern. The hum drops a few notches by default — before the meeting starts, before anything is said. The knowledge that capture is handled is, on its own, regulating.",
    ],
  },
  {
    pn: 'B',
    title: 'Live-query the meeting while it is still happening.',
    body: [
      "Especially at work, where I am juggling a half-dozen projects, codebases, and threads at once, I lose the thread mid-call. Used to be: smile, nod, hope it shakes out.",
      "Now I ask Granola — what was just said? — and catch myself back up. Or I ask it to clarify a phrase I couldn't quite hear. Live, in-call, while the meeting is still going. The cost of momentary distraction drops from 'I just missed something I will need in twenty minutes' to 'I will re-read the last sixty seconds and rejoin'.",
    ],
  },
  {
    pn: 'C',
    title: 'A faithful summary by the time the call ends.',
    body: [
      "The call ends. The summary is there. The full transcript is there if I want it. There is no negotiation with my future self over what got committed to.",
      "I am writing this twelve months in: the summaries are good. Not 'good for AI' — actually good. I have not needed to materially correct one in months. The record exists by the time I open the next tab.",
    ],
  },
  {
    pn: 'D',
    title: 'It is the input layer for the WorkOS AI stack I already built.',
    body: [
      <>
        I wrote and shipped a{' '}
        <a
          href="https://workos.com/blog/cloudflare-workers-workflows-ai-blog-bot"
          target="_blank"
          rel="noopener"
          style={{ color: 'var(--accent)' }}
        >
          blog bot at WorkOS
        </a>{' '}
        — Cloudflare Workers + Workflows + Slack + Webflow CMS — that is now used org-wide. So when I want a new Applied AI internal feature that uses meeting context, the scaffolding is already there.
      </>,
      "'Draft our perspective on the customer questions from this morning's Acme call' is minutes-not-days work, because the blog bot is the default first plug-in and Granola is the input layer. Meeting capture stops being a sink. It becomes the start of a pipeline.",
    ],
  },
  {
    pn: 'E',
    title: 'No bot ever joins the meeting.',
    body: [
      "Loom recorders and the Google / Zoom AI Companions are heavy-handed. The other person's first introduction to the tooling is 'there is a robot listening to us', which immediately changes how they speak. Voices get tighter. Asides disappear. The meeting becomes more rehearsed.",
      "Granola is silent. There is no bot. Audio is captured locally. People stay relaxed, talk naturally, and the recording I get back is closer to the conversation that would have happened without any tooling in the room.",
    ],
  },
] as const

const wontDo = [
  {
    lede: 'I do not run it in calls where consent is unclear.',
    gloss:
      'Personal capture is one thing. Recording someone who has not understood that capture is happening is another. The local-audio architecture makes it technically silent. That does not make it ethically silent. I tell people.',
  },
  {
    lede: 'I do not paste raw transcripts back at people.',
    gloss:
      'The summary is for me. The transcript is for me. What goes to my manager, a customer, a partner is something I wrote, informed by the record, not pulled from it verbatim.',
  },
  {
    lede: 'I do not pretend the AI is doing the listening for me.',
    gloss:
      'It captures. I still have to think, still have to remember, still have to actually be in the meeting. Granola removed the part of meetings I was bad at; it did not remove the part I have to do.',
  },
]

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
                I&apos;ve been running Granola in every meeting for twelve months. WorkOS exec syncs, customer calls, consulting calls, friend catch-ups, the lot. This page is the short version of why it stuck — five specific things I would not be able to give up.
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
              <div className="aud-sub">The first pillar below explains exactly how.</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div
          className="container mx-auto max-w-6xl px-4 md:px-6"
          style={{ paddingTop: 72, paddingBottom: 32 }}
        >
          <header className="stand-head">
            <span className="num">§ 01</span>
            <h3>The five things that <em>made it stick</em>.</h3>
          </header>
          <ul className="stand-list">
            {pillars.map((p) => (
              <li key={p.pn}>
                <span className="glyph">{p.pn}</span>
                <span>
                  <span className="lede">{p.title}</span>
                  {p.body.map((para, i) => (
                    <span
                      key={i}
                      className="gloss"
                      style={{ display: 'block', marginTop: i === 0 ? 0 : 10 }}
                    >
                      {para}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div
          className="container mx-auto max-w-6xl px-4 md:px-6"
          style={{ paddingTop: 32, paddingBottom: 56 }}
        >
          <header className="stand-head">
            <span className="num">§ 02</span>
            <h3>What I <em>do not</em> use it for.</h3>
          </header>
          <ul className="stand-list">
            {wontDo.map((s) => (
              <li key={s.lede}>
                <span className="glyph no">×</span>
                <span>
                  <span className="lede">{s.lede}</span>
                  <span className="gloss">{s.gloss}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="claim">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 intake-wrap">
          <div className="intake-grid">
            <div>
              <div className="db-head" style={{ marginBottom: 16 }}>
                <div className="num">§ 03</div>
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
                <strong>Affiliate disclosure.</strong> Granola pays me a commission if you stay on past the trial. It is the meeting tool I would recommend either way; the commission is what makes the time to write this page economic. The take is mine. No edit rights granted.
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
                  No email, no workflow guide, no follow-up. The form above just lets me send the workflow I would otherwise have to write twice.
                </p>
              </div>

              <div>
                <h4>The deep-dive review</h4>
                <p>
                  <Link
                    href="/blog/granola-applied-ai-workflow-workos"
                    style={{ color: 'var(--accent)' }}
                  >
                    Granola in my Applied AI workflow at WorkOS →
                  </Link>{' '}
                  <span className="dim">— 90 days in, four meeting shapes, real screenshots, where it breaks down.</span>
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
