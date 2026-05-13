import { fetchDashboardData } from "@/app/actions/sheets";
import { Badge } from "@/components/ui/badge";
import { DashboardView } from "@/components/DashboardView";
// ─── Sub-components ──────────────────────────────────────────────────────────

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10">
          <svg
            className="h-4 w-4 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-destructive">
            Failed to fetch data
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Verify that <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">GOOGLE_SHEETS_CLIENT_EMAIL</code>,{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">GOOGLE_SHEETS_PRIVATE_KEY</code>, and{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">GOOGLE_SHEET_ID</code>{" "}
            are set correctly in your <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">.env</code> file
            and that the service account has been granted access to the sheet.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  const result = await fetchDashboardData();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <svg
                className="h-4 w-4 text-background"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M3.375 5.625c0-.621.504-1.125 1.125-1.125h15c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h15M4.5 6.75h15M4.5 6.75v9"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Intern Assessment
              </p>
              <h1 className="text-sm font-semibold leading-none text-foreground">
                Data Pipeline
              </h1>
            </div>
          </div>
          <Badge
            variant={result.success ? "default" : "destructive"}
            className="text-xs"
          >
            {result.success ? "✓ Connected" : "✗ Error"}
          </Badge>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        {/* Hero section */}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Analytics Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your Google Sheets data and upload local files seamlessly.
          </p>
        </div>

        {/* Error or Dashboard */}
        {!result.success ? (
          <ErrorState message={result.error} />
        ) : (
          <DashboardView initialGoogleSheetsData={result.data} />
        )}

        {/* Footer note */}
        <p className="text-xs text-muted-foreground border-t border-border pt-6">
          Data fetched server-side on every request. Credentials read from{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono">.env</code> via{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono">process.env</code>.
        </p>
      </main>
    </div>
  );
}
