import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { SettingsForm } from "@/components/settings-form";
import { readState } from "@/lib/storage";
import { formatClock } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const state = await readState();

  return (
    <AppShell eyebrow="Settings" title="Target sleep, shift-friendly anchors, and reminder fallback controls.">
      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div className="card p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Sleep settings</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em]">Main sleep anchor window</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Use this to treat daytime sleep as valid main sleep for shift work. The dashboard and consistency ranges use
            this window rather than assuming nighttime-only sleep.
          </p>
          <div className="mt-5">
            <SettingsForm settings={state.settings} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Current setup</p>
            <div className="mt-5 grid gap-3 text-sm text-[var(--muted)]">
              <p>Target: {state.settings.targetMinutes / 60} hours</p>
              <p>
                Anchor window: {formatClock(state.settings.anchorStartMinutes)} to{" "}
                {formatClock(state.settings.anchorEndMinutes)}
              </p>
              <p>
                Reminder: {state.settings.bedtimeReminderEnabled ? "enabled" : "disabled"} ·{" "}
                {state.settings.reminderLabel}
              </p>
            </div>
          </div>
          <div className="card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Notification fallback</p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Browser-safe reminder state is persisted locally. Native local notifications can be connected later without
              changing the user-facing settings flow.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ActionButton
                endpoint="/api/settings"
                body={{ permission: { name: "notifications", value: "granted" } }}
                label="Mark notifications granted"
                pendingLabel="Saving..."
                className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
              />
              <ActionButton
                endpoint="/api/settings"
                body={{ permission: { name: "notifications", value: "declined" } }}
                label="Mark notifications declined"
                pendingLabel="Saving..."
                className="rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold"
              />
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
