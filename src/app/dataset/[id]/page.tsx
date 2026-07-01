import { db } from "@/db";
import { datasets } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import DatasetPreview from "@/components/DatasetPreview";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const datasetResult = await db
    .select({
      title: datasets.title,
      description: datasets.description,
    })
    .from(datasets)
    .where(and(eq(datasets.id, params.id), eq(datasets.status, "APPROVED")))
    .limit(1);

  const dataset = datasetResult[0];

  if (!dataset) {
    return {
      title: "Dataset Not Found",
      description: "The requested dataset could not be found.",
    };
  }

  return {
    title: `${dataset.title} | DataMart`,
    description: dataset.description.slice(0, 150) + "...",
  };
}

export default async function DatasetProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const datasetResult = await db
    .select()
    .from(datasets)
    .where(and(eq(datasets.id, params.id), eq(datasets.status, "APPROVED")))
    .limit(1);

  const dataset = datasetResult[0];

  if (!dataset) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid md:grid-cols-3 gap-8">

        {/* Main Content: Details and Preview */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary" className="capitalize text-sm px-3 py-1">
                {dataset.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Updated {dataset.updatedAt.toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{dataset.title}</h1>
            <p className="text-lg text-muted-foreground whitespace-pre-wrap">
              {dataset.description}
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-bold mb-4">Data Preview</h2>
            <Suspense fallback={<div className="p-8 text-center bg-muted/20 border rounded-lg">Loading preview...</div>}>
              <DatasetPreview fileUrl={dataset.fileUrl} />
            </Suspense>
          </div>
        </div>

        {/* Sidebar: Checkout */}
        <div className="md:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-2xl">Purchase Dataset</CardTitle>
              <CardDescription>Instant access to full data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-6 text-primary">
                ${(dataset.price / 100).toFixed(2)}
              </div>
              <ul className="space-y-3 text-sm mb-6 text-muted-foreground">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Full data download
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Commercial use allowed
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Lifetime access
                </li>
              </ul>
              <Button className="w-full text-lg py-6 font-semibold">
                Buy Now - ${(dataset.price / 100).toFixed(2)}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
