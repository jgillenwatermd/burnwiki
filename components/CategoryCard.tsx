import Link from "next/link";
import type { Category } from "@/lib/types";

interface Props {
  category: Category;
  index?: number;
}

export default function CategoryCard({ category, index }: Props) {
  const count = category.topic_count || 0;
  const isEmpty = count === 0;
  const num = typeof index === "number" ? String(index + 1).padStart(2, "0") : null;

  return (
    <Link
      href={`/topics/${category.id}`}
      className={`block border no-underline transition-colors ${
        isEmpty
          ? "border-codex-rule-light bg-codex-paper hover:border-codex-rule"
          : "border-codex-rule bg-codex-card hover:border-codex-ink"
      }`}
    >
      <div className="p-6">
        <div className="flex items-baseline justify-between">
          {num && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-codex-muted">
              § {num}
            </span>
          )}
          <span className="font-mono text-[10px] text-codex-muted">
            {isEmpty ? "0 published" : `${count} ${count === 1 ? "topic" : "topics"}`}
          </span>
        </div>
        <h3
          className={`mt-2 font-serif text-xl font-medium tracking-tight capitalize ${
            isEmpty ? "text-codex-ink2" : "text-codex-ink"
          }`}
        >
          {category.name}
        </h3>
        {category.description && (
          <p
            className={`mt-1 font-serif text-sm italic ${
              isEmpty ? "text-codex-muted" : "text-codex-ink2"
            }`}
          >
            {category.description.length > 140
              ? category.description.slice(0, 140) + "\u2026"
              : category.description}
          </p>
        )}
      </div>
    </Link>
  );
}
