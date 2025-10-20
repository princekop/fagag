import { Skeleton } from "@/components/ui/skeleton"

interface AuthPageSkeletonProps {
  heading?: string
  subheading?: string
  ctaLabel?: string
}

export function AuthPageSkeleton({
  heading = "Loading",
  subheading = "Please wait while we prepare your experience",
  ctaLabel = "Preparing",
}: AuthPageSkeletonProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs space-y-6">
            <div className="space-y-2 text-center">
              <Skeleton className="mx-auto h-7 w-48" />
              <Skeleton className="mx-auto h-4 w-56" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-14 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="mx-auto h-4 w-44" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <Skeleton className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-background/80" />
        <div className="pointer-events-none absolute bottom-6 left-6 right-6">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-6 text-white/70 backdrop-blur-md">
            <Skeleton className="h-3 w-24" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
