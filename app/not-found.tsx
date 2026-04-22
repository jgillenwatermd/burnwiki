import Link from "next/link";
import { getAllTopics } from "@/lib/content";
import SearchBar from "@/components/SearchBar";
import type { Topic } from "@/lib/types";

export const revalidate = 3600;

export const metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist on Burn Wiki.",
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  let topics: Topic[] = [];
  try {
    topics = await getAllTopics();
  } catch {
    topics = [];
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="font-mono text-[10px] uppercase tracking-wider text-codex-muted">
        404
      </div>
      <h1 className="mt-2 font-serif text-3xl font-medium text-codex-ink">
        Page not found
      </h1>
      <p className="mt-4 font-serif text-codex-ink2">
        The page you&rsquo;re looking for doesn&rsquo;t exist on Burn Wiki.
        Try searching, or jump to a published topic below.
      </p>

      <div className="mt-6">
        <SearchBar />
      </div>

      {topics.length > 0 && (
        <div className="mt-10">
          <div className="font-mono text-[10px] uppercase tracking-wider text-codex-muted">
            {`Published topics (${topics.length})`}
          </div>
          <ul className="mt-3 space-y-3">
            {topics.map((t) => (
              <li key={t.canonical_id}>
                <Link
                  href={`/topics/${t.category}/${t.canonical_id}`}
                  className="font-serif text-base font-medium text-codex-ink no-underline hover:text-codex-accent"
                >
                  {t.title}
                </Link>
                {t.summary && (
                  <p className="mt-0.5 line-clamp-2 font-serif text-sm text-codex-ink3">
                    {t.summary.slice(0, 200)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 border-t border-codex-rule pt-6">
        <div className="font-mono text-[10px] uppercase tracking-wider text-codex-muted">
          Not finding what you need?
        </div>
        <p className="mt-2 font-serif text-sm text-codex-ink2">
          Email{" "}
          <a
            href="mailto:editorial@burnwiki.com"
            className="text-codex-accent hover:underline"
          >
            editorial@burnwiki.com
          </a>{" "}
          to request a topic or report a broken link.
        </p>
      </div>
    </div>
  );
}
