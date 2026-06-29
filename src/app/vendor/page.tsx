import { db } from "@/db";
import { datasets } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function VendorDashboard() {
  const session = await auth();
  const vendorId = session?.user?.id;

  if (!vendorId) return null;

  const vendorDatasets = await db.query.datasets.findMany({
    where: eq(datasets.vendorId, vendorId),
    orderBy: (datasets, { desc }) => [desc(datasets.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Your Datasets</h2>
        <Link href="/vendor/upload">
          <Button>Upload New Dataset</Button>
        </Link>
      </div>

      {vendorDatasets.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg border border-dashed border-gray-300">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No datasets</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by uploading your first dataset.
          </p>
          <div className="mt-6">
            <Link href="/vendor/upload">
              <Button>Upload Dataset</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {vendorDatasets.map((dataset) => (
              <li key={dataset.id}>
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {dataset.title}
                    </p>
                    <p className="mt-1 flex items-center text-sm text-gray-500">
                      <span className="truncate">{dataset.category}</span>
                      <span className="mx-2">&middot;</span>
                      <span>${(dataset.price / 100).toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center gap-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      dataset.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      dataset.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {dataset.status.toLowerCase()}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
