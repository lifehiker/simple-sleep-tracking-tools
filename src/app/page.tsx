import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";
import { readState } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const state = await readState();

  return (
    <main className="pb-16">
      <section className="shell pt-6 md:pt-10">
        <div className="card overflow-hidden bg-[linear-gradient(135deg,#0f2e2e_0%,#164e4a_35%,#c96d4f_100%)] px-6 py-8 text-white md:px-10 md:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="pill inline-flex px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/85">
                Sleep Log for Apple Watch
              </p>
              <h1 className="display-title mt-6 max-w-4xl">
                Simple sleep tracking for people who want logs, not a wellness platform.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-white/84">
                Import Apple Watch sleep, track naps, measure sleep debt, support shift schedules, and run a basic
                snore check without the clutter of coaching subscriptions and generic scores.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/app"
                  className="rounded-full bg-white px-6 py-4 text-sm font-semibold text-[var(--accent-strong)]"
                >
                  Open product demo
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-full border border-white/25 px-6 py-4 text-sm font-semibold text-white"
                >
                  View pricing
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Launch waitlist</p>
                <p className="mt-3 text-sm text-white/84">
                  Email capture is stored locally in this production-safe fallback build. No third-party email provider is
                  required to run the app.
                </p>
                <div className="mt-5">
                  <WaitlistForm />
                </div>
                <p className="mt-4 text-xs text-white/65">{state.waitlist.length} local signups captured.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <FeatureStat value="7-day debt" label="Track hours behind or recovered" />
                <FeatureStat value="1-tap naps" label="Save completed naps into the log" />
                <FeatureStat value="Shift-safe" label="Anchor consistency to your real sleep window" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <FeatureCard
          title="Apple Health import"
          body="Bring in segmented watch sleep sessions where available, or use the built-in fallback importer to verify the full workflow."
        />
        <FeatureCard
          title="Sleep debt in hours"
          body="A narrow dashboard for last night, seven-day average, rolling debt, and recovery instead of generic readiness scores."
        />
        <FeatureCard
          title="Naps + snore check"
          body="Fast nap presets with log persistence and a basic loud-event timeline for overnight snore review."
        />
        <FeatureCard
          title="Built for shift workers"
          body="Consistency calculations follow your preferred sleep window, even if your main sleep starts at 8 AM."
        />
      </section>

      <section className="shell mt-12 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="card p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Positioning</p>
          <h2 className="section-title mt-3">A utility app, not a coaching ecosystem.</h2>
          <div className="mt-6 grid gap-4 text-sm text-[var(--muted)] md:grid-cols-2">
            <p>See how much you slept last night, whether your schedule is drifting, and how many naps you needed.</p>
            <p>Keep the surface area small enough that Apple Watch users can understand the app at a glance.</p>
            <p>Use realistic fallbacks for billing, email capture, Health import, and watch sync when credentials are absent.</p>
            <p>Stay compatible with automated builds by avoiding runtime font downloads and other network-coupled setup.</p>
          </div>
        </div>
        <div className="card p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Free vs paid</p>
          <div className="mt-5 grid gap-4">
            <div className="rounded-[1.6rem] bg-white p-5">
              <p className="text-lg font-bold">Free</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Health import, manual logging, last 7 days, basic dashboard, one 20-minute nap preset, and one snore
                preview mode.
              </p>
            </div>
            <div className="rounded-[1.6rem] bg-[var(--accent-soft)] p-5">
              <p className="text-lg font-bold">Lifetime unlock</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Full history, 7/30/90-day trends, all nap presets, shift schedule mode, and full snore event timeline.
              </p>
            </div>
          </div>
          <Link href="/pricing" className="mt-5 inline-flex text-sm font-semibold text-[var(--accent)]">
            Compare plans
          </Link>
        </div>
      </section>

      <section className="shell mt-12">
        <div className="card p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">FAQ</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <FaqCard
              title="Does this really work without Apple Health credentials?"
              body="Yes. The demo app includes a local segmented import fallback so the dashboard, trends, and logs stay fully testable."
            />
            <FaqCard
              title="Can I use it if I sleep during the day?"
              body="Yes. The settings page lets you define your main sleep anchor window so debt and consistency follow your schedule."
            />
            <FaqCard
              title="What happens without a billing SDK?"
              body="Premium mode is locally toggleable in this build so feature gating, paywall UI, and upgrade flows can still be verified."
            />
            <FaqCard
              title="Is there an email platform connected?"
              body="No external email provider is required. The waitlist form stores signups locally as a safe fallback."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur">
      <p className="text-xl font-bold tracking-[-0.04em]">{value}</p>
      <p className="mt-2 text-sm text-white/78">{label}</p>
    </div>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="card p-6">
      <h2 className="text-xl font-bold tracking-[-0.04em]">{title}</h2>
      <p className="mt-3 text-sm text-[var(--muted)]">{body}</p>
    </article>
  );
}

function FaqCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-[1.6rem] border border-[var(--line)] bg-white p-5">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-3 text-sm text-[var(--muted)]">{body}</p>
    </article>
  );
}
