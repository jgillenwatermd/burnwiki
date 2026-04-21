"use client";

import { useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (headings.length === 0) return null;

  const content = (
    <ul className="space-y-1.5 text-sm">
      {headings.map((h) => (
        <li
          key={h.id}
          className={
            h.level === 3
              ? "border-l border-codex-rule pl-4 ml-2"
              : "border-l border-codex-rule pl-3"
          }
        >
          <a
            href={`#${h.id}`}
            className="block py-0.5 font-serif text-codex-ink2 no-underline hover:text-codex-accent"
            onClick={() => setIsOpen(false)}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile: collapsible */}
      <div className="mb-6 border border-codex-rule bg-codex-card p-4 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-wider text-codex-muted"
        >
          On this page
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {isOpen && <div className="mt-3">{content}</div>}
      </div>

      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-6">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-codex-muted">
            On this page
          </div>
          {content}
        </div>
      </aside>
    </>
  );
}
