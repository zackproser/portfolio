import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        
        // New variants for vector database comparison
        auto: "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 font-medium",
        manual: "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800 font-medium",
        
        // Performance metric variants
        latency: "border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 font-medium",
        throughput: "border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 font-medium",
        
        // Feature support variants
        supported: "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800 font-medium",
        unsupported: "border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 font-medium",
        
        // N/A variant
        na: "border-transparent bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700 font-medium",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[0.625rem]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {
    value?: string | number;
  }

function Badge({ className, variant, size, value, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {value || children}
    </div>
  )
}

export { Badge, badgeVariants }
