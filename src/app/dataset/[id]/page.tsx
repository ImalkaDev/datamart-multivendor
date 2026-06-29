import { Metadata } from 'next';
import { db } from '@/db';
import { datasets } from '@/db/schema';
import { eq } from 'drizzle-orm';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  const resolvedParams = await props.params;
  const id = resolvedParams.id;

  const [dataset] = await db
    .select()
    .from(datasets)
    .where(eq(datasets.id, id))
    .limit(1);

  if (!dataset) {
    return {
      title: 'Dataset Not Found',
    };
  }

  return {
    title: dataset.title,
    description: dataset.description || undefined,
    openGraph: {
      title: dataset.title,
      description: dataset.description || undefined,
      url: `https://datamart.com/dataset/${id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dataset.title,
      description: dataset.description || undefined,
    },
  };
}

export default async function DatasetPage(props: Props) {
  const resolvedParams = await props.params;
  const id = resolvedParams.id;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Dataset: {id}</h1>
      <p className="mt-4">Content for dataset {id} goes here.</p>
    </div>
  );
}
