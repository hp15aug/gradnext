export interface StandardizedData {
  id: string;
  date: string;
  category: string;
  value: number;
  source: string;
  originalData: any;
}

/**
 * Normalizes an array of arbitrary objects into a StandardizedData format.
 * Uses heuristics to map fields for date, category, and value.
 *
 * @param rawData - Array of objects (e.g., from CSV, XLSX, or Google Sheets)
 * @param sourceName - A label identifying where this data came from
 * @returns Array of standardized data objects
 */
export function normalizeData(
  rawData: any[],
  sourceName: string
): StandardizedData[] {
  // Keywords to guess mapping based on column headers
  const dateKeywords = ["date", "timestamp", "time", "created", "day", "month"];
  const categoryKeywords = [
    "category",
    "type",
    "name",
    "item",
    "product",
    "department",
    "desc",
    "description",
    "title",
  ];
  const valueKeywords = [
    "value",
    "amount",
    "price",
    "revenue",
    "cost",
    "total",
    "sales",
    "qty",
    "quantity",
    "budget",
  ];

  return rawData
    .map((row, index) => {
      // Edge case: Skip empty rows or non-objects
      if (!row || typeof row !== "object" || Object.keys(row).length === 0) {
        return null;
      }

      const keys = Object.keys(row);

      // Helper to find the first key that matches any of the given keywords
      const getMatch = (keywords: string[]) => {
        return keys.find((k) =>
          keywords.some((kw) => k.toLowerCase().includes(kw))
        );
      };

      const dateKey = getMatch(dateKeywords) || keys[0];
      const categoryKey = getMatch(categoryKeywords) || keys[1] || keys[0];
      const valueKey = getMatch(valueKeywords) || keys[2] || keys[1];

      // Parse the value carefully to handle currencies, commas, etc.
      let val = 0;
      if (valueKey && row[valueKey] !== undefined && row[valueKey] !== null) {
        // Strip everything except digits, minus sign, and period
        const parsed = parseFloat(
          String(row[valueKey]).replace(/[^0-9.-]+/g, "")
        );
        if (!isNaN(parsed)) {
          val = parsed;
        }
      }

      return {
        id: `${sourceName.replace(/\s+/g, "-")}-${index}-${Date.now()}`,
        date: dateKey ? String(row[dateKey] || "") : "",
        category: categoryKey ? String(row[categoryKey] || "") : "",
        value: val,
        source: sourceName,
        originalData: row,
      };
    })
    .filter(Boolean) as StandardizedData[];
}
