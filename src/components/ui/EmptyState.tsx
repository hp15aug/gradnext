import { FolderX } from "lucide-react";

export function EmptyState({ message = "No data available in this view." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 rounded-xl border border-dashed border-border bg-card/30">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
        <FolderX className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground tracking-tight">No Data Found</h3>
      <p className="text-sm text-muted-foreground max-w-sm text-center mt-2">
        {message}
      </p>
    </div>
  );
}
