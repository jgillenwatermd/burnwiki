const levelConfig: Record<string, { label: string; color: string }> = {
  high: { label: "High", color: "bg-green-100 text-green-800" },
  moderate: { label: "Moderate", color: "bg-blue-100 text-blue-800" },
  low: { label: "Low", color: "bg-gray-100 text-gray-700" },
  "very-low": { label: "Very Low", color: "bg-gray-100 text-gray-500" },
  "expert-consensus": {
    label: "Expert Consensus",
    color: "bg-amber-100 text-amber-800",
  },
};

export default function EvidenceBadge({
  level,
  small = false,
}: {
  level: string;
  small?: boolean;
}) {
  const config = levelConfig[level] || {
    label: level.replace(/-/g, " "),
    color: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium capitalize ${config.color} ${
        small ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs"
      }`}
    >
      {config.label}
    </span>
  );
}
