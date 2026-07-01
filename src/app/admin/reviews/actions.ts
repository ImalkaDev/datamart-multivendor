"use server";

import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteReview(reviewId: string) {
  const session = await auth();

  if (!session || session.user?.role !== "Admin") {
    throw new Error("Unauthorized");
  }

  await db.delete(reviews).where(eq(reviews.id, reviewId));
  revalidatePath("/admin/reviews");
  // Also revalidate dataset pages where the review might appear
  // revalidatePath("/dataset/[id]", "page");
}
