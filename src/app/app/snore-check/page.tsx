import { AppShell } from "@/components/app-shell";
import { SnoreCheckForm } from "@/components/snore-check-form";
import { readState } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SnoreCheckPage() {
  const state = await readState();
  const latest = state.snoreSessions?.[0];

  return (
    <AppShell eyebrow="Snore check" title="Overnight loud-event review with a guarded browser fallback.">
      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="card p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Start a check</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em]">Sample overnight analysis</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            The PRD calls for iPhone-only recording with loud-peak detection. In this environment the server generates a
            realistic sample session so the event timeline, gating, and result views are still fully implemented.
          </p>
          <div className="mt-5">
            <SnoreCheckForm />
          </div>
        </div>
        <div className="card p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Latest result</p>
          {latest ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-[1.5rem] bg-white p-4">
                <p className="text-sm text-[var(--muted)]">Detected event count</p>
                <p className="mt-2 text-5xl font-bold tracking-[-0.06em]">{latest.eventCount}</p>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  Threshold {latest.threshold.toFixed(2)} · {latest.mode} mode ·{" "}
                  {latest.previewOnly ? "preview-only free tier" : "full premium detail"}
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-[var(--accent-soft)] p-4 text-sm text-[var(--accent-strong)]">
                <p className="font-semibold">Playback note</p>
                <p className="mt-2">
                  Clip playback is represented with preview labels instead of binary audio blobs so the app stays build-safe
                  without browser or native recorder dependencies.
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[var(--muted)]">No snore sessions yet.</p>
          )}
        </div>
      </section>

      <section className="card p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Event timeline</p>
        <div className="mt-5 grid gap-3">
          {latest?.events?.map((event, index) => (
            <article key={event.id} className="rounded-[1.5rem] border border-[var(--line)] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Possible snore {index + 1}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{event.previewLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{event.level.toFixed(2)}</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">peak level</p>
                </div>
              </div>
              {!state.premium.unlocked ? (
                <p className="mt-3 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                  Free tier shows event count and preview markers only.
                </p>
              ) : null}
            </article>
          )) ?? <p className="text-sm text-[var(--muted)]">Run a sample check to populate events.</p>}
        </div>
      </section>
    </AppShell>
  );
}
