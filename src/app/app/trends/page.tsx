import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SleepChart } from "@/components/sleep-chart";
import { computeTrendPoints } from "@/lib/metrics";
import { readState } from "@/lib/storage";
import { formatHours, formatMinutes } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function TrendsPage() {
  const state = await readState();
  const trend7 = computeTrendPoints(state, 7);
  const trend30 = computeTrendPoints(state, 30);
  const trend90 = state.premium.unlocked ? computeTrendPoints(state, 90) : [];

  return (
    <AppShell eyebrow="Trends" title="Rolling 7, 30, and 90-day context for recovery, drift, and naps.">
      <SleepChart points={trend7} />
      <section className="grid gap-4 lg:grid-cols-2">
        <TrendSummaryCard title="30-day average" value={averageLabel(trend30)} detail="Extended context for shift changes, travel, and inconsistent weeks." />
        <TrendSummaryCard title="30-day debt trend" value={debtLabel(trend30)} detail="Running deficit or recovery against the target sleep duration." />
      </section>

      <section className="card p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Premium windows</p>
        {state.premium.unlocked ? (
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <TrendSummaryCard title="7-day" value={averageLabel(trend7)} detail="Fast feedback loop." />
            <TrendSummaryCard title="30-day" value={averageLabel(trend30)} detail="Behavior pattern view." />
            <TrendSummaryCard title="90-day" value={averageLabel(trend90)} detail="Long-range trend history." />
          </div>
        ) : (
          <div className="mt-5 rounded-[1.6rem] bg-[#fff2e5] p-5">
            <p className="text-lg font-bold">Upgrade to unlock 30 and 90-day depth</p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Free users can inspect the 7-day chart. The full PRD premium workflow is implemented through a local
              lifetime unlock fallback.
            </p>
            <Link href="/pricing" className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)]">
              Review plans
            </Link>
          </div>
        )}
      </section>
    </AppShell>
  );
}

function averageLabel(points: { totalMinutes: number }[]) {
  if (!points.length) return "0h";
  const avg = Math.round(points.reduce((sum, point) => sum + point.totalMinutes, 0) / points.length);
  return formatMinutes(avg);
}

function debtLabel(points: { debtMinutes: number }[]) {
  if (!points.length) return "0h";
  return formatHours(points.at(-1)?.debtMinutes ?? 0);
}

function TrendSummaryCard({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <article className="card p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">{title}</p>
      <p className="mt-4 text-4xl font-bold tracking-[-0.05em]">{value}</p>
      <p className="mt-3 text-sm text-[var(--muted)]">{detail}</p>
    </article>
  );
}
