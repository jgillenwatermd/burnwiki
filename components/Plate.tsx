/**
 * Plate — stylized placeholder for clinical imagery. Used until real
 * illustrations/photography are sourced. Each `kind` renders a different
 * schematic SVG composition on warm paper stock.
 */
type PlateKind =
  | "burn-depth"
  | "rule-9"
  | "lund-browder"
  | "anatomy"
  | "jackson-zones"
  | "parkland-curve"
  | "clinical";

interface Props {
  kind: PlateKind;
  label?: string;
  figNum?: string;
  h?: number;
  w?: number;
  stripe?: string;
  bg?: string;
  caption?: boolean;
  className?: string;
}

const INK3 = "#5b5048";
const INK2 = "#3d3530";
const INK = "#1a1613";
const RULE = "#d9d0c2";
const RULE_LIGHT = "#e8e0d0";
const CARD = "#fdfbf6";
const MUTED = "#7a6d62";

export default function Plate({
  kind,
  label,
  figNum,
  h = 160,
  w = 260,
  stripe = "#c9a878",
  bg = "#efe6d4",
  caption = true,
  className,
}: Props) {
  const inner = {
    "burn-depth": (
      <g>
        <rect width={w} height={h} fill={bg} />
        <g opacity="0.5">
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={20 + (i * (w - 40)) / 4}
              y={h * 0.25}
              width={(w - 40) / 4 - 4}
              height={h * 0.5}
              fill={["#f0d9b5", "#c2864e", "#6b3520", "#2a1510"][i]}
            />
          ))}
        </g>
        <g stroke={INK3} strokeWidth="0.5" opacity="0.6">
          <line x1="20" y1={h * 0.82} x2={w - 20} y2={h * 0.82} />
        </g>
        <g
          fontFamily="var(--font-mono), ui-monospace, Menlo, monospace"
          fontSize="7"
          fill={INK3}
          textAnchor="middle"
        >
          {["Superfc", "Sup·PT", "Dp·PT", "Full"].map((t, i) => (
            <text
              key={i}
              x={20 + (i * (w - 40)) / 4 + (w - 40) / 8 - 2}
              y={h * 0.9}
            >
              {t}
            </text>
          ))}
        </g>
      </g>
    ),
    "rule-9": (
      <g>
        <rect width={w} height={h} fill={bg} />
        <g opacity="0.55" stroke={INK3} strokeWidth="1.2" fill="none">
          <circle cx={w / 2} cy={h * 0.22} r={h * 0.1} />
          <rect
            x={w / 2 - h * 0.22}
            y={h * 0.33}
            width={h * 0.44}
            height={h * 0.36}
          />
          <rect
            x={w / 2 - h * 0.42}
            y={h * 0.36}
            width={h * 0.18}
            height={h * 0.32}
          />
          <rect
            x={w / 2 + h * 0.24}
            y={h * 0.36}
            width={h * 0.18}
            height={h * 0.32}
          />
          <rect
            x={w / 2 - h * 0.22}
            y={h * 0.7}
            width={h * 0.18}
            height={h * 0.24}
          />
          <rect
            x={w / 2 + 0.02 * h}
            y={h * 0.7}
            width={h * 0.18}
            height={h * 0.24}
          />
        </g>
      </g>
    ),
    "lund-browder": (
      <g>
        <rect width={w} height={h} fill={bg} />
        <g opacity="0.3" stroke={INK3} strokeWidth="0.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={"h" + i}
              x1="20"
              x2={w - 20}
              y1={20 + (i * (h - 40)) / 7}
              y2={20 + (i * (h - 40)) / 7}
            />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={"v" + i}
              y1="20"
              y2={h - 20}
              x1={20 + (i * (w - 40)) / 4}
              x2={20 + (i * (w - 40)) / 4}
            />
          ))}
        </g>
      </g>
    ),
    anatomy: (
      <g>
        <rect width={w} height={h} fill={bg} />
        <g opacity="0.55">
          <rect x="20" y={h * 0.18} width={w - 40} height={h * 0.1} fill="#e8c9a8" />
          <rect x="20" y={h * 0.3} width={w - 40} height={h * 0.18} fill="#c49a74" />
          <rect x="20" y={h * 0.5} width={w - 40} height={h * 0.24} fill="#876245" />
          <rect x="20" y={h * 0.76} width={w - 40} height={h * 0.12} fill="#5a4030" />
        </g>
      </g>
    ),
    "jackson-zones": (
      <g>
        <rect width={w} height={h} fill={bg} />
        <g opacity="0.65">
          <ellipse cx={w / 2} cy={h / 2} rx={w * 0.38} ry={h * 0.38} fill="#d4b89a" />
          <ellipse cx={w / 2} cy={h / 2} rx={w * 0.28} ry={h * 0.28} fill="#b07a55" />
          <ellipse cx={w / 2} cy={h / 2} rx={w * 0.16} ry={h * 0.16} fill="#5a2f1a" />
        </g>
      </g>
    ),
    "parkland-curve": (
      <g>
        <rect width={w} height={h} fill={bg} />
        <g stroke={INK3} strokeWidth="0.5" opacity="0.3">
          {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
            <line
              key={"h" + i}
              x1="30"
              x2={w - 20}
              y1={h * p + 10}
              y2={h * p + 10}
            />
          ))}
          {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
            <line
              key={"v" + i}
              y1="20"
              y2={h - 20}
              x1={30 + (w - 50) * p}
              x2={30 + (w - 50) * p}
            />
          ))}
        </g>
        <path
          d={`M30,${h - 20} Q${w * 0.2},${h * 0.4} ${w * 0.4},${h * 0.35} T${w - 20},${h * 0.25}`}
          stroke="#8a3e1f"
          strokeWidth="2"
          fill="none"
        />
        <path
          d={`M30,${h - 20} Q${w * 0.3},${h * 0.6} ${w - 20},${h * 0.45}`}
          stroke={INK3}
          strokeWidth="1.2"
          fill="none"
          strokeDasharray="3,2"
        />
      </g>
    ),
    clinical: (
      <g>
        <rect width={w} height={h} fill={bg} />
        <defs>
          <pattern
            id={`cp-${kind}-${figNum ?? "x"}`}
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(35)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="9"
              stroke={stripe}
              strokeWidth="3"
              opacity="0.4"
            />
          </pattern>
        </defs>
        <rect width={w} height={h} fill={`url(#cp-${kind}-${figNum ?? "x"})`} />
        <rect
          x={w * 0.15}
          y={h * 0.25}
          width={w * 0.7}
          height={h * 0.5}
          fill={stripe}
          opacity="0.25"
        />
      </g>
    ),
  }[kind];

  return (
    <figure
      className={className}
      style={{
        margin: 0,
        border: `1px solid ${RULE}`,
        background: CARD,
        display: "block",
      }}
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        style={{ display: "block", height: h, background: bg }}
      >
        {inner}
      </svg>
      {caption && (
        <figcaption
          className="font-mono"
          style={{
            padding: "6px 10px",
            fontSize: 10,
            color: MUTED,
            letterSpacing: 0.3,
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${RULE_LIGHT}`,
          }}
        >
          <span>{figNum ? `Fig. ${figNum}` : ""}</span>
          <span style={{ color: INK2 }}>{label}</span>
        </figcaption>
      )}
    </figure>
  );
}
