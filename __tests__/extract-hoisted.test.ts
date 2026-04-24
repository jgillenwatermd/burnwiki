import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { extractHoistedSection } from "../lib/extract-hoisted";

/*
 * Regression test for the case-sensitivity contract between
 * wiki/SCHEMA.md v0.7 + content-quality-gate v1.2 W11/W12 and this frontend.
 *
 * Canonical capitalization: `## Summary` and `## Key Points` (both words
 * title-cased for Key Points). Any other capitalization must fail to match
 * so the page renders without the hoisted callout rather than silently
 * losing the intended structural affordance.
 */

const SAMPLE_WITH_BOTH = `## Summary

- **WHAT IT IS:** Albumin is a plasma protein.
- **WHEN INDICATED:** >20% TBSA burns with fluid creep.
- **HOW DELIVERED:** 5% solution IV over 30 min.

## Key Points

- Recognize fluid creep early.
- Start colloid rescue at hour 8\u201312.
- Titrate to UOP 0.5 mL/kg/h.

## Overview

Albumin has been the most widely used colloid\u2026

## Physiologic Rationale

Increased capillary permeability\u2026
`;

describe("extractHoistedSection \u2014 canonical capitalization matches", () => {
  it("extracts ## Summary (title case) cleanly", () => {
    const out = extractHoistedSection(SAMPLE_WITH_BOTH, "Summary");
    assert.ok(out.markdown, "Summary should be extracted");
    assert.match(out.markdown!, /WHAT IT IS/);
    assert.match(out.markdown!, /HOW DELIVERED/);
    assert.doesNotMatch(out.remainder, /## Summary/);
    assert.match(out.remainder, /## Key Points/);
    assert.match(out.remainder, /## Overview/);
  });

  it("extracts ## Key Points (title case, both words) cleanly", () => {
    const out = extractHoistedSection(SAMPLE_WITH_BOTH, "Key Points");
    assert.ok(out.markdown, "Key Points should be extracted");
    assert.match(out.markdown!, /Recognize fluid creep/);
    assert.doesNotMatch(out.remainder, /## Key Points/);
    assert.match(out.remainder, /## Summary/);
    assert.match(out.remainder, /## Overview/);
  });
});

describe("extractHoistedSection \u2014 non-canonical capitalization fails to match", () => {
  const lowercaseSummary = SAMPLE_WITH_BOTH.replace("## Summary", "## summary");
  const lowercaseKP = SAMPLE_WITH_BOTH.replace(
    "## Key Points",
    "## Key points"
  );
  const allLowerKP = SAMPLE_WITH_BOTH.replace(
    "## Key Points",
    "## key points"
  );

  it("does NOT match ## summary (lowercase s) \u2014 W11 canonical rule", () => {
    const out = extractHoistedSection(lowercaseSummary, "Summary");
    assert.equal(
      out.markdown,
      null,
      "Lowercase summary heading must fail to match"
    );
    assert.equal(
      out.remainder,
      lowercaseSummary,
      "Remainder should be untouched when no match"
    );
  });

  it("does NOT match ## Key points (lowercase p) \u2014 W12 canonical rule (live bug on fluid-resuscitation-in-burns)", () => {
    const out = extractHoistedSection(lowercaseKP, "Key Points");
    assert.equal(
      out.markdown,
      null,
      "## Key points (lowercase p) must fail to match \u2014 this is the fluid-resuscitation live-site bug"
    );
  });

  it("does NOT match ## key points (all lowercase)", () => {
    const out = extractHoistedSection(allLowerKP, "Key Points");
    assert.equal(out.markdown, null);
  });
});

describe("extractHoistedSection \u2014 absent section returns null cleanly", () => {
  const NO_HOISTED = `## Overview

The patient presented\u2026

## Management

Resuscitation proceeded\u2026
`;

  it("returns null + unchanged remainder when ## Summary is absent (pre-v0.7 pages)", () => {
    const out = extractHoistedSection(NO_HOISTED, "Summary");
    assert.equal(out.markdown, null);
    assert.equal(out.remainder, NO_HOISTED);
  });

  it("returns null + unchanged remainder when ## Key Points is absent", () => {
    const out = extractHoistedSection(NO_HOISTED, "Key Points");
    assert.equal(out.markdown, null);
    assert.equal(out.remainder, NO_HOISTED);
  });
});

describe("extractHoistedSection \u2014 trailing-EOF section (no following H2)", () => {
  const EOF_ONLY = `## Overview

Some prose.

## Key Points

- Final bullet 1.
- Final bullet 2.
`;

  it("extracts a trailing ## Key Points block that has no following H2", () => {
    const out = extractHoistedSection(EOF_ONLY, "Key Points");
    assert.ok(out.markdown);
    assert.match(out.markdown!, /Final bullet 1/);
    assert.match(out.markdown!, /Final bullet 2/);
    assert.doesNotMatch(out.remainder, /## Key Points/);
  });
});

describe("extractHoistedSection \u2014 chained extraction (Summary then Key Points)", () => {
  it("first extracts Summary, then Key Points from the remainder, yielding a clean prose-body remainder", () => {
    const s = extractHoistedSection(SAMPLE_WITH_BOTH, "Summary");
    const k = extractHoistedSection(s.remainder, "Key Points");
    assert.ok(s.markdown);
    assert.ok(k.markdown);
    assert.doesNotMatch(k.remainder, /## Summary/);
    assert.doesNotMatch(k.remainder, /## Key Points/);
    assert.match(k.remainder, /## Overview/);
    assert.match(k.remainder, /## Physiologic Rationale/);
  });
});
