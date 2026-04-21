import { getAllCategories } from "@/lib/content";
import CategoryCard from "@/components/CategoryCard";
import EvBadge from "@/components/EvBadge";
import type { EvidenceLevel } from "@/lib/evidence";

export const revalidate = 3600;

const EVIDENCE_LEGEND: EvidenceLevel[] = [
  "High",
  "Moderate",
  "Low–Moderate",
  "Low",
  "Expert Consensus",
];

export default async function HomePage() {
  const categories = await getAllCategories();
  const publishedCount = categories.reduce(
    (sum, c) => sum + (c.topic_count || 0),
    0
  );
  const sortedCategories = [...categories].sort((a, b) => {
    const aEmpty = (a.topic_count || 0) === 0 ? 1 : 0;
    const bEmpty = (b.topic_count || 0) === 0 ? 1 : 0;
    if (aEmpty !== bEmpty) return aEmpty - bEmpty;
    return (a.sort_order ?? 999) - (b.sort_order ?? 999);
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Hero */}
      <div className="mb-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-codex-muted">
          The first illustrated evidence-anchored burn-care reference
        </div>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl font-medium leading-[1.03] tracking-[-0.025em] text-codex-ink">
          Evidence-anchored burn care,
          <br />
          <span className="italic text-codex-ink2">
            written by the people doing it.
          </span>
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-codex-ink2">
          {publishedCount} topic{publishedCount === 1 ? "" : "s"} published.
          New topics released as they clear full evidence review. Every claim
          PMID-linked; every page physician-supervised.
        </p>

        {/* Evidence legend — teaches the palette inline */}
        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-codex-rule pt-5 font-mono text-[10px] tracking-wider text-codex-muted">
          <span className="uppercase">Evidence</span>
          {EVIDENCE_LEGEND.map((L) => (
            <span key={L} className="inline-flex items-center gap-1.5">
              <EvBadge level={L} mode="dot" />
              <span className="uppercase text-codex-ink3">{L}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Category grid — editorial numbered */}
      <div className="grid grid-cols-[1px] gap-px bg-codex-rule sm:grid-cols-2 lg:grid-cols-3">
        {sortedCategories.map((category, i) => (
          <CategoryCard key={category.id} category={category} index={i} />
        ))}
      </div>
    </div>
  );
}
