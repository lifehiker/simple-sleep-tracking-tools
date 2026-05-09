import { FREE_LOG_LIMIT_DAYS } from "@/lib/constants";
import type { AppState, AppSummary, DashboardMetrics, SleepLog, TrendPoint, TrendWindow, WatchSummary } from "@/lib/types";
import { diffMinutes, formatDateLabel, minuteDistance, minutesSinceMidnight, startOfDay } from "@/lib/time";

function sortLogs(logs: SleepLog[]) {
  return [...logs].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
}

export function isInAnchorWindow(log: SleepLog, anchorStartMinutes: number, anchorEndMinutes: number) {
  if (log.kind !== "main") {
    return false;
  }

  const startMinutes = minutesSinceMidnight(log.start);
  if (anchorStartMinutes <= anchorEndMinutes) {
    return startMinutes >= anchorStartMinutes && startMinutes <= anchorEndMinutes;
  }

  return startMinutes >= anchorStartMinutes || startMinutes <= anchorEndMinutes;
}

function dailyBuckets(logs: SleepLog[], windowDays: number, state: AppState) {
  const today = startOfDay(new Date());
  const days = Array.from({ length: windowDays }, (_, offset) => {
    const day = new Date(today.getTime() - offset * 24 * 60 * 60 * 1000);
    const key = day.toISOString().slice(0, 10);
    const logsForDay = logs.filter((log) => log.start.slice(0, 10) === key);
    const totalMinutes = logsForDay.reduce((sum, log) => sum + diffMinutes(log.start, log.end), 0);
    const naps = logsForDay.filter((log) => log.kind === "nap").length;
    return { day, key, logsForDay, totalMinutes, naps };
  }).reverse();

  let debtRunning = 0;
  return days.map((bucket) => {
    const mainSleep = bucket.logsForDay
      .filter((log) =>
        isInAnchorWindow(log, state.settings.anchorStartMinutes, state.settings.anchorEndMinutes),
      )
      .reduce((sum, log) => sum + diffMinutes(log.start, log.end), 0);
    debtRunning += state.settings.targetMinutes - mainSleep;
    return {
      date: formatDateLabel(bucket.day),
      totalMinutes: bucket.totalMinutes,
      debtMinutes: debtRunning,
      naps: bucket.naps,
    } satisfies TrendPoint;
  });
}

export function computeDashboardMetrics(state: AppState): DashboardMetrics {
  const logs = sortLogs(state.sleepLogs);
  const mainLogs = logs.filter((log) => log.kind === "main");
  const napLogs7d = logs.filter((log) => {
    const ageMs = Date.now() - new Date(log.start).getTime();
    return log.kind === "nap" && ageMs <= FREE_LOG_LIMIT_DAYS * 24 * 60 * 60 * 1000;
  });

  const anchored = mainLogs.filter((log) =>
    isInAnchorWindow(log, state.settings.anchorStartMinutes, state.settings.anchorEndMinutes),
  );
  const lastNightMinutes = anchored[0] ? diffMinutes(anchored[0].start, anchored[0].end) : 0;
  const last7 = anchored.slice(0, 7);
  const sevenDayAverageMinutes = last7.length
    ? Math.round(last7.reduce((sum, log) => sum + diffMinutes(log.start, log.end), 0) / last7.length)
    : 0;
  const sleepDebtMinutes = last7.reduce(
    (sum, log) => sum + (state.settings.targetMinutes - diffMinutes(log.start, log.end)),
    0,
  );
  const bedtimes = last7.map((log) => minutesSinceMidnight(log.start));
  const wakeTimes = last7.map((log) => minutesSinceMidnight(log.end));
  const bedtimeRangeMinutes =
    bedtimes.length > 1 ? Math.max(...bedtimes.map((value) => minuteDistance(value, bedtimes[0]))) : 0;
  const wakeRangeMinutes =
    wakeTimes.length > 1 ? Math.max(...wakeTimes.map((value) => minuteDistance(value, wakeTimes[0]))) : 0;

  return {
    lastNightMinutes,
    sevenDayAverageMinutes,
    sleepDebtMinutes,
    napCount7d: napLogs7d.length,
    bedtimeRangeMinutes,
    wakeRangeMinutes,
  };
}

export function computeTrendPoints(state: AppState, window: TrendWindow): TrendPoint[] {
  return dailyBuckets(state.sleepLogs, window, state);
}

export function getVisibleLogs(state: AppState) {
  const logs = sortLogs(state.sleepLogs);
  if (state.premium.unlocked) {
    return logs;
  }

  const cutoff = Date.now() - FREE_LOG_LIMIT_DAYS * 24 * 60 * 60 * 1000;
  return logs.filter((log) => new Date(log.start).getTime() >= cutoff);
}

export function computeSummary(state: AppState): AppSummary {
  return {
    metrics: computeDashboardMetrics(state),
    trends: computeTrendPoints(state, 7),
    recentLogs: getVisibleLogs(state).slice(0, 8),
    premiumLocked: !state.premium.unlocked,
  };
}

export function computeWatchSummary(state: AppState): WatchSummary {
  const metrics = computeDashboardMetrics(state);
  return {
    lastSleepMinutes: metrics.lastNightMinutes,
    currentDebtMinutes: metrics.sleepDebtMinutes,
    nextNapPreset: state.premium.unlocked ? 20 : state.napTimer.presetMinutes,
    syncStatus:
      "Web fallback active. Apple Watch sync is represented with mirrored dashboard data and demo nap controls.",
  };
}
