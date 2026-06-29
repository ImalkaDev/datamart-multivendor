"use server";

import { db } from "@/db";
import { datasets, settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function approveDataset(id: string) {
  const session = await auth();
  if (session?.user?.role !== "Admin") {
    throw new Error("Unauthorized");
  }

  await db
    .update(datasets)
    .set({ status: "APPROVED" })
    .where(eq(datasets.id, id));

  revalidatePath("/admin/moderation");
  revalidatePath("/admin");
}

export async function rejectDataset(id: string) {
  const session = await auth();
  if (session?.user?.role !== "Admin") {
    throw new Error("Unauthorized");
  }

  await db
    .update(datasets)
    .set({ status: "REJECTED" })
    .where(eq(datasets.id, id));

  revalidatePath("/admin/moderation");
  revalidatePath("/admin");
}

export async function updateSeoSettings(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "Admin") {
    throw new Error("Unauthorized");
  }

  const metaTitle = formData.get("metaTitle") as string;
  const metaDescription = formData.get("metaDescription") as string;

  if (metaTitle !== null) {
    await db
      .insert(settings)
      .values({ key: "meta_title", value: metaTitle })
      .onConflictDoUpdate({ target: settings.key, set: { value: metaTitle } });
  }

  if (metaDescription !== null) {
    await db
      .insert(settings)
      .values({ key: "meta_description", value: metaDescription })
      .onConflictDoUpdate({ target: settings.key, set: { value: metaDescription } });
  }

  revalidatePath("/admin/seo");
}
