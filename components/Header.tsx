"use client";

import Link from "next/link";
import { useState } from "react";
import SearchBar from "./SearchBar";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-codex-rule bg-codex-bg">
      <div className="mx-auto flex max-w-5xl items-center gap-5 px-4 py-3">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          <span className="font-serif text-lg font-semibold tracking-tight text-codex-ink">
            Burn<span className="text-codex-accent">·</span>Wiki
          </span>
        </Link>

        <div className="flex-1" />

        {/* Desktop search + nav */}
        <div className="hidden items-center gap-6 md:flex">
          <SearchBar compact />
          <nav className="flex gap-5 text-xs text-codex-ink2">
            <Link href="/" className="pb-0.5 hover:text-codex-ink">
              Index
            </Link>
            <Link href="/about" className="pb-0.5 hover:text-codex-ink">
              About
            </Link>
          </nav>
        </div>

        {/* Mobile hamburger */}
        <button
          className="p-2 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6 text-codex-ink2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-codex-rule-light px-4 pb-4 md:hidden">
          <div className="py-3">
            <SearchBar />
          </div>
          <nav className="flex flex-col gap-2 text-sm text-codex-ink2">
            <Link
              href="/"
              className="hover:text-codex-ink"
              onClick={() => setMenuOpen(false)}
            >
              Index
            </Link>
            <Link
              href="/about"
              className="hover:text-codex-ink"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
