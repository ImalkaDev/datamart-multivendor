import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Papa from "papaparse";

interface DatasetPreviewProps {
  fileUrl: string;
}

export default async function DatasetPreview({ fileUrl }: DatasetPreviewProps) {
  let data: Record<string, string>[] = [];
  let headers: string[] = [];
  let errorState: "not_csv" | "fetch_error" | "parse_error" | "empty" | null = null;

  try {
    // Only attempt to preview CSV files based on URL extension
    if (!fileUrl.toLowerCase().endsWith(".csv")) {
      errorState = "not_csv";
    } else {
      // Fetch the first 4KB using Range headers to avoid downloading massive datasets
      const response = await fetch(fileUrl, {
        headers: {
          Range: "bytes=0-4096",
        },
        next: { revalidate: 3600 } // cache preview for an hour
      });

      if (!response.ok && response.status !== 206) { // 206 is Partial Content
        throw new Error(`Failed to fetch dataset preview: ${response.statusText}`);
      }

      const partialText = await response.text();

      // The last line might be cut off since we fetched exactly 4096 bytes.
      const lines = partialText.split('\n');
      if (lines.length > 1) {
         lines.pop(); // drop the last line to ensure we don't have a partial row
      }
      const cleanText = lines.join('\n');

      const result = Papa.parse(cleanText, {
        header: true,
        skipEmptyLines: true,
        preview: 10
      });

      if (result.errors.length > 0 && result.data.length === 0) {
        console.error("PapaParse errors:", result.errors);
        errorState = "parse_error";
      } else {
        data = result.data as Record<string, string>[];
        if (data.length === 0) {
          errorState = "empty";
        } else {
          headers = Object.keys(data[0] || {});
        }
      }
    }
  } catch (error) {
    console.error("Error generating dataset preview:", error);
    errorState = "fetch_error";
  }

  if (errorState === "not_csv") {
    return (
      <div className="p-8 text-center bg-muted/20 border rounded-lg">
        <p className="text-muted-foreground">
          Preview is currently only available for CSV files.
        </p>
      </div>
    );
  }

  if (errorState === "parse_error") {
    return (
      <div className="p-8 text-center bg-muted/20 border border-destructive/20 rounded-lg text-destructive">
        Failed to parse dataset preview. The file might not be a valid CSV.
      </div>
    );
  }

  if (errorState === "empty") {
    return (
      <div className="p-8 text-center bg-muted/20 border rounded-lg">
        No data rows could be parsed for preview.
      </div>
    );
  }

  if (errorState === "fetch_error") {
    return (
      <div className="p-8 text-center bg-muted/20 border border-destructive/20 rounded-lg text-destructive">
        <p>Could not load dataset preview at this time.</p>
        <p className="text-xs mt-2 opacity-80">This might be due to a network error or restricted file access.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header} className="whitespace-nowrap">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              {headers.map((header) => (
                <TableCell key={`${i}-${header}`} className="whitespace-nowrap max-w-[200px] truncate" title={row[header]}>
                  {row[header]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-3 border-t bg-muted/50 text-xs text-muted-foreground text-center">
        Showing first {data.length} rows. Full dataset available upon purchase.
      </div>
    </div>
  );
}
