import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategory, getTopicsByCategory, getAllCategorySlugs } from "@/lib/content";
import EvidenceBadge from "@/components/EvidenceBadge";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((category) => ({ category }));
}

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categoryId } = await params;
  const category = await getCategory(categoryId);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description || `Browse ${category.name} topics on Burn Wiki.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: categoryId } = await params;
  const category = await getCategory(categoryId);
  if (!category) notFound();

  const topics = await getTopicsByCategory(categoryId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/" className="text-[#0645ad] hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="capitalize">{category.name}</span>
      </nav>

      <h1 className="text-2xl font-bold text-[#1a1a2e]">{category.name}</h1>
      {category.description && (
        <p className="mt-2 text-gray-600">{category.description}</p>
      )}

      <div className="mt-8 divide-y divide-gray-100">
        {topics.map((topic) => (
          <div key={topic.canonical_id} className="py-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <Link
                  href={`/topics/${categoryId}/${topic.canonical_id}`}
                  className="text-base font-medium text-[#0645ad] no-underline hover:underline"
                >
                  {topic.title}
                </Link>
                {topic.summary && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {topic.summary.slice(0, 200)}
                  </p>
                )}
              </div>
              {topic.evidence_level && (
                <EvidenceBadge level={topic.evidence_level} />
              )}
            </div>
          </div>
        ))}
        {topics.length === 0 && (
          <p className="py-8 text-center text-gray-400">
            Topics for this category are in editorial review.
          </p>
        )}
      </div>
    </div>
  );
}
