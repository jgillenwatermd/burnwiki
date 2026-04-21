import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategory, getTopicsByCategory, getAllCategorySlugs } from "@/lib/content";
import EvidenceBadge from "@/components/EvidenceBadge";
import type { Metadata } from "next";
import type { Topic } from "@/lib/types";

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

function formatSlugAsTitle(slug: string): string {
  if (!slug) return "";
  const words = slug.split("-").join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export default async function CategoryPage({ params }: Props) {
  const { category: categoryId } = await params;
  const category = await getCategory(categoryId);
  if (!category) notFound();

  const allTopics = await getTopicsByCategory(categoryId);

  const publishedById = new Map<string, Topic>();
  for (const t of allTopics) publishedById.set(t.canonical_id, t);

  // Top-level: no parent, OR parent isn't published in this category (orphan)
  const topLevel = allTopics.filter(
    (t) => !t.parent_topic || !publishedById.has(t.parent_topic)
  );
  // Newest top-level topics first (so freshly-published parents bubble up)
  topLevel.sort((a, b) => {
    const ad = a.last_updated || "";
    const bd = b.last_updated || "";
    return bd.localeCompare(ad);
  });

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

      {topLevel.length === 0 && (
        <p className="mt-12 text-center text-gray-400">
          Topics for this category are in editorial review.
        </p>
      )}

      <div className="mt-8 space-y-10">
        {topLevel.map((parent) => (
          <section key={parent.canonical_id}>
            <div className="border-b border-gray-200 pb-3">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <Link
                    href={`/topics/${categoryId}/${parent.canonical_id}`}
                    className="text-lg font-semibold text-[#0645ad] no-underline hover:underline"
                  >
                    {parent.title}
                  </Link>
                  {parent.summary && (
                    <p className="mt-1 text-sm text-gray-600">
                      {parent.summary.length > 280
                        ? parent.summary.slice(0, 280) + "\u2026"
                        : parent.summary}
                    </p>
                  )}
                </div>
                {parent.evidence_level && (
                  <EvidenceBadge level={parent.evidence_level} />
                )}
              </div>
            </div>

            {parent.subtopics && parent.subtopics.length > 0 && (
              <ul className="mt-4 ml-2 space-y-3 border-l-2 border-gray-100 pl-4">
                {parent.subtopics.map((subId) => {
                  const sub = publishedById.get(subId);
                  if (sub) {
                    return (
                      <li
                        key={subId}
                        className="flex items-start gap-3"
                      >
                        <div className="flex-1">
                          <Link
                            href={`/topics/${categoryId}/${sub.canonical_id}`}
                            className="text-sm font-medium text-[#0645ad] no-underline hover:underline"
                          >
                            {sub.title}
                          </Link>
                          {sub.summary && (
                            <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                              {sub.summary.slice(0, 180)}
                            </p>
                          )}
                        </div>
                        {sub.evidence_level && (
                          <EvidenceBadge level={sub.evidence_level} />
                        )}
                      </li>
                    );
                  }
                  return (
                    <li key={subId} className="text-sm">
                      <span className="italic text-gray-500">
                        {formatSlugAsTitle(subId)}
                      </span>
                      <span className="ml-2 text-xs text-gray-400">
                        (in editorial review)
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
