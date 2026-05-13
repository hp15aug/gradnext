"use client";

import { useFilteredData } from "@/store/useDataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Activity, Hash, Trophy } from "lucide-react";
import { useMemo } from "react";

export function KPICards() {
  const filteredData = useFilteredData();

  const metrics = useMemo(() => {
    let totalValue = 0;
    const categoryTotals: Record<string, number> = {};

    filteredData.forEach((item) => {
      totalValue += item.value || 0;
      if (item.category) {
        categoryTotals[item.category] =
          (categoryTotals[item.category] || 0) + (item.value || 0);
      }
    });

    const count = filteredData.length;
    const averageValue = count > 0 ? totalValue / count : 0;

    let topCategory = "N/A";
    let maxCatValue = -Infinity;
    Object.entries(categoryTotals).forEach(([cat, val]) => {
      if (val > maxCatValue) {
        maxCatValue = val;
        topCategory = cat;
      }
    });

    return { totalValue, count, averageValue, topCategory };
  }, [filteredData]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.totalValue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Transactions
          </CardTitle>
          <Hash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.count.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Value</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.averageValue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">
            {metrics.topCategory}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
