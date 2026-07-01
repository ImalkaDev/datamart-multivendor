import { formatDistanceToNow } from "date-fns";

type ReviewWithUser = {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    name: string | null;
  } | undefined;
};

export default function ReviewList({ reviews }: { reviews: ReviewWithUser[] }) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-zinc-500 italic">No reviews yet.</p>;
  }

  // Sort by newest first
  const sortedReviews = [...reviews].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-col gap-6">
      {sortedReviews.map((review) => (
        <div key={review.id} className="border-b pb-6 last:border-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold">{review.user?.name || "Anonymous"}</span>
            <span className="text-zinc-500 text-sm">
              • {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </span>
          </div>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${
                  star <= review.rating ? "text-yellow-400" : "text-zinc-300 dark:text-zinc-700"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
