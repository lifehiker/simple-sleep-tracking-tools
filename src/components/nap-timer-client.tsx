"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FREE_NAP_PRESET, NAP_PRESETS } from "@/lib/constants";
import { formatDateTime } from "@/lib/time";
import type { AppState } from "@/lib/types";

function formatCountdown(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function NapTimerClient({
  napTimer,
  premiumUnlocked,
}: {
  napTimer: AppState["napTimer"];
  premiumUnlocked: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [isPending, startTransition] = useTransition();
  const countdown = napTimer.endsAt ? Math.max(0, new Date(napTimer.endsAt).getTime() - now) : 0;

  useEffect(() => {
    if (!napTimer.active || !napTimer.endsAt) return;
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [napTimer.active, napTimer.endsAt]);

  async function send(action: "start" | "complete" | "cancel", presetMinutes?: number) {
    const response = await fetch("/api/nap-timer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, presetMinutes }),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      throw new Error(result.error ?? "Nap timer request failed.");
    }
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        {NAP_PRESETS.map((preset) => {
          const locked = !premiumUnlocked && preset !== FREE_NAP_PRESET;
          const active = napTimer.presetMinutes === preset;
          return (
            <button
              key={preset}
              type="button"
              disabled={locked || isPending || napTimer.active}
              className={`rounded-[1.5rem] border px-4 py-5 text-left transition ${
                active ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--line)] bg-white"
              } ${locked ? "opacity-50" : ""}`}
              onClick={() => {
                startTransition(async () => {
                  try {
                    setMessage(null);
                    await send("start", preset);
                    setMessage(`Started a ${preset}-minute nap.`);
                  } catch (error) {
                    setMessage(error instanceof Error ? error.message : "Could not start nap.");
                  }
                });
              }}
            >
              <p className="text-lg font-bold">{preset} min</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {locked ? "Premium-only preset" : preset === 90 ? "Full cycle reset" : "Quick recharge"}
              </p>
            </button>
          );
        })}
      </div>
      <div className="card p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Active timer</p>
        <p className="mt-4 text-6xl font-bold tracking-[-0.06em]">
          {napTimer.active ? formatCountdown(countdown) : "00:00"}
        </p>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {napTimer.active && napTimer.endsAt
            ? `Ends at ${formatDateTime(napTimer.endsAt)}. Completing the timer saves a nap entry automatically.`
            : "Start from a preset to save a completed nap back into the sleep log."}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!napTimer.active || isPending}
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
            onClick={() => {
              startTransition(async () => {
                try {
                  await send("complete");
                  setMessage("Nap completed and logged.");
                } catch (error) {
                  setMessage(error instanceof Error ? error.message : "Could not complete nap.");
                }
              });
            }}
          >
            Save completed nap
          </button>
          <button
            type="button"
            disabled={!napTimer.active || isPending}
            className="rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold"
            onClick={() => {
              startTransition(async () => {
                try {
                  await send("cancel");
                  setMessage("Nap timer cancelled.");
                } catch (error) {
                  setMessage(error instanceof Error ? error.message : "Could not cancel nap.");
                }
              });
            }}
          >
            Cancel timer
          </button>
        </div>
        {message ? <p className="mt-4 text-sm text-[var(--muted)]">{message}</p> : null}
      </div>
    </div>
  );
}
