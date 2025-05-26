import { Skeleton } from "@/components/ui/skeleton"

export function ComparisonPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero section skeleton */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
            <Skeleton className="h-24 w-24 rounded-xl" />
            <div className="text-center md:text-4xl text-2xl font-bold">vs</div>
            <Skeleton className="h-24 w-24 rounded-xl" />
          </div>
          <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </div>
        
        {/* Newsletter section skeleton */}
        <Skeleton className="h-32 w-full rounded-lg mb-12" />
        
        {/* Overview section skeleton */}
        <div className="mb-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Pros/cons skeleton */}
        <Skeleton className="h-64 w-full rounded-lg mb-12" />
        
        {/* Feature comparison skeleton */}
        <Skeleton className="h-96 w-full rounded-lg mb-12" />
      </div>
    </div>
  )
} 