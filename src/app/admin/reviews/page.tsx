import { db } from "@/db";
import { reviews, users, datasets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { deleteReview } from "./actions";

export default async function AdminReviewsPage() {
  const allReviews = await db.query.reviews.findMany();

  const reviewsWithDetails = await Promise.all(
    allReviews.map(async (review) => {
      const user = await db.query.users.findFirst({
        where: eq(users.id, review.userId),
      });
      const dataset = await db.query.datasets.findFirst({
        where: eq(datasets.id, review.datasetId),
      });

      return {
        ...review,
        user,
        dataset,
      };
    })
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Reviews</h1>

      {reviewsWithDetails.length === 0 ? (
        <p className="text-zinc-500">No reviews found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b dark:border-zinc-800">
                <th className="py-3 font-medium">Dataset</th>
                <th className="py-3 font-medium">User</th>
                <th className="py-3 font-medium">Rating</th>
                <th className="py-3 font-medium">Comment</th>
                <th className="py-3 font-medium">Date</th>
                <th className="py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewsWithDetails.map((review) => (
                <tr key={review.id} className="border-b dark:border-zinc-800">
                  <td className="py-4 align-top">{review.dataset?.title || "Unknown"}</td>
                  <td className="py-4 align-top">{review.user?.name || review.user?.email || "Unknown"}</td>
                  <td className="py-4 align-top">{review.rating} / 5</td>
                  <td className="py-4 align-top max-w-xs truncate" title={review.comment}>
                    {review.comment}
                  </td>
                  <td className="py-4 align-top">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 align-top text-right">
                    <form action={async () => {
                      "use server";
                      await deleteReview(review.id);
                    }}>
                      <Button variant="destructive" size="sm" type="submit">
                        Delete
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
