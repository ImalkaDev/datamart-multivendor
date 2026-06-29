import { db } from "@/db";
import { datasets, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { approveDataset, rejectDataset } from "../actions";

export default async function ModerationPage() {
  const pendingDatasets = await db
    .select({
      id: datasets.id,
      title: datasets.title,
      description: datasets.description,
      createdAt: datasets.createdAt,
      vendorName: users.name,
    })
    .from(datasets)
    .leftJoin(users, eq(datasets.vendorId, users.id))
    .where(eq(datasets.status, "PENDING"))
    .orderBy(desc(datasets.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Moderation Queue</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve or reject pending datasets.
        </p>
      </div>

      <div className="rounded-md border bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingDatasets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No pending datasets.
                </TableCell>
              </TableRow>
            ) : (
              pendingDatasets.map((dataset) => (
                <TableRow key={dataset.id}>
                  <TableCell className="font-medium">{dataset.title}</TableCell>
                  <TableCell>{dataset.vendorName || "Unknown"}</TableCell>
                  <TableCell>
                    {dataset.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <form action={approveDataset.bind(null, dataset.id)} className="inline-block">
                      <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                    </form>
                    <form action={rejectDataset.bind(null, dataset.id)} className="inline-block">
                      <Button type="submit" size="sm" variant="destructive">
                        Reject
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
