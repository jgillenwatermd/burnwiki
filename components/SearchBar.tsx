"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { searchTopics } from "@/lib/search";
import type { SearchResult } from "@/lib/types";
import EvidenceBadge from "./EvidenceBadge";

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const { results: data } = await searchTopics(query);
      setResults(data);
      setIsOpen(data.length > 0);
      setLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div ref={ref} className={`relative ${compact ? "w-64" : "w-full max-w-xl mx-auto"}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="Search burn topics..."
            className={`w-full rounded-lg border border-gray-300 bg-white px-4 pr-10 text-gray-900 placeholder-gray-400 focus:border-[#0645ad] focus:outline-none focus:ring-1 focus:ring-[#0645ad] ${
              compact ? "py-1.5 text-sm" : "py-3 text-base"
            }`}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Search"
          >
            <svg className={compact ? "h-4 w-4" : "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Dropdown results */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {loading ? (
            <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
          ) : (
            <>
              {results.slice(0, 8).map((result) => (
                <button
                  key={result.canonical_id}
                  className="flex w-full flex-col gap-1 border-b border-gray-50 px-4 py-3 text-left hover:bg-[#f8f9fa]"
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                    router.push(`/topics/${result.category}/${result.canonical_id}`);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#0645ad]">
                      {result.title}
                    </span>
                    {result.evidence_level && (
                      <EvidenceBadge level={result.evidence_level} small />
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {result.category.replace(/-/g, " ")}
                  </span>
                  {result.summary && (
                    <span className="line-clamp-1 text-xs text-gray-400">
                      {result.summary.slice(0, 150)}
                    </span>
                  )}
                </button>
              ))}
              {results.length > 8 && (
                <button
                  className="w-full px-4 py-2 text-center text-sm text-[#0645ad] hover:bg-[#f8f9fa]"
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                  }}
                >
                  See all {results.length} results
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
