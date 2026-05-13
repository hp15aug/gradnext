"use client";

import { useEffect, useRef } from "react";
import { useDataStore } from "@/store/useDataStore";
import type { SheetData } from "@/lib/google-sheets";
import { normalizeData } from "@/lib/data-processor";
import { FileUploader } from "@/components/FileUploader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, LayoutDashboard } from "lucide-react";

function RawSheetTable({
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
        <p className="text-sm text-muted-foreground">
          No data found in this sheet.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border px-6 py-4 bg-muted/20">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <Badge variant="secondary" className="font-mono text-xs">
          {badge}
        </Badge>
        <span className="ml-auto text-xs text-muted-foreground">
          {rows.length} row{rows.length !== 1 ? "s" : ""} · {headers.length}{" "}
          column{headers.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {headers.map((header) => (
                <TableHead
                  key={header}
                  className="bg-muted/50 text-xs font-medium uppercase tracking-wide text-muted-foreground whitespace-nowrap"
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
                    <TableCell
                      key={header}
                      className="text-sm text-foreground whitespace-nowrap"
                    >
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
      </div>
    </section>
  );
}

export function DashboardView({
  initialGoogleSheetsData,
}: {
  initialGoogleSheetsData: SheetData;
}) {
  const setGoogleSheetsData = useDataStore(
    (state) => state.setGoogleSheetsData
  );
  const mergedData = useDataStore((state) => state.mergedData);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Normalize both sheets and combine them
    const normalizedSheet1 = normalizeData(
      initialGoogleSheetsData.sheet1,
      "Google Sheets - Sheet 1"
    );
    const normalizedSheet2 = normalizeData(
      initialGoogleSheetsData.sheet2,
      "Google Sheets - Sheet 2"
    );
    setGoogleSheetsData([...normalizedSheet1, ...normalizedSheet2]);
  }, [initialGoogleSheetsData, setGoogleSheetsData]);

  return (
    <Tabs defaultValue="unified" className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger
            value="unified"
            className="flex items-center gap-2 px-4 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
          >
            <LayoutDashboard className="w-4 h-4" />
            Unified Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="raw"
            className="flex items-center gap-2 px-4 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
          >
            <Database className="w-4 h-4" />
            Raw Data
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="unified" className="space-y-8 mt-0 focus-visible:outline-none">
        {/* Uploader Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            Add Local Data
          </h2>
          <FileUploader />
        </section>

        {/* Unified Table Section */}
        <section className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border px-6 py-4 bg-muted/20">
            <h2 className="text-base font-semibold text-foreground">
              Unified Dataset
            </h2>
            <Badge variant="secondary" className="font-mono text-xs">
              {mergedData.length} Records
            </Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[200px] bg-muted/50 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Source
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Date
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Category
                </TableHead>
                <TableHead className="text-right bg-muted/50 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Value
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mergedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No data available.
                  </TableCell>
                </TableRow>
              ) : (
                mergedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Badge
                        variant={
                          row.source.includes("Google Sheets")
                            ? "outline"
                            : "default"
                        }
                        className="text-[10px] uppercase font-semibold"
                      >
                        {row.source}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {row.date || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.category || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-right font-medium">
                      {row.value.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).replace("$", "")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </section>
      </TabsContent>

      <TabsContent value="raw" className="space-y-6 mt-0 focus-visible:outline-none">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Source Data
          </h2>
          <p className="text-sm text-muted-foreground">
            Direct, untransformed data synced from the connected Google Sheets account.
          </p>
        </div>
        
        <RawSheetTable
          title="Google Sheets — Sheet 1"
          badge={`${initialGoogleSheetsData.sheet1.length} rows`}
          headers={initialGoogleSheetsData.sheet1Headers}
          rows={initialGoogleSheetsData.sheet1}
        />
        <RawSheetTable
          title="Google Sheets — Sheet 2"
          badge={`${initialGoogleSheetsData.sheet2.length} rows`}
          headers={initialGoogleSheetsData.sheet2Headers}
          rows={initialGoogleSheetsData.sheet2}
        />
      </TabsContent>
    </Tabs>
  );
}
