# First
Act as a Senior Full Stack Developer. I am building a Web Developer Intern Assessment. 
I have a Next.js (App Router) project in the `src` directory using Tailwind CSS and shadcn/ui.

**Goal:** Complete Phase 1 by setting up a robust Google Sheets data fetching pipeline.

**Environment Variables available in .env:**
- GOOGLE_SHEETS_CLIENT_EMAIL
- GOOGLE_SHEETS_PRIVATE_KEY
- GOOGLE_SHEET_ID

**Technical Specs:**
1. Use the `googleapis` library.
2. Create a utility file `src/lib/google-sheets.ts` to initialize the Google Auth using the Service Account credentials. 
3. Note: Sanitize the `GOOGLE_SHEETS_PRIVATE_KEY` to handle potential newline characters (`\n`) correctly.
4. Create an async function `getDashboardData()` that:
   - Fetches data from "Sheet1" and "Sheet2".
   - Transforms the raw rows (arrays) into an array of objects where the keys are the column headers (the first row).
5. Create a Server Action in `src/app/actions/sheets.ts` to expose this data.
6. Update `src/app/page.tsx` to:
   - Fetch the data on the server.
   - Use a simple shadcn/ui `Table` or a basic JSON view to verify the data from BOTH sheets is appearing correctly.
   - Implement a basic "Loading" state and error handling if the API fails.

**Design Preference:** 
Maintain a minimalist SaaS aesthetic. Use a standard `DataTable` structure from shadcn for the verification view.


# Second
Act as a Senior Full Stack Developer. We are moving to Phase 2 of the Analytics Dashboard.
I have already set up Google Sheets fetching in Phase 1. Now, I need to implement a professional file upload system and a centralized state management.

**Objectives:**
1. **State Management (Zustand):** 
   - Create a store in `src/store/useDataStore.ts`.
   - The store should hold `googleSheetsData`, `uploadedData`, and a computed `mergedData` array.
   - Include actions to set Google Sheets data and add/remove uploaded data.

2. **File Processing Utility:**
   - Create `src/lib/data-processor.ts`.
   - Implement a "Normalizer" function. This function should take an array of objects from ANY source and return a standardized schema. 
   - Standard Schema: `{ date: string, category: string, value: number, source: string, originalData: any }`.
   - Use logic to "guess" mapping (e.g., if a column is "Revenue" or "Amount", map it to "value").

3. **File Uploader Component:**
   - Create `src/components/FileUploader.tsx` using `react-dropzone` and `shadcn/ui` styling.
   - It must support `.csv` (using `papaparse`) and `.xlsx` (using `xlsx`).
   - On successful parse, normalize the data using the utility and add it to the Zustand store.

4. **Integration in `src/app/page.tsx`:**
   - On page load, take the Google Sheets data from Phase 1 and hydrate the Zustand store.
   - Display the `FileUploader` component.
   - Update the existing table to display the `mergedData` from the store instead of just the raw Google Sheets data.
   - Add a "Source" badge to the table (e.g., "Google Sheets" vs "Uploaded File") to distinguish data origins.

**Technical Constraints:**
- Use `lucide-react` for upload icons.
- Ensure the Normalizer handles edge cases like empty rows or inconsistent date formats.
- For the "AI" aspect of normalization: Write a smart heuristic function that uses string similarity or keyword matching to map headers. If it's too complex, create a mapping object that can be easily extended.

**Style:** 
Modern, clean, and professional. Use shadcn "Card" components to wrap the uploader.


# Third
Act as a Senior Frontend Engineer. We are now building Phase 3 of the Analytics Dashboard. 
The data pipeline is complete. We have a Zustand store (`useDataStore`) containing `mergedData` with the normalized schema: `{ id: string, date: string, category: string, value: number, source: string }`.

**Objectives:**
We need to build a responsive, SaaS-style dashboard layout in `src/app/page.tsx` utilizing shadcn/ui components and Tailwind CSS. Break the UI into the following modular components inside a new `src/components/dashboard/` directory.

**1. Global Filters (`src/components/dashboard/DashboardFilters.tsx`)**
- Create a filter bar containing:
  - A Date Range Picker using shadcn's Calendar and `date-fns`.
  - A Category Filter (Select or Dropdown) derived from the unique categories in `mergedData`.
- These filters should update a `filteredData` computed state in the Zustand store (or filter on the fly before passing to children).

**2. KPI Cards (`src/components/dashboard/KPICards.tsx`)**
- Create a 4-column grid of shadcn Cards displaying:
  1. Total Value (sum of `value`)
  2. Total Transactions (count of items)
  3. Average Value (Total / Count)
  4. Top Category (category with the highest total value)
- Use `date-fns` and array reduction to calculate these based on the *filtered* data. Include simple Lucide icons for each.

**3. Charts Component (`src/components/dashboard/DashboardCharts.tsx`)**
- Use `recharts` to build 3 responsive charts (wrapped in shadcn Cards):
  - **Chart 1 (Trend):** An AreaChart or LineChart showing `value` over time (grouped by day or month using `date-fns`).
  - **Chart 2 (Distribution):** A Donut/PieChart showing total value segmented by `category`.
  - **Chart 3 (Comparison):** A BarChart comparing total value by `source` (e.g., Google Sheets vs. Uploaded CSV).
- Ensure the charts use clean, minimalist styling (hide axes lines, use elegant tooltips matching the shadcn theme).

**4. Advanced Data Table (`src/components/dashboard/DataTable.tsx`)**
- Implement `@tanstack/react-table` integrated with shadcn's `<Table>` components.
- Requirements:
  - Sortable columns (Date, Category, Value, Source).
  - Global text search input to filter rows.
  - Pagination (Next/Previous controls).
- Render a visual badge for the `source` column (e.g., a blue badge for "Google Sheets", a green badge for "Upload").

**Assembly:**
Update `src/app/page.tsx` to render the `DashboardFilters` at the top, followed by the `KPICards`, a grid for the `DashboardCharts` (e.g., Line chart full width, Pie and Bar split 50/50 below it), and finally the `DataTable` at the bottom.


# Fourth

Act as a Senior Frontend Engineer. We are now in Phase 4 (Final Polish) of the Analytics Dashboard. 
The core data pipeline, Zustand store, and UI (Charts/Table) are complete. We need to add production-level polish, data validation, and user feedback.

**Objectives:**

**1. Data Health Checks (Duplicate & Consistency Validation)**
- Update the normalizer function in `src/lib/data-processor.ts`.
- Add logic to detect duplicate rows (e.g., identical `date`, `category`, and `value`).
- Add logic to check for inconsistent columns (e.g., rows missing required fields).
- When normalizing uploaded files, return an object containing `{ validData, duplicatesCount, errors }`.

**2. User Feedback (shadcn/ui Toasts)**
- Implement shadcn's `useToast` across the application.
- Show a **Success Toast** when a file uploads successfully.
- Show a **Warning Toast** if the Data Health Check finds skipped duplicates or missing columns (e.g., "Skipped 3 duplicate rows").
- Show an **Error Toast** if the Google Sheets API fetch fails or if the file format is completely invalid.

**3. UX Polish: Skeleton Loaders**
- Create `src/components/dashboard/DashboardSkeleton.tsx`.
- Use shadcn's `<Skeleton />` component to build a visually accurate loading state for the KPI Cards, Charts, and Table.
- Update `src/app/page.tsx`: While the Google Sheets data is initially fetching, display this skeleton instead of the actual components or a blank screen.

**4. Dark Mode Support**
- Integrate `next-themes` by creating a `ThemeProvider` in your root layout.
- Create a `src/components/ThemeToggle.tsx` (using a Sun/Moon icon from `lucide-react`) and place it in the top header of the dashboard.
- Ensure all charts (`recharts`) and table text adapt nicely to the dark theme variables.

**5. Export to CSV Feature**
- Add an "Export to CSV" button (using shadcn's Button) next to the Global Filters or above the Table.
- Write a utility function that takes the current `filteredData` from the Zustand store, converts it to a standard CSV string, and triggers a browser file download.

**Technical Constraints:**
- Keep components modular.
- Do not break the existing Zustand state; only enhance how the data gets piped into it.
- Ensure the "Export" feature downloads exactly what the user sees on their screen (respecting active filters).


# Fifth
Act as a Senior UI/UX Developer. We are adding the final professional touches to the Analytics Dashboard.

**Task 1: Framer Motion Loading Splash Screen**
- Create a new component `src/components/ui/LoadingScreen.tsx`.
- Use `framer-motion` to create a minimalist, full-screen loading overlay.
- Requirements:
    - A sleek, centered logo or "Dashboard" text with a subtle "breathe" or "shimmer" animation.
    - Use a smooth `AnimatePresence` fade-out effect when the loading is complete.
    - Ensure it blocks the main UI until the Google Sheets data is fully loaded into the Zustand store.

**Task 2: Source Sheet Integration**
- Update the dashboard header to include a "View Source" button using shadcn/ui (Outline variant).
- Link: `https://docs.google.com/spreadsheets/d/1d1M8VCTeBwXTKn7LA0HORkkJr8qUvrnzRIPnHKftrZ8/edit`
- Use the `ExternalLink` icon from `lucide-react`.
- Ensure the `GOOGLE_SHEET_ID` in the backend logic/env is updated to match: `1d1M8VCTeBwXTKn7LA0HORkkJr8qUvrnzRIPnHKftrZ8`.

**Task 3: Layout Refinement & "Necessary Changes"**
- **Sticky Header:** Make the dashboard header sticky with a `backdrop-blur` effect for a modern feel.
- **Empty States:** If the Google Sheet is empty or the user hasn't uploaded a file, show a clean "No Data Available" illustration/message rather than an empty chart.
- **Responsive Spacing:** Ensure the padding and grid gaps are consistent across mobile and desktop (use `gap-6` or `gap-8`).
- **Data Refresh:** Add a "Refresh" button in the header that re-triggers the Google Sheets Server Action to fetch fresh data without a page reload.

**Integration Logic:**
- In `src/app/page.tsx`, wrap the main content in `AnimatePresence`.
- Use a local `isAppLoading` state that stays true until the `getDashboardData` fetch is successful.
- Switch from the `LoadingScreen` to the main dashboard content with a smooth slide-up animation.

**Design Aesthetic:** 
Stick to the minimalist SaaS look. High contrast in Dark Mode, subtle borders, and consistent typography.