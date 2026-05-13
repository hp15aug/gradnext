"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="flex flex-col space-y-8">
        {/* Filters Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-10 w-[200px]" />
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-2 rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-[300px] w-full rounded-full" />
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="space-y-4 mt-8 pt-8 border-t border-border">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-64" />
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="border-b p-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
