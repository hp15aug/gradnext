# Analytics Dashboard

> **Web Developer Intern Assessment** — A full-stack, SaaS-grade analytics dashboard built with Next.js 15 App Router, Google Sheets as a live data source, and a rich interactive frontend using Recharts, TanStack Table, and Zustand.

---

## Table of Contents

1. [Live Preview](#live-preview)
2. [Tech Stack](#tech-stack)
3. [Setup Instructions](#setup-instructions)
4. [Project Architecture](#project-architecture)
5. [Feature Walkthrough](#feature-walkthrough)
6. [Assumptions Made](#assumptions-made)
7. [Folder Structure](#folder-structure)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (nova style) |
| State Management | Zustand |
| Animations | Framer Motion |
| Data Visualisation | Recharts |
| Data Table | TanStack React Table v8 |
| Google API | googleapis (Service Account) |
| File Parsing | PapaParse (CSV), XLSX (Excel) |
| Notifications | Sonner (shadcn/ui toast) |
| Dark Mode | next-themes |

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18.x
- A Google Cloud project with the **Sheets API** enabled
- A Service Account with a JSON key file
- The target Google Sheet shared with the service account email

### 1. Clone & Install

```bash
git clone https://github.com/hp15aug/gradnext.git
cd gradnext
npm install
```

### 2. Configure Environment Variables

Create a `.env` file at the project root (it is already `.gitignore`d):

```env
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1d1M8VCTeBwXTKn7LA0HORkkJr8qUvrnzRIPnHKftrZ8
```

> **Important:** The private key must be enclosed in double-quotes and must contain literal `\n` escape sequences (not real newlines). The `google-sheets.ts` utility automatically sanitises these before passing them to the Google Auth client.

### 3. Grant Sheet Access

Open the target Google Sheet → **Share** → paste the `GOOGLE_SHEETS_CLIENT_EMAIL` → grant **Viewer** (or higher) access.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dashboard will fetch live data from Google Sheets on every server render.

### 5. Type Check

```bash
npx tsc --noEmit
```

---

## Project Architecture

The application is structured around a **4-phase build** with a clean separation between the server data layer and the client interactive layer.

```
┌─────────────────────────────────────────────────┐
│              Next.js App Router                  │
│                                                  │
│   page.tsx (Server Component)                    │
│   └── fetchDashboardData() ← Server Action       │
│        └── googleapis → Google Sheets API        │
│                                                  │
│   Renders:                                       │
│   └── DashboardView (Client Component)           │
│        └── Normalizes raw rows → Zustand store   │
│             ├── KPICards      ← useFilteredData  │
│             ├── DashboardCharts ← useFilteredData│
│             ├── DataTable     ← useFilteredData  │
│             └── DashboardFilters → setters       │
└─────────────────────────────────────────────────┘
```

### Data Flow

```
Google Sheets API
       │
       ▼
Server Action (sheets.ts)           ← runs on the server, no API key exposure
       │  returns SheetData { sheet1[], sheet2[], headers }
       ▼
page.tsx (async Server Component)
       │  passes initialGoogleSheetsData as prop
       ▼
DashboardView.tsx (Client Component)
       │  normalizeData() → { validData, duplicatesCount, errors }
       ▼
useDataStore (Zustand)              ← single source of truth
       │  googleSheetsData + uploadedData → mergedData (computed)
       ▼
useFilteredData() hook              ← memoized, date + category filters
       │
       ├─▶ KPICards
       ├─▶ DashboardCharts
       └─▶ DataTable
```

### Key Architectural Decisions

#### Server-Side Fetching (Phase 1)
Google Sheets credentials **never leave the server**. The `googleapis` client is initialised in `src/lib/google-sheets.ts` using environment variables. A single Server Action (`src/app/actions/sheets.ts`) exposes the data to the UI. The result is passed as a serialised prop — no client-side API calls.

#### Normalisation Layer (Phase 2)
`src/lib/data-processor.ts` contains a heuristic keyword mapper that standardises any arbitrary data source (CSV, Excel, Google Sheets) into a unified schema:

```ts
{
  id: string        // deterministic unique key
  date: string      // raw string; formatted at render time
  category: string
  value: number
  source: string    // "Google Sheets - Sheet 1" | filename
  originalData: any // preserved for the Raw Data tab
}
```

This schema means all downstream components (Charts, Table, KPIs) are completely source-agnostic.

#### Global State (Zustand)
The store (`src/store/useDataStore.ts`) holds:
- `googleSheetsData` — set once on mount from the server prop
- `uploadedData` — array of arrays, one per uploaded file
- `mergedData` — computed as `[...googleSheetsData, ...uploadedData.flat()]`
- `dateRange` / `categoryFilter` — global filter state

The `useFilteredData()` exported hook is **memoized with `useMemo`** over `[mergedData, dateRange, categoryFilter]` to prevent re-renders when nothing has changed.

#### Loading UX
- `src/app/loading.tsx` intentionally returns `null` — the Next.js Suspense skeleton is disabled.
- `DashboardView` manages an `isAppLoading` boolean. On mount it normalises data, waits 800 ms (for UX feel), then sets `isAppLoading = false`.
- `AnimatePresence` wraps the `LoadingScreen` component for a smooth fade-out.
- The main content slides up via a `motion.div` entry animation.

---

## Feature Walkthrough

### Unified Dashboard Tab
| Feature | Detail |
|---|---|
| **Date Range Filter** | Shadcn Calendar Popover; filters `mergedData` reactively |
| **Category Filter** | Dynamic Select; options derived from live `mergedData` categories |
| **Export CSV** | Downloads the *currently filtered* view; respects all active filters |
| **KPI Cards** | Total Value, Transaction Count, Average Value, Top Category |
| **Area Chart** | Monthly value trend over time |
| **Pie Chart** | Value distribution by category |
| **Bar Chart** | Value comparison by data source |
| **Data Table** | Sortable columns, global search, pagination (TanStack Table) |
| **File Upload** | Drag-and-drop CSV / XLSX; auto-normalised and merged into the store |

### Raw Data Tab
Shows the untransformed rows directly from Sheet 1 and Sheet 2 with all original column headers preserved.

### Data Health (Toasts)
| Event | Toast |
|---|---|
| File uploaded successfully | ✅ Success with row count |
| Duplicate rows detected | ⚠️ Warning with count |
| Invalid / unparseable file | ❌ Error |
| Google Sheets sync had duplicates | ℹ️ Info |

---

## Assumptions Made

### Data Schema
1. **First row = headers.** Both Sheet 1 and Sheet 2 are assumed to have a header row. Rows without a header are skipped.
2. **Column names are English keywords.** The heuristic normaliser maps columns using keyword matching (e.g., `"Revenue"`, `"Amount"`, `"Total"` → `value`). Non-English column names may not map correctly.
3. **Values are numeric or coercible.** The `value` field is extracted via `parseFloat` after stripping currency symbols. Completely non-numeric values default to `0`.
4. **Dates are parseable by `new Date()`.** Standard formats (`YYYY-MM-DD`, `MM/DD/YYYY`, ISO 8601) work. Ambiguous formats like `13/01/2024` (DD/MM) may be misinterpreted by the native parser.

### Google Sheets Access
5. The service account has **at least Viewer access** to the sheet. Without this, the entire dashboard shows an error state.
6. Only **Sheet1** and **Sheet2** are fetched. Additional sheets are ignored.

### File Uploads
7. CSV files use **comma** as the delimiter. PapaParse auto-detects most common delimiters, but exotic formats may fail.
8. XLSX files — only the **first worksheet** in the workbook is read.
9. Uploaded files are held in **browser memory only** (Zustand). Refreshing the page clears all uploaded data; only the Google Sheets data persists (re-fetched server-side).

### Environment
10. The application is designed to run in a **Node.js server environment** (`npm run dev` or a standard Next.js deployment). Serverless edge runtimes are not supported due to the `googleapis` dependency.
11. All credentials are stored in `.env` and are **never exposed to the client bundle**.

---

## Folder Structure

```
src/
├── app/
│   ├── actions/
│   │   └── sheets.ts          # Server Action — exposes fetchDashboardData()
│   ├── globals.css             # Tailwind base + shadcn CSS variables
│   ├── layout.tsx              # Root layout — ThemeProvider + Toaster
│   ├── loading.tsx             # Intentionally returns null (LoadingScreen owns UX)
│   └── page.tsx                # Root Server Component — fetches + renders
│
├── components/
│   ├── dashboard/
│   │   ├── DashboardCharts.tsx # Recharts: Area, Pie, Bar
│   │   ├── DashboardFilters.tsx# Date Range + Category filter + Export CSV
│   │   ├── DashboardSkeleton.tsx # Skeleton layout (unused in nav flow, available)
│   │   ├── DataTable.tsx       # TanStack Table: sort, search, paginate
│   │   └── KPICards.tsx        # 4 animated metric cards
│   ├── ui/
│   │   ├── EmptyState.tsx      # "No Data Found" illustration
│   │   └── LoadingScreen.tsx   # Framer Motion full-screen splash
│   ├── DashboardView.tsx       # Client orchestrator — tabs, state hydration
│   ├── FileUploader.tsx        # react-dropzone + PapaParse + XLSX
│   ├── RefreshButton.tsx       # router.refresh() client trigger
│   ├── ThemeProvider.tsx       # next-themes wrapper
│   └── ThemeToggle.tsx         # Sun/Moon dropdown
│
├── lib/
│   ├── data-processor.ts       # Heuristic normaliser + duplicate detection
│   ├── google-sheets.ts        # googleapis Auth + getDashboardData()
│   └── utils.ts                # cn() helper (clsx + tailwind-merge)
│
└── store/
    └── useDataStore.ts         # Zustand store + useFilteredData() hook
```

---

*Built as a Web Developer Intern Assessment. All data is fetched server-side and normalised before reaching the client.*
