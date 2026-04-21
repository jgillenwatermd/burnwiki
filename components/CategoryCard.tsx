import Link from "next/link";
import type { Category } from "@/lib/types";

export default function CategoryCard({ category }: { category: Category }) {
  const count = category.topic_count || 0;
  const isEmpty = count === 0;
  return (
    <Link
      href={`/topics/${category.id}`}
      className={`block rounded-lg border p-5 no-underline transition-colors ${
        isEmpty
          ? "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-[#f8f9fa]"
      }`}
    >
      <h3
        className={`text-base font-semibold capitalize ${
          isEmpty ? "text-gray-500" : "text-[#1a1a2e]"
        }`}
      >
        {category.name}
      </h3>
      {category.description && (
        <p className={`mt-1 text-sm ${isEmpty ? "text-gray-400" : "text-gray-500"}`}>
          {category.description}
        </p>
      )}
      <p className={`mt-2 text-xs ${isEmpty ? "italic text-gray-400" : "text-gray-400"}`}>
        {isEmpty
          ? "0 topics published \u2014 in editorial review"
          : `${count} topic${count !== 1 ? "s" : ""}`}
      </p>
    </Link>
  );
}
