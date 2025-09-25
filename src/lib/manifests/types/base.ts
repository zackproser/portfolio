// Base contract for tool manifests with provenance tracking
export type IsoDate = string;

export interface ProvenanceItem {
  path: string;          // JSON Pointer: e.g. "/facts/models/0/pricing/input_per_1k"
  url: string;           // authoritative source
  quote?: string;        // short exact excerpt (optional but recommended)
  captured_at: IsoDate;  // when it was last verified
}

export interface ToolManifest<TFacts> {
  schema_version: "1.0";
  slug: string;                        // "openai-api"
  name: string;                        // "OpenAI API"
  category: "llm_api" | "vector_db" | "coding_assistant" | "ai_framework";
  homepage_url: string;
  docs_url?: string;
  github_repo?: string;                // "owner/repo"
  as_of: IsoDate;                      // when the manifest as a whole was last verified
  facts: TFacts;                       // category-specific facts only (no derived values)
  provenance: ProvenanceItem[];        // must cover every non-null fact path
}

// JSON Pointer utilities
export function escapeJsonPointer(k: string): string {
  return k.replace(/~/g, "~0").replace(/\//g, "~1");
}

export function collectJsonPointers(obj: any, base = ""): string[] {
  if (obj === null || obj === undefined) return [];
  if (typeof obj !== "object") return [base];
  if (Array.isArray(obj)) {
    return obj.flatMap((v, i) => collectJsonPointers(v, `${base}/${i}`));
  }
  return Object.entries(obj).flatMap(([k, v]) => {
    const keyPath = base ? `${base}/${escapeJsonPointer(k)}` : `/${escapeJsonPointer(k)}`;
    return collectJsonPointers(v, keyPath);
  });
}

export function enforceProvenanceCoverage(doc: { facts: any; provenance: { path: string }[] }): void {
  const paths = collectJsonPointers(doc.facts).map(p => `/facts${p}`);
  const prov = new Set(doc.provenance.map(p => p.path));
  
  for (const p of paths) {
    // Check if there's a direct provenance entry
    if (prov.has(p)) {
      continue;
    }
    
    // For array elements, check if there's a provenance entry for the parent array
    const pathParts = p.split('/');
    if (pathParts.length > 0 && /^\d+$/.test(pathParts[pathParts.length - 1])) {
      // This is an array element, check if parent array has provenance
      const parentPath = pathParts.slice(0, -1).join('/');
      if (prov.has(parentPath)) {
        continue;
      }
    }
    
    // For optional fields (notes, community, etc.), check if parent object has provenance
    const optionalFields = ['notes', 'community', 'burst'];
    const lastPart = pathParts[pathParts.length - 1];
    if (optionalFields.includes(lastPart)) {
      const parentPath = pathParts.slice(0, -1).join('/');
      if (prov.has(parentPath)) {
        continue;
      }
    }
    
    // If we get here, there's no provenance coverage
    throw new Error(`Missing provenance for ${p}`);
  }
}
