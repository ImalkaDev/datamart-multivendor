import { MetadataRoute } from 'next';
import { db } from '@/db';
import { datasets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let datasetUrls: { url: string; lastModified: Date }[] = [];

  try {
    const approvedDatasets = await db
      .select()
      .from(datasets)
      .where(eq(datasets.status, 'APPROVED'));

    datasetUrls = approvedDatasets.map((dataset) => ({
      url: `https://datamart.com/dataset/${dataset.id}`,
      lastModified: dataset.updatedAt,
    }));
  } catch (error) {
    console.warn('Failed to fetch datasets for sitemap during build:', error);
  }

  return [
    {
      url: 'https://datamart.com',
      lastModified: new Date(),
    },
    {
      url: 'https://datamart.com/explore',
      lastModified: new Date(),
    },
    ...datasetUrls,
  ];
}
