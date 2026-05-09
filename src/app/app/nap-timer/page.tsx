import { AppShell } from "@/components/app-shell";
import { NapTimerClient } from "@/components/nap-timer-client";
import { readState } from "@/lib/storage";
import { formatDateTime } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function NapTimerPage() {
  const state = await readState();

  return (
    <AppShell eyebrow="Nap timer" title="Preset naps on iPhone now, with watch-first intent preserved.">
      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <NapTimerClient napTimer={state.napTimer} premiumUnlocked={state.premium.unlocked} />
        <div className="card p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Workflow notes</p>
          <div className="mt-5 space-y-4 text-sm text-[var(--muted)]">
            <p>Free tier exposes the 20-minute preset only. Premium unlock enables 10, 30, and 90 minutes.</p>
            <p>Completing the timer saves a nap directly into the sleep log with source `nap_timer`.</p>
            <p>Browser builds cannot schedule durable local alerts, so the timer page provides a clear countdown and save path.</p>
          </div>
        </div>
      </section>
      <section className="card p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Recent nap history</p>
        <div className="mt-5 grid gap-3">
          {state.napHistory.length ? (
            state.napHistory.map((item) => (
              <article key={item.id} className="rounded-[1.5rem] border border-[var(--line)] bg-white p-4">
                <p className="text-sm font-semibold">{item.presetMinutes}-minute preset</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {formatDateTime(item.startedAt)} to {formatDateTime(item.endedAt)}
                </p>
              </article>
            ))
          ) : (
            <p className="text-sm text-[var(--muted)]">No completed naps yet in this session.</p>
          )}
        </div>
      </section>
    </AppShell>
  );
}
