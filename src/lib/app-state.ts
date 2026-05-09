import { FREE_NAP_PRESET } from "@/lib/constants";
import { createNapHistoryItem, createSnoreSession } from "@/lib/mock-data";
import type { AppState, NapPreset, PermissionStatus, SleepEntryKind, SleepLog, SleepSource } from "@/lib/types";
import { addMinutes, clamp, diffMinutes, toIso } from "@/lib/time";

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeLogInput(input: {
  id?: string;
  start: string;
  end: string;
  kind: SleepEntryKind;
  source: SleepSource;
  notes?: string;
}) {
  const start = new Date(input.start);
  const end = new Date(input.end);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    throw new Error("Sleep logs need a valid start and end time.");
  }

  const now = new Date().toISOString();
  const segment = {
    id: createId("segment"),
    start: start.toISOString(),
    end: end.toISOString(),
  };

  return {
    id: input.id ?? createId("sleep"),
    start: start.toISOString(),
    end: end.toISOString(),
    kind: input.kind,
    source: input.source,
    notes: input.notes?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
    segments: [segment],
  } satisfies SleepLog;
}

export function upsertLog(state: AppState, nextLog: SleepLog) {
  const existing = state.sleepLogs.find((log) => log.id === nextLog.id);
  const merged = existing
    ? state.sleepLogs.map((log) =>
        log.id === nextLog.id ? { ...nextLog, createdAt: existing.createdAt, updatedAt: new Date().toISOString() } : log,
      )
    : [nextLog, ...state.sleepLogs];

  return {
    ...state,
    sleepLogs: merged.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()),
  };
}

export function deleteLog(state: AppState, id: string) {
  return {
    ...state,
    sleepLogs: state.sleepLogs.filter((log) => log.id !== id),
  };
}

export function importHealthSample(state: AppState) {
  const imported: SleepLog[] = [
    {
      id: createId("sleep"),
      start: addMinutes(new Date(), -8 * 60 - 35).toISOString(),
      end: addMinutes(new Date(), -50).toISOString(),
      kind: "main",
      source: "healthkit",
      notes: "Sample Apple Health import",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      segments: [
        {
          id: createId("segment"),
          start: addMinutes(new Date(), -8 * 60 - 35).toISOString(),
          end: addMinutes(new Date(), -5 * 60 - 5).toISOString(),
        },
        {
          id: createId("segment"),
          start: addMinutes(new Date(), -4 * 60 - 40).toISOString(),
          end: addMinutes(new Date(), -50).toISOString(),
        },
      ],
    },
  ];

  return {
    ...state,
    permissions: {
      ...state.permissions,
      healthKit: "granted" as const,
    },
    onboarding: {
      ...state.onboarding,
      healthImportExplained: true,
    },
    sleepLogs: [...imported, ...state.sleepLogs].sort(
      (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime(),
    ),
  };
}

export function updateSettings(
  state: AppState,
  input: Partial<AppState["settings"]> & { notificationsStatus?: PermissionStatus },
) {
  return {
    ...state,
    settings: {
      ...state.settings,
      ...input,
      targetMinutes: clamp(input.targetMinutes ?? state.settings.targetMinutes, 240, 720),
      anchorStartMinutes: clamp(input.anchorStartMinutes ?? state.settings.anchorStartMinutes, 0, 1439),
      anchorEndMinutes: clamp(input.anchorEndMinutes ?? state.settings.anchorEndMinutes, 0, 1439),
      bedtimeReminderLeadMinutes: clamp(
        input.bedtimeReminderLeadMinutes ?? state.settings.bedtimeReminderLeadMinutes,
        5,
        180,
      ),
    },
    permissions: input.notificationsStatus
      ? { ...state.permissions, notifications: input.notificationsStatus }
      : state.permissions,
  };
}

export function updateOnboarding(state: AppState, input: Partial<AppState["onboarding"]>) {
  return {
    ...state,
    onboarding: {
      ...state.onboarding,
      ...input,
    },
  };
}

export function updatePermission(state: AppState, permission: keyof AppState["permissions"], value: PermissionStatus) {
  return {
    ...state,
    permissions: {
      ...state.permissions,
      [permission]: value,
    },
  };
}

export function startNapTimer(state: AppState, presetMinutes: NapPreset) {
  const allowedPreset = state.premium.unlocked || presetMinutes === FREE_NAP_PRESET ? presetMinutes : FREE_NAP_PRESET;
  const now = new Date();
  return {
    ...state,
    napTimer: {
      active: true,
      presetMinutes: allowedPreset,
      startedAt: toIso(now),
      endsAt: toIso(addMinutes(now, allowedPreset)),
      completedAt: null,
    },
  };
}

export function completeNapTimer(state: AppState) {
  if (!state.napTimer.startedAt) {
    throw new Error("No active nap timer.");
  }

  const startedAt = new Date(state.napTimer.startedAt);
  const endedAt = state.napTimer.endsAt ? new Date(state.napTimer.endsAt) : new Date();
  const log = normalizeLogInput({
    start: startedAt.toISOString(),
    end: endedAt.toISOString(),
    kind: "nap",
    source: "nap_timer",
    notes: `${state.napTimer.presetMinutes} minute nap preset`,
  });

  return {
    ...upsertLog(state, log),
    napTimer: {
      ...state.napTimer,
      active: false,
      completedAt: endedAt.toISOString(),
    },
    napHistory: [
      createNapHistoryItem(state.napTimer.presetMinutes, startedAt.toISOString(), endedAt.toISOString(), log.id),
      ...state.napHistory,
    ],
  };
}

export function cancelNapTimer(state: AppState) {
  return {
    ...state,
    napTimer: {
      active: false,
      presetMinutes: state.napTimer.presetMinutes,
      startedAt: null,
      endsAt: null,
      completedAt: null,
    },
  };
}

export function createSnoreCheck(state: AppState, threshold: number) {
  const session = createSnoreSession(threshold, !state.premium.unlocked);
  return {
    ...state,
    permissions: {
      ...state.permissions,
      microphone: "granted" as const,
    },
    onboarding: {
      ...state.onboarding,
      snorePromptSeen: true,
    },
    snoreSessions: [session, ...state.snoreSessions],
  };
}

export function togglePremium(state: AppState, unlocked: boolean) {
  return {
    ...state,
    premium: {
      ...state.premium,
      unlocked,
      mode: unlocked ? ("fallback" as const) : ("locked" as const),
    },
  };
}

export function addWaitlistLead(state: AppState, email: string) {
  if (!email.includes("@")) {
    throw new Error("Enter a valid email address.");
  }

  if (state.waitlist.some((lead) => lead.email.toLowerCase() === email.toLowerCase())) {
    return state;
  }

  return {
    ...state,
    waitlist: [
      {
        id: createId("lead"),
        email: email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        source: "landing-page" as const,
      },
      ...state.waitlist,
    ],
  };
}

export function summarizeSleepLog(log: SleepLog) {
  return {
    ...log,
    durationMinutes: diffMinutes(log.start, log.end),
  };
}
