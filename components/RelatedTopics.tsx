import Link from "next/link";

interface RelatedTopic {
  canonical_id: string;
  title: string;
  category: string;
}

export default function RelatedTopics({ topics }: { topics: RelatedTopic[] }) {
  if (topics.length === 0) return null;

  return (
    <div>
      <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-codex-muted">
        See also
      </div>
      <ul>
        {topics.map((topic, i) => (
          <li
            key={topic.canonical_id}
            className={`py-2.5 ${i === 0 ? "" : "border-t border-codex-rule"}`}
          >
            <Link
              href={`/topics/${topic.category}/${topic.canonical_id}`}
              className="font-serif text-sm font-medium text-codex-ink no-underline hover:text-codex-accent"
            >
              {topic.title}
            </Link>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-codex-muted">
              {topic.category.replace(/-/g, " ")}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
