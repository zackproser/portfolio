import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SectionHead } from "@/components/SectionHead"

export const metadata: Metadata = {
  title: "Claude Workshops for Enterprise | Zachary Proser",
  description:
    "Three practitioners. Half-day to two-day. Up to 100 leaders shipping with Claude by the end of the session — including the ones who haven't opened a terminal in a decade.",
  openGraph: {
    title: "Claude Workshops for Enterprise | Zachary Proser",
    description:
      "Three practitioners. Half-day to two-day. Up to 100 leaders shipping with Claude by the end of the session.",
    images: [{ url: "https://zackproser.b-cdn.net/images/claude-cowork-workshop.webp" }],
  },
}

const HERO_PHOTO = "https://zackproser.b-cdn.net/images/zack-and-nick.webp"
const STRIP_NICK_ZACK = "https://zackproser.b-cdn.net/images/aie-london-workshop-nick-zack.webp"
const STRIP_EVIDENCE = "https://zackproser.b-cdn.net/images/aie-london-workshop-evidence.webp"
const STRIP_AUDIENCE = "https://zackproser.b-cdn.net/images/aie-london-audience-wide.webp"
const ZACK_PORTRAIT = "https://zackproser.b-cdn.net/images/zack-sketch.webp"
const NICK_NISI_PORTRAIT = "https://zackproser.b-cdn.net/images/nick-nisi-sketch.webp"
const NICK_CANNARIATO_PORTRAIT = "https://zackproser.b-cdn.net/images/nick-cannariato-sketch.webp"

type Phase = {
  code: string
  kind: string
  time: string
  title: string
  desc: string
  tools: string[]
}

const phases: Phase[] = [
  {
    code: "01",
    kind: "Calibration",
    time: "T+0:00",
    title: "Sterile pre-flight check",
    desc: "Laptops verified. Whisper Flow, Claude Code, and a pod-shared scratchpad warmed up. We do introductions during the install, not before.",
    tools: ["Claude.ai", "Claude Code", "Whisper Flow"],
  },
  {
    code: "02",
    kind: "Demo",
    time: "T+0:20",
    title: "Voice coding — the first holy-shit moment",
    desc: "Whisper Flow plus Claude Code in a terminal. We dictate the same task three different ways and watch the pod realize they just typed at 180 WPM without typing. This is the moment the room shifts.",
    tools: ["Whisper Flow", "Claude Code"],
  },
  {
    code: "03",
    kind: "Hands-on",
    time: "T+0:50",
    title: "The pod ships its first real thing",
    desc: "Each pod picks a workflow from their own job. CS picks a triage automation. Marketing picks a competitive teardown. Finance picks a Salesforce report. We unblock, suggest, get out of the way. Working code at the end of the hour — not a demo.",
    tools: ["Claude Code", "Your stack"],
  },
  {
    code: "04",
    kind: "Skills",
    time: "T+1:50",
    title: "Package the work as a reusable skill",
    desc: "The thing your pod just built becomes a Claude skill — branded, on-policy, in your org's shared repo. Fifteen to forty of these by the time we leave, depending on engagement shape.",
    tools: ["Skills", "Brand template", "Your repo"],
  },
  {
    code: "05",
    kind: "Champions",
    time: "T+2:40",
    title: "Cross-pod demo & champion identification",
    desc: "Each pod shows their skill. We tag the people who lit up — your internal champions. They go home with a 30-day playbook for keeping the flywheel turning after we're gone.",
    tools: ["Champion roster", "30-day playbook"],
  },
]

type Artifact = { n: string; tag: string; title: string; desc: string }
const artifacts: Artifact[] = [
  {
    n: "01",
    tag: "The thing that makes it stick",
    title: "A playbook tailored to your team",
    desc: "A bound and digital playbook written for your org by name. Covers the workflows your pods discovered, the skills they shipped, the rules of your brand and policy, and the specific way your champions should run their first thirty days of office hours. Your team's voice, your team's tools.",
  },
  {
    n: "02",
    tag: "In your repo before we leave",
    title: "Org-specific Claude skills",
    desc: "Fifteen to forty reusable skills built by the pods during the session, branded with your brand template, scoped to your stack and your policy. Each one solves an actual problem someone in the room has.",
  },
  {
    n: "03",
    tag: "Who lit up, and where they sit",
    title: "Champion roster + spark map",
    desc: "By end of day we hand you a labeled list of who lit up, where they sit, and what they shipped. Plus a heatmap of which departments are warm, lukewarm, or about-to-revolt — so your next moves are aimed, not sprayed.",
  },
  {
    n: "04",
    tag: "An on-ramp for the people who missed it",
    title: "Recordings + searchable transcripts",
    desc: "Every plenary recorded, transcribed, and uploaded to a private destination of your choosing. People who couldn't attend get a chaptered, searchable archive — not a four-hour video they'll never watch.",
  },
]

type Engagement = {
  n: string
  kind: string
  title: React.ReactNode
  when: string
  who: string
  crew: string
  price: string
  desc: string
  bullets: string[]
  feature?: boolean
}

const engagements: Engagement[] = [
  {
    n: "01",
    kind: "Half-day",
    title: (
      <>
        Single-team <em>workshop.</em>
      </>
    ),
    when: "Half-day · single session",
    who: "Up to 25 attendees",
    crew: "1 – 2 practitioners",
    price: "From $15k",
    desc: "A focused half-day for one team that already has Claude in their hands and wants to compound. Engineering teams who want the Claude Code playbook compressed. AI working groups who want voice coding and skills under their belt by lunch.",
    bullets: [
      "Hands-on, in-person or remote",
      "One lead practitioner + optional co-lead",
      "5–10 skills shipped live, in your repo",
      "Tailored playbook (~12 pages)",
      "Recording + transcripts",
    ],
  },
  {
    n: "02",
    kind: "Collaboration-week",
    title: (
      <>
        Org-wide <em>rollout workshop.</em>
      </>
    ),
    when: "Half-day · large room",
    who: "Up to 100 attendees · pods of 4–5",
    crew: "Full three-practitioner crew",
    price: "From $45k",
    desc: "The collaboration-week shape. Built for orgs running a top-down Claude rollout — leadership offsite, all-hands programming, “everyone in one room and let’s actually move.” This is where the change management lives.",
    bullets: [
      "Hands-on, on-site",
      "Up to 20 pods, three embedded practitioners",
      "15–25 org-specific skills shipped live",
      "Tailored playbook (~24 pages)",
      "Champion roster + spark map delivered day-of",
      "T-2wk sterile pre-flight · T+7 wrap call",
    ],
    feature: true,
  },
  {
    n: "03",
    kind: "Intensive",
    title: (
      <>
        Two-day <em>deep intensive.</em>
      </>
    ),
    when: "Two consecutive days",
    who: "Up to 60 attendees · curated",
    crew: "Full crew · embedded both days",
    price: "From $90k",
    desc: "Two days, full crew, deep. For organizations who want substantively more shipped, more champions identified, more workflows transformed — not just sparked. Day one mirrors the half-day arc; day two doubles down on skills, autonomous task runners, and the org-specific patterns your champions will run with for a quarter.",
    bullets: [
      "Two full days hands-on · same crew throughout",
      "30–40 skills shipped live, in your repo",
      "Tailored playbook (~40 pages, printed + digital)",
      "Department-level workflow audits",
      "Champion onboarding mini-workshop on day 2",
      "T+30 follow-up working session included",
    ],
  },
]

const faqs: { q: string; a: string }[] = [
  {
    q: "Will this embarrass executives who haven't touched a terminal in years?",
    a: 'No — and that\'s not an accident. See "Why the room is safe" above. Mixed-skill pods, a rotating keyboard, no public coding, no "stand up and demo." The shape of the room makes embarrassment impossible by design, not by hope.',
  },
  {
    q: "Can you actually handle a hundred attendees?",
    a: "Yes — it's the engagement we run most often. We split the room into roughly twenty pods of 4–5 with one keyboard owner each. The three of us rotate through, embedded — roughly seven pods per practitioner, but in practice we float to where the action is.",
  },
  {
    q: "Our laptops are locked down. Our IT team is twitchy. Now what?",
    a: "We send you a laptop image, install script, and account checklist two weeks before the workshop. Your IT team runs it; we're on Slack if anything breaks. We dry-run three random machines remotely three days before. The sterile pre-flight is non-negotiable for a reason.",
  },
  {
    q: "Our engineering team is already shipping with Claude Code. Won't they be bored?",
    a: "They're the engine. We pair them inside mixed pods, where they become the local expert and walk a non-engineer across the chat → code bridge. Most engineers tell us afterward it was the most fun part of their week. If you specifically want engineering-only depth, the half-day single-team shape is the right pick.",
  },
  {
    q: "Half-day vs. two-day — which is right for us?",
    a: "If your goal is to spark adoption across the org and identify champions, the half-day is plenty. If your goal is substantive transformation — workflows actually replaced, autonomous task runners shipped, your team operating in a new mode — book the two-day intensive. The collaboration-week shape sits in between.",
  },
  {
    q: "Do you do retainers or ongoing engagements?",
    a: "Yes, but only after we've run a workshop together first. We need to have set a foundation with your team before ongoing work makes sense — otherwise we'd be guessing at where the leverage actually is. Mention it on the scoping call.",
  },
  {
    q: "Can you do this remote-only?",
    a: "Yes, with caveats. The pod mechanic translates to breakout rooms reasonably well; the embedded-practitioner mechanic doesn't translate as cleanly. We discount remote engagements meaningfully, and we'll be straight with you about what changes.",
  },
  {
    q: "How is this different from an Anthropic-led workshop?",
    a: "Anthropic teaches the product. We teach what doing the rollout inside an org actually looks like — change management, the bridge from chat to code, the skills layer that turns one person's win into an org-wide habit. We co-hosted with Anthropic in SF in Feb 2026. We're orthogonal, not competitive.",
  },
]

type Person = {
  id: string
  role: string
  name: React.ReactNode
  bio: string
  creds: React.ReactNode[]
  photo?: string
}

const people: Person[] = [
  {
    id: "zack",
    role: "Applied AI · WorkOS",
    name: (
      <>
        Zachary <em>Proser</em>
      </>
    ),
    bio: "Full-stack engineer, 15 years shipping distributed systems, internal tooling, and customer-facing applications that automate manual tedium away. Currently one of five on the Applied AI team at WorkOS — which powers auth for OpenAI, Cursor, and most of the labs you've heard of. Ships production Claude Code daily.",
    creds: [
      "Full-stack engineer · 15 years",
      "Core engineer · Cloudflare (when eng was ~100 worldwide)",
      "Staff DevRel · Pinecone",
      "Open-source developer, speaker, trainer",
      "AIE NY & AIE London workshop instructor",
      <>
        DevSecCon 2025 keynote —{" "}
        <Link
          href="/videos/devseccon-2025-keynote-walking-and-talking-in-the-woods-with-ai"
          className="underline decoration-dotted underline-offset-2 hover:text-burnt-400 dark:hover:text-amber-400"
        >
          watch the talk →
        </Link>
      </>,
    ],
    photo: ZACK_PORTRAIT,
  },
  {
    id: "nick-nisi",
    role: "EM · DX / AI · WorkOS",
    name: (
      <>
        Nick <em>Nisi</em>
      </>
    ),
    bio: "Staff engineer and AI practitioner working at the front of the field. EM of WorkOS's DX / AI team — owns the internal harnesses other teams build on top of. Co-instructed at AIE NY and AIE London.",
    creds: [
      "Staff engineer · AI practitioner",
      "EM · DX / AI · WorkOS",
      "Co-host · AIE NY workshop",
      "Co-host · AIE London workshop",
      "Long-time JS & tooling community voice",
    ],
    photo: NICK_NISI_PORTRAIT,
  },
  {
    id: "nick-cannariato",
    role: "Senior Solutions Engineer · WorkOS",
    name: (
      <>
        Nick <em>Cannariato</em>
      </>
    ),
    bio: "Senior solutions engineer at WorkOS, with a developer-tools tour-of-duty before that: Twilio, Heroku, Zapier, GitHub. Knows enterprise rollouts from inside the room — what melts, what scales, what your IT team will actually approve.",
    creds: [
      "Senior Solutions Engineer · WorkOS",
      "Ex-Twilio · Heroku · Zapier · GitHub",
      "Embedded with rollouts at Fortune-scale orgs",
      "Specializes in adoption + change management",
      'Brings the "what about IT?" sanity check',
    ],
    photo: NICK_CANNARIATO_PORTRAIT,
  },
]

export default function ClaudeWorkshopsPage() {
  return (
    <div className="editorial-home flex flex-col min-h-screen text-charcoal-50 dark:text-parchment-100 theme-transition">
      <main className="flex-1">
        {/* ============ Hero ============ */}
        <section className="cw-hero pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="container mx-auto max-w-6xl px-4 md:px-6 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start">
            <div>
              <div className="cw-crumb">
                <Link href="/">Home</Link>
                <span className="sep">/</span>
                <Link href="/speaking">Workshops</Link>
                <span className="sep">/</span>
                <b>Claude for enterprise</b>
              </div>

              <h1 className="editorial-hero-h1 text-charcoal-50 dark:text-parchment-100 mt-4">
                Claude workshops for organizations <em>doing the rollout.</em>
              </h1>

              <p className="editorial-lede text-parchment-600 dark:text-slate-300">
                Three practitioners. Half-day to two-day. Up to one hundred leaders shipping with Claude
                by the end of the session — including the ones who haven&apos;t opened a terminal in a decade.
              </p>

              <div className="editorial-secondary text-parchment-600 dark:text-slate-400 mt-6">
                <a className="cw-cta-mono" href="#book">Book a workshop →</a>
                <span>·</span>
                <a className="cw-cta-mono" href="#engagements">Engagement shapes →</a>
                <span>·</span>
                <a className="cw-cta-mono" href="#arc">Jump to the arc →</a>
              </div>

              <dl className="editorial-meta text-parchment-600 dark:text-slate-400">
                <dt>Format</dt>
                <dd>Hands-on. Not a lecture. Pods of four to five, practitioner per pod, mixed-skill on purpose.</dd>
                <dt>Crew</dt>
                <dd>One, two, or three practitioners — scales with your room.</dd>
                <dt>Shape</dt>
                <dd>Half-day, full-day, or two-day intensive.</dd>
              </dl>
            </div>

            <div>
              <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">In the room</div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-parchment-300 dark:border-slate-700 shadow-md">
                <Image
                  src={HERO_PHOTO}
                  alt="Zack and Nick at the AI Engineer World's Fair, ready to teach the Mastra workshop"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 font-mono text-[11px] tracking-[0.1em] uppercase text-parchment-600 dark:text-slate-400">
                AIE World&apos;s Fair · SF · Mastra workshop
              </p>
            </div>
          </div>
        </section>

        {/* ============ Stat slab ============ */}
        <section className="pb-12">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="editorial-stats text-charcoal-50 dark:text-parchment-100">
              <div className="editorial-stat">
                <div className="editorial-stat-num">
                  3<span className="unit">crew</span>
                </div>
                <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                  Practitioners on-site
                </div>
              </div>
              <div className="editorial-stat">
                <div className="editorial-stat-num">
                  100<span className="unit">leaders</span>
                </div>
                <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                  Per collaboration-week session
                </div>
              </div>
              <div className="editorial-stat">
                <div className="editorial-stat-num">
                  ½–2<span className="unit">days</span>
                </div>
                <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                  Shape to your week
                </div>
              </div>
              <div className="editorial-stat">
                <div className="editorial-stat-num">
                  15–40<span className="unit">skills</span>
                </div>
                <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                  Shipped live, in your repo
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ § 01 The job to be done ============ */}
        <section className="py-14">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <SectionHead
              num="01"
              title={
                <>
                  You don&apos;t have an AI problem. You have an <em>adoption</em> problem.
                </>
              }
            />
            <div className="cw-prose">
              <p>
                The license is bought. The pilots are running. Engineering has been on Claude Code for months.
                But the rest of the org is either making cool emojis with the chat or quietly waiting for someone
                else to figure it out — and your CEO is asking what&apos;s taking so long.
              </p>
              <p>
                We&apos;ve watched the same pattern at every org we&apos;ve talked to this year. The bottleneck
                is never the model. It&apos;s the change management — the cultural shift from{" "}
                <em>&ldquo;AI is a thing engineers do&rdquo;</em> to{" "}
                <em>&ldquo;AI is how everyone here works.&rdquo;</em> Speakers don&apos;t move that. Office hours
                don&apos;t move that. A room of your peers shipping something together, with practitioners
                embedded inside the pods, does.
              </p>
            </div>
          </div>
        </section>

        {/* ============ § 02 Format ============ */}
        <section id="format" className="py-14 editorial-section-alt">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <SectionHead
              num="02"
              title={<>How the workshop runs.</>}
              moreHref="#engagements"
              moreLabel="Engagement shapes →"
            />
            <div className="cw-prose mb-8">
              <p>
                Workshop-shaped, not classroom-shaped. We split your room into pods of{" "}
                <em>four to five</em>, mixed-skill on purpose — exec next to engineer next to ops next to CS.
                Each pod has a designated keyboard owner; it rotates every fifteen minutes. The practitioners
                float, embedded — somebody is sitting next to you when you get stuck, not raising your hand
                on Zoom.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <article className="editorial-card">
                <div className="editorial-card-link">
                  <div className="editorial-card-meta flex items-center justify-between">
                    <span>F.01 · Pod</span>
                    <span className="text-burnt-400 dark:text-amber-400">4 – 5</span>
                  </div>
                  <div className="editorial-card-body" style={{ padding: "20px" }}>
                    <h3 className="editorial-card-title">Mixed-skill on purpose</h3>
                    <p className="editorial-card-desc" style={{ WebkitLineClamp: 4 }}>
                      Engineer + exec + ops + curious. Nobody is the most senior or the most junior at the table.
                      Awkwardness has nowhere to land.
                    </p>
                    <div className="editorial-card-footer">
                      <span className="editorial-card-read">Pod size</span>
                      <span className="editorial-card-index">F.01</span>
                    </div>
                  </div>
                </div>
              </article>

              <article className="editorial-card">
                <div className="editorial-card-link">
                  <div className="editorial-card-meta flex items-center justify-between">
                    <span>F.02 · Keyboard</span>
                    <span className="text-burnt-400 dark:text-amber-400">~15 min</span>
                  </div>
                  <div className="editorial-card-body" style={{ padding: "20px" }}>
                    <h3 className="editorial-card-title">Hot seat rotates</h3>
                    <p className="editorial-card-desc" style={{ WebkitLineClamp: 4 }}>
                      You build, watch, build again. No &ldquo;stand up and demo to the whole room.&rdquo; The hot
                      seat moves long enough to feel something, short enough that nobody owns the failure.
                    </p>
                    <div className="editorial-card-footer">
                      <span className="editorial-card-read">Rotation</span>
                      <span className="editorial-card-index">F.02</span>
                    </div>
                  </div>
                </div>
              </article>

              <article className="editorial-card">
                <div className="editorial-card-link">
                  <div className="editorial-card-meta flex items-center justify-between">
                    <span>F.03 · Crew</span>
                    <span className="text-burnt-400 dark:text-amber-400">1 – 3</span>
                  </div>
                  <div className="editorial-card-body" style={{ padding: "20px" }}>
                    <h3 className="editorial-card-title">Practitioners, not speakers</h3>
                    <p className="editorial-card-desc" style={{ WebkitLineClamp: 4 }}>
                      We float through the pods, embedded. Roughly seven pods per practitioner at full scale, but
                      in practice we go where the action is.
                    </p>
                    <div className="editorial-card-footer">
                      <span className="editorial-card-read">Crew size</span>
                      <span className="editorial-card-index">F.03</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div className="grid gap-8 md:grid-cols-2 mt-8">
              <div>
                <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
                  What we won&apos;t do
                </div>
                <ul className="cw-ticks">
                  <li>Run a deck for an hour</li>
                  <li>Single anyone out</li>
                  <li>Make the engineers sit through a &ldquo;what is an LLM&rdquo; slide</li>
                  <li>Leave you with a recording and a wave goodbye</li>
                </ul>
              </div>
              <div>
                <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
                  What we always do
                </div>
                <ul className="cw-ticks">
                  <li>
                    Build inside <em>your</em> codebase, docs, and brand
                  </li>
                  <li>Pair exec + IC inside each pod</li>
                  <li>Ship org-specific skills live, in your repo</li>
                  <li>Surface your hottest internal champions</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ============ § 03 Pre-flight ============ */}
        <section className="py-14">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <SectionHead
              num="03"
              title={
                <>
                  Pre-flight. <em>The part that makes day-of work.</em>
                </>
              }
            />
            <div className="cw-prose mb-8">
              <p>
                The most expensive thing a workshop can do is burn the first ninety minutes on env setup.
                We&apos;ve watched it kill rooms. So we don&apos;t.
              </p>
            </div>
            <div className="cw-preflight">
              <div className="cw-preflight-step">
                <div className="cw-preflight-when">T-2 weeks</div>
                <h5>Spec drop</h5>
                <p>
                  Laptop image, install script, account checklist. Your IT team runs it; we&apos;re on Slack
                  if they get stuck.
                </p>
              </div>
              <div className="cw-preflight-step">
                <div className="cw-preflight-when">T-3 days</div>
                <h5>Dry run</h5>
                <p>
                  We log into three random machines remotely and verify. Never goes clean on the first
                  pass — that&apos;s the point.
                </p>
              </div>
              <div className="cw-preflight-step">
                <div className="cw-preflight-when">T-0</div>
                <h5>Day-of</h5>
                <p>We arrive 90 min early. Tables labeled. Pods pre-assigned, mixed-skill on purpose.</p>
              </div>
              <div className="cw-preflight-step">
                <div className="cw-preflight-when">T+7 days</div>
                <h5>Wrap</h5>
                <p>
                  Recordings posted. Skills merged. Playbook delivered. Sync with your AI lead — we don&apos;t
                  disappear.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ § 04 The arc ============ */}
        <section id="arc" className="py-14 editorial-section-alt">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <SectionHead
              num="04"
              title={
                <>
                  The arc · <em>chat</em> to <em>code</em>, inside one afternoon.
                </>
              }
            />
            <div className="cw-prose mb-6">
              <p>
                The single biggest shift for non-engineering leaders is realizing that the wall between
                &ldquo;chat with Claude&rdquo; and &ldquo;Claude is building software for me&rdquo; is about{" "}
                <em>thirty minutes of practice</em>. We walk every pod across it. Two-day intensives double up
                on Phase 03 and Phase 04 — that&apos;s where the real organizational compounding happens.
              </p>
            </div>
            {phases.map((p) => (
              <div className="cw-phase" key={p.code}>
                <div className="cw-phase-head">
                  <span className="code">
                    P{p.code} · {p.kind}
                  </span>
                  <span className="time">{p.time}</span>
                </div>
                <div className="cw-phase-body">
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </div>
                <div className="cw-phase-tools">
                  {p.tools.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ § 05 Compassion ============ */}
        <section className="py-14">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <SectionHead
              num="05"
              title={
                <>
                  We&apos;re still the ones who <em>sweat.</em>
                </>
              }
            />
            <div className="cw-prose mb-2">
              <p>
                We&apos;ve each spent fifteen years learning to type fast. Now we dictate. Nick and I still text
                each other when something feels strange about that — when we realize we&apos;ve lost a skill we
                used to be proud of. We get the whiplash personally. So when your hundredth leader puts their
                hands on Claude Code for the first time and freezes, we know exactly what they&apos;re feeling.
              </p>
              <p>
                Compassion isn&apos;t a posture we put on for the workshop. It&apos;s the <em>only</em> reason
                any of this works. People learn when they feel safe. They feel safe when nobody at the table
                is going to be ridiculed for what they don&apos;t know. The room is calibrated around that,
                deliberately, top to bottom.
              </p>
            </div>

            <div className="cw-principles">
              <div>
                <div className="label">Principle 01</div>
                <h4>Mixed-skill pods. Always.</h4>
                <p>
                  Each pod has an exec, an engineer who&apos;s been on Claude Code for months, and a couple of
                  curious neutrals. Nobody is the most senior or the most junior at the table.
                </p>
              </div>
              <div>
                <div className="label">Principle 02</div>
                <h4>The keyboard rotates.</h4>
                <p>
                  You build, you watch, you build again. There is no &ldquo;stand up and demo to the whole
                  room.&rdquo; The hot seat moves every fifteen minutes by design.
                </p>
              </div>
              <div>
                <div className="label">Principle 03</div>
                <h4>We&apos;ve been in the seat.</h4>
                <p>
                  Every practitioner has personally been bad at Claude in front of someone who was better at it.
                  We remember exactly what it felt like. We lead with that memory.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ § 06 Artifacts ============ */}
        <section className="py-14 editorial-section-alt">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <SectionHead
              num="06"
              title={
                <>
                  The workshop is the <em>spark.</em> The artifacts are the <em>fire.</em>
                </>
              }
            />
            <div className="cw-prose mb-6">
              <p>
                A workshop that ends when the room empties is worth roughly nothing thirty days later. Every
                engagement ships a kit your champions can carry forward — built during the session, signed off
                by you, ready to share on Monday morning. The biggest of these is the <em>tailored playbook</em>,
                written for your org by name.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {artifacts.map((a) => (
                <article className="editorial-card" key={a.n}>
                  <div className="editorial-card-link">
                    <div className="editorial-card-meta flex items-center justify-between">
                      <span>A.{a.n} · Artifact</span>
                      <span className="text-burnt-400 dark:text-amber-400">{a.tag}</span>
                    </div>
                    <div className="editorial-card-body" style={{ padding: "20px" }}>
                      <h3 className="editorial-card-title">{a.title}</h3>
                      <p className="editorial-card-desc" style={{ WebkitLineClamp: 6 }}>
                        {a.desc}
                      </p>
                      <div className="editorial-card-footer">
                        <span className="editorial-card-read">Artifact {a.n}</span>
                        <span className="editorial-card-index">A.{a.n}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ § 07 Team ============ */}
        <section id="team" className="py-14">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <SectionHead
              num="07"
              title={
                <>
                  Three practitioners. <em>One shipping crew.</em>
                </>
              }
            />
            <div className="cw-prose mb-2">
              <p>
                You&apos;re not hiring a speaker. You&apos;re hiring three full-time builders at companies that
                use Claude in anger every day. We run workshops as the side of our job that translates what we
                do daily into something your team can pick up by 5pm.
              </p>
            </div>

            {people.map((person) => (
              <div className="cw-person" key={person.id}>
                <div className="cw-person-av">
                  {person.photo ? (
                    <Image
                      src={person.photo}
                      alt={person.id}
                      fill
                      sizes="140px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="cw-person-av-placeholder">Photo</div>
                  )}
                </div>
                <div>
                  <div className="cw-person-meta">
                    <span className="role">{person.role}</span>
                  </div>
                  <h4>{person.name}</h4>
                  <div className="cw-person-bio">{person.bio}</div>
                  <dl className="cw-creds">
                    {person.creds.map((c, i) => (
                      <div key={i} className="contents">
                        <dt>{String(i + 1).padStart(2, "0")}</dt>
                        <dd>{c}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ § 08 Engagements (pricing) ============ */}
        <section id="engagements" className="py-14 editorial-section-alt">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <SectionHead
              num="08"
              title={
                <>
                  Engagements · <em>three shapes</em>, one shipping crew.
                </>
              }
              moreHref="/contact"
              moreLabel="Book a scoping call →"
            />
            <div className="cw-prose mb-8">
              <p>
                Every engagement is fixed-scope, fixed-price, held the moment you sign. No hourly. No discovery
                phase before you can plan a budget. You pick a shape, we hold the date, we ship.
              </p>
            </div>

            {engagements.map((e) => (
              <article className={`cw-engagement ${e.feature ? "feature" : ""}`} key={e.n}>
                <div className="cw-engagement-left">
                  <div className="meta">
                    <b>Workshop № {e.n}</b>
                    <span>
                      {e.kind} · {e.when}
                    </span>
                  </div>
                  <div className="title">{e.title}</div>
                  <span className="price">{e.price}</span>
                </div>
                <div className="cw-engagement-right">
                  <p className="desc">{e.desc}</p>
                  <dl className="info">
                    <div>
                      <dt>Who</dt>
                      <dd>{e.who}</dd>
                    </div>
                    <div>
                      <dt>Crew</dt>
                      <dd>{e.crew}</dd>
                    </div>
                    <div>
                      <dt>Format</dt>
                      <dd>Hands-on</dd>
                    </div>
                  </dl>
                  <ul className="cw-ticks">
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <div className="cw-engagement-footer">
                    <span>Scope &amp; held in 48 hr</span>
                    <Link href="/contact" className="cw-cta-mono">
                      Scope this →
                    </Link>
                  </div>
                </div>
              </article>
            ))}

            <div className="cw-retainer">
              <div className="cw-retainer-meta">
                <b>§ 08.½ · Ongoing partnership</b>
                <span className="right">Available · post-workshop only</span>
              </div>
              <h3>For orgs we&apos;ve already shipped with.</h3>
              <p>
                Once we&apos;ve run a workshop together and the foundation is in place, some orgs ask us to
                keep showing up — running monthly champion office hours, reviewing skill PRs, sitting in on
                quarterly AI strategy. We&apos;re selective about retainers: we only take them after a
                workshop, because <em>that&apos;s how we know we can actually move the needle for your team.</em>{" "}
                Monthly, scoped to your scale, starting in the low five figures.
              </p>
              <Link href="/contact" className="cw-cta-mono">
                Mention it on the scoping call →
              </Link>
            </div>

            <p className="mt-8 text-[14px] leading-relaxed text-parchment-500 dark:text-slate-400 max-w-[68ch]">
              Travel for the crew is billed at cost, separately. Venue, catering, and per-diems are on you. We
              can deliver remote — it&apos;s effective at smaller sizes; we&apos;ll be straight with you about
              what changes.
            </p>
          </div>
        </section>

        {/* ============ § 09 In the room (photo strip) ============ */}
        <section className="py-14">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
              In the room · AIE London · WorkOS
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  src: STRIP_NICK_ZACK,
                  alt: "Zack and Nick co-instructing the Skills at Scale workshop at AI Engineering London",
                  caption: "Skills at Scale · Nick & Zack",
                },
                {
                  src: STRIP_EVIDENCE,
                  alt: "Zack teaching backtick evidence patterns to workshop attendees",
                  caption: "Teaching evidence patterns",
                },
                {
                  src: STRIP_AUDIENCE,
                  alt: "Packed audience at the AI Engineering London workshop",
                  caption: "AIE London · the room",
                },
              ].map((img) => (
                <figure key={img.src} className="m-0">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-parchment-300 dark:border-slate-700 shadow-sm">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 font-mono text-[11px] tracking-[0.1em] uppercase text-parchment-600 dark:text-slate-400">
                    {img.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-4 text-center font-mono text-[11px] tracking-[0.1em] uppercase text-parchment-500 dark:text-slate-500">
              AI Engineer World&apos;s Fair · New York &amp; London · WorkOS internal Claude Day · SF
            </p>
          </div>
        </section>

        {/* ============ § 09 FAQ ============ */}
        <section className="py-14">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <SectionHead num="09" title={<>Frequently — and reasonably — asked.</>} />
            <div className="cw-faq-list">
              {faqs.map((f, i) => (
                <div className="cw-faq-item" key={f.q}>
                  <div className="cw-faq-meta">Q.{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <h4>{f.q}</h4>
                    <p>{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ § 10 Closing CTA ============ */}
        <section id="book" className="py-20 editorial-section-alt">
          <div className="container mx-auto max-w-4xl px-4 md:px-6 text-center">
            <div className="editorial-eyebrow text-parchment-600 dark:text-slate-400">
              Ready when you are
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mt-4 text-charcoal-50 dark:text-parchment-100">
              Tell us when your <em className="text-burnt-400 dark:text-amber-400 italic">collaboration week</em> is.
            </h2>
            <p className="editorial-lede text-parchment-600 dark:text-slate-300 mx-auto mt-4">
              30-minute scoping call. We send you a proposal within 48 hours. We hold the date the moment you
              sign — typically booked out 6–10 weeks.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md text-white bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-charcoal-500 transition-colors"
              >
                Book a 30-min scoping call →
              </Link>
              <Link
                href="/speaking"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md border border-parchment-400 dark:border-slate-600 text-charcoal-50 dark:text-parchment-100 hover:border-burnt-400 dark:hover:border-amber-400 hover:text-burnt-400 dark:hover:text-amber-400 transition-colors"
              >
                View all workshops &amp; talks
              </Link>
            </div>

            <div className="cw-close-kit">
              <div className="cw-close-kit-label">What to send in the first email</div>
              <ul className="cw-ticks">
                <li>Headcount and mix (eng / non-eng / leadership ratios)</li>
                <li>Target date range or collaboration-week dates</li>
                <li>What&apos;s already been rolled out internally</li>
                <li>The CEO&apos;s actual phrasing of what they want</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
