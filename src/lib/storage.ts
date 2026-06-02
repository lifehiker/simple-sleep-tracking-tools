import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createSeedState } from "@/lib/mock-data";
import type { AppState } from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const statePath = path.join(dataDir, "app-state.json");

async function ensureStateFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(statePath, "utf8");
  } catch {
    await writeFile(statePath, JSON.stringify(createSeedState(), null, 2), "utf8");
  }
}

export async function readState(): Promise<AppState> {
  await ensureStateFile();
  try {
    const raw = await readFile(statePath, "utf8");
    return JSON.parse(raw) as AppState;
  } catch {
    // File may be partially written by a concurrent writeState call.
    // Recover by regenerating seed state rather than letting the throw
    // escape into streaming SSR (which would produce a 200 with empty body).
    const seed = createSeedState();
    await writeFile(statePath, JSON.stringify(seed, null, 2), "utf8").catch(() => {});
    return seed;
  }
}

export async function writeState(state: AppState) {
  await ensureStateFile();
  await writeFile(statePath, JSON.stringify(state, null, 2), "utf8");
}

export async function updateState(updater: (state: AppState) => AppState | Promise<AppState>) {
  const current = await readState();
  const next = await updater(current);
  await writeState(next);
  return next;
}
