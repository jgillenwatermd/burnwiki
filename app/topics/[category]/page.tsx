import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategory, getTopicsByCategory, getAllCategorySlugs } from "@/lib/content";
import EvBadge from "@/components/EvBadge";
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

  const topLevel = allTopics.filter(
    (t) => !t.parent_topic || !publishedById.has(t.parent_topic)
  );
  topLevel.sort((a, b) => {
    const ad = a.last_updated || "";
    const bd = b.last_updated || "";
    return bd.localeCompare(ad);
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {/* Breadcrumb */}
      <nav className="font-mono text-[10px] uppercase tracking-wider text-codex-muted">
        <Link href="/" className="hover:text-codex-ink">
          Index
        </Link>
        <span className="mx-2">›</span>
        <span className="text-codex-ink2">{category.name}</span>
      </nav>

      <h1 className="mt-4 font-serif text-4xl font-medium capitalize leading-tight tracking-tight text-codex-ink">
        {category.name}
      </h1>
      {category.description && (
        <p className="mt-3 font-serif text-base italic leading-relaxed text-codex-ink2">
          {category.description}
        </p>
      )}

      {topLevel.length === 0 && (
        <p className="mt-16 text-center font-mono text-xs uppercase tracking-wider text-codex-muted">
          Topics for this category are in editorial review.
        </p>
      )}

      <div className="mt-10 space-y-10">
        {topLevel.map((parent) => (
          <section key={parent.canonical_id}>
            <div className="border-b border-codex-rule pb-3">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <Link
                    href={`/topics/${categoryId}/${parent.canonical_id}`}
                    className="font-serif text-xl font-medium text-codex-ink no-underline hover:text-codex-accent"
                  >
                    {parent.title}
                  </Link>
                  {parent.summary && (
                    <p className="mt-1 font-serif text-sm leading-relaxed text-codex-ink2">
                      {parent.summary.length > 280
                        ? parent.summary.slice(0, 280) + "\u2026"
                        : parent.summary}
                    </p>
                  )}
                </div>
                {parent.evidence_level && (
                  <EvBadge level={parent.evidence_level} />
                )}
              </div>
            </div>

            {parent.subtopics && parent.subtopics.length > 0 && (
              <ul className="mt-4 ml-1 space-y-3 border-l border-codex-rule pl-5">
                {parent.subtopics.map((subId) => {
                  const sub = publishedById.get(subId);
                  if (sub) {
                    return (
                      <li key={subId} className="flex items-start gap-3">
                        <EvBadge level={sub.evidence_level} mode="dot" />
                        <div className="flex-1">
                          <Link
                            href={`/topics/${categoryId}/${sub.canonical_id}`}
                            className="font-serif text-sm font-medium text-codex-ink no-underline hover:text-codex-accent"
                          >
                            {sub.title}
                          </Link>
                          {sub.summary && (
                            <p className="mt-0.5 line-clamp-2 font-serif text-xs leading-relaxed text-codex-ink3">
                              {sub.summary.slice(0, 200)}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  }
                  return (
                    <li key={subId} className="flex items-start gap-3">
                      <span className="mt-1.5 block h-1.5 w-1.5 rounded-full border border-codex-rule" />
                      <div className="flex-1">
                        <span className="font-serif text-sm italic text-codex-muted">
                          {formatSlugAsTitle(subId)}
                        </span>
                        <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-codex-muted">
                          in editorial review
                        </span>
                      </div>
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
