'use client'

import { track } from '@vercel/analytics'
import { ArrowUpRight, Check } from 'lucide-react'
import { getAffiliateLink, type AffiliateMedium, type AffiliatePlacement } from '@/lib/affiliate'

// ────────────────────────────────────────────────────────────────────────
// CTA cards for the Granola pillar essay.
//
// These are purpose-built for /granola, not reused from the demo. The
// editorial body around them uses serif headings, cream paper, burnt
// orange accent. The cards punch through that texture as dark, dense,
// high-contrast inserts — the visual rhythm-break is the point.
//
// Conversion best-practice elements baked in:
//
//   - Strong type hierarchy: large serif headline → sub → benefit list
//   - Author endorsement strip (≥ 1 specific lived-experience number)
//   - Risk reversal (free trial / no card / cancel anytime)
//   - Primary CTA + secondary action (form / sidebar / skip)
//   - Animated chevron + subtle scale on hover
//   - utm_term per placement → granular dashboard split
//   - Vercel analytics `affiliate_click` event with matching term
//
// All cards route through getAffiliateLink({ product: 'granola',
// campaign: 'granola-pillar', medium: 'blog' }) so they aggregate cleanly.
// ────────────────────────────────────────────────────────────────────────

const CAMPAIGN = 'granola-pillar'
const MEDIUM: AffiliateMedium = 'blog'

interface BaseProps {
  /** utm_term — kebab-case section tag (e.g., "s06-after-etiquette") */
  term: string
  /** Optional override for the headline copy */
  headline?: string
  /** Optional override for the sub-headline */
  sub?: string
}

// ────────────────────────────────────────────────────────────────────────
// Hero CTA — full pitch with benefits + dual action
// ────────────────────────────────────────────────────────────────────────

interface HeroProps extends BaseProps {
  kicker?: string
  benefits?: string[]
  ctaLabel?: string
  secondaryLabel?: string
  /** Anchor on the page to scroll to for the secondary action */
  secondaryHref?: string
}

export function GranolaHeroCTA({
  term,
  kicker = '§ Try it',
  headline = 'Granola — silent meeting capture, structured notes, free to start.',
  sub = "The meeting tool I've run for twelve months. Every exec sync, every customer call, every friend catch-up. No bot joins the conversation.",
  benefits = [
    'No bot joins the call · local audio capture',
    'Structured summary in seconds, transcript one click away',
    'Templates per meeting shape · live-query mid-call',
  ],
  ctaLabel = 'Start your free trial',
  secondaryLabel = 'Send me the workflow guide',
  secondaryHref = '#claim',
}: HeroProps) {
  const link = getAffiliateLink({
    product: 'granola',
    campaign: CAMPAIGN,
    medium: MEDIUM,
    placement: 'hero-card',
    term,
  })

  const onClick = () =>
    track('affiliate_click', {
      product: 'granola',
      context: `pillar:${term}`,
      variant: 'hero',
      campaign: CAMPAIGN,
      term,
    })

  return (
    <div
      className="granola-cta-hero group"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
        background: 'linear-gradient(135deg, #1f2d3d 0%, #141428 100%)',
        border: '1px solid rgba(230, 126, 34, 0.25)',
        padding: 'clamp(24px, 4vw, 36px)',
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.04) inset, 0 30px 60px -30px rgba(0,0,0,0.5)',
      }}
    >
      {/* Decorative accent — a soft burnt-orange glow in the top-right */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 240,
          height: 240,
          background:
            'radial-gradient(circle, rgba(230,126,34,0.25) 0%, rgba(230,126,34,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative' }}>
        {/* Kicker + endorsement strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            marginBottom: 18,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily:
                "var(--font-mono, 'JetBrains Mono'), ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: '#e67e22',
              fontWeight: 600,
            }}
          >
            {kicker}
          </span>
          <span
            style={{
              fontFamily:
                "var(--font-mono, 'JetBrains Mono'), ui-monospace, monospace",
              fontSize: 10.5,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'rgba(251, 247, 240, 0.55)',
              fontWeight: 500,
            }}
          >
            12 mo daily use · Zachary Proser
          </span>
        </div>

        {/* Headline */}
        <h3
          style={{
            fontFamily: "var(--font-serif, 'Crimson Pro'), Georgia, serif",
            fontSize: 'clamp(24px, 3vw, 32px)',
            fontWeight: 500,
            letterSpacing: '-.015em',
            lineHeight: 1.18,
            color: '#fbf7f0',
            margin: '0 0 14px',
            maxWidth: '36ch',
          }}
        >
          {headline}
        </h3>

        {/* Sub */}
        <p
          style={{
            fontFamily: "var(--font-serif, 'Crimson Pro'), Georgia, serif",
            fontSize: 17,
            lineHeight: 1.55,
            color: 'rgba(251, 247, 240, 0.78)',
            margin: '0 0 22px',
            maxWidth: '52ch',
          }}
        >
          {sub}
        </p>

        {/* Benefits */}
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 28px',
            display: 'grid',
            gap: 10,
          }}
        >
          {benefits.map((b) => (
            <li
              key={b}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                fontFamily: "var(--font-sans, 'Inter'), system-ui, sans-serif",
                fontSize: 14.5,
                lineHeight: 1.5,
                color: 'rgba(251, 247, 240, 0.88)',
              }}
            >
              <Check
                size={16}
                strokeWidth={2.5}
                style={{ color: '#e67e22', flexShrink: 0, marginTop: 2 }}
                aria-hidden
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* Action row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            marginBottom: 18,
          }}
        >
          <a
            href={link}
            target="_blank"
            rel="sponsored noopener noreferrer"
            onClick={onClick}
            className="granola-cta-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 22px',
              borderRadius: 10,
              background: '#e67e22',
              color: '#1a1a2e',
              fontFamily: "var(--font-sans, 'Inter'), system-ui, sans-serif",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '-.005em',
              textDecoration: 'none',
              boxShadow: '0 8px 24px -8px rgba(230, 126, 34, 0.5)',
              transition: 'transform .15s ease, box-shadow .15s ease, background .15s ease',
            }}
          >
            <span>{ctaLabel}</span>
            <ArrowUpRight size={18} strokeWidth={2.5} className="granola-cta-arrow" />
          </a>
          <a
            href={secondaryHref}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '14px 18px',
              borderRadius: 10,
              background: 'transparent',
              color: 'rgba(251, 247, 240, 0.85)',
              fontFamily: "var(--font-sans, 'Inter'), system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '-.005em',
              textDecoration: 'none',
              border: '1px solid rgba(251, 247, 240, 0.18)',
              transition: 'background .15s ease, border-color .15s ease',
            }}
          >
            <span>{secondaryLabel}</span>
            <span aria-hidden>↓</span>
          </a>
        </div>

        {/* Trust strip */}
        <div
          style={{
            fontFamily: "var(--font-mono, 'JetBrains Mono'), ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: 'rgba(251, 247, 240, 0.5)',
            marginTop: 6,
          }}
        >
          Mac · Windows · iOS &nbsp;·&nbsp; Free plan available &nbsp;·&nbsp; No credit card to try &nbsp;·&nbsp; Cancel anytime
        </div>
      </div>

      {/* Hover micro-interactions */}
      <style>{`
        .granola-cta-hero .granola-cta-primary:hover {
          transform: translateY(-1px);
          background: #f08c2e;
          box-shadow: 0 12px 28px -8px rgba(230, 126, 34, 0.55);
        }
        .granola-cta-hero .granola-cta-primary:hover .granola-cta-arrow {
          transform: translate(2px, -2px);
        }
        .granola-cta-hero .granola-cta-arrow {
          transition: transform .15s ease;
        }
      `}</style>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────
// Compact CTA — endorsement bar that fits between paragraphs
// ────────────────────────────────────────────────────────────────────────

interface CompactProps extends BaseProps {
  ctaLabel?: string
}

export function GranolaCompactCTA({
  term,
  headline = 'Granola — the app I just described.',
  sub = 'Free to try · ~5 minute setup · works on Mac, Windows, iOS.',
  ctaLabel = 'Start free trial',
}: CompactProps) {
  const link = getAffiliateLink({
    product: 'granola',
    campaign: CAMPAIGN,
    medium: MEDIUM,
    placement: 'compact-card',
    term,
  })

  const onClick = () =>
    track('affiliate_click', {
      product: 'granola',
      context: `pillar:${term}`,
      variant: 'compact',
      campaign: CAMPAIGN,
      term,
    })

  return (
    <a
      href={link}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={onClick}
      className="granola-cta-compact"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 18,
        alignItems: 'center',
        padding: '18px 22px',
        borderRadius: 12,
        background: 'linear-gradient(135deg, #1f2d3d 0%, #141428 100%)',
        border: '1px solid rgba(230, 126, 34, 0.22)',
        textDecoration: 'none',
        boxShadow: '0 12px 30px -18px rgba(0,0,0,0.4)',
        transition: 'transform .15s ease, border-color .15s ease, box-shadow .15s ease',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-serif, 'Crimson Pro'), Georgia, serif",
            fontSize: 'clamp(17px, 2vw, 19px)',
            fontWeight: 500,
            letterSpacing: '-.005em',
            color: '#fbf7f0',
            lineHeight: 1.25,
            marginBottom: 4,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            fontFamily: "var(--font-sans, 'Inter'), system-ui, sans-serif",
            fontSize: 13,
            lineHeight: 1.5,
            color: 'rgba(251, 247, 240, 0.65)',
          }}
        >
          {sub}
        </div>
      </div>
      <div
        className="granola-cta-pill"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 18px',
          borderRadius: 8,
          background: '#e67e22',
          color: '#1a1a2e',
          fontFamily: "var(--font-sans, 'Inter'), system-ui, sans-serif",
          fontSize: 13.5,
          fontWeight: 700,
          letterSpacing: '-.005em',
          whiteSpace: 'nowrap',
          boxShadow: '0 6px 18px -8px rgba(230, 126, 34, 0.5)',
          transition: 'background .15s ease',
        }}
      >
        <span>{ctaLabel}</span>
        <ArrowUpRight size={16} strokeWidth={2.5} className="granola-cta-arrow" />
      </div>

      <style>{`
        .granola-cta-compact:hover {
          transform: translateY(-2px);
          border-color: rgba(230, 126, 34, 0.45);
          box-shadow: 0 18px 36px -18px rgba(0,0,0,0.5);
        }
        .granola-cta-compact:hover .granola-cta-pill {
          background: #f08c2e;
        }
        .granola-cta-compact:hover .granola-cta-arrow {
          transform: translate(2px, -2px);
        }
        .granola-cta-compact .granola-cta-arrow {
          transition: transform .15s ease;
        }
        @media (max-width: 540px) {
          .granola-cta-compact {
            grid-template-columns: 1fr !important;
          }
          .granola-cta-compact .granola-cta-pill {
            justify-self: stretch;
            justify-content: center;
          }
        }
      `}</style>
    </a>
  )
}

// ────────────────────────────────────────────────────────────────────────
// Inline CTA — a bolded link with the underline accent for in-prose use
// ────────────────────────────────────────────────────────────────────────

interface InlineProps {
  term: string
  children: React.ReactNode
}

export function GranolaInlineCTA({ term, children }: InlineProps) {
  const link = getAffiliateLink({
    product: 'granola',
    campaign: CAMPAIGN,
    medium: MEDIUM,
    placement: 'inline-cta' as AffiliatePlacement,
    term,
  })

  const onClick = () =>
    track('affiliate_click', {
      product: 'granola',
      context: `pillar:${term}`,
      variant: 'inline',
      campaign: CAMPAIGN,
      term,
    })

  return (
    <a
      href={link}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={onClick}
      style={{
        color: '#e67e22',
        textDecoration: 'none',
        borderBottom: '1px solid rgba(230, 126, 34, 0.55)',
        paddingBottom: 1,
        fontWeight: 600,
        transition: 'color .15s ease, border-color .15s ease',
      }}
      className="granola-cta-inline"
    >
      {children}
      <style>{`
        .granola-cta-inline:hover {
          color: #f08c2e;
          border-bottom-color: #f08c2e;
        }
      `}</style>
    </a>
  )
}
