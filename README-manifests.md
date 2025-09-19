# Tool Manifest System

This document describes the new manifest-based comparison system that replaces the database-driven approach with versioned YAML manifests containing verifiable facts and provenance tracking.

## Overview

The manifest system provides:
- **Verifiable Facts**: All data comes from official vendor sources with citations
- **Provenance Tracking**: Every fact includes source URL and verification date
- **Type Safety**: Strict TypeScript schemas with JSON Schema validation
- **No Synthetic Scores**: Only publish facts that are verifiable from vendor sources
- **Hover Citations**: UI shows source information on hover for every displayed fact

## Architecture

### Base Types (`src/lib/manifests/types/base.ts`)

```typescript
interface ToolManifest<TFacts> {
  schema_version: "1.0";
  slug: string;
  name: string;
  category: "llm_api" | "vector_db" | "coding_assistant" | "ai_framework";
  homepage_url: string;
  docs_url?: string;
  github_repo?: string;
  as_of: IsoDate;
  facts: TFacts;
  provenance: ProvenanceItem[];
}

interface ProvenanceItem {
  path: string;          // JSON Pointer
  url: string;           // authoritative source
  quote?: string;        // short exact excerpt
  captured_at: IsoDate;  // when verified
}
```

### LLM API Facts (`src/lib/manifests/types/llm_api.ts`)

Focused on what developers actually compare:
- Models and modalities
- Context window sizes
- Pricing per 1K tokens (normalized)
- Rate limits
- SDK support
- Terms and restrictions

### Manifest Loader (`src/lib/manifests/loader.ts`)

- Validates against JSON schemas
- Enforces provenance coverage
- Configurable storage (filesystem, object store, etc.)
- Type-safe loading with error handling

## Usage

### Creating Manifests

Manifests are YAML files in the `manifests/` directory:

```yaml
schema_version: "1.0"
slug: "openai-api"
name: "OpenAI API"
category: "llm_api"
homepage_url: "https://openai.com/api"
as_of: "2024-01-15T00:00:00Z"
facts:
  vendor: "openai"
  auth:
    scheme: "bearer"
    header: "Authorization"
    base_url: "https://api.openai.com/v1"
  models:
    - name: "gpt-4o"
      modality: ["text", "image"]
      context_tokens_max: 128000
      pricing:
        input_per_1k: 0.005
        output_per_1k: 0.015
      # ... more model details
provenance:
  - path: "/facts/vendor"
    url: "https://openai.com/api"
    quote: "OpenAI API"
    captured_at: "2024-01-15T00:00:00Z"
  # ... more provenance entries
```

### Loading Manifests

```typescript
import { loadLlmApiManifest, createManifestProvider } from '@/lib/manifests/loader';

const provider = createManifestProvider();
const manifest = await loadLlmApiManifest('openai-api', provider);
```

### Displaying Facts with Citations

```tsx
import { FactWithCitation } from '@/components/FactWithCitation';

<FactWithCitation
  value="$0.005 / 1K input"
  jsonPointer="/facts/models/0/pricing/input_per_1k"
  provenance={manifest.provenance}
/>
```

## Validation

### Schema Validation

```bash
npm run validate-manifests
```

Validates all manifests against JSON schemas and checks for:
- Required fields
- Correct data types
- Valid URLs and dates
- Category-specific fact schemas

### Provenance Coverage

```bash
npm run check-provenance
```

Ensures every non-null fact has a corresponding provenance entry.

### Policy Checks

```bash
npm run policy-checks
```

Runs quality checks for:
- Unusual pricing values
- Stale verification dates
- Placeholder URLs
- Vendor mismatches

## Migration

### From Database to Manifests

```bash
npm run migrate-to-manifests
```

Converts existing database tools to YAML manifests with:
- Basic fact mapping
- Placeholder provenance entries
- Proper categorization

**Note**: This creates starter manifests that need manual verification and fact-checking.

## CI/CD

The GitHub Actions workflow (`.github/workflows/validate-manifests.yml`) runs on:
- Pull requests touching manifests
- Pushes to main branch

Validates:
1. JSON Schema compliance
2. Provenance coverage
3. Policy compliance

## Development Workflow

1. **Create/Edit Manifest**: Write YAML with facts and provenance
2. **Validate Locally**: Run validation scripts
3. **Test in UI**: Use manifest-based comparison components
4. **Submit PR**: CI validates automatically
5. **Deploy**: Manifests are read directly (no cache)

## File Structure

```
manifests/
├── openai-api.yaml
├── anthropic-api.yaml
└── ...

src/lib/manifests/
├── types/
│   ├── base.ts
│   └── llm_api.ts
└── loader.ts

src/components/
├── FactWithCitation.tsx
└── ManifestBasedComparison.tsx

scripts/
├── validate-manifests.ts
├── check-provenance.ts
├── policy-checks.ts
└── migrate-to-manifests.ts
```

## Key Principles

1. **No Invented Data**: Only publish facts verifiable from vendor sources
2. **Complete Provenance**: Every fact must have a source URL and verification date
3. **Normalized Units**: All pricing in USD per 1K tokens, context in integer tokens
4. **Type Safety**: Strict schemas prevent invalid data
5. **Transparent Citations**: UI shows source information for every fact
6. **No Synthetic Benchmarks**: Only vendor-published facts, no subjective scores

## Future Extensions

- Additional categories (vector databases, coding assistants)
- Automated fact extraction from vendor pages
- LLM-powered PR bot for manifest updates
- Caching layer for production performance
- Synthetic benchmarks (separate from facts)
