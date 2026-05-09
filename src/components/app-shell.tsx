import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/logs", label: "Sleep log" },
  { href: "/app/trends", label: "Trends" },
  { href: "/app/nap-timer", label: "Nap timer" },
  { href: "/app/snore-check", label: "Snore check" },
  { href: "/app/watch", label: "Watch" },
  { href: "/app/settings", label: "Settings" },
];

export function AppShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <div className="shell py-6 md:py-8">
      <div className="app-grid">
        <aside className="card sticky top-6 p-5">
          <div className="space-y-5">
            <div>
              <Link href="/" className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                Sleep Log
              </Link>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Watch-first sleep tracking with debt, naps, snore checks, and shift-friendly scheduling.
              </p>
            </div>
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="pill px-4 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="rounded-3xl bg-[var(--accent-soft)] p-4 text-sm text-[var(--accent-strong)]">
              <p className="font-semibold">Browser-safe fallback active</p>
              <p className="mt-2">
                Native HealthKit, Apple Watch, notifications, and overnight recording are represented with guarded local
                workflows so the app remains fully usable in this build environment.
              </p>
            </div>
          </div>
        </aside>
        <main className="space-y-6">
          <header className="card overflow-hidden p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] md:text-5xl">{title}</h1>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
