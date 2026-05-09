"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function DeleteLogButton({ id }: { id: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending}
        className="text-sm font-semibold text-[var(--rose)]"
        onClick={() => {
          startTransition(async () => {
            const response = await fetch(`/api/logs?id=${id}`, { method: "DELETE" });
            const result = (await response.json()) as { error?: string };
            if (!response.ok) {
              setMessage(result.error ?? "Could not delete log.");
              return;
            }
            setMessage("Deleted.");
            router.refresh();
          });
        }}
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>
      {message ? <p className="text-xs text-[var(--muted)]">{message}</p> : null}
    </div>
  );
}
