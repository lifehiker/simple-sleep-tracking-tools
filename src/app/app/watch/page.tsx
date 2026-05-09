import { AppShell } from "@/components/app-shell";
import { computeWatchSummary } from "@/lib/metrics";
import { readState } from "@/lib/storage";
import { formatHours, formatMinutes } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function WatchPage() {
  const state = await readState();
  const watch = computeWatchSummary(state);

  return (
    <AppShell eyebrow="Apple Watch" title="Companion-ready data, mirrored in a web-safe fallback view.">
      <section className="grid gap-4 md:grid-cols-3">
        <WatchCard title="Last sleep total" value={formatMinutes(watch.lastSleepMinutes)} detail="Mirrored from the main dashboard summary." />
        <WatchCard title="Current debt" value={formatHours(watch.currentDebtMinutes)} detail="The same recovery calculation the watch complication would use." />
        <WatchCard title="Next nap preset" value={`${watch.nextNapPreset} min`} detail="Watch quick action equivalent." />
      </section>
      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="card p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Sync state</p>
          <p className="mt-4 text-sm text-[var(--muted)]">{watch.syncStatus}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Companion scope from PRD</p>
          <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
            <p>View last sleep total.</p>
            <p>Start a nap timer.</p>
            <p>View current sleep debt.</p>
            <p>Sync data with iPhone.</p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function WatchCard({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <article className="card p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">{title}</p>
      <p className="mt-4 text-4xl font-bold tracking-[-0.05em]">{value}</p>
      <p className="mt-3 text-sm text-[var(--muted)]">{detail}</p>
    </article>
  );
}
