import { create } from "zustand";
import { StandardizedData } from "@/lib/data-processor";

interface DataStore {
  googleSheetsData: StandardizedData[];
  uploadedData: StandardizedData[];
  mergedData: StandardizedData[];
  setGoogleSheetsData: (data: StandardizedData[]) => void;
  addUploadedData: (data: StandardizedData[]) => void;
  removeUploadedData: (source: string) => void;
  clearUploadedData: () => void;
}

export const useDataStore = create<DataStore>((set) => ({
  googleSheetsData: [],
  uploadedData: [],
  mergedData: [],
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
}));
