import { fetchDashboardData } from "@/app/actions/sheets";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// ─── Metadata ────────────────────────────────────────────────────────────────
export const metadata = {
  title: "Data Verification — Intern Assessment",
  description:
    "Phase 1: Google Sheets data pipeline verification for the Web Developer Intern Assessment.",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function SheetTable({
  title,
  badge,
  headers,
  rows,
}: {
  title: string;
  badge: string;
  headers: string[];
  rows: Record<string, string>[];
}) {
  if (headers.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <Badge variant="secondary">{badge}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">No data found in this sheet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <Badge variant="secondary">{badge}</Badge>
        <span className="ml-auto text-xs text-muted-foreground">
          {rows.length} row{rows.length !== 1 ? "s" : ""} · {headers.length} column{headers.length !== 1 ? "s" : ""}
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {headers.map((header) => (
              <TableHead
                key={header}
                className="bg-muted/50 text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={headers.length}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                No data rows found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, rowIdx) => (
              <TableRow key={rowIdx}>
                {headers.map((header) => (
                  <TableCell key={header} className="text-sm text-foreground">
                    {row[header] || (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </section>
  );
}

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
            Google Sheets Verification
          </h2>
          <p className="text-sm text-muted-foreground">
            Server-side data fetched via Service Account · Both sheets rendered below
          </p>
        </div>

        {/* Error or data */}
        {!result.success ? (
          <ErrorState message={result.error} />
        ) : (
          <div className="space-y-6">
            <SheetTable
              title="Sheet 1"
              badge={`${result.data.sheet1.length} rows`}
              headers={result.data.sheet1Headers}
              rows={result.data.sheet1}
            />
            <SheetTable
              title="Sheet 2"
              badge={`${result.data.sheet2.length} rows`}
              headers={result.data.sheet2Headers}
              rows={result.data.sheet2}
            />
          </div>
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
