import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Burn Wiki — a clinical encyclopedia for the burn care community.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1a1a2e]">About Burn Wiki</h1>

      <div className="topic-content mt-8 space-y-6">
        <p>
          Burn Wiki is a public, evidence-indexed clinical encyclopedia dedicated to
          burn care. It is the only open-access reference of its kind for the burn
          care community.
        </p>

        <h2>Who is this for?</h2>
        <p>
          Burn surgeons, surgical critical care, advanced practice providers,
          nurses, rehabilitation therapists, pharmacists, social workers,
          psychologists, respiratory therapists, trainees, and researchers.
          Anyone involved in the care of burn-injured patients.
        </p>

        <h2>How does it work?</h2>
        <p>
          Every topic is written by burn-care domain experts. Every clinical
          claim is linked to its source literature via PubMed. Inline citations
          connect directly to the referenced studies.
        </p>

        <h2>Evidence standards</h2>
        <p>
          Each topic carries an evidence level badge reflecting the strength of
          the underlying literature. This is not a grading of the writing quality
          but of the evidence base available for that clinical domain. Topics
          built primarily on randomized trials and systematic reviews are marked
          as high evidence; topics relying on expert consensus are marked
          accordingly.
        </p>

        <h2>How Burn Wiki is built</h2>
        <p>
          Burn Wiki pages are drafted by a large language model (LLM) under
          supervision of a physician editor-in-chief and burn-care domain
          experts. Every page passes a multi-gate evidence-anchoring pipeline
          before publication: literature search, claim extraction, citation
          verification, internal and external adversarial review, and
          editor-in-chief sign-off. Every clinical claim on a published page
          links to its source in PubMed. The LLM does not publish directly — no
          page reaches this site without human expert approval.
        </p>

        <h2>Content and editorial independence</h2>
        <p>
          Burn Wiki has no commercial sponsors. Content decisions are driven by
          clinical relevance, not advertising. The encyclopedia is a living
          resource: topics are added and updated continuously as new evidence
          emerges.
        </p>

        <h2>Contact</h2>
        <p>
          For questions, corrections, or collaboration inquiries, please reach out
          to the editorial team.
        </p>
      </div>
    </div>
  );
}
