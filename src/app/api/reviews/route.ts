import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { purchases, reviews } from "@/db/schema";
import { auth } from "@/auth";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { datasetId, rating, comment } = body;

    if (!datasetId || !rating || !comment) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const userId = session.user.id;

    // Check if the user has purchased the dataset
    const purchase = await db.query.purchases.findFirst({
      where: and(eq(purchases.datasetId, datasetId), eq(purchases.userId, userId))
    });

    if (!purchase) {
      return NextResponse.json({ error: "You must purchase this dataset to review it." }, { status: 403 });
    }

    // Check if the user already reviewed it
    const existingReview = await db.query.reviews.findFirst({
      where: and(eq(reviews.datasetId, datasetId), eq(reviews.userId, userId))
    });

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this dataset." }, { status: 409 });
    }

    // Insert the review
    const [newReview] = await db.insert(reviews).values({
      userId,
      datasetId,
      rating,
      comment,
    }).returning();

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Failed to post review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
