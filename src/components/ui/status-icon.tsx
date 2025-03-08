import React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusIconProps {
  status: boolean | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
  className?: string;
}

export function StatusIcon({ 
  status, 
  size = 'md', 
  showBackground = true,
  className 
}: StatusIconProps) {
  if (status === null || status === undefined) {
    return null;
  }
  
  // Size mappings
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };
  
  const iconSize = sizeClasses[size];
  
  // Background classes
  const bgClasses = showBackground ? status 
    ? "bg-green-100 dark:bg-green-950/30 rounded-full p-1" 
    : "bg-red-100 dark:bg-red-950/30 rounded-full p-1" 
    : "";
  
  return status ? (
    <div className={cn(
      "text-green-500 dark:text-green-400 transition-all duration-200 hover:scale-110", 
      bgClasses,
      className
    )}>
      <Check className={iconSize} strokeWidth={3} />
    </div>
  ) : (
    <div className={cn(
      "text-red-500 dark:text-red-400 transition-all duration-200 hover:scale-110",
      bgClasses,
      className
    )}>
      <X className={iconSize} strokeWidth={3} />
    </div>
  );
} 