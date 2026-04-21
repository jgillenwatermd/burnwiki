import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Burn Wiki — an open-access, evidence-anchored clinical reference for burn care.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="font-mono text-[10px] uppercase tracking-wider text-codex-muted">
        About
      </div>
      <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight text-codex-ink">
        About Burn Wiki
      </h1>

      <div className="topic-content mt-8">
        <p>
          Burn Wiki is an open-access clinical reference for burn care. Each
          clinical claim on each page links to its primary PubMed-indexed
          source. Each page clears a multi-gate evidence-anchoring pipeline
          before publication. Three topics are currently live.
        </p>

        <h2>Audience</h2>
        <p>
          Primary: burn and critical-care physicians, surgical trainees, and
          advanced practice providers. Content also serves nursing,
          rehabilitation, pharmacy, social work, and research readers. Open
          access; no account required.
        </p>

        <h2>How content is built</h2>
        <p>
          A large language model drafts each topic from a corpus of primary
          sources. Each page then passes through a multi-gate review pipeline:
          literature search, claim extraction, citation verification, internal
          review, external clinician review, and editor-in-chief sign-off.
          Pages go live only after every gate passes.
        </p>
        <p>
          Each clinical claim on a Burn Wiki page is locked to its specific
          PubMed-indexed source rather than to a page-level bibliography. This
          makes claims individually re-reviewable as literature evolves,
          reusable across topics that cite the same primary work, and
          separately signed off by reviewers.
        </p>

        <h2>Evidence standards</h2>
        <p>
          Each topic carries an evidence-level badge (High, Moderate,
          Low&ndash;Moderate, Low, Expert Consensus) reflecting the strength of
          the underlying literature. Every cited source is a PubMed-indexed
          primary work. Textbook chapters are read for bibliography only
          &mdash; their cited PMIDs enter the corpus, but their body text never
          appears on a Burn Wiki page as authority for a claim.
        </p>

        <h2>Editorial independence</h2>
        <p>
          Burn Wiki has no commercial sponsors, no advertising, and no industry
          funding. Editorial decisions are driven by clinical relevance and
          evidence availability.
        </p>

        <h2>Editorial team</h2>
        <p>
          <strong>Editor in Chief</strong>
          <br />
          Justin Gillenwater, MD, MS, FACS, FABA
        </p>

        <h2>Corrections and feedback</h2>
        <p>
          <a href="mailto:editorial@burnwiki.com">editorial@burnwiki.com</a>
        </p>
      </div>
    </div>
  );
}
