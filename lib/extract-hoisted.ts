/*
 * Single source of truth for the H2 hoisting regexes that pull `## Summary`
 * and `## Key Points` out of topic body markdown so the frontend can render
 * them above the prose. Case-sensitive by design — the schema v0.7 + content-
 * quality-gate v1.2 W11/W12 require canonical capitalization, and a lowercase
 * `## summary` or `## key points` should fail loudly rather than silently
 * match (see __tests__/extract-hoisted.test.ts).
 */

export type HoistedSection = {
  /** Extracted bullet/body markdown (heading line stripped). `null` if no match. */
  markdown: string | null;
  /** Markdown with the matched section removed, for rendering the prose body. */
  remainder: string;
};

export function extractHoistedSection(
  markdown: string,
  heading: "Summary" | "Key Points"
): HoistedSection {
  const headingPattern = heading.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const match = markdown.match(
    new RegExp(`## ${headingPattern}\\s*\\n([\\s\\S]*?)(?=\\n## |\\n*$)`)
  );
  if (!match) return { markdown: null, remainder: markdown };
  const remainder = markdown.replace(
    new RegExp(`## ${headingPattern}\\s*\\n[\\s\\S]*?(?=\\n## |\\n*$)`),
    ""
  );
  return { markdown: match[1], remainder };
}
