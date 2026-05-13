export interface StandardizedData {
  id: string;
  date: string;
  category: string;
  value: number;
  source: string;
  originalData: any;
}

export interface NormalizationResult {
  validData: StandardizedData[];
  duplicatesCount: number;
  errors: string[];
}

/**
 * Normalizes an array of arbitrary objects into a StandardizedData format.
 * Includes data health checks to flag missing fields and filter out duplicates.
 */
export function normalizeData(
  rawData: any[],
  sourceName: string
): NormalizationResult {
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

  const validData: StandardizedData[] = [];
  const errors: string[] = [];
  let duplicatesCount = 0;

  // We use a set to track uniqueness based on date + category + value
  const seenSignatures = new Set<string>();

  rawData.forEach((row, index) => {
    // Edge case: Skip empty rows or non-objects
    if (!row || typeof row !== "object" || Object.keys(row).length === 0) {
      return;
    }

    const keys = Object.keys(row);

    const getMatch = (keywords: string[]) => {
      return keys.find((k) =>
        keywords.some((kw) => k.toLowerCase().includes(kw))
      );
    };

    const dateKey = getMatch(dateKeywords) || keys[0];
    const categoryKey = getMatch(categoryKeywords) || keys[1] || keys[0];
    const valueKey = getMatch(valueKeywords) || keys[2] || keys[1];

    let val = 0;
    if (valueKey && row[valueKey] !== undefined && row[valueKey] !== null) {
      const parsed = parseFloat(
        String(row[valueKey]).replace(/[^0-9.-]+/g, "")
      );
      if (!isNaN(parsed)) {
        val = parsed;
      }
    }

    const dateVal = dateKey ? String(row[dateKey] || "").trim() : "";
    const categoryVal = categoryKey ? String(row[categoryKey] || "").trim() : "";

    // Validation: Missing critical fields
    if (!dateVal && !categoryVal && val === 0) {
      errors.push(`Row ${index + 1} skipped: Missing critical data.`);
      return;
    }

    // Validation: Duplicate check
    const signature = `${dateVal}|${categoryVal}|${val}`;
    if (seenSignatures.has(signature)) {
      duplicatesCount++;
      return;
    }
    seenSignatures.add(signature);

    validData.push({
      id: `${sourceName.replace(/\s+/g, "-")}-${index}-${Date.now()}`,
      date: dateVal,
      category: categoryVal,
      value: val,
      source: sourceName,
      originalData: row,
    });
  });

  return { validData, duplicatesCount, errors };
}
