import { create } from "zustand";
import { useMemo } from "react";
import { StandardizedData } from "@/lib/data-processor";
import { isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns";

interface DateRange {
  from?: Date;
  to?: Date;
}

interface DataStore {
  googleSheetsData: StandardizedData[];
  uploadedData: StandardizedData[];
  mergedData: StandardizedData[];
  
  // Filters
  dateRange: DateRange | undefined;
  categoryFilter: string;
  
  // Actions
  setGoogleSheetsData: (data: StandardizedData[]) => void;
  addUploadedData: (data: StandardizedData[]) => void;
  removeUploadedData: (source: string) => void;
  clearUploadedData: () => void;
  setDateRange: (range: DateRange | undefined) => void;
  setCategoryFilter: (category: string) => void;
}

export const useDataStore = create<DataStore>((set, get) => ({
  googleSheetsData: [],
  uploadedData: [],
  mergedData: [],
  
  dateRange: undefined,
  categoryFilter: "All",
  
  setGoogleSheetsData: (data) =>
    set((state) => ({
      googleSheetsData: data,
      mergedData: [...data, ...state.uploadedData],
    })),
  addUploadedData: (data) =>
    set((state) => {
      const newUploaded = [...state.uploadedData, ...data];
      return {
        uploadedData: newUploaded,
        mergedData: [...state.googleSheetsData, ...newUploaded],
      };
    }),
  removeUploadedData: (source) =>
    set((state) => {
      const newUploaded = state.uploadedData.filter((d) => d.source !== source);
      return {
        uploadedData: newUploaded,
        mergedData: [...state.googleSheetsData, ...newUploaded],
      };
    }),
  clearUploadedData: () =>
    set((state) => ({
      uploadedData: [],
      mergedData: [...state.googleSheetsData],
    })),
    
  setDateRange: (range) => set({ dateRange: range }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
}));


// Helper hook to get filtered data
export const useFilteredData = () => {
  const mergedData = useDataStore((state) => state.mergedData);
  const dateRange = useDataStore((state) => state.dateRange);
  const categoryFilter = useDataStore((state) => state.categoryFilter);

  return useMemo(() => {
    return mergedData.filter((item) => {
      // Category filter
      if (categoryFilter !== "All" && item.category !== categoryFilter) {
        return false;
      }

      // Date range filter
      if (dateRange?.from || dateRange?.to) {
        if (!item.date) return false;
        const itemDate = new Date(item.date);
        // fallback if invalid date
        if (isNaN(itemDate.getTime())) return false;

        if (dateRange.from && itemDate < startOfDay(dateRange.from)) return false;
        if (dateRange.to && itemDate > endOfDay(dateRange.to)) return false;
      }

      return true;
    });
  }, [mergedData, dateRange, categoryFilter]);
};
