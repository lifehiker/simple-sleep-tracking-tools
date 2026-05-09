"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { formatClock } from "@/lib/time";
import type { AppState } from "@/lib/types";

export function SettingsForm({ settings }: { settings: AppState["settings"] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        startTransition(async () => {
          setMessage(null);
          const response = await fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              settings: {
                targetMinutes: Number(form.get("targetHours")) * 60,
                anchorStartMinutes: Number(form.get("anchorStartMinutes")),
                anchorEndMinutes: Number(form.get("anchorEndMinutes")),
                bedtimeReminderEnabled: form.get("bedtimeReminderEnabled") === "on",
                bedtimeReminderLeadMinutes: Number(form.get("bedtimeReminderLeadMinutes")),
                reminderLabel: String(form.get("reminderLabel")),
              },
            }),
          });
          const result = (await response.json()) as { error?: string };
          if (!response.ok) {
            setMessage(result.error ?? "Could not save settings.");
            return;
          }
          setMessage("Settings updated.");
          router.refresh();
        });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Target sleep hours
          <input
            name="targetHours"
            type="number"
            min={4}
            max={12}
            step={0.5}
            defaultValue={settings.targetMinutes / 60}
            className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Bedtime reminder lead
          <input
            name="bedtimeReminderLeadMinutes"
            type="number"
            min={5}
            max={180}
            step={5}
            defaultValue={settings.bedtimeReminderLeadMinutes}
            className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Preferred sleep window start
          <select
            name="anchorStartMinutes"
            defaultValue={settings.anchorStartMinutes}
            className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
          >
            {Array.from({ length: 24 }, (_, hour) => hour * 60).map((minutes) => (
              <option key={minutes} value={minutes}>
                {formatClock(minutes)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Preferred sleep window end
          <select
            name="anchorEndMinutes"
            defaultValue={settings.anchorEndMinutes}
            className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
          >
            {Array.from({ length: 24 }, (_, hour) => hour * 60).map((minutes) => (
              <option key={minutes} value={minutes}>
                {formatClock(minutes)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Reminder label
        <input
          name="reminderLabel"
          defaultValue={settings.reminderLabel}
          className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
        />
      </label>
      <label className="flex items-center gap-3 text-sm font-medium">
        <input type="checkbox" name="bedtimeReminderEnabled" defaultChecked={settings.bedtimeReminderEnabled} />
        Enable bedtime reminder fallback
      </label>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
        >
          {isPending ? "Saving..." : "Save settings"}
        </button>
        {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      </div>
    </form>
  );
}
