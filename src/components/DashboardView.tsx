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

export function DashboardView({
  initialGoogleSheetsData,
}: {
  initialGoogleSheetsData: SheetData;
}) {
  const setGoogleSheetsData = useDataStore((state) => state.setGoogleSheetsData);
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
    <div className="space-y-8">
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
            Unified Dashboard Data
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
    </div>
  );
}
