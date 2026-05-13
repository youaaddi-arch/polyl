export default function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "blue" | "green" | "amber" | "red";
}) {
  const accentClass =
    accent === "green"
      ? "text-emerald-600"
      : accent === "amber"
      ? "text-amber-600"
      : accent === "red"
      ? "text-rose-600"
      : "text-brand-600";
  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`mt-1 text-3xl font-semibold ${accentClass}`}>{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </div>
  );
}
