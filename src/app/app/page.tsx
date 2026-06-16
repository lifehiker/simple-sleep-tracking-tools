import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { MetricCard } from "@/components/metric-card";
import { OnboardingPanel } from "@/components/onboarding-panel";
import { PremiumToggle } from "@/components/premium-toggle";
import { SleepChart } from "@/components/sleep-chart";
import { computeDashboardMetrics, computeTrendPoints, getVisibleLogs } from "@/lib/metrics";
import { readState } from "@/lib/storage";
import { diffMinutes, formatDateTime, formatMinutes } from "@/lib/time";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const state = await readState();
  const metrics = computeDashboardMetrics(state);
  const trends = computeTrendPoints(state, 7);
  const recentLogs = getVisibleLogs(state).slice(0, 6);

  return (
    <AppShell eyebrow="Dashboard" title="A clear picture of last night and the week around it.">
      <OnboardingPanel state={state} />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Last night" value={formatMinutes(metrics.lastNightMinutes)} detail="Anchored to your main sleep window." />
        <MetricCard
          label="7-day average"
          value={formatMinutes(metrics.sevenDayAverageMinutes)}
          detail="Average main sleep duration across recent sessions."
          tone="warm"
        />
        <MetricCard
          label="Sleep debt"
          value={metrics.sleepDebtMinutes > 0 ? `${formatMinutes(metrics.sleepDebtMinutes)} behind` : `${formatMinutes(Math.abs(metrics.sleepDebtMinutes))} recovered`}
          detail="Rolling comparison against your target sleep duration."
          tone="accent"
        />
        <MetricCard label="Naps this week" value={String(metrics.napCount7d)} detail="Recovery sessions saved in the last 7 days." />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <SleepChart points={trends} />
        <div className="card p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Consistency</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-[1.4rem] bg-white p-4">
              <p className="text-sm text-[var(--muted)]">Bedtime spread</p>
              <p className="mt-2 text-3xl font-bold">{formatMinutes(metrics.bedtimeRangeMinutes)}</p>
            </div>
            <div className="rounded-[1.4rem] bg-white p-4">
              <p className="text-sm text-[var(--muted)]">Wake spread</p>
              <p className="mt-2 text-3xl font-bold">{formatMinutes(metrics.wakeRangeMinutes)}</p>
            </div>
            <div className="rounded-[1.4rem] bg-[var(--accent-soft)] p-4">
              <p className="text-sm text-[var(--muted)]">Feature gate state</p>
              <p className="mt-2 text-lg font-bold">
                {state.premium.unlocked ? "Premium fallback unlocked" : "Free tier active"}
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Use the local premium toggle to verify full-history, trends, nap presets, and snore detail access.
              </p>
              <div className="mt-4">
                <PremiumToggle unlocked={state.premium.unlocked} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div className="card p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Recent sessions</p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em]">Last imported and logged sleep</h2>
            </div>
            <ActionButton
              endpoint="/api/import-health"
              label="Import Apple Health sample"
              pendingLabel="Importing..."
              className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white"
            />
          </div>
          <div className="mt-5 space-y-3">
            {recentLogs.map((log) => (
              <article key={log.id} className="rounded-[1.4rem] border border-[var(--line)] bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold capitalize">
                      {log.kind} sleep · {log.source}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {formatDateTime(log.start)} to {formatDateTime(log.end)}
                    </p>
                  </div>
                  <p className="text-xl font-bold">{formatMinutes(diffMinutes(log.start, log.end))}</p>
                </div>
                {log.notes ? <p className="mt-3 text-sm text-[var(--muted)]">{log.notes}</p> : null}
                {(log.segments?.length ?? 0) > 1 ? (
                  <p className="mt-3 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                    Segmented session: {log.segments.length} sleep blocks
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Permission routing</p>
          <div className="mt-5 space-y-3 text-sm text-[var(--muted)]">
            <p>HealthKit is only explained during onboarding or import.</p>
            <p>Microphone access is only requested when the user opens snore check.</p>
            <p>Notifications stay optional and are represented with settings-based fallback reminders in this build.</p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
