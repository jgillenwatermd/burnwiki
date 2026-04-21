import { getAllCategories } from "@/lib/content";
import CategoryCard from "@/components/CategoryCard";
import SearchBar from "@/components/SearchBar";

export const revalidate = 3600;

export default async function HomePage() {
  const categories = await getAllCategories();
  const publishedCount = categories.reduce(
    (sum, c) => sum + (c.topic_count || 0),
    0
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-[#1a1a2e]">Burn Wiki</h1>
        <p className="mt-3 text-lg text-gray-600">
          A clinical encyclopedia for anyone in burn care
        </p>
        <div className="mt-6">
          <SearchBar />
        </div>
        <p className="mt-4 text-sm text-gray-400">
          Currently {publishedCount} topic{publishedCount === 1 ? "" : "s"} live.
          New topics published as they clear full evidence review.
        </p>
      </div>

      {/* Category grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
