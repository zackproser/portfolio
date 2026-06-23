import type { MonitoredPage } from './utils'

// Four believable monitored pages, each with a hand-built snapshot timeline.
// The markdown and structured fields mirror what Firecrawl returns so the diffs
// and JSON-mode payloads look like real production output.

export const MONITORED_PAGES: MonitoredPage[] = [
  // 1. SaaS pricing page — a price bump and a plan rename.
  {
    id: 'acmecloud-pricing',
    label: 'AcmeCloud — Pricing',
    url: 'https://acmecloud.io/pricing',
    purpose: 'Catch competitor price moves and plan repackaging the moment they ship.',
    category: 'pricing',
    alertChannel: '#competitive-intel',
    schema: JSON.stringify(
      {
        type: 'object',
        properties: {
          starterPrice: { type: 'string' },
          proPrice: { type: 'string' },
          freeTrialDays: { type: 'string' },
        },
      },
      null,
      2
    ),
    snapshots: [
      {
        id: 'acmecloud-pricing-s1',
        scrapedAt: '2026-05-04T10:00:00.000+00:00',
        markdown: `# Pricing

Simple, transparent pricing that scales with your team.

## Starter — $12/mo
- 3 projects
- 10 GB storage
- Community support

## Pro — $39/mo
- Unlimited projects
- 100 GB storage
- Priority email support

Start with a 14-day free trial. No credit card required.`,
        fields: {
          starterPrice: '$12/mo',
          proPrice: '$39/mo',
          freeTrialDays: '14',
        },
      },
      {
        id: 'acmecloud-pricing-s2',
        scrapedAt: '2026-05-11T10:00:00.000+00:00',
        markdown: `# Pricing

Simple, transparent pricing that scales with your team.

## Starter — $12/mo
- 3 projects
- 10 GB storage
- Community support

## Pro — $39/mo
- Unlimited projects
- 100 GB storage
- Priority email support

Start with a 14-day free trial. No credit card required.`,
        fields: {
          starterPrice: '$12/mo',
          proPrice: '$39/mo',
          freeTrialDays: '14',
        },
      },
      {
        id: 'acmecloud-pricing-s3',
        scrapedAt: '2026-05-18T10:00:00.000+00:00',
        markdown: `# Pricing

Simple, transparent pricing that scales with your team.

## Starter — $15/mo
- 3 projects
- 25 GB storage
- Community support

## Pro — $49/mo
- Unlimited projects
- 250 GB storage
- Priority email support

Start with a 7-day free trial. No credit card required.`,
        fields: {
          starterPrice: '$15/mo',
          proPrice: '$49/mo',
          freeTrialDays: '7',
        },
      },
      {
        id: 'acmecloud-pricing-s4',
        scrapedAt: '2026-05-25T10:00:00.000+00:00',
        markdown: `# Pricing

Simple, transparent pricing that scales with your team.

## Starter — $15/mo
- 3 projects
- 25 GB storage
- Community support

## Pro — $49/mo
- Unlimited projects
- 250 GB storage
- Priority email support

## Scale — $149/mo
- Everything in Pro
- SSO and SCIM
- 99.9% uptime SLA

Start with a 7-day free trial. No credit card required.`,
        fields: {
          starterPrice: '$15/mo',
          proPrice: '$49/mo',
          freeTrialDays: '7',
        },
      },
    ],
  },

  // 2. Competitor changelog — a shipped feature.
  {
    id: 'meridian-changelog',
    label: 'Meridian Analytics — Changelog',
    url: 'https://meridian.dev/changelog',
    purpose: 'Know the day a competitor ships a feature you are also building.',
    category: 'changelog',
    alertChannel: '#product-watch',
    schema: JSON.stringify(
      {
        type: 'object',
        properties: {
          latestVersion: { type: 'string' },
          latestReleaseDate: { type: 'string' },
        },
      },
      null,
      2
    ),
    snapshots: [
      {
        id: 'meridian-changelog-s1',
        scrapedAt: '2026-05-02T08:00:00.000+00:00',
        markdown: `# Changelog

## v3.4.0 — April 28, 2026
- Added saved dashboard layouts
- Faster CSV export for large datasets
- Fixed timezone handling on scheduled reports`,
        fields: {
          latestVersion: 'v3.4.0',
          latestReleaseDate: 'April 28, 2026',
        },
      },
      {
        id: 'meridian-changelog-s2',
        scrapedAt: '2026-05-09T08:00:00.000+00:00',
        markdown: `# Changelog

## v3.4.0 — April 28, 2026
- Added saved dashboard layouts
- Faster CSV export for large datasets
- Fixed timezone handling on scheduled reports`,
        fields: {
          latestVersion: 'v3.4.0',
          latestReleaseDate: 'April 28, 2026',
        },
      },
      {
        id: 'meridian-changelog-s3',
        scrapedAt: '2026-05-16T08:00:00.000+00:00',
        markdown: `# Changelog

## v3.5.0 — May 14, 2026
- Shipped real-time anomaly alerts powered by streaming ingestion
- New Slack and PagerDuty alert destinations
- Public API for programmatic dashboard creation

## v3.4.0 — April 28, 2026
- Added saved dashboard layouts
- Faster CSV export for large datasets
- Fixed timezone handling on scheduled reports`,
        fields: {
          latestVersion: 'v3.5.0',
          latestReleaseDate: 'May 14, 2026',
        },
      },
    ],
  },

  // 3. Documentation page — a section removed and another added.
  {
    id: 'paywell-docs-auth',
    label: 'PayWell Docs — Authentication',
    url: 'https://docs.paywell.com/authentication',
    purpose: 'Catch breaking API doc changes before they break your integration.',
    category: 'docs',
    alertChannel: '#integrations',
    schema: JSON.stringify(
      {
        type: 'object',
        properties: {
          recommendedAuthMethod: { type: 'string' },
          tokenLifetime: { type: 'string' },
        },
      },
      null,
      2
    ),
    snapshots: [
      {
        id: 'paywell-docs-auth-s1',
        scrapedAt: '2026-04-20T12:00:00.000+00:00',
        markdown: `# Authentication

PayWell supports two authentication methods.

## API Keys
Pass your API key in the \`Authorization\` header. Keys never expire and are scoped per project.

## Basic Auth
Send your account email and password with each request. Available on legacy accounts only.`,
        fields: {
          recommendedAuthMethod: 'API Keys',
          tokenLifetime: 'never expires',
        },
      },
      {
        id: 'paywell-docs-auth-s2',
        scrapedAt: '2026-05-04T12:00:00.000+00:00',
        markdown: `# Authentication

PayWell supports two authentication methods.

## OAuth 2.0
Use the authorization code flow to obtain a short-lived access token. Tokens expire after 60 minutes and refresh tokens rotate on each use.

## API Keys
Pass your API key in the \`Authorization\` header. Keys never expire and are scoped per project.`,
        fields: {
          recommendedAuthMethod: 'OAuth 2.0',
          tokenLifetime: '60 minutes',
        },
      },
      {
        id: 'paywell-docs-auth-s3',
        scrapedAt: '2026-05-18T12:00:00.000+00:00',
        markdown: `# Authentication

PayWell supports OAuth 2.0 for all new integrations.

## OAuth 2.0
Use the authorization code flow to obtain a short-lived access token. Tokens expire after 30 minutes and refresh tokens rotate on each use.

## Migrating from API Keys
API keys are deprecated and will stop working on August 1, 2026. Migrate to OAuth before that date.`,
        fields: {
          recommendedAuthMethod: 'OAuth 2.0',
          tokenLifetime: '30 minutes',
        },
      },
    ],
  },

  // 4. Policy / ToS page — a compliance-relevant change.
  {
    id: 'northstar-tos',
    label: 'NorthStar — Terms of Service',
    url: 'https://northstar.app/legal/terms',
    purpose: 'Flag terms and data-handling changes your legal team must review.',
    category: 'policy',
    alertChannel: '#legal-compliance',
    schema: JSON.stringify(
      {
        type: 'object',
        properties: {
          dataRetentionPeriod: { type: 'string' },
          governingLaw: { type: 'string' },
          arbitrationRequired: { type: 'string' },
        },
      },
      null,
      2
    ),
    snapshots: [
      {
        id: 'northstar-tos-s1',
        scrapedAt: '2026-03-15T00:00:00.000+00:00',
        markdown: `# Terms of Service

Last updated: March 15, 2026

## 7. Data Retention
We retain your account data for 90 days after cancellation, after which it is permanently deleted.

## 12. Governing Law
These terms are governed by the laws of the State of Delaware.`,
        fields: {
          dataRetentionPeriod: '90 days',
          governingLaw: 'Delaware',
          arbitrationRequired: 'no',
        },
      },
      {
        id: 'northstar-tos-s2',
        scrapedAt: '2026-05-15T00:00:00.000+00:00',
        markdown: `# Terms of Service

Last updated: May 15, 2026

## 7. Data Retention
We retain your account data for 24 months after cancellation, after which it is permanently deleted.

## 12. Governing Law
These terms are governed by the laws of the State of Delaware.

## 13. Binding Arbitration
By using NorthStar you agree to resolve disputes through binding arbitration and waive your right to a jury trial.`,
        fields: {
          dataRetentionPeriod: '24 months',
          governingLaw: 'Delaware',
          arbitrationRequired: 'yes',
        },
      },
    ],
  },
]

export const CATEGORY_META: Record<
  MonitoredPage['category'],
  { label: string; tone: string }
> = {
  pricing: { label: 'Pricing', tone: 'emerald' },
  changelog: { label: 'Changelog', tone: 'blue' },
  docs: { label: 'Docs', tone: 'purple' },
  policy: { label: 'Policy', tone: 'amber' },
}
