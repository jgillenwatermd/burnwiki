import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-[#f8f9fa]">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 sm:flex-row">
          <div>
            <Link href="/" className="font-semibold text-[#1a1a2e] no-underline">
              Burn Wiki
            </Link>
            <span className="ml-2">
              A clinical encyclopedia for the burn surgery community
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-[#1a1a2e]">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
