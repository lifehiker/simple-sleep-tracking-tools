"use client";

import { useState, useTransition } from "react";

export function WaitlistForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        const formElement = event.currentTarget;
        const form = new FormData(event.currentTarget);
        startTransition(async () => {
          setMessage(null);
          const response = await fetch("/api/waitlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: String(form.get("email")) }),
          });
          const result = (await response.json()) as { message?: string; error?: string };
          setMessage(result.message ?? result.error ?? "Request finished.");
          if (response.ok) {
            formElement.reset();
          }
        });
      }}
    >
      <input
        required
        type="email"
        name="email"
        placeholder="your@email.com"
        className="min-w-0 flex-1 rounded-full border border-white/25 bg-white/90 px-5 py-4 text-[var(--foreground)]"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-semibold text-white"
      >
        {isPending ? "Saving..." : "Get launch updates"}
      </button>
      {message ? <p className="text-sm text-white/80 sm:basis-full">{message}</p> : null}
    </form>
  );
}
