import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { datasets } from "@/db/schema";
import * as z from "zod";

const datasetSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(0),
  category: z.string().min(1),
  fileUrl: z.string().url(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== "Vendor" && session.user.role !== "Admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = datasetSchema.parse(body);

    const vendorId = session?.user?.id;

    if (!vendorId) {
       return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    const [newDataset] = await db.insert(datasets).values({
      title: validatedData.title,
      description: validatedData.description,
      price: validatedData.price,
      category: validatedData.category,
      fileUrl: validatedData.fileUrl,
      vendorId: vendorId,
      status: "PENDING",
    }).returning();

    return NextResponse.json(newDataset, { status: 201 });
  } catch (error) {
    console.error("Error creating dataset:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create dataset" },
      { status: 500 }
    );
  }
}
