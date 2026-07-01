import { db } from "@/db";
import { datasets } from "@/db/schema";
import { eq, and, ilike, desc } from "drizzle-orm";
import { SearchFilters } from "./SearchFilters";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Explore Datasets | DataMart",
  description: "Browse and search through our extensive collection of high-quality datasets.",
};

export default async function ExplorePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const category = typeof searchParams.category === "string" ? searchParams.category : "";

  const conditions = [eq(datasets.status, "APPROVED")];

  if (q) {
    conditions.push(ilike(datasets.title, `%${q}%`));
  }

  if (category && category !== "all") {
    conditions.push(eq(datasets.category, category));
  }

  const fetchedDatasets = await db
    .select()
    .from(datasets)
    .where(and(...conditions))
    .orderBy(desc(datasets.createdAt));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Explore Datasets</h1>
        <p className="text-muted-foreground">Find the perfect dataset for your next big project.</p>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <SearchFilters />
      </Suspense>

      {fetchedDatasets.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
          <h3 className="text-xl font-semibold mb-2">No datasets found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters to find what you&apos;re looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fetchedDatasets.map((dataset) => (
            <Card key={dataset.id} className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {dataset.category}
                  </Badge>
                  <span className="font-bold text-lg text-primary">
                    ${(dataset.price / 100).toFixed(2)}
                  </span>
                </div>
                <CardTitle className="line-clamp-1" title={dataset.title}>{dataset.title}</CardTitle>
                <CardDescription className="line-clamp-2" title={dataset.description}>
                  {dataset.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {/* Additional details could go here in the future */}
              </CardContent>
              <CardFooter className="pt-4 border-t bg-muted/10">
                <Link href={`/dataset/${dataset.id}`} className="w-full">
                  <Button className="w-full">
                    View Dataset
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
