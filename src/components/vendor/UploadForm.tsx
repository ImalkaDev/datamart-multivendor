"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.any().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, {
    message: "Price must be a positive number.",
  }),
  category: z.string().min(1, {
    message: "Category is required.",
  }),
  file: z.any()
    .refine((files) => files?.length === 1, "File is required.")
    .refine((files) => files?.[0]?.size <= 100000000, `Max file size is 100MB.`),
});

export function UploadForm() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
    } as unknown as FormValues,
  });

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsUploading(true);
      const file = values.file[0] as File;

      // 1. Get presigned URL
      const presignedRes = await fetch("/api/datasets/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!presignedRes.ok) {
        throw new Error("Failed to get presigned URL");
      }

      const { url, fileUrl } = await presignedRes.json();

      // 2. Upload to R2 directly
      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file to R2");
      }

      // 3. Save to database
      const saveRes = await fetch("/api/datasets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          price: values.price * 100, // Store in cents
          category: values.category,
          fileUrl,
        }),
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save dataset");
      }

      router.push("/vendor");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to upload dataset. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-lg shadow-sm border">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="E.g. E-Commerce Sales 2023" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your dataset in detail..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (USD)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormDescription>Set to 0 for free.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="E.g. Finance, Healthcare..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormItem>
          <FormLabel>Dataset File</FormLabel>
          <FormControl>
            <Input type="file" {...fileRef} />
          </FormControl>
          <FormDescription>Upload CSV, JSON, or ZIP (Max 100MB)</FormDescription>
          <FormMessage>
            {form.formState.errors.file?.message as string}
          </FormMessage>
        </FormItem>

        <Button type="submit" className="w-full" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Dataset"}
        </Button>
      </form>
    </Form>
  );
}
