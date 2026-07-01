import { Metadata } from 'next';
import { db } from "@/db";
import { datasets, users, reviews, purchases } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import DatasetPreview from "@/components/DatasetPreview";
import { auth } from "@/auth";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
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
    openGraph: {
      title: dataset.title,
      description: dataset.description || undefined,
      url: `https://datamart.com/dataset/${params.id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dataset.title,
      description: dataset.description || undefined,
    },
  };
}

export default async function DatasetProductPage(props: Props) {
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

  // Get vendor name
  const vendorResult = await db.select().from(users).where(eq(users.id, dataset.vendorId)).limit(1);
  const vendor = vendorResult[0];

  const allReviews = await db.select().from(reviews).where(eq(reviews.datasetId, params.id));

  // Need to manually join user for review list
  const allReviewsWithUser = await Promise.all(allReviews.map(async (r) => {
      const userResult = await db.select().from(users).where(eq(users.id, r.userId)).limit(1);
      return {
          ...r,
          user: userResult[0]
      }
  }));

  const totalReviews = allReviews.length;
  const averageRating = totalReviews > 0
    ? allReviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
    : 0;

  const session = await auth();
  let hasPurchased = false;
  let hasReviewed = false;

  if (session && session.user && session.user.id) {
    const purchaseResult = await db.select().from(purchases).where(and(eq(purchases.datasetId, params.id), eq(purchases.userId, session.user.id))).limit(1);
    hasPurchased = purchaseResult.length > 0;

    const reviewResult = await db.select().from(reviews).where(and(eq(reviews.datasetId, params.id), eq(reviews.userId, session.user.id))).limit(1);
    hasReviewed = reviewResult.length > 0;
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
            <h1 className="text-4xl font-bold mb-2">{dataset.title}</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">Vendor: {vendor?.name || 'Unknown'}</p>

            <div className="flex items-center gap-2 mb-4">
              <span className="font-semibold text-lg">{averageRating.toFixed(1)} / 5</span>
              <span className="text-zinc-500">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
            </div>
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

          <Separator />

          <div>
            <div className="mb-8">
              {hasPurchased && !hasReviewed && (
                <div className="mb-8 p-6 border rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                  <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
                  <ReviewForm datasetId={params.id} />
                </div>
              )}
              {hasPurchased && hasReviewed && (
                <div className="mb-8 p-4 border rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                  You have already reviewed this dataset.
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              <ReviewList reviews={allReviewsWithUser} />
            </div>
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
