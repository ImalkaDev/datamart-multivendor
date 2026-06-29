import { MetadataRoute } from 'next';
import { db } from '@/db';
import { datasets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const approvedDatasets = await db
    .select()
    .from(datasets)
    .where(eq(datasets.status, 'APPROVED'));

  const datasetUrls = approvedDatasets.map((dataset) => ({
    url: `https://datamart.com/dataset/${dataset.id}`,
    lastModified: dataset.updatedAt,
  }));

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
