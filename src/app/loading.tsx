import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Badge } from "@/components/ui/badge";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground animate-pulse" />
            <div>
              <div className="h-3 w-24 bg-muted animate-pulse rounded mb-1" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </div>
          </div>
          <Badge variant="secondary" className="text-xs text-muted-foreground animate-pulse">
            Fetching Data...
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Analytics Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Synchronizing with Google Sheets and preparing workspace.
          </p>
        </div>
        <DashboardSkeleton />
      </main>
    </div>
  );
}
