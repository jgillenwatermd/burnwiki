import type { MetadataRoute } from "next";
import { getAllTopics, getAllCategorySlugs } from "@/lib/content";

const SITE_URL = "https://burnwiki.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [topics, categorySlugs] = await Promise.all([
    getAllTopics(),
    getAllCategorySlugs(),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const categoryEntries: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${SITE_URL}/topics/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const topicEntries: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${SITE_URL}/topics/${topic.category}/${topic.canonical_id}`,
    lastModified: topic.updated_at ? new Date(topic.updated_at) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...categoryEntries, ...topicEntries];
}
