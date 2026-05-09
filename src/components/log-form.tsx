"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

function toLocalValue(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function LogForm({
  initial,
}: {
  initial?: {
    id: string;
    start: string;
    end: string;
    kind: "main" | "nap";
    notes?: string;
  };
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const formElement = event.currentTarget;
        const form = new FormData(event.currentTarget);
        startTransition(async () => {
          setMessage(null);
          try {
            const response = await fetch("/api/logs", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: initial?.id,
                start: new Date(String(form.get("start"))).toISOString(),
                end: new Date(String(form.get("end"))).toISOString(),
                kind: form.get("kind"),
                notes: form.get("notes"),
              }),
            });

            const result = (await response.json()) as { error?: string };
            if (!response.ok) {
              throw new Error(result.error ?? "Could not save log.");
            }
            setMessage(initial ? "Log updated." : "Log saved.");
            router.refresh();
            if (!initial) {
              formElement.reset();
            }
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Could not save log.");
          }
        });
      }}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Start
          <input
            required
            name="start"
            type="datetime-local"
            defaultValue={toLocalValue(initial?.start)}
            className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          End
          <input
            required
            name="end"
            type="datetime-local"
            defaultValue={toLocalValue(initial?.end)}
            className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
          />
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-[180px_1fr]">
        <label className="grid gap-2 text-sm font-medium">
          Entry type
          <select
            name="kind"
            defaultValue={initial?.kind ?? "main"}
            className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
          >
            <option value="main">Main sleep</option>
            <option value="nap">Nap</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Notes
          <input
            name="notes"
            defaultValue={initial?.notes ?? ""}
            placeholder="Interrupted sleep, travel, jet lag, etc."
            className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
          />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
        >
          {isPending ? "Saving..." : initial ? "Update log" : "Save log"}
        </button>
        {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      </div>
    </form>
  );
}
