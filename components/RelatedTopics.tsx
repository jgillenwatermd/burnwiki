import Link from "next/link";

interface RelatedTopic {
  canonical_id: string;
  title: string;
  category: string;
}

export default function RelatedTopics({ topics }: { topics: RelatedTopic[] }) {
  if (topics.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-[#f8f9fa] p-4">
      <h3 className="mb-3 text-sm font-semibold text-[#1a1a2e]">
        Related Topics
      </h3>
      <ul className="space-y-2">
        {topics.map((topic) => (
          <li key={topic.canonical_id}>
            <Link
              href={`/topics/${topic.category}/${topic.canonical_id}`}
              className="text-sm text-[#0645ad] no-underline hover:underline"
            >
              {topic.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
