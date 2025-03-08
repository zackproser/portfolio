import React from "react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Info, Clock, Zap, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusIcon } from "@/components/ui/status-icon";

type ValueType = boolean | string | number | null | undefined;

interface VectorBadgeProps extends Omit<BadgeProps, 'children'> {
  value: ValueType;
  type?: 'boolean' | 'latency' | 'throughput' | 'scalability' | 'text';
  showNA?: boolean;
  simpleBoolean?: boolean;
}

export function VectorBadge({ 
  value, 
  type = 'text', 
  showNA = true,
  simpleBoolean = false,
  className,
  ...props 
}: VectorBadgeProps) {
  // Helper to determine if value is empty
  const isEmpty = value === null || value === undefined || value === '';
  
  if (isEmpty && !showNA) {
    return null;
  }
  
  // Handle boolean values
  if (type === 'boolean') {
    if (typeof value === 'boolean') {
      // If simpleBoolean is true, just show the icon
      if (simpleBoolean) {
        return <StatusIcon status={value} showBackground={true} />;
      }
      
      // Otherwise show the badge with text
      return (
        <Badge 
          variant={value ? "supported" : "unsupported"}
          className={cn("gap-1", className)} 
          {...props}
        >
          <StatusIcon status={value} size="sm" showBackground={false} />
          <span>{value ? "Supported" : "Not Supported"}</span>
        </Badge>
      );
    }
  }
  
  // Handle empty values
  if (isEmpty) {
    return (
      <Badge 
        variant="na" 
        className={cn("gap-1", className)} 
        {...props}
      >
        <Info className="h-3 w-3" />
        <span>N/A</span>
      </Badge>
    );
  }
  
  // Handle specific metric types
  switch (type) {
    case 'latency':
      return (
        <Badge 
          variant="latency" 
          className={cn("gap-1", className)} 
          {...props}
        >
          <Clock className="h-3 w-3" />
          <span>{value} ms</span>
        </Badge>
      );
      
    case 'throughput':
      return (
        <Badge 
          variant="throughput" 
          className={cn("gap-1", className)} 
          {...props}
        >
          <Zap className="h-3 w-3" />
          <span>{value} qps</span>
        </Badge>
      );
      
    case 'scalability':
      const isAuto = String(value).toLowerCase() === 'auto';
      const isManual = String(value).toLowerCase() === 'manual';
      
      return (
        <Badge 
          variant={isAuto ? "auto" : isManual ? "manual" : "default"}
          className={cn("gap-1", className)} 
          {...props}
        >
          <Scale className="h-3 w-3" />
          <span>{value}</span>
        </Badge>
      );
      
    default:
      // For regular text values
      return (
        <Badge 
          variant="outline" 
          className={className} 
          {...props}
        >
          {value}
        </Badge>
      );
  }
} 