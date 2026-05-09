import { ReactNode } from "react";

export function MetricCard({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "default" | "accent" | "warm";
}) {
  const toneClasses =
    tone === "accent"
      ? "bg-[var(--accent)] text-white border-transparent"
      : tone === "warm"
        ? "bg-[#fff2e5] border-[#f0d0ab]"
        : "bg-[var(--card)]";

  return (
    <article className={`card p-5 ${toneClasses}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-4 text-4xl font-bold tracking-[-0.05em]">{value}</p>
      <p className="mt-3 text-sm opacity-80">{detail}</p>
    </article>
  );
}

export function DetailList({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 text-sm text-[var(--muted)]">{children}</div>;
}
