import { google } from "googleapis";

/**
 * Initializes a Google Auth client using Service Account credentials
 * from environment variables. The private key is sanitized to handle
 * literal `\n` escape sequences that may be stored as-is in .env files.
 */
function getGoogleAuthClient() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const rawPrivateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  if (!clientEmail || !rawPrivateKey) {
    throw new Error(
      "Missing Google Sheets credentials. Ensure GOOGLE_SHEETS_CLIENT_EMAIL and GOOGLE_SHEETS_PRIVATE_KEY are set in .env"
    );
  }

  // Sanitize: remove surrounding quotes, replace literal `\n` strings with real newlines,
  // and ensure the PEM header/footer are correctly separated from the key body.
  let privateKey = rawPrivateKey.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
  
  privateKey = privateKey.replace(/-----BEGIN PRIVATE KEY-----/, "-----BEGIN PRIVATE KEY-----\n");
  privateKey = privateKey.replace(/-----END PRIVATE KEY-----/, "\n-----END PRIVATE KEY-----");
  privateKey = privateKey.replace(/\n+/g, "\n"); // Clean up any duplicate newlines

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return auth;
}

/**
 * Transforms a 2D array of raw sheet values (rows) into an array of
 * objects where each key corresponds to the column header (first row).
 *
 * @param rows - Raw 2D array from the Sheets API (first row = headers)
 * @returns Array of typed record objects
 */
function transformRowsToObjects(
  rows: string[][]
): Record<string, string>[] {
  if (!rows || rows.length < 2) return [];

  const [headers, ...dataRows] = rows;

  return dataRows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      // Fallback for empty header cells
      const key = header?.trim() || `Column_${index + 1}`;
      obj[key] = row[index] ?? "";
    });
    return obj;
  });
}

export interface SheetData {
  sheet1: Record<string, string>[];
  sheet2: Record<string, string>[];
  sheet1Headers: string[];
  sheet2Headers: string[];
}

/**
 * Fetches data from "Sheet1" and "Sheet2" of the configured Google Sheet
 * and returns typed, header-keyed data objects for both sheets.
 */
export async function getDashboardData(): Promise<SheetData> {
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    throw new Error(
      "Missing GOOGLE_SHEET_ID environment variable."
    );
  }

  const auth = getGoogleAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  const [sheet1Response, sheet2Response] = await Promise.all([
    sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1",
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet2",
    }),
  ]);

  const sheet1Rows = (sheet1Response.data.values ?? []) as string[][];
  const sheet2Rows = (sheet2Response.data.values ?? []) as string[][];

  const sheet1Headers = sheet1Rows[0] ?? [];
  const sheet2Headers = sheet2Rows[0] ?? [];

  return {
    sheet1: transformRowsToObjects(sheet1Rows),
    sheet2: transformRowsToObjects(sheet2Rows),
    sheet1Headers,
    sheet2Headers,
  };
}
