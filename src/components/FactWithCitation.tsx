import type { ProvenanceItem } from "@/lib/manifests/types/base";
import React from "react";

function findProvenance(prov: ProvenanceItem[], jsonPointer: string): ProvenanceItem | null {
  return prov.find(p => p.path === jsonPointer) || null;
}

interface FactWithCitationProps {
  value: React.ReactNode;
  jsonPointer: string;
  provenance: ProvenanceItem[];
  className?: string;
}

export function FactWithCitation({ 
  value, 
  jsonPointer, 
  provenance, 
  className = "" 
}: FactWithCitationProps) {
  const p = findProvenance(provenance, jsonPointer);
  
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span>{value}</span>
      {p && (
        <span 
          className="group relative cursor-help select-none" 
          aria-label="Source"
          title={`Source: ${p.url}`}
        >
          <span className="text-blue-500 hover:text-blue-700 transition-colors">
            ⓘ
          </span>
          <span className="pointer-events-none absolute z-10 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 -translate-x-1/2 left-1/2 mt-2 whitespace-nowrap shadow-lg">
            <a 
              href={p.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline hover:no-underline"
            >
              Source
            </a>
            {" · verified "}
            {new Date(p.captured_at).toLocaleDateString()}
            {p.quote && ` · "${p.quote}"`}
          </span>
        </span>
      )}
    </span>
  );
}

// Helper component for displaying facts in comparison tables
export function ComparisonFactCell({ 
  value, 
  jsonPointer, 
  provenance, 
  fallback = "Not published",
  className = ""
}: {
  value: React.ReactNode;
  jsonPointer: string;
  provenance: ProvenanceItem[];
  fallback?: string;
  className?: string;
}) {
  if (value === null || value === undefined) {
    return (
      <span className={`text-gray-500 italic ${className}`}>
        {fallback}
      </span>
    );
  }
  
  return (
    <FactWithCitation
      value={value}
      jsonPointer={jsonPointer}
      provenance={provenance}
      className={className}
    />
  );
}
