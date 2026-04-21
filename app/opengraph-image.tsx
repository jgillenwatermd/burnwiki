import { ImageResponse } from "next/og";

export const alt = "Burn Wiki — Clinical Encyclopedia for Burn Care";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a2e",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 140,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            display: "flex",
            alignItems: "center",
            gap: "0",
          }}
        >
          <span>Burn</span>
          <span style={{ color: "#c0392b" }}>Wiki</span>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 38,
            color: "#cbd5e1",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          A clinical encyclopedia for anyone in burn care
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 24,
            color: "#94a3b8",
          }}
        >
          Evidence-indexed. PMID-linked. Open access.
        </div>
      </div>
    ),
    { ...size },
  );
}
