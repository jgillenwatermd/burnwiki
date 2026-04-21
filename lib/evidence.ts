export type EvidenceLevel =
  | "High"
  | "Moderate"
  | "Low–Moderate"
  | "Low"
  | "Expert Consensus";

export interface EvidencePalette {
  bg: string;
  ink: string;
  dot: string;
  label: string;
}

export const EVIDENCE_PALETTE: Record<EvidenceLevel, EvidencePalette> = {
  High: { bg: "#e6ece0", ink: "#3a5225", dot: "#5b7a35", label: "High" },
  Moderate: { bg: "#ede5d2", ink: "#6b5420", dot: "#a08142", label: "Moderate" },
  "Low–Moderate": {
    bg: "#f0e4d2",
    ink: "#7a5830",
    dot: "#b07a3e",
    label: "Low–Mod",
  },
  Low: { bg: "#f0d9c8", ink: "#803a1a", dot: "#a85232", label: "Low" },
  "Expert Consensus": {
    bg: "#e4dde4",
    ink: "#4a3b56",
    dot: "#6a5580",
    label: "Consensus",
  },
};

/**
 * Normalize frontmatter `evidence_level` values (lowercase, various forms)
 * to the canonical EvidenceLevel key. Defaults to Moderate on unrecognized.
 */
export function normalizeEvidence(raw: string | null | undefined): EvidenceLevel {
  if (!raw) return "Moderate";
  const v = raw.toLowerCase().replace(/[\s_]+/g, "-");
  if (v.startsWith("high")) return "High";
  if (v === "moderate" || v === "mod") return "Moderate";
  if (v === "low-moderate" || v === "low-mod" || v === "mod-low") return "Low–Moderate";
  if (v === "low") return "Low";
  if (v.startsWith("expert") || v.includes("consensus")) return "Expert Consensus";
  return "Moderate";
}
