import {
  EVIDENCE_PALETTE,
  normalizeEvidence,
  type EvidenceLevel,
} from "@/lib/evidence";

type Mode = "badge" | "dot" | "bar";

interface Props {
  level: EvidenceLevel | string | null | undefined;
  mode?: Mode;
  className?: string;
}

/**
 * Evidence swatch. Three render modes:
 *   badge — pill with label ("HIGH", "MODERATE", ...)
 *   dot   — small colored circle, titled for a11y
 *   bar   — 4-step filled segmented bar (not applicable to Expert Consensus)
 */
export default function EvBadge({ level, mode = "badge", className }: Props) {
  const canonical = normalizeEvidence(typeof level === "string" ? level : null);
  const e = EVIDENCE_PALETTE[canonical];

  if (mode === "dot") {
    return (
      <span
        title={canonical}
        aria-label={`${canonical} evidence`}
        className={className}
        style={{
          width: 8,
          height: 8,
          borderRadius: 8,
          background: e.dot,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
    );
  }

  if (mode === "bar") {
    const order: EvidenceLevel[] = ["Low", "Low–Moderate", "Moderate", "High"];
    const reachedIdx = order.indexOf(canonical);
    return (
      <span
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "stretch",
          height: 14,
          border: `1px solid ${e.dot}`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {order.map((L, i) => {
          const reached = canonical !== "Expert Consensus" && i <= reachedIdx;
          return (
            <span
              key={L}
              style={{
                width: 6,
                background: reached ? e.dot : "transparent",
                borderRight: i < 3 ? `1px solid ${e.dot}` : 0,
              }}
            />
          );
        })}
      </span>
    );
  }

  return (
    <span
      className={`font-mono ${className ?? ""}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 10,
        letterSpacing: "0.03em",
        textTransform: "uppercase",
        color: e.ink,
        background: e.bg,
        padding: "2px 7px",
        borderRadius: 2,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: 5,
          background: e.dot,
        }}
      />
      {e.label}
    </span>
  );
}
