import { Skeleton } from "@/components/ui/skeleton.tsx"

export default function MapCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 bg-card text-card-foreground shadow-sm">
      <div className="flex items-start justify-between">
        <div className="w-full pr-8">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-3 w-1/3 mt-2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
      <div className="mt-3 text-sm space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  )
}

