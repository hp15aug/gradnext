"use server";

import { getDashboardData } from "@/lib/google-sheets";
import type { SheetData } from "@/lib/google-sheets";

export interface DashboardActionResult {
  success: true;
  data: SheetData;
}

export interface DashboardActionError {
  success: false;
  error: string;
}

export type DashboardActionResponse =
  | DashboardActionResult
  | DashboardActionError;

/**
 * Server Action that fetches dashboard data from Google Sheets.
 * Returns a discriminated union — callers should always check `result.success`
 * before accessing `result.data`.
 */
export async function fetchDashboardData(): Promise<DashboardActionResponse> {
  try {
    const data = await getDashboardData();
    return { success: true, data };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unknown error occurred.";
    console.error("[fetchDashboardData] Error:", message);
    return { success: false, error: message };
  }
}
