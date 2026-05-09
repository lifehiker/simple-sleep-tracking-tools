import { ActionButton } from "@/components/action-button";
import type { AppState } from "@/lib/types";

export function OnboardingPanel({ state }: { state: AppState }) {
  const done = state.onboarding.completed;
  return (
    <section className="card p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Onboarding</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em]">
            {done ? "Setup complete" : "Permissions-first setup"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
            Health import, notifications, and snore recording are represented with guarded fallbacks here. The UI mirrors
            the native permission flow the PRD calls for while remaining safe in a browser build.
          </p>
        </div>
        <ActionButton
          endpoint="/api/settings"
          body={{ onboarding: { completed: !done, healthImportExplained: true, notificationPromptSeen: true } }}
          label={done ? "Mark onboarding incomplete" : "Complete onboarding"}
          pendingLabel="Saving..."
          className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
        />
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <StatusCard
          title="Health import"
          state={state.permissions.healthKit}
          description="Read Apple Watch sleep sessions from Apple Health when the user opts in."
        />
        <StatusCard
          title="Notifications"
          state={state.permissions.notifications}
          description="Nap completion and bedtime reminder education with browser-safe fallback scheduling."
        />
        <StatusCard
          title="Snore recording"
          state={state.permissions.microphone}
          description="Request microphone access only when the user opens snore check, matching the PRD."
        />
      </div>
    </section>
  );
}

function StatusCard({ title, state, description }: { title: string; state: string; description: string }) {
  const tone = state === "granted" ? "bg-[var(--accent-soft)]" : state === "declined" ? "bg-[#ffe8e8]" : "bg-white";
  return (
    <article className={`rounded-[1.5rem] border border-[var(--line)] p-4 ${tone}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{state}</p>
      <p className="mt-3 text-sm text-[var(--muted)]">{description}</p>
    </article>
  );
}
