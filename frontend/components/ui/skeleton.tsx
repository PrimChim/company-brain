import * as React from "react"

import { cn } from "@/lib/utils"

const skeletonBase = "animate-pulse bg-muted/60 rounded-md"

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(skeletonBase, className)} {...props} />
  ),
)
Skeleton.displayName = "Skeleton"

const SkeletonCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border border-border bg-card p-4", className)}
      {...props}
    />
  ),
)
SkeletonCard.displayName = "SkeletonCard"

const SkeletonBadge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(skeletonBase, "h-5 w-20 rounded-full", className)}
      {...props}
    />
  ),
)
SkeletonBadge.displayName = "SkeletonBadge"

const SkeletonAvatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(skeletonBase, "size-10 rounded-full", className)}
      {...props}
    />
  ),
)
SkeletonAvatar.displayName = "SkeletonAvatar"

type SkeletonTextProps = React.HTMLAttributes<HTMLDivElement> & {
  width?: "third" | "two-thirds" | "full"
}

const skeletonTextWidths = {
  third: "w-1/3",
  "two-thirds": "w-2/3",
  full: "w-full",
} as const

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ className, width = "full", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(skeletonBase, "h-4", skeletonTextWidths[width], className)}
      {...props}
    />
  ),
)
SkeletonText.displayName = "SkeletonText"

export { Skeleton, SkeletonAvatar, SkeletonBadge, SkeletonCard, SkeletonText }
export type { SkeletonTextProps }
