import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-codex-rule bg-codex-paper">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-codex-ink3 sm:flex-row">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-serif text-base font-semibold text-codex-ink no-underline"
            >
              Burn<span className="text-codex-accent">·</span>Wiki
            </Link>
            <span className="font-serif italic text-codex-ink3">
              A clinical encyclopedia for anyone in burn care
            </span>
          </div>
          <div className="flex gap-4 font-mono text-xs uppercase tracking-wide">
            <Link href="/about" className="hover:text-codex-ink">
              About
            </Link>
          </div>
        </div>
        <div className="mt-3 border-t border-codex-rule-light pt-3 text-center font-mono text-[10px] uppercase tracking-wider text-codex-muted">
          LLM-drafted, physician-supervised. Every claim PMID-linked.{" "}
          <Link href="/about" className="text-codex-accent hover:underline">
            How Burn Wiki is built
          </Link>
          .
        </div>
      </div>
    </footer>
  );
}
