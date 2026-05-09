# Forge PRD Tasks

Status legend: `[ ]` pending, `[~]` in progress, `[x]` complete, `[n/a]` not required by PRD but explicitly assessed.

## Phase 1: Foundation
- [x] Read `PRD.md` end-to-end.
- [x] Read `BUILD_INSTRUCTIONS.md` end-to-end.
- [x] Inventory current repository state and identify missing scaffold/code.
- [x] Scaffold Next.js app with TypeScript, App Router, Tailwind, and standalone output.
- [x] Establish global design system, layout shell, metadata, responsive navigation, and polished visual direction.
- [x] Add local persistence layer and typed domain models for logs, settings, timers, snore sessions, and premium state.
- [x] Add server utilities for safe file-backed storage and seed/demo data.
- [x] Add reusable validation/helpers for sleep durations, schedule windows, nap presets, trends, and debt calculations.

## Phase 2: Data Model And Auth
- [x] Define data model covering:
  - [x] Sleep logs with source (`manual`, `healthkit`, `nap_timer`), type (`main`, `nap`), segmentation support, notes, and timestamps.
  - [x] User settings for target sleep duration, preferred anchor window, bedtime reminders, onboarding state, and permission flags.
  - [x] Nap timer state/history.
  - [x] Snore check sessions, events, preview clips, and fallback audio metadata.
  - [x] Premium/unlock state and feature gating.
- [n/a] End-user auth/login.
Reason: PRD describes a single-user utility app with local app data and no account system. The web implementation will run without authentication.

## Phase 3: Core User-Facing Pages
- [x] Dashboard page with:
  - [x] Last night total sleep
  - [x] 7-day average sleep
  - [x] Rolling sleep debt/surplus
  - [x] Bedtime consistency range
  - [x] Wake consistency range
  - [x] Naps in last 7 days
  - [x] Recent sessions list and chart
- [x] Sleep log page with filtering, segmented sessions display, and add/edit/delete flows.
- [x] Manual sleep entry/edit UI with main-sleep vs nap tagging and source handling.
- [x] Trends page with 7/30/90-day summaries and premium gating.
- [x] Nap timer page with presets, countdown state, completion handling, and saved nap logs.
- [x] Shift schedule/settings page for target sleep duration and preferred sleep anchor window.
- [x] Snore check page with recorder fallback UX, threshold setting, session results, event list, and clip preview metadata.
- [x] Onboarding/permissions experience for Health import, notifications, and snore recording education.
- [x] Apple Watch companion representation/fallback page documenting watch-specific value and sync state in web-safe form.
- [x] Pricing/paywall page for free vs paid feature access.
- [x] Marketing landing page and supporting sections aligned to PRD positioning and ASO copy.

## Phase 4: APIs / Server Actions
- [x] API/server path to read application state.
- [x] API/server path to create/update/delete sleep logs.
- [x] API/server path to import mock Apple Health sleep data with segmented sessions support.
- [x] API/server path to update user settings and onboarding/permission state.
- [x] API/server path to start/complete/cancel nap timer and save completed naps.
- [x] API/server path to create snore check sessions and detect/store loud event markers from sample data.
- [x] API/server path to toggle premium unlock fallback.
- [x] API/server path to expose watch-summary/sync data for the companion view.

## Phase 5: Core Workflows
- [x] Onboarding flow from first visit through permissions education.
- [x] Apple Health import workflow with graceful fallback when native integration is unavailable.
- [x] Manual logging workflow including editing and deleting entries.
- [x] Sleep debt and recovery calculations across rolling windows.
- [x] Shift-friendly sleep anchor workflow for non-nighttime main sleep.
- [x] Nap timer workflow including completion state and saved nap log.
- [x] Snore check workflow with event detection and gated detail preview.
- [x] Premium gating workflow for free vs paid limits.

## Phase 6: Secondary Workflows And Integrations
- [x] Billing integration or safe fallback.
- [x] Email capture/integration or safe fallback.
- [x] Storage implementation for production-safe local persistence.
- [x] Notification-style UX or safe fallback for bedtime reminders and nap completion.
- [x] HealthKit/Apple Watch/native capability fallback documentation in-app.

## Phase 7: Marketing / SEO Pages
- [x] Primary landing page with strong copy for Apple Watch sleep tracking.
- [x] Feature sections for sleep debt, naps, shift schedules, and snore check.
- [x] Pricing section.
- [x] FAQ section.
- [x] SEO metadata, Open Graph basics, sitemap/robots support if practical.

## Phase 8: Docker / Deploy
- [x] Configure `next.config` with `output: "standalone"`.
- [x] Create production-ready Dockerfile using only directories that exist.
- [x] Ensure app builds without build-time network dependencies.
- [x] Add environment variable documentation / fallback handling.

## Phase 9: Verification
- [x] Run `npm run build` and fix issues until clean.
- [x] Start dev server and verify it runs without crashing.
- [x] Smoke-test primary routes.
- [x] Test key interactive flows: onboarding, import, manual log, nap timer, settings, snore check, premium toggle.
- [x] Review pages/components for polished UI and fix issues found.
- [n/a] Create `HUMAN_INPUT_NEEDED.md` only for true external credential/account requirements.
Reason: all credential-dependent native integrations were implemented with safe local fallbacks, so no external input is required to run the app.
- [x] Create `FORGE_COMPLETION_AUDIT.md` mapping PRD requirements to implementation files.
- [ ] Output `FORGE_BUILD_COMPLETE` only after all non-external requirements are implemented and verified.
