'use client';

import { useState } from 'react';
import { Source } from '@/lib/decision-engine/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, ExternalLink, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface EvidenceCitationProps {
  sources: Source[];
  value?: string | number;
  inferred?: boolean;
  className?: string;
}

export function EvidenceCitation({ sources, value, inferred, className = '' }: EvidenceCitationProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) {
    return null;
  }

  const primarySource = sources[0];
  const daysSinceUpdate = getDaysSinceUpdate(primarySource.observed_at);
  const isStale = daysSinceUpdate > 30;
  const isRecent = daysSinceUpdate <= 7;

  const getStatusIcon = () => {
    if (isStale) {
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    } else if (isRecent) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else {
      return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    if (isStale) {
      return <Badge variant="destructive" className="text-xs">Stale</Badge>;
    } else if (isRecent) {
      return <Badge variant="default" className="text-xs">Recent</Badge>;
    } else {
      return <Badge variant="secondary" className="text-xs">Verified</Badge>;
    }
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {value && (
        <span className="text-sm font-medium">{value}</span>
      )}
      {inferred && (
        <Badge variant="outline" className="text-xs">Inferred</Badge>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Info className="h-3 w-3 text-gray-400 hover:text-gray-600" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Evidence Sources</h4>
              {getStatusBadge()}
            </div>
            
            {sources.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className="text-sm font-medium">
                    {getDomainFromUrl(source.url)}
                  </span>
                </div>
                
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Observed {getDaysSinceUpdate(source.observed_at)} days ago
                  </div>
                  
                  {source.excerpt && (
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      &ldquo;{source.excerpt}&rdquo;
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Link 
                      href={source.url as any}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View source
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-amber-600 hover:text-amber-800"
                      onClick={() => handleFlagStale(source.url)}
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Flag as stale
                    </Button>
                  </div>
                </div>
                
                {index < sources.length - 1 && (
                  <div className="border-t border-gray-200 my-2" />
                )}
              </div>
            ))}
            
            {inferred && (
              <div className="bg-amber-50 border border-amber-200 rounded p-2">
                <div className="flex items-center gap-1 text-xs text-amber-800">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="font-medium">Inferred Value</span>
                </div>
                <p className="text-xs text-amber-700 mt-1">
                  This value was calculated or estimated from available data sources.
                </p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Helper functions
function getDaysSinceUpdate(observedAt: string): number {
  const observedDate = new Date(observedAt);
  const now = new Date();
  return Math.floor((now.getTime() - observedDate.getTime()) / (1000 * 60 * 60 * 24));
}

function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function handleFlagStale(url: string): void {
  // This would integrate with your issue tracking system
  console.log(`Flagging stale source: ${url}`);
  
  // For now, just show a toast or notification
  // In a real implementation, this would:
  // 1. Create an issue in your tracking system
  // 2. Send a notification to the content team
  // 3. Update the source status in your database
}

// Specialized citation components for different data types
export function PriceCitation({ sources, value, currency = '$' }: { 
  sources: Source[]; 
  value: number; 
  currency?: string;
}) {
  return (
    <EvidenceCitation
      sources={sources}
      value={`${currency}${value.toFixed(4)}`}
      className="font-mono"
    />
  );
}

export function TokenCitation({ sources, value }: { 
  sources: Source[]; 
  value: number;
}) {
  return (
    <EvidenceCitation
      sources={sources}
      value={`${(value / 1000).toFixed(0)}K tokens`}
    />
  );
}

export function BooleanCitation({ sources, value, trueLabel = 'Yes', falseLabel = 'No' }: { 
  sources: Source[]; 
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
}) {
  return (
    <EvidenceCitation
      sources={sources}
      value={value ? trueLabel : falseLabel}
    />
  );
}

export function ArrayCitation({ sources, value, maxItems = 3 }: { 
  sources: Source[]; 
  value: string[];
  maxItems?: number;
}) {
  const displayValue = value.length > maxItems 
    ? `${value.slice(0, maxItems).join(', ')} +${value.length - maxItems} more`
    : value.join(', ');
    
  return (
    <EvidenceCitation
      sources={sources}
      value={displayValue}
    />
  );
}

export function PercentageCitation({ sources, value }: { 
  sources: Source[]; 
  value: number;
}) {
  return (
    <EvidenceCitation
      sources={sources}
      value={`${(value * 100).toFixed(1)}%`}
    />
  );
}

