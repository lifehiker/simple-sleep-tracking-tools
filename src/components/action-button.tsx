"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface ActionButtonProps {
  endpoint: string;
  body?: Record<string, unknown>;
  label: string;
  pendingLabel?: string;
  className?: string;
  method?: "POST";
  onSuccessMessage?: string;
}

export function ActionButton({
  endpoint,
  body,
  label,
  pendingLabel,
  className,
  method = "POST",
}: ActionButtonProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <button
        className={className}
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            setMessage(null);
            try {
              const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: body ? JSON.stringify(body) : undefined,
              });
              const result = (await response.json()) as { message?: string; error?: string };
              if (!response.ok) {
                throw new Error(result.error ?? "Request failed.");
              }
              setMessage(result.message ?? "Saved.");
              router.refresh();
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Something went wrong.");
            }
          });
        }}
        type="button"
      >
        {isPending ? pendingLabel ?? "Working..." : label}
      </button>
      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </div>
  );
}
