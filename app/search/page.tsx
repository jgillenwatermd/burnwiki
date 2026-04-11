"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { searchTopics } from "@/lib/search";
import type { SearchResult } from "@/lib/types";
import EvidenceBadge from "@/components/EvidenceBadge";
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1a1a2e]">Search Results</h1>
      <div className="mt-4">
        <SearchBar />
      </div>

      {query && (
        <p className="mt-4 text-sm text-gray-500">
          {loading
            ? "Searching..."
            : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
        </p>
      )}

      {searchError && (
        <p className="mt-4 text-sm text-red-600">
          Search is temporarily unavailable. Please try again later.
        </p>
      )}

      <div className="mt-6 divide-y divide-gray-100">
        {results.map((result) => (
          <div key={result.canonical_id} className="py-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <Link
                  href={`/topics/${result.category}/${result.canonical_id}`}
                  className="text-base font-medium text-[#0645ad] no-underline hover:underline"
                >
                  {result.title}
                </Link>
                <p className="mt-0.5 text-xs capitalize text-gray-400">
                  {result.category.replace(/-/g, " ")}
                </p>
                {result.summary && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {result.summary.slice(0, 200)}
                  </p>
                )}
              </div>
              {result.evidence_level && (
                <EvidenceBadge level={result.evidence_level} />
              )}
            </div>
          </div>
        ))}
      </div>

      {!loading && query && results.length === 0 && !searchError && (
        <div className="py-12 text-center">
          <p className="text-gray-500">
            No topics found for &ldquo;{query}&rdquo;
          </p>
          <p className="mt-2 text-sm text-gray-400">
            The encyclopedia is growing. Try a different term or browse categories from the{" "}
            <Link href="/" className="text-[#0645ad] hover:underline">
              homepage
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
        <div className="mx-auto max-w-3xl px-4 py-8">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Search Results</h1>
          <p className="mt-4 text-sm text-gray-500">Loading...</p>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
