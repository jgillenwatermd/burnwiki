"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { searchTopics } from "@/lib/search";
import type { SearchResult } from "@/lib/types";
import EvBadge from "./EvBadge";

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
      const settled = query.trim();
      const { results: data } = await searchTopics(settled);
      setResults(data);
      setIsOpen(data.length > 0);
      setLoading(false);
      if (settled.length >= 2 && settled.length <= 200) {
        fetch("/api/search/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: settled,
            result_count: data.length,
            referrer:
              typeof document !== "undefined"
                ? document.referrer || undefined
                : undefined,
          }),
          keepalive: true,
        }).catch(() => {});
      }
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
    <div ref={ref} className={`relative ${compact ? "w-72" : "mx-auto w-full max-w-xl"}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-[3px] border border-codex-rule bg-codex-card px-3 py-1.5 focus-within:border-codex-ink">
          <svg
            className="h-3.5 w-3.5 shrink-0 text-codex-muted"
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="7" cy="7" r="5" />
            <path strokeLinecap="round" d="M11 11l3.5 3.5" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder={"Search topics\u2026"}
            className={`min-w-0 flex-1 bg-transparent font-serif italic text-codex-ink placeholder:text-codex-muted focus:outline-none ${
              compact ? "text-xs" : "text-base"
            }`}
          />
          <span className="hidden shrink-0 rounded-[2px] border border-codex-rule px-1.5 py-px font-mono text-[10px] text-codex-muted sm:inline">
            {"\u2318K"}
          </span>
        </div>
      </form>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto border border-codex-rule bg-codex-card shadow-[0_18px_40px_-12px_rgba(40,25,15,0.25)]">
          {loading ? (
            <div className="px-4 py-3 font-mono text-xs text-codex-muted">
              {"Searching\u2026"}
            </div>
          ) : (
            <>
              {results.slice(0, 8).map((result) => (
                <button
                  key={result.canonical_id}
                  className="flex w-full flex-col gap-1 border-b border-codex-rule-light px-4 py-3 text-left hover:bg-codex-paper"
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                    router.push(`/topics/${result.category}/${result.canonical_id}`);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-medium text-codex-ink">
                      {result.title}
                    </span>
                    {result.evidence_level && (
                      <EvBadge level={result.evidence_level} mode="dot" />
                    )}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-codex-muted">
                    {result.category.replace(/-/g, " ")}
                  </span>
                  {result.summary && (
                    <span className="line-clamp-1 font-serif text-xs text-codex-ink3">
                      {result.summary.slice(0, 180)}
                    </span>
                  )}
                </button>
              ))}
              {results.length > 8 && (
                <button
                  className="w-full px-4 py-2 text-center font-mono text-xs uppercase tracking-wide text-codex-accent hover:bg-codex-paper"
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                  }}
                >
                  {`See all ${results.length} results \u2192`}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
