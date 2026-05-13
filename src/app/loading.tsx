export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <header className="border-b border-border bg-card/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
            <div className="space-y-1.5">
              <div className="h-2.5 w-28 animate-pulse rounded bg-muted" />
              <div className="h-3 w-40 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        {/* Heading skeleton */}
        <div className="space-y-2">
          <div className="h-7 w-64 animate-pulse rounded bg-muted" />
          <div className="h-4 w-80 animate-pulse rounded bg-muted" />
        </div>

        {/* Table skeleton × 2 */}
        {[0, 1].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border px-6 py-4">
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="p-4 space-y-3">
              {/* Header row */}
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((col) => (
                  <div
                    key={col}
                    className="h-3 flex-1 animate-pulse rounded bg-muted/70"
                  />
                ))}
              </div>
              {/* Data rows */}
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="flex gap-3">
                  {[1, 2, 3, 4].map((col) => (
                    <div
                      key={col}
                      className="h-3 flex-1 animate-pulse rounded bg-muted/40"
                      style={{ opacity: 1 - row * 0.12 }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
