'use client'

import { useMemo, useState } from 'react'
import { track } from '@vercel/analytics'
import { ArrowRight, Check } from 'lucide-react'
import { getAffiliateLink, buildConciergeTerm } from '@/lib/affiliate'

type Role =
  | 'sales'
  | 'consultant'
  | 'executive'
  | 'engineer'
  | 'product'
  | 'recruiter'
  | 'therapist'
  | 'photographer'
  | 'researcher'
  | 'founder'
  | 'other'

type MeetingShape = 'client' | 'internal' | 'sensitive' | 'interview' | 'live'
type Stack = 'mac' | 'windows' | 'zoom' | 'meet' | 'inperson'

const ROLES: { id: Role; label: string }[] = [
  { id: 'sales', label: 'Sales' },
  { id: 'consultant', label: 'Consultant' },
  { id: 'executive', label: 'Executive' },
  { id: 'engineer', label: 'Engineer' },
  { id: 'product', label: 'Product / PM' },
  { id: 'recruiter', label: 'Recruiter' },
  { id: 'therapist', label: 'Therapist / Coach' },
  { id: 'photographer', label: 'Photographer' },
  { id: 'researcher', label: 'Researcher' },
  { id: 'founder', label: 'Founder' },
  { id: 'other', label: 'Something else' },
]

const SHAPES: { id: MeetingShape; label: string; hint: string }[] = [
  { id: 'client', label: 'Client / sales calls', hint: 'Trust changes the conversation' },
  { id: 'internal', label: 'Internal team', hint: 'Everyone is fine being recorded' },
  { id: 'sensitive', label: 'Sensitive / HR', hint: 'Candor matters; a bot kills it' },
  { id: 'interview', label: 'Interviews', hint: 'You want to be present, not typing' },
  { id: 'live', label: 'Live captions', hint: 'Real-time transcript during the call' },
]

const STACKS: { id: Stack; label: string }[] = [
  { id: 'mac', label: 'Mac' },
  { id: 'windows', label: 'Windows' },
  { id: 'zoom', label: 'Zoom-heavy' },
  { id: 'meet', label: 'Google Meet' },
  { id: 'inperson', label: 'In-person / hybrid' },
]

type Pick = 'granola' | 'otter' | 'fireflies' | 'fathom'

const PICKS: Record<Pick, { name: string; product: 'granola' | null; tagline: string; reasonByShape: Partial<Record<MeetingShape, string>> }> = {
  granola: {
    name: 'Granola',
    product: 'granola',
    tagline: 'Invisible. No bot. Mac.',
    reasonByShape: {
      client: 'Client calls hinge on candor. The moment a bot announces itself, the real conversation goes away.',
      sensitive: 'For HR, legal, or anything sensitive: a recording bot is a non-starter. Granola captures audio locally — nobody else on the call knows.',
      interview: 'You want to be present, not typing. Granola gets out of the way and you read the notes after.',
      internal: 'Even internal — once you stop seeing "[Bot] is recording," meetings get faster.',
      live: 'No live captions in Granola today. If that is the deal-breaker, Otter is the honest answer.',
    },
  },
  otter: {
    name: 'Otter.ai',
    product: null,
    tagline: 'Best for shared transcripts + live captions.',
    reasonByShape: {
      live: 'Live captions during the call is what Otter does best. Bot-based, but you wanted the bot.',
      internal: 'Internal team meetings where everyone is fine being recorded — Otter is the team-transcript option.',
    },
  },
  fireflies: {
    name: 'Fireflies.ai',
    product: null,
    tagline: 'Best when call data has to land in a CRM.',
    reasonByShape: {
      client: 'If your sales motion runs through Salesforce or HubSpot and revops needs the data, Fireflies wins.',
      internal: 'Same answer for internal sales reviews — CRM sync is the differentiator.',
    },
  },
  fathom: {
    name: 'Fathom',
    product: null,
    tagline: 'Free, Zoom-first.',
    reasonByShape: {
      internal: 'Free tier is solid if you live in Zoom and the bot does not change anything for you.',
    },
  },
}

function recommend(role: Role, shape: MeetingShape | null, stack: Stack | null): Pick {
  // Shape is the strongest signal.
  if (shape === 'sensitive') return 'granola'
  if (shape === 'live') return 'otter'
  if (shape === 'interview') return 'granola'
  if (shape === 'client') {
    // Sales people who care about CRM → Fireflies; everyone else → Granola.
    if (role === 'sales' && stack === 'windows') return 'fireflies'
    return 'granola'
  }
  if (shape === 'internal') {
    if (role === 'sales') return 'fireflies'
    if (stack === 'zoom') return 'fathom'
    return 'otter'
  }
  // No shape selected yet — fall back to role.
  if (
    role === 'consultant' ||
    role === 'executive' ||
    role === 'therapist' ||
    role === 'photographer' ||
    role === 'researcher' ||
    role === 'founder'
  ) return 'granola'
  if (role === 'sales') return 'fireflies'
  return 'granola'
}

interface ConciergeProps {
  campaign: string
  defaultRole?: Role
  // Optional: override the headline copy per host post.
  headline?: string
}

export function MeetingNotesConcierge({ campaign, defaultRole, headline }: ConciergeProps) {
  const [role, setRole] = useState<Role>(defaultRole ?? 'consultant')
  const [shape, setShape] = useState<MeetingShape | null>(null)
  const [stack, setStack] = useState<Stack | null>(null)

  const pickKey = useMemo(() => recommend(role, shape, stack), [role, shape, stack])
  const pick = PICKS[pickKey]

  const term = buildConciergeTerm({ role, shape, stack })
  const link = pick.product
    ? getAffiliateLink({
        product: pick.product,
        campaign,
        medium: 'blog',
        placement: 'concierge',
        term,
      })
    : null

  const reason =
    (shape && pick.reasonByShape[shape]) ||
    pick.reasonByShape.client ||
    pick.tagline

  function handleClick() {
    track('concierge_cta_click', {
      product: pickKey,
      role,
      shape: shape ?? '',
      stack: stack ?? '',
      campaign,
      term,
    })
  }

  function handleAnswer<T extends string>(setter: (v: T) => void, value: T, key: 'role' | 'shape' | 'stack') {
    setter(value)
    track('concierge_answer', { key, value, campaign })
  }

  const roleLabel = ROLES.find(r => r.id === role)?.label.toLowerCase() || 'you'

  return (
    <section className="mn-concierge" aria-label="Find the right meeting notes tool">
      <header className="mnc-head">
        <span className="mnc-eyebrow">§ The 30-second concierge</span>
        <h3 className="mnc-title">
          {headline ?? <>Three questions. One <em>honest</em> recommendation.</>}
        </h3>
      </header>

      <div className="mnc-grid">
        <div className="mnc-q">
          <div className="mnc-qlabel"><span className="mnc-num">01</span> What do you do?</div>
          <div className="mnc-pills" role="radiogroup" aria-label="Role">
            {ROLES.map(r => (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={role === r.id}
                className={`mnc-pill${role === r.id ? ' is-on' : ''}`}
                onClick={() => handleAnswer(setRole, r.id, 'role')}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mnc-q">
          <div className="mnc-qlabel"><span className="mnc-num">02</span> What kind of meetings matter most?</div>
          <div className="mnc-shapes" role="radiogroup" aria-label="Meeting shape">
            {SHAPES.map(s => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={shape === s.id}
                className={`mnc-shape${shape === s.id ? ' is-on' : ''}`}
                onClick={() => handleAnswer(setShape, s.id, 'shape')}
              >
                <span className="mnc-shape-label">{s.label}</span>
                <span className="mnc-shape-hint">{s.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mnc-q">
          <div className="mnc-qlabel"><span className="mnc-num">03</span> Where do you mostly meet?</div>
          <div className="mnc-pills" role="radiogroup" aria-label="Stack">
            {STACKS.map(s => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={stack === s.id}
                className={`mnc-pill${stack === s.id ? ' is-on' : ''}`}
                onClick={() => handleAnswer(setStack, s.id, 'stack')}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="mnc-result" aria-live="polite">
        <div className="mnc-result-eyebrow">
          <Check className="mnc-check" size={14} aria-hidden /> For a {roleLabel} →
        </div>
        <div className="mnc-result-name">
          {pick.name}
          <span className="mnc-result-tag">{pick.tagline}</span>
        </div>
        <p className="mnc-result-reason">{reason}</p>
        {link ? (
          <a
            className="mnc-cta"
            href={link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={handleClick}
          >
            Try {pick.name} free <ArrowRight size={16} aria-hidden />
          </a>
        ) : (
          <div className="mnc-cta-note">
            That is the honest answer for your case. I do not run an affiliate link for {pick.name} — search the name and pick the legit signup page.
          </div>
        )}
        <div className="mnc-fine">
          Disclosure: Granola is an affiliate partnership. I only recommend it where it actually fits — see other answers above.
        </div>
      </aside>
    </section>
  )
}

export default MeetingNotesConcierge
