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
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="flex flex-col gap-3 mb-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">Explore Datasets</h1>
        <p className="text-lg text-slate-600 font-light">Find the perfect dataset for your next big project.</p>
      </div>

      <Suspense fallback={<div className="animate-pulse h-16 bg-slate-200 rounded-xl mb-8"></div>}>
        <div className="mb-10 p-6 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100">
          <SearchFilters />
        </div>
      </Suspense>

      {fetchedDatasets.length === 0 ? (
        <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-slate-800">No datasets found</h3>
          <p className="text-slate-500 max-w-md mx-auto">Try adjusting your search query or filters to find what you&apos;re looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {fetchedDatasets.map((dataset) => (
            <Card key={dataset.id} className="flex flex-col h-full overflow-hidden bg-white/80 backdrop-blur-md border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 rounded-2xl">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <Badge variant="secondary" className="capitalize bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    {dataset.category}
                  </Badge>
                  <span className="font-bold text-xl text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                    ${(dataset.price / 100).toFixed(2)}
                  </span>
                </div>
                <CardTitle className="line-clamp-2 text-xl leading-tight" title={dataset.title}>{dataset.title}</CardTitle>
                <CardDescription className="line-clamp-3 mt-2 text-sm leading-relaxed" title={dataset.description}>
                  {dataset.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {/* Additional details could go here in the future */}
              </CardContent>
              <CardFooter className="pt-6 pb-6 px-6 mt-auto border-t border-slate-50 bg-slate-50/50">
                <Link href={`/dataset/${dataset.id}`} className="w-full">
                  <Button className="w-full rounded-xl py-6 font-semibold hover:scale-105 transition-transform duration-300 shadow-sm">
                    View Details
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
