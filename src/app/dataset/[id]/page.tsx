import { db } from "@/db";
import { datasets, users, reviews, purchases } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";

export default async function DatasetPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const dataset = await db.query.datasets.findFirst({
    where: eq(datasets.id, id),
  });

  if (!dataset) {
    notFound();
  }

  // Get vendor name
  const vendor = await db.query.users.findFirst({
    where: eq(users.id, dataset.vendorId),
  });

  const allReviews = await db.query.reviews.findMany({
    where: eq(reviews.datasetId, id),
  });

  // Need to manually join user for review list
  const allReviewsWithUser = await Promise.all(allReviews.map(async (r) => {
      const user = await db.query.users.findFirst({
          where: eq(users.id, r.userId)
      });
      return {
          ...r,
          user
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
    const purchase = await db.query.purchases.findFirst({
      where: and(eq(purchases.datasetId, id), eq(purchases.userId, session.user.id))
    });
    hasPurchased = !!purchase;

    const review = await db.query.reviews.findFirst({
      where: and(eq(reviews.datasetId, id), eq(reviews.userId, session.user.id))
    });
    hasReviewed = !!review;
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{dataset.title}</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">Vendor: {vendor?.name || 'Unknown'}</p>

        <div className="flex items-center gap-2 mb-4">
          <span className="font-semibold text-lg">{averageRating.toFixed(1)} / 5</span>
          <span className="text-zinc-500">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
        </div>

        <p className="text-lg whitespace-pre-wrap">{dataset.description}</p>
      </div>

      <div className="mb-8">
        {hasPurchased && !hasReviewed && (
          <div className="mb-8 p-6 border rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
            <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
            <ReviewForm datasetId={id} />
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
  );
}
