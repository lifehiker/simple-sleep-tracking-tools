"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function PremiumToggle({ unlocked }: { unlocked: boolean }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={isPending}
        className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white"
        onClick={() => {
          startTransition(async () => {
            const response = await fetch("/api/premium", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ unlocked: !unlocked }),
            });
            const result = (await response.json()) as { message?: string; error?: string };
            if (!response.ok) {
              setMessage(result.error ?? "Could not update premium state.");
              return;
            }
            setMessage(result.message ?? "Updated.");
            router.refresh();
          });
        }}
      >
        {isPending ? "Updating..." : unlocked ? "Lock premium" : "Unlock premium fallback"}
      </button>
      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </div>
  );
}
