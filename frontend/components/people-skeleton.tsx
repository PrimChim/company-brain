"use client";

import {
  SkeletonCard,
  SkeletonAvatar,
  SkeletonText,
  SkeletonBadge,
} from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function PeopleSkeleton() {
  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="space-y-3 flex-1">
          {/* Breadcrumb label */}
          <SkeletonText width="third" className="h-3" />
          {/* Page title */}
          <SkeletonText width="two-thirds" className="h-9" />
          {/* Description */}
          <div className="space-y-2 pt-2">
            <SkeletonText width="full" className="h-4" />
            <SkeletonText width="two-thirds" className="h-4" />
          </div>
        </div>
        {/* Action button */}
        <SkeletonText width="third" className="h-10 md:w-32" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} className="space-y-2">
            <SkeletonText width="two-thirds" className="h-3" />
            <SkeletonText width="full" className="h-6" />
          </SkeletonCard>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <SkeletonText width="full" className="h-11 sm:max-w-sm sm:w-full" />
        {/* Filter dropdown */}
        <SkeletonText width="third" className="h-10 md:w-32" />
      </div>

      {/* People Grid - 3 Columns Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} className="space-y-4">
            {/* Top Row: Avatar + Name & Role */}
            <div className="flex items-start gap-4">
              <SkeletonAvatar className="flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <SkeletonText width="two-thirds" className="h-4" />
                <SkeletonText width="third" className="h-3" />
              </div>
            </div>

            {/* Middle Section: Project Pills */}
            <div className="flex gap-2 flex-wrap">
              <SkeletonBadge />
              <SkeletonBadge />
            </div>

            {/* Divider */}
            <Separator className="bg-border/40" />

            {/* Bottom Footer: Action buttons */}
            <div className="flex gap-2">
              <SkeletonText width="full" className="h-9 flex-1" />
              <SkeletonText width="full" className="h-9 flex-1" />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}
