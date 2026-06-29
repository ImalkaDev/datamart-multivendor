"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ReviewForm({ datasetId }: { datasetId: string }) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          datasetId,
          rating,
          comment,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex flex-col gap-2">
        <label htmlFor="rating" className="text-sm font-medium">Rating</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-2 rounded-md bg-transparent"
        >
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Good</option>
          <option value={3}>3 - Average</option>
          <option value={2}>2 - Poor</option>
          <option value={1}>1 - Terrible</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="comment" className="text-sm font-medium">Comment</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          className="border p-2 rounded-md bg-transparent"
          placeholder="Share your experience with this dataset..."
        />
      </div>

      <Button type="submit" disabled={loading} className="w-fit">
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
