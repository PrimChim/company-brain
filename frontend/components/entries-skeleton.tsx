import { SkeletonCard, SkeletonText, SkeletonBadge } from '@/components/ui/skeleton'

export function EntriesSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="flex flex-col gap-3">
          <SkeletonText width="third" className="h-3" />
          <SkeletonText width="two-thirds" className="h-9" />
          <SkeletonText width="full" className="h-4 max-w-xl" />
        </div>
        <SkeletonText width="third" className="h-10 md:w-32" />
      </div>
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 md:flex-row">
        <SkeletonText width="full" className="h-10 md:flex-1" />
        <SkeletonText width="third" className="h-10 md:w-40" />
        <SkeletonText width="third" className="h-10 md:w-40" />
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} className="flex flex-col gap-4 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <SkeletonText width="two-thirds" className="h-6" />
                <SkeletonText width="full" className="h-4 max-w-3xl" />
                <SkeletonText width="two-thirds" className="h-4 max-w-2xl" />
              </div>
              <SkeletonBadge />
            </div>
            <div className="flex flex-wrap gap-2">
              <SkeletonBadge />
              <SkeletonBadge className="w-24" />
              <SkeletonBadge className="w-20" />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <SkeletonText width="third" className="h-3" />
              <SkeletonText width="third" className="h-9 w-24" />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  )
}
