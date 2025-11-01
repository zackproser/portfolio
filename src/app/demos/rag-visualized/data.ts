export type RagDatasetDocument = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  lastUpdated: string;
};

export type RagDataset = {
  id: string;
  name: string;
  description: string;
  color: string;
  documents: RagDatasetDocument[];
  sampleQueries: string[];
};

export type RagNarrativeStep = {
  id: string;
  label: string;
  title: string;
  description: string;
};

export const RAG_VALUE_POINTS = [
  {
    id: 'hallucinations',
    title: 'Ground every answer in truth',
    description:
      'Verified retrieval prevents the model from hallucinating or confabulating based on stale pre-training data. Users see citations tied to real sources, not guesses.'
  },
  {
    id: 'costs',
    title: 'Operate with pragmatic economics',
    description:
      'Targeted semantic search over your own corpus costs less than hiring a fine-tuning team and paying for repetitive model training cycles.'
  },
  {
    id: 'speed',
    title: 'Ship fast with existing talent',
    description:
      'Experienced engineers can stand up a RAG layer quickly - long before an organization can develop the capital and expertise to train or fine-tune foundation models.'
  }
] as const;

export const RAG_NARRATIVE_STEPS: RagNarrativeStep[] = [
  {
    id: 'ingest',
    label: '01',
    title: 'Ingest & Chunk',
    description: 'Break trusted knowledge into reusable snippets with metadata so retrieval can stay precise.'
  },
  {
    id: 'embed',
    label: '02',
    title: 'Embed & Store',
    description: 'Convert each chunk into a semantic vector and keep it in a fast, filterable index.'
  },
  {
    id: 'retrieve',
    label: '03',
    title: 'Retrieve & Rerank',
    description: 'Match the live question against vectors, blend semantic and keyword signals, and surface the best context.'
  },
  {
    id: 'compose',
    label: '04',
    title: 'Compose & Ground',
    description: 'Assemble a grounded prompt, let the LLM draft an answer, then cite the exact chunks used.'
  }
];

export const SAMPLE_DATASETS: RagDataset[] = [
  {
    id: 'support-playbook',
    name: 'Customer Support Playbook',
    description: 'A curated set of onboarding guides, escalation runbooks, and release notes for a fast-growing SaaS product.',
    color: '#3b82f6',
    sampleQueries: [
      'How should we troubleshoot SSO provisioning failures?',
      'What does the premium support escalation policy guarantee?'
    ],
    documents: [
      {
        id: 'doc-support-1',
        title: 'SSO Provisioning Checklist',
        lastUpdated: '2025-03-18',
        tags: ['sso', 'identity', 'enterprise'],
        content:
          'Successful SSO provisioning requires a verified SAML metadata file, an activated enterprise workspace, and aligned attribute mappings. When a provisioning job fails, validate the audience URI, confirm the ACS URL matches the latest release, and rotate secrets older than 90 days. Escalate to the platform team if retry attempts exceed three and the customer has premium support. Provide a link to the audit log when escalating so the on-call engineer can reconstruct the failure quickly.'
      },
      {
        id: 'doc-support-2',
        title: 'Premium Support Entitlements',
        lastUpdated: '2025-04-02',
        tags: ['support', 'sla'],
        content:
          'Premium support includes 24/7 incident intake, a 15-minute first-response SLA for SEV0 and SEV1 tickets, and direct access to the enterprise solutions engineer assigned to the account. Escalations must include customer impact, reproduction steps, and any mitigation already attempted. Planned maintenance notifications must be sent 72 hours in advance. The support team is responsible for weekly summaries of open escalations for executive stakeholders.'
      },
      {
        id: 'doc-support-3',
        title: 'Release Notes - Admin Console 2.7',
        lastUpdated: '2025-05-11',
        tags: ['release-notes', 'admin-console'],
        content:
          'Version 2.7 introduces guided provisioning flows for SAML integrations, adds webhooks for user lifecycle events, and deprecates legacy SCIM v1 endpoints. Customers must migrate integrations before July 31. The release also improves audit log filtering, allowing support engineers to trace provisioning attempts by request ID. Known issues: webhook retries pause after five failures and require manual resume.'
      }
    ]
  },
  {
    id: 'security-blueprints',
    name: 'Security & Compliance Blueprints',
    description: 'Policies, architecture briefs, and audit responses used by a compliance automation team.',
    color: '#10b981',
    sampleQueries: [
      'How do we justify regional data residency to auditors?',
      'What is our process for rotating API credentials?'
    ],
    documents: [
      {
        id: 'doc-sec-1',
        title: 'Regional Data Residency Strategy',
        lastUpdated: '2025-01-07',
        tags: ['compliance', 'architecture'],
        content:
          'We deploy per-region storage clusters so customer data remains in the geography where it was collected. The control plane orchestrates tenant metadata while encryption keys are isolated per region using a dedicated KMS. Audit responses must include diagrams showing data flow, retention policies, and cross-region replication restricted to hashed telemetry. Exceptions require VP-level approval and a 30-day remediation plan.'
      },
      {
        id: 'doc-sec-2',
        title: 'Credential Rotation Playbook',
        lastUpdated: '2025-02-19',
        tags: ['security', 'operations'],
        content:
          'API credentials are rotated every 60 days using automated pipelines backed by short-lived tokens. Secrets older than 45 days trigger proactive notifications in Slack. Emergency rotations follow the incident command system, with audit logging of each credential issuance. Customers receive a status page update if a rotation affects their integrations.'
      },
      {
        id: 'doc-sec-3',
        title: 'SOC 2 Type II Common Responses',
        lastUpdated: '2025-03-30',
        tags: ['audit', 'soc2'],
        content:
          'Auditors frequently request evidence of change management, access reviews, and incident response drills. We store quarterly access review exports in the compliance drive, reference PagerDuty postmortems for drill evidence, and link to the Terraform change approval flow. When answering auditor questions, cite the control ID, provide the evidence path, and note the review cadence.'
      }
    ]
  }
];
