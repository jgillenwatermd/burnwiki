import Link from "next/link";
import { getAllCategories } from "@/lib/content";
import CategoryCard from "@/components/CategoryCard";

export const revalidate = 3600;

export default async function HomePage() {
  const categories = await getAllCategories();
  const publishedCount = categories.reduce(
    (sum, c) => sum + (c.topic_count || 0),
    0
  );
  const sortedCategories = [...categories].sort((a, b) => {
    const aEmpty = (a.topic_count || 0) === 0 ? 1 : 0;
    const bEmpty = (b.topic_count || 0) === 0 ? 1 : 0;
    if (aEmpty !== bEmpty) return aEmpty - bEmpty;
    return (a.sort_order ?? 999) - (b.sort_order ?? 999);
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="sr-only">Burn Wiki</h1>
      <p className="mb-10 max-w-2xl font-serif text-lg leading-relaxed text-codex-ink2">
        Burn Wiki is an open-access clinical reference for burn care.{" "}
        {publishedCount === 0
          ? "No topics are currently published."
          : `${publishedCount} topic${publishedCount === 1 ? "" : "s"} ${
              publishedCount === 1 ? "is" : "are"
            } currently published.`}{" "}
        See{" "}
        <Link
          href="/about"
          className="text-codex-accent underline decoration-codex-rule underline-offset-2 hover:decoration-codex-accent"
        >
          About
        </Link>{" "}
        for how content is built.
      </p>

      <div className="grid grid-cols-2 gap-px bg-codex-rule lg:grid-cols-3">
        {sortedCategories.map((category, i) => (
          <CategoryCard key={category.id} category={category} index={i} />
        ))}
      </div>
    </div>
  );
}
