export default function KeyPointsCallout({ html }: { html: string }) {
  return (
    <div className="my-8 border border-codex-rule bg-codex-paper p-5">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-codex-accent">
        Key Points
      </div>
      <div
        className="topic-content text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
