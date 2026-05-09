import Link from "next/link";
import { PremiumToggle } from "@/components/premium-toggle";
import { readState } from "@/lib/storage";

export default async function PricingPage() {
  const state = await readState();

  return (
    <main className="shell py-8 md:py-12">
      <div className="card p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Pricing</p>
            <h1 className="section-title mt-3">Freemium with a one-time lifetime unlock.</h1>
            <p className="mt-4 max-w-2xl text-sm text-[var(--muted)]">
              The production-safe build uses a local premium toggle in place of StoreKit or Stripe so the paywall, feature
              gates, and upgrade UX can be verified without credentials.
            </p>
          </div>
          <Link href="/app" className="rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold">
            Back to app
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-[var(--line)] bg-white p-6">
            <p className="text-lg font-bold">Free</p>
            <p className="mt-2 text-4xl font-bold tracking-[-0.05em]">$0</p>
            <ul className="mt-5 grid gap-3 text-sm text-[var(--muted)]">
              <li>Apple Health import fallback</li>
              <li>Manual sleep logging</li>
              <li>Last 7 days of logs</li>
              <li>Basic dashboard and last night total</li>
              <li>20-minute nap preset</li>
              <li>Snore event count preview</li>
            </ul>
          </article>
          <article className="rounded-[2rem] border border-[var(--accent)] bg-[var(--accent-soft)] p-6">
            <p className="text-lg font-bold">Lifetime unlock</p>
            <p className="mt-2 text-4xl font-bold tracking-[-0.05em]">{state.premium.priceLabel}</p>
            <p className="mt-2 text-sm text-[var(--accent-strong)]">Launch pricing: {state.premium.launchPriceLabel}</p>
            <ul className="mt-5 grid gap-3 text-sm text-[var(--muted)]">
              <li>Full sleep history</li>
              <li>7/30/90-day trends</li>
              <li>All nap presets</li>
              <li>Shift-friendly schedule mode</li>
              <li>Full snore event timeline</li>
              <li>Advanced watch summary access</li>
            </ul>
          </article>
        </div>

        <div className="mt-8 rounded-[2rem] bg-[#172033] p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Local billing fallback</p>
          <p className="mt-3 max-w-2xl text-sm text-white/78">
            Toggle the premium state here to validate gating logic. This keeps the application production-ready without a
            mandatory external billing account in development and automated builds.
          </p>
          <div className="mt-5">
            <PremiumToggle unlocked={state.premium.unlocked} />
          </div>
        </div>
      </div>
    </main>
  );
}
