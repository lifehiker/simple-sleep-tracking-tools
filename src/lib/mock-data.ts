import { DEFAULT_THRESHOLD, FREE_NAP_PRESET } from "@/lib/constants";
import type { AppState, NapPreset, SleepLog, SleepSegment, SnoreEvent } from "@/lib/types";
import { addMinutes, startOfDay, toIso } from "@/lib/time";

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function buildSegments(start: Date, chunks: number[]) {
  let cursor = start;
  return chunks.map((chunk) => {
    const segmentStart = cursor;
    const segmentEnd = addMinutes(segmentStart, chunk);
    cursor = addMinutes(segmentEnd, 15);
    return {
      id: createId("segment"),
      start: toIso(segmentStart),
      end: toIso(segmentEnd),
    } satisfies SleepSegment;
  });
}

function buildLog(params: {
  start: Date;
  durationMinutes: number;
  kind: SleepLog["kind"];
  source: SleepLog["source"];
  notes?: string;
  segmented?: number[];
}) {
  const end = addMinutes(params.start, params.durationMinutes);
  const segments = params.segmented
    ? buildSegments(params.start, params.segmented)
    : [
        {
          id: createId("segment"),
          start: toIso(params.start),
          end: toIso(end),
        },
      ];
  return {
    id: createId("sleep"),
    start: toIso(params.start),
    end: toIso(end),
    source: params.source,
    kind: params.kind,
    notes: params.notes,
    createdAt: toIso(end),
    updatedAt: toIso(end),
    segments,
  } satisfies SleepLog;
}

function buildSnoreEvents(threshold: number): SnoreEvent[] {
  return [
    { id: createId("snore"), secondsFromStart: 1840, level: threshold + 0.13, previewLabel: "00:30:40 clip" },
    { id: createId("snore"), secondsFromStart: 5520, level: threshold + 0.09, previewLabel: "01:32:00 clip" },
    { id: createId("snore"), secondsFromStart: 12330, level: threshold + 0.18, previewLabel: "03:25:30 clip" },
    { id: createId("snore"), secondsFromStart: 18780, level: threshold + 0.11, previewLabel: "05:13:00 clip" },
  ];
}

export function createSeedState(): AppState {
  const today = startOfDay(new Date());
  const logs: SleepLog[] = [];

  for (let dayIndex = 0; dayIndex < 12; dayIndex += 1) {
    const anchorDay = addMinutes(today, -dayIndex * 24 * 60);
    const mainStart = addMinutes(anchorDay, 7 * 60 + ((dayIndex % 3) - 1) * 25);
    const duration = 390 + ((dayIndex + 1) % 4) * 25;
    logs.push(
      buildLog({
        start: mainStart,
        durationMinutes: duration,
        kind: "main",
        source: dayIndex < 3 ? "healthkit" : "manual",
        notes: dayIndex === 2 ? "Interrupted by early meeting." : undefined,
        segmented: dayIndex === 2 ? [180, 145, 80] : undefined,
      }),
    );

    if (dayIndex % 3 === 0) {
      logs.push(
        buildLog({
          start: addMinutes(anchorDay, 14 * 60 + 20),
          durationMinutes: 25,
          kind: "nap",
          source: "nap_timer",
          notes: "Recovery nap",
        }),
      );
    }
  }

  logs.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

  return {
    sleepLogs: logs,
    settings: {
      targetMinutes: 8 * 60,
      anchorStartMinutes: 22 * 60,
      anchorEndMinutes: 8 * 60,
      bedtimeReminderEnabled: true,
      bedtimeReminderLeadMinutes: 45,
      notificationsEnabled: false,
      reminderLabel: "Start winding down",
    },
    onboarding: {
      completed: false,
      healthImportExplained: false,
      notificationPromptSeen: false,
      snorePromptSeen: false,
    },
    permissions: {
      healthKit: "pending",
      notifications: "pending",
      microphone: "pending",
    },
    napTimer: {
      active: false,
      presetMinutes: FREE_NAP_PRESET,
      startedAt: null,
      endsAt: null,
      completedAt: null,
    },
    napHistory: [],
    snoreSessions: [
      {
        id: createId("snore_session"),
        createdAt: toIso(addMinutes(today, -360)),
        startTime: toIso(addMinutes(today, -8 * 60)),
        durationMinutes: 440,
        threshold: DEFAULT_THRESHOLD,
        mode: "sample",
        eventCount: 4,
        previewOnly: true,
        events: buildSnoreEvents(DEFAULT_THRESHOLD),
      },
    ],
    premium: {
      unlocked: false,
      mode: "fallback",
      priceLabel: "$9.99 lifetime",
      launchPriceLabel: "$7.99 launch",
    },
    waitlist: [],
  };
}

export function createNapHistoryItem(presetMinutes: NapPreset, startedAt: string, endedAt: string, savedLogId?: string) {
  return {
    id: createId("nap_history"),
    presetMinutes,
    startedAt,
    endedAt,
    savedLogId,
  };
}

export function createSnoreSession(threshold: number, previewOnly: boolean) {
  const now = new Date();
  const events = buildSnoreEvents(threshold);
  return {
    id: createId("snore_session"),
    createdAt: toIso(now),
    startTime: toIso(addMinutes(now, -7 * 60 - 25)),
    durationMinutes: 445,
    threshold,
    mode: "sample" as const,
    eventCount: events.length,
    previewOnly,
    events,
  };
}
