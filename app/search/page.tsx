"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { searchTopics } from "@/lib/search";
import type { SearchResult } from "@/lib/types";
import EvBadge from "@/components/EvBadge";
import SearchBar from "@/components/SearchBar";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchTopics(query).then(({ results: data, error }) => {
      setResults(data);
      setSearchError(error);
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="font-mono text-[10px] uppercase tracking-wider text-codex-muted">
        Search
      </div>
      <h1 className="mt-2 font-serif text-3xl font-medium text-codex-ink">
        Search results
      </h1>
      <div className="mt-5">
        <SearchBar />
      </div>

      {query && (
        <p className="mt-5 font-mono text-xs uppercase tracking-wider text-codex-muted">
          {loading
            ? "Searching\u2026"
            : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
        </p>
      )}

      {searchError && (
        <p className="mt-4 font-mono text-xs text-codex-accent">
          Search is temporarily unavailable. Please try again later.
        </p>
      )}

      <div className="mt-6">
        {results.map((result, i) => (
          <div
            key={result.canonical_id}
            className={`py-4 ${i === 0 ? "" : "border-t border-codex-rule"}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <Link
                  href={`/topics/${result.category}/${result.canonical_id}`}
                  className="font-serif text-base font-medium text-codex-ink no-underline hover:text-codex-accent"
                >
                  {result.title}
                </Link>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-codex-muted">
                  {result.category.replace(/-/g, " ")}
                </p>
                {result.summary && (
                  <p className="mt-1 line-clamp-2 font-serif text-sm leading-relaxed text-codex-ink2">
                    {result.summary.slice(0, 220)}
                  </p>
                )}
              </div>
              {result.evidence_level && (
                <EvBadge level={result.evidence_level} />
              )}
            </div>
          </div>
        ))}
      </div>

      {!loading && query && results.length === 0 && !searchError && (
        <div className="py-12 text-center">
          <p className="font-serif text-codex-ink2">
            No topics found for &ldquo;{query}&rdquo;
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-wider text-codex-muted">
            The encyclopedia is growing. Try a different term or{" "}
            <Link href="/" className="text-codex-accent hover:underline">
              browse the index
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-6 py-10">
          <h1 className="font-serif text-3xl font-medium text-codex-ink">
            Search results
          </h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-codex-muted">
            {"Loading\u2026"}
          </p>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
