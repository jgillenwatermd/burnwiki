export default function KeyPointsCallout({ html }: { html: string }) {
  return (
    <div className="my-8 rounded-lg border-l-4 border-[#c0392b] bg-[#f8f9fa] p-5">
      <h2 className="mb-3 text-lg font-semibold text-[#1a1a2e]">Key Points</h2>
      <div
        className="topic-content text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
