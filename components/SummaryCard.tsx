export default function SummaryCard({ html }: { html: string }) {
  return (
    <section
      aria-labelledby="summary-heading"
      className="summary-card mt-6 mb-7 border border-codex-rule border-l-[3px] border-l-codex-accent bg-codex-paper p-5 sm:px-6 sm:py-[22px]"
    >
      <h2 id="summary-heading" className="sr-only">
        Summary
      </h2>
      <div className="mb-3 flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full bg-codex-accent"
        />
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-codex-ink3">
          Summary &mdash; bedside
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-codex-rule" />
        <span className="font-mono text-[10px] tracking-[0.04em] text-codex-muted">
          ~15 sec read
        </span>
      </div>
      <div
        className="topic-content summary-card-body text-[0.9375rem] leading-[1.55]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}
