"use client";

import {
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonCard,
  SkeletonText,
} from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const projectCards = Array.from({ length: 4 });
const metrics = Array.from({ length: 3 });

function ProjectCardSkeleton() {
  return (
    <SkeletonCard className="flex min-h-64 flex-col gap-6 p-5">
      <div className="flex items-start justify-between gap-4">
        <SkeletonText width="two-thirds" className="h-6" />
        <SkeletonBadge className="w-14" />
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center">
          <SkeletonAvatar className="size-8 border-2 border-card" />
          <SkeletonAvatar className="-ml-2 size-8 border-2 border-card" />
          <SkeletonAvatar className="-ml-2 size-8 border-2 border-card" />
          <SkeletonAvatar className="-ml-2 size-8 border-2 border-card" />
        </div>
        <div className="flex flex-1 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SkeletonText width="third" className="h-3 w-8" />
            <SkeletonText width="third" className="h-3 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonText width="third" className="h-3 w-8" />
            <SkeletonText width="third" className="h-3 w-14" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <SkeletonBadge className="w-24" />
        <SkeletonBadge className="w-20" />
      </div>

      <div className="mt-auto flex flex-col gap-4">
        <Separator className="bg-border/60" />
        <SkeletonText width="full" className="h-9 w-40" />
      </div>
    </SkeletonCard>
  );
}

export function ProjectsSkeleton() {
  return (
    <div className="w-full space-y-8" aria-label="Loading projects" aria-busy="true">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="flex flex-1 flex-col gap-3">
          <SkeletonText width="third" className="h-3" />
          <SkeletonText width="two-thirds" className="h-9" />
          <SkeletonText width="full" className="h-4 max-w-xl" />
        </div>
        <SkeletonText width="third" className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metrics.map((_, index) => (
          <SkeletonCard key={index} className="flex items-center justify-between p-5">
            <div className="flex flex-col gap-3">
              <SkeletonText width="two-thirds" className="h-3" />
              <SkeletonText width="third" className="h-7 w-16" />
            </div>
            <SkeletonAvatar className="size-9 rounded-lg" />
          </SkeletonCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {projectCards.map((_, index) => (
          <ProjectCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export { ProjectCardSkeleton };
