"use client";

import { useDataStore, useFilteredData } from "@/store/useDataStore";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";

export function DashboardFilters() {
  const dateRange = useDataStore((state) => state.dateRange);
  const setDateRange = useDataStore((state) => state.setDateRange);
  const categoryFilter = useDataStore((state) => state.categoryFilter);
  const setCategoryFilter = useDataStore((state) => state.setCategoryFilter);
  const mergedData = useDataStore((state) => state.mergedData);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    mergedData.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats).sort();
  }, [mergedData]);

  const filteredData = useFilteredData();

  const handleExport = () => {
    if (filteredData.length === 0) {
      return;
    }
    
    const headers = ["Source", "Date", "Category", "Value"];
    const csvRows = [headers.join(",")];
    
    filteredData.forEach(row => {
      // Escape quotes for CSV safety
      const source = `"${(row.source || "").replace(/"/g, '""')}"`;
      const date = `"${(row.date || "").replace(/"/g, '""')}"`;
      const category = `"${(row.category || "").replace(/"/g, '""')}"`;
      const value = row.value;
      
      csvRows.push([source, date, category, value].join(","));
    });
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `export_${format(new Date(), "yyyy-MM-dd_HHmm")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger className="w-[300px] flex items-center border border-border rounded-md px-3 py-2 text-sm justify-start text-left font-normal bg-card hover:bg-card/90">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Filter by date range</span>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={{ from: dateRange?.from, to: dateRange?.to }}
                onSelect={(range) => setDateRange(range as any)}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-2">
          <Select value={categoryFilter} onValueChange={(val) => val && setCategoryFilter(val)}>
            <SelectTrigger className="w-[200px] bg-card hover:bg-card/90">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button onClick={handleExport} variant="secondary" disabled={filteredData.length === 0}>
        <Download className="mr-2 h-4 w-4" /> Export CSV
      </Button>
    </div>
  );
}
