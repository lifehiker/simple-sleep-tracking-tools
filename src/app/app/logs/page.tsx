import { AppShell } from "@/components/app-shell";
import { DeleteLogButton } from "@/components/delete-log-button";
import { LogForm } from "@/components/log-form";
import { getVisibleLogs } from "@/lib/metrics";
import { readState } from "@/lib/storage";
import { diffMinutes, formatDateTime, formatMinutes } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const state = await readState();
  const logs = getVisibleLogs(state);
  const editable = logs[0];

  return (
    <AppShell eyebrow="Sleep log" title="Manual logging, edits, segmented imports, and nap history in one place.">
      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="card p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Add a session</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em]">Manual sleep entry</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Add main sleep or naps manually. Source is stored as manual, while imported and timer-based entries remain
            tagged for filtering and audits.
          </p>
          <div className="mt-5">
            <LogForm />
          </div>
        </div>
        <div className="card p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Quick edit</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em]">Edit latest entry</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            The latest log is loaded for fast correction. Delete is also available for manual cleanup and QA.
          </p>
          {editable ? (
            <div className="mt-5 space-y-4">
              <LogForm initial={editable} />
              <DeleteLogButton id={editable.id} />
            </div>
          ) : (
            <p className="mt-4 text-sm text-[var(--muted)]">No entries available yet.</p>
          )}
        </div>
      </section>

      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">History</p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em]">
              {state.premium.unlocked ? "Full history" : "Last 7 days visible on free tier"}
            </h2>
          </div>
          <p className="text-sm text-[var(--muted)]">{logs.length} visible entries</p>
        </div>
        <div className="mt-5 grid gap-3">
          {logs.map((log) => (
            <article key={log.id} className="rounded-[1.6rem] border border-[var(--line)] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold capitalize">
                    {log.kind} sleep · {log.source}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {formatDateTime(log.start)} to {formatDateTime(log.end)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{formatMinutes(diffMinutes(log.start, log.end))}</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{log.segments.length} segments</p>
                </div>
              </div>
              {log.notes ? <p className="mt-3 text-sm text-[var(--muted)]">{log.notes}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
