import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-codex-rule bg-codex-paper">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex items-center justify-between gap-4 text-sm text-codex-ink3">
          <Link
            href="/"
            className="font-serif text-base font-semibold text-codex-ink no-underline"
          >
            Burn<span className="text-codex-accent">·</span>Wiki
          </Link>
          <div className="flex items-center gap-5 font-mono text-xs uppercase tracking-wide">
            <Link href="/about" className="hover:text-codex-ink">
              About
            </Link>
            <a
              href="mailto:editorial@burnwiki.com"
              className="hover:text-codex-ink"
            >
              Contact
            </a>
          </div>
        </div>
        <div className="mt-3 border-t border-codex-rule-light pt-3 text-center font-mono text-[10px] uppercase tracking-wider text-codex-muted">
          LLM-drafted, physician-reviewed.{" "}
          <Link href="/about" className="text-codex-accent hover:underline">
            Read about the editorial process
          </Link>
          .
        </div>
      </div>
    </footer>
  );
}
