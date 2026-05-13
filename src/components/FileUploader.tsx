"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { UploadCloud, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { normalizeData } from "@/lib/data-processor";
import { useDataStore } from "@/store/useDataStore";

export function FileUploader() {
  const [error, setError] = useState<string | null>(null);
  const addUploadedData = useDataStore((state) => state.addUploadedData);

  const processFile = (file: File) => {
    setError(null);
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const normalized = normalizeData(results.data, file.name);
          addUploadedData(normalized);
        },
        error: (err: any) => setError(`CSV Parse Error: ${err.message}`),
      });
    } else if (extension === "xlsx" || extension === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          const normalized = normalizeData(json, file.name);
          addUploadedData(normalized);
        } catch (err) {
          setError(
            `Excel Parse Error: ${
              err instanceof Error ? err.message : "Unknown error"
            }`
          );
        }
      };
      reader.onerror = () => setError("Failed to read file.");
      reader.readAsArrayBuffer(file);
    } else {
      setError("Unsupported file format. Please upload CSV or XLSX.");
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(processFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  return (
    <Card
      className={`overflow-hidden border-dashed border-2 transition-colors ${
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-border bg-muted/20"
      }`}
    >
      <CardContent className="p-0">
        <div
          {...getRootProps()}
          className="flex flex-col items-center justify-center py-12 px-6 text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground/60" />
          <h3 className="text-lg font-medium text-foreground">
            Drag & drop files here
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Support for CSV and Excel (.xlsx, .xls) files
          </p>
          <Button variant="secondary" size="sm">
            Browse Files
          </Button>
          {error && (
            <div className="mt-4 flex items-center text-sm text-destructive bg-destructive/10 px-3 py-1.5 rounded-md">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
