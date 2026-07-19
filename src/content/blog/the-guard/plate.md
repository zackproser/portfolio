# Agent Threat-Model Pack

Drawing: TDD-012  
Artifact: BP-012 — Agent Threat-Model Pack  
Format: A1 trust-boundary diagram + worksheets · PDF

## Trust-boundary diagram

Draw the deployed route, including components that only transform text and components that can enforce authority.

`principal → trusted task record → context assembler ← untrusted sources → model proposal → policy decision → authorization grant → tool adapter → external system → output renderer`

Mark every crossing with:

- Data entering: ____
- Caller identity: ____
- Trust label and provenance: ____
- Allowed operation: ____
- Enforcing component: ____
- Deny behavior: ____
- Evidence emitted: ____
- Residual risk: ____

Prompt text can guide model behavior. It cannot create a dependable privilege boundary. Put authorization and permission enforcement in code outside the model.

## Data and source inventory

| Source | Producer / owner | Can an attacker influence it? | Enters model context? | Sensitivity | Integrity check | Retention | Trust label | Parser / renderer | Residual risk |
|---|---|---|---|---|---|---|---|---|---|
| User task | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ |
| Email / message | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ |
| Calendar record | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ |
| Retrieved document | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ |
| Web content | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ |
| Tool result | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ |
| Model output | model | yes | maybe | ____ | ____ | ____ | untrusted | ____ | ____ |
| Other: ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ |

## Tool-permission matrix

Use separate read, draft, mutate, send, delete, execute, and administer capabilities. Avoid a single broad “tool access” grant.

| Principal / agent role | Tool | Operation | Resource scope | Recipient / destination scope | Preconditions | Human approval | Re-authentication | Rate / value limit | Reversible? | Audit event | Default |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ____ | calendar | read | ____ | n/a | task id ____ | no | ____ | ____ | yes | ____ | deny |
| ____ | calendar | create | ____ | ____ | explicit date/time | ____ | ____ | ____ | yes | ____ | deny |
| ____ | email | draft | ____ | ____ | named thread | no | ____ | ____ | yes | ____ | deny |
| ____ | email | send | ____ | allowlisted ____ | approved draft hash | yes | ____ | ____ | no | ____ | deny |
| ____ | files | read | folder ____ | n/a | purpose ____ | ____ | ____ | ____ | yes | ____ | deny |
| ____ | files | delete | ____ | n/a | backup id ____ | yes | ____ | ____ | maybe | ____ | deny |
| ____ | code / shell | execute | sandbox ____ | network ____ | signed job ____ | yes | ____ | ____ | no | ____ | deny |
| ____ | other: ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | deny |

## Defense-to-boundary review

| Defense | Boundary it can affect | Enforcement mechanism | Test oracle | Expected utility cost | Residual risk | Owner |
|---|---|---|---|---|---|---|
| Source labeling / provenance | source → context assembly | ____ | label preserved end to end | ____ | model may ignore labels | ____ |
| Context isolation / minimization | stored data → model context | ____ | excluded source absent | ____ | included data can still inject | ____ |
| Injection detector / policy check | model proposal → candidate action | ____ | prepared class rejected | ____ | false negatives and adaptive attacks | ____ |
| Capability scoping | principal → tool grant | ____ | out-of-scope call denied | ____ | abuse inside granted scope | ____ |
| Human approval | proposal → privileged action | ____ | no action before approval | ____ | fatigue, deception, weak summaries | ____ |
| Tool adapter validation | authorization → external system | ____ | schema/scope mismatch denied | ____ | valid but harmful in-scope action | ____ |
| Output handling | model output → downstream interpreter | ____ | output rendered inert | ____ | semantic harm remains | ____ |

## Attack-tree worksheet

### Root event

Untrusted content causes an unauthorized or unintended privileged effect: ____

### Branch A — reach model context

- Controllable source: ____
- Retrieval or tool path: ____
- Parser / transformation: ____
- Provenance retained or lost: ____
- Context-minimization test: ____

### Branch B — influence a proposal

- Attack class, described without payload text: ____
- Intended user task displaced, modified, or observed: ____
- Detector / model-behavior assumption: ____
- Adaptive variation family: ____
- Proposal evidence: ____

### Branch C — convert proposal into authority

- Tool and operation: ____
- Required capability: ____
- Resource / recipient / value scope: ____
- Policy decision point: ____
- Authorization binding: principal ____ · task ____ · action ____ · expiry ____
- Approval required: ____
- Tool-side enforcement: ____

### Branch D — create downstream effect

- External system mutation or disclosure: ____
- Output interpreter / renderer: ____
- Rollback available: ____
- Detection signal: ____
- Incident owner: ____

## Red-team test-case template

Test with prepared, non-operational attack classes. Keep real credentials, recipients, funds, production data, and executable payloads out of the fixture.

- Test ID: ____
- Date and benchmark / harness version: ____
- System, model, prompt, and tool versions: ____
- Legitimate user task: ____
- Prepared hostile source class: ____
- Injection location: email ____ · document ____ · web ____ · tool result ____ · other ____
- Attacker goal class: disclosure ____ · unauthorized mutation ____ · outbound communication ____ · execution ____ · task diversion ____
- Capabilities available to the agent: ____
- Expected legitimate state change: ____
- Forbidden state change: ____
- Deterministic utility oracle: ____
- Deterministic security oracle: ____
- Defenses enabled: ____
- Attempts per case and retry policy: ____
- Expected result: task success ____ · attack success ____ · blocked legitimate action ____
- Observed result: task success ____ · attack success ____ · blocked legitimate action ____
- Trace / evidence IDs: ____
- Residual risk and follow-up: ____

## Evidence log

Report utility and security together. An agent that refuses every task can show zero attack success while providing zero value.

| Date | Harness + version | System / model revision | Case family | Attempts | Task success | Attack success | Blocked legitimate actions | Severity / impact | Evidence link | Decision |
|---|---|---|---|---:|---:|---:|---:|---|---|---|
| ____ | ____ | ____ | benign baseline | ____ | ____% | n/a | ____% | n/a | ____ | ____ |
| ____ | ____ | ____ | direct injection | ____ | ____% | ____% | ____% | ____ | ____ | ____ |
| ____ | ____ | ____ | indirect: message | ____ | ____% | ____% | ____% | ____ | ____ | ____ |
| ____ | ____ | ____ | indirect: document | ____ | ____% | ____% | ____% | ____ | ____ | ____ |
| ____ | ____ | ____ | indirect: tool result | ____ | ____% | ____% | ____% | ____ | ____ | ____ |
| ____ | ____ | ____ | adaptive variation | ____ | ____% | ____% | ____% | ____ | ____ | ____ |
| ____ | ____ | ____ | repeated attempts | ____ | ____% | ____% | ____% | ____ | ____ | ____ |

### Release boundary

- Maximum accepted attack success by impact tier: low ____ · medium ____ · high ____ · critical ____
- Minimum accepted task success: ____
- Maximum accepted blocked-legitimate-action rate: ____
- Required defense-in-depth checks: ____
- Residual risks accepted by: ____
- Expiry / retest date: ____
- Rollback trigger and owner: ____
