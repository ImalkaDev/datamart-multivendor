import { UploadForm } from "@/components/vendor/UploadForm";

export default function UploadDatasetPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Upload Dataset</h2>
        <p className="text-gray-500 mt-2">
          Upload a new dataset to be listed on the marketplace. All uploads are subject to review.
        </p>
      </div>
      <UploadForm />
    </div>
  );
}
