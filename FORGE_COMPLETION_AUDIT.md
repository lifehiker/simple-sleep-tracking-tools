# Forge Completion Audit

## Product foundation

- App shell, responsive navigation, visual system, metadata, and marketing entry point:
  - `src/app/layout.tsx`
  - `src/app/globals.css`
  - `src/app/page.tsx`
  - `src/app/pricing/page.tsx`
- Standalone production output and runtime docs:
  - `next.config.ts`
  - `Dockerfile`
  - `.dockerignore`
  - `README.md`

## Data model and persistence

- Local single-user state model:
  - `src/lib/types.ts`
- Seed/demo data and safe fallback records:
  - `src/lib/mock-data.ts`
- File-backed storage:
  - `src/lib/storage.ts`
  - `data/.gitkeep`
- Domain logic for logs, settings, nap timer, snore sessions, premium, waitlist:
  - `src/lib/app-state.ts`
  - `src/lib/metrics.ts`
  - `src/lib/time.ts`
  - `src/lib/constants.ts`

## PRD feature mapping

### Apple Health sleep import

- UI and workflow:
  - `src/app/app/page.tsx`
  - `src/components/onboarding-panel.tsx`
- Server path:
  - `src/app/api/import-health/route.ts`
- Implementation detail:
  - `src/lib/app-state.ts` (`importHealthSample`)
  - `src/lib/mock-data.ts` (segmented sample sessions)

### Manual sleep log entry and editing

- User-facing page and forms:
  - `src/app/app/logs/page.tsx`
  - `src/components/log-form.tsx`
  - `src/components/delete-log-button.tsx`
- Server path:
  - `src/app/api/logs/route.ts`
- Persistence/update logic:
  - `src/lib/app-state.ts` (`normalizeLogInput`, `upsertLog`, `deleteLog`)

### Sleep debt calculation

- Metrics and rolling calculations:
  - `src/lib/metrics.ts`
- Dashboard and trends presentation:
  - `src/app/app/page.tsx`
  - `src/app/app/trends/page.tsx`
  - `src/components/metric-card.tsx`
  - `src/components/sleep-chart.tsx`

### Simple trends dashboard

- Dashboard route:
  - `src/app/app/page.tsx`
- Reusable visuals:
  - `src/components/metric-card.tsx`
  - `src/components/sleep-chart.tsx`
- Supporting calculations:
  - `src/lib/metrics.ts`

### Nap timer

- User-facing page and countdown controls:
  - `src/app/app/nap-timer/page.tsx`
  - `src/components/nap-timer-client.tsx`
- Server path:
  - `src/app/api/nap-timer/route.ts`
- Persistence/update logic:
  - `src/lib/app-state.ts` (`startNapTimer`, `completeNapTimer`, `cancelNapTimer`)

### Shift-friendly schedule mode

- Settings page and anchor window UX:
  - `src/app/app/settings/page.tsx`
  - `src/components/settings-form.tsx`
- Settings API:
  - `src/app/api/settings/route.ts`
- Anchor-window logic:
  - `src/lib/metrics.ts` (`isInAnchorWindow`)

### Basic snore check

- User-facing page and threshold controls:
  - `src/app/app/snore-check/page.tsx`
  - `src/components/snore-check-form.tsx`
- Server path:
  - `src/app/api/snore-check/route.ts`
- Fallback session generation:
  - `src/lib/mock-data.ts`
  - `src/lib/app-state.ts` (`createSnoreCheck`)

### Apple Watch companion

- Companion representation page:
  - `src/app/app/watch/page.tsx`
- Watch-summary API:
  - `src/app/api/watch-summary/route.ts`
- Mirror summary logic:
  - `src/lib/metrics.ts` (`computeWatchSummary`)

### Local notifications and bedtime reminders

- Settings UX and reminder controls:
  - `src/app/app/settings/page.tsx`
  - `src/components/settings-form.tsx`
  - `src/components/onboarding-panel.tsx`
- Server path:
  - `src/app/api/settings/route.ts`
- Local fallback persistence:
  - `src/lib/app-state.ts` (`updateSettings`, `updatePermission`)

### Onboarding and permissions

- Dashboard onboarding experience:
  - `src/components/onboarding-panel.tsx`
  - `src/app/app/page.tsx`
- Permissions/settings server path:
  - `src/app/api/settings/route.ts`

## Pricing, billing fallback, and email capture

- Pricing/paywall UI:
  - `src/app/pricing/page.tsx`
  - `src/components/premium-toggle.tsx`
- Premium feature gate and fallback billing path:
  - `src/app/api/premium/route.ts`
  - `src/lib/app-state.ts` (`togglePremium`)
- Email capture fallback:
  - `src/components/waitlist-form.tsx`
  - `src/app/api/waitlist/route.ts`
  - `src/lib/app-state.ts` (`addWaitlistLead`)

## Marketing and SEO

- Landing page positioning, FAQ, and pricing teaser:
  - `src/app/page.tsx`
- Metadata and social tags:
  - `src/app/layout.tsx`
- Robots and sitemap:
  - `src/app/robots.ts`
  - `src/app/sitemap.ts`

## Auth assessment

- No auth implementation was added.
- Reason:
  - The PRD specifies a local utility app with app-local persistence and no account system.
  - `FORGE_PRD_TASKS.md` explicitly records auth as not required.

## Verification completed

- Build:
  - `npm run build` passed after implementation.
- Lint:
  - `npm run lint` passed.
- Dev runtime:
  - `npm run dev` started successfully on `http://localhost:3000` and primary routes returned `200`.
- Production runtime:
  - `npm run start` now uses `node .next/standalone/server.js` and served `http://localhost:3001/app` successfully.
- Smoke-tested routes:
  - `/`
  - `/pricing`
  - `/app`
  - `/app/logs`
  - `/app/trends`
  - `/app/nap-timer`
  - `/app/snore-check`
  - `/app/watch`
  - `/app/settings`
- Smoke-tested interactive/server flows:
  - `GET /api/state`
  - `POST /api/waitlist`
  - `POST /api/import-health`
  - `POST /api/settings`
  - `POST /api/premium`
  - `POST /api/nap-timer` start/complete
  - `POST /api/snore-check`
  - `POST /api/logs`
  - `DELETE /api/logs`
  - `GET /api/watch-summary`

## Intentionally deferred external/native items

- Real HealthKit integration:
  - Deferred because the web environment cannot call Apple Health APIs.
  - App still runs via segmented sample import and the same downstream metrics/log UI.
- Real Apple Watch connectivity:
  - Deferred because WatchConnectivity is native-only.
  - App still runs via mirrored watch summary data and nap-timer companion representation.
- Real overnight microphone recording and audio clip playback:
  - Deferred because the current environment prioritizes build-safe fallback behavior.
  - App still runs via generated snore event sessions, threshold controls, preview labels, and gating logic.
- Real local notification scheduling:
  - Deferred because durable background alerts are not reliable in the current browser/server model.
  - App still runs via persisted reminder settings and explicit notification-permission state.
- Real billing provider:
  - Deferred because no external billing account is required for this build.
  - App still runs via local premium toggle and complete feature-gating flows.
- Real email platform integration:
  - Deferred because no third-party email account is required.
  - App still runs via local waitlist capture storage.

## Deployment note

- `docker build .` could not be executed in this environment even though Docker is installed, because access to `/var/run/docker.sock` is denied. The Dockerfile itself is present and aligned with Next.js standalone output.
