"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { DEFAULT_THRESHOLD } from "@/lib/constants";

export function SnoreCheckForm() {
  const router = useRouter();
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <label className="grid gap-2 text-sm font-medium">
        Loud-event threshold
        <input
          type="range"
          min="0.35"
          max="0.95"
          step="0.01"
          value={threshold}
          onChange={(event) => setThreshold(Number(event.target.value))}
        />
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={isPending}
          className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => {
            startTransition(async () => {
              setMessage(null);
              const response = await fetch("/api/snore-check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ threshold }),
              });
              const result = (await response.json()) as { message?: string; error?: string };
              if (!response.ok) {
                setMessage(result.error ?? "Could not create snore check.");
                return;
              }
              setMessage(result.message ?? "Snore check created.");
              router.refresh();
            });
          }}
        >
          {isPending ? "Analyzing..." : "Run sample overnight check"}
        </button>
        <p className="text-sm text-[var(--muted)]">Current threshold: {threshold.toFixed(2)}</p>
      </div>
      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </div>
  );
}
