'use client'

import { useMemo, useState } from 'react'
import { track } from '@vercel/analytics'
import { ArrowRight, Check } from 'lucide-react'
import { getAffiliateLink, buildConciergeTerm } from '@/lib/affiliate'
import { AskAdvisorCTA } from '@/components/advisor/AskAdvisorCTA'

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
type Requirement = 'captions' | 'crm' | 'none'

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

const REQUIREMENTS: { id: Requirement; label: string }[] = [
  { id: 'captions', label: 'Live captions during the call' },
  { id: 'crm', label: 'Auto-sync to Salesforce / HubSpot' },
  { id: 'none', label: 'Neither' },
]

type Pick = 'granola' | 'otter' | 'fireflies'

const PICKS: Record<Pick, { name: string; product: 'granola' | null; tagline: string; reasonByShape: Partial<Record<MeetingShape, string>> }> = {
  granola: {
    name: 'Granola',
    product: 'granola',
    tagline: 'No bot joins the call.',
    reasonByShape: {
      client: 'Client calls hinge on candor. The moment a bot announces itself, the real conversation goes away.',
      sensitive: 'For HR, legal, or anything sensitive: a recording bot is a non-starter. Granola captures audio locally — nobody else on the call knows.',
      interview: 'You want to be present, not typing. Granola gets out of the way and you read the notes after.',
      internal: 'Once no "[Bot] is recording" banner interrupts, internal meetings get faster. Zack uses Granola daily for team syncs.',
      live: 'No live captions in Granola today. If that is the deal-breaker, Otter is the honest answer.',
    },
  },
  otter: {
    name: 'Otter.ai',
    product: null,
    tagline: 'Best for shared transcripts + live captions.',
    reasonByShape: {
      live: 'Live captions during the call is what Otter does best. Bot-based, but you wanted the bot.',
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
}

export function recommend(_role: Role, shape: MeetingShape | null, requirement: Requirement | null): Pick {
  // Selecting the live-captions meeting shape is itself a stated hard requirement.
  if (shape === 'live' || requirement === 'captions') return 'otter'
  if (requirement === 'crm') return 'fireflies'
  return 'granola'
}

const REASON_BY_ROLE: Record<Role, string> = {
  sales: 'Granola keeps the call focused on the buyer while it drafts the notes in the background.',
  consultant: 'Granola captures the details while you stay focused on the client and the decisions in the room.',
  executive: 'Granola gives you a useful record without adding another participant to the meeting.',
  engineer: 'Granola turns team syncs and technical discussions into notes without a bot joining the call.',
  product: 'Granola lets you follow the discussion while it captures decisions, questions, and follow-ups.',
  recruiter: 'Granola lets you stay present with the candidate while it drafts the interview notes.',
  therapist: 'Granola stays out of the conversation, which matters when trust and attention shape the session.',
  photographer: 'Granola captures client details and creative decisions while you keep the conversation natural.',
  researcher: 'Granola lets you listen closely while it drafts a record you can review after the session.',
  founder: 'Granola handles the notes across customer calls and team syncs without sending a bot into the room.',
  other: 'Granola drafts useful meeting notes without adding a bot participant to the call.',
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
  const [requirement, setRequirement] = useState<Requirement | null>(null)

  const pickKey = useMemo(() => recommend(role, shape, requirement), [role, shape, requirement])
  const pick = PICKS[pickKey]

  const term = buildConciergeTerm({ role, shape, requirement })
  const link = pick.product
    ? getAffiliateLink({
        product: pick.product,
        campaign,
        medium: 'blog',
        placement: 'concierge',
        term,
      })
    : null

  const reason = pickKey === 'otter'
    ? 'You need live captions during the call. Otter provides them; Granola does not today.'
    : pickKey === 'fireflies'
      ? 'Your organization requires meeting data to sync automatically to Salesforce or HubSpot. Fireflies is built for that workflow.'
      : (shape && pick.reasonByShape[shape]) || REASON_BY_ROLE[role]

  function handleClick() {
    track('concierge_cta_click', {
      product: pickKey,
      role,
      shape: shape ?? '',
      requirement: requirement ?? '',
      campaign,
      term,
    })
  }

  function handleAnswer<T extends string>(setter: (v: T) => void, value: T, key: 'role' | 'shape' | 'requirement') {
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
          <div className="mnc-qlabel"><span className="mnc-num">03</span> Any hard requirements?</div>
          <div className="mnc-pills" role="radiogroup" aria-label="Hard requirements">
            {REQUIREMENTS.map(r => (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={requirement === r.id}
                className={`mnc-pill${requirement === r.id ? ' is-on' : ''}`}
                onClick={() => handleAnswer(setRequirement, r.id, 'requirement')}
              >
                {r.label}
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
            Get 3 months free <ArrowRight size={16} aria-hidden />
          </a>
        ) : (
          <div className="mnc-cta-note">
            That is the honest answer for your case. I do not run an affiliate link for {pick.name} — search the name and pick the legit signup page.
          </div>
        )}
        {link && (
          <div className="mnc-free-plan">Free plan available; new users get their first 3 months free through my link.</div>
        )}
        <div className="mnc-fine">
          Disclosure: Granola is an affiliate partnership. I only recommend it where it actually fits — see other answers above.
        </div>
      </aside>
      <AskAdvisorCTA
        from="concierge"
        variant="compact"
        className="mnc-advisor-cta"
      />
    </section>
  )
}

export default MeetingNotesConcierge
