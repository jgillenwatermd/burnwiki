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
    <ul className="space-y-1 text-sm">
      {headings.map((h) => (
        <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
          <a
            href={`#${h.id}`}
            className="block py-0.5 text-[#0645ad] no-underline hover:text-[#1a1a2e] hover:underline"
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
      <div className="mb-6 rounded-lg border border-gray-200 bg-[#f8f9fa] p-4 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between text-sm font-semibold text-[#1a1a2e]"
        >
          Contents
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && <div className="mt-3">{content}</div>}
      </div>

      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-6">
          <div className="rounded-lg border border-gray-200 bg-[#f8f9fa] p-4">
            <h2 className="mb-3 text-sm font-semibold text-[#1a1a2e]">Contents</h2>
            {content}
          </div>
        </div>
      </aside>
    </>
  );
}
