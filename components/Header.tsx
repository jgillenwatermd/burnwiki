"use client";

import Link from "next/link";
import { useState } from "react";
import SearchBar from "./SearchBar";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="text-xl font-bold text-[#1a1a2e]">Burn<span className="text-[#c0392b]">Wiki</span></span>
        </Link>

        {/* Desktop search + nav */}
        <div className="hidden items-center gap-6 md:flex">
          <SearchBar compact />
          <nav className="flex gap-4 text-sm">
            <Link
              href="/"
              className="text-gray-600 hover:text-[#1a1a2e]"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-[#1a1a2e]"
            >
              About
            </Link>
          </nav>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6 text-gray-600"
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 px-4 pb-4 md:hidden">
          <div className="py-3">
            <SearchBar compact />
          </div>
          <nav className="flex flex-col gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-600 hover:text-[#1a1a2e]"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-[#1a1a2e]"
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
