import Link from "next/link";
import type { Category } from "@/lib/types";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/topics/${category.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 no-underline transition-colors hover:border-gray-300 hover:bg-[#f8f9fa]"
    >
      <h3 className="text-base font-semibold capitalize text-[#1a1a2e]">
        {category.name}
      </h3>
      {category.description && (
        <p className="mt-1 text-sm text-gray-500">{category.description}</p>
      )}
      <p className="mt-2 text-xs text-gray-400">
        {category.topic_count || 0} topic{(category.topic_count || 0) !== 1 ? "s" : ""}
      </p>
    </Link>
  );
}
