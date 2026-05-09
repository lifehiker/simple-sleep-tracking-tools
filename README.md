# Sleep Log for Apple Watch

Web implementation of the PRD for a focused sleep-tracking utility: Apple Health import fallback, manual logs, sleep debt, naps, shift-friendly scheduling, snore check preview, paywall gating, and landing-page marketing flows.

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

## Storage

- Local application state is persisted to `data/app-state.json`.
- The app seeds demo data automatically when the file does not exist.
- No external database is required for local development or automated builds.

## Environment

- No environment variables are required.
- Billing, Apple Health import, Apple Watch sync, notifications, microphone recording, and email capture all use guarded local fallbacks so the app remains functional without external services or credentials.

## Docker

```bash
docker build .
```

The Docker image uses Next.js standalone output and copies only directories that exist in this repository.
