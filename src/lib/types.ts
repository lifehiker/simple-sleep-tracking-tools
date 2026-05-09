export type SleepSource = "manual" | "healthkit" | "nap_timer";
export type SleepEntryKind = "main" | "nap";
export type PermissionStatus = "pending" | "granted" | "declined";
export type NapPreset = 10 | 20 | 30 | 90;
export type TrendWindow = 7 | 30 | 90;

export interface SleepSegment {
  id: string;
  start: string;
  end: string;
}

export interface SleepLog {
  id: string;
  start: string;
  end: string;
  source: SleepSource;
  kind: SleepEntryKind;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  segments: SleepSegment[];
}

export interface SleepSettings {
  targetMinutes: number;
  anchorStartMinutes: number;
  anchorEndMinutes: number;
  bedtimeReminderEnabled: boolean;
  bedtimeReminderLeadMinutes: number;
  notificationsEnabled: boolean;
  reminderLabel: string;
}

export interface OnboardingState {
  completed: boolean;
  healthImportExplained: boolean;
  notificationPromptSeen: boolean;
  snorePromptSeen: boolean;
}

export interface PermissionsState {
  healthKit: PermissionStatus;
  notifications: PermissionStatus;
  microphone: PermissionStatus;
}

export interface NapTimerState {
  active: boolean;
  presetMinutes: NapPreset;
  startedAt: string | null;
  endsAt: string | null;
  completedAt: string | null;
}

export interface NapTimerHistoryItem {
  id: string;
  presetMinutes: NapPreset;
  startedAt: string;
  endedAt: string;
  savedLogId?: string;
}

export interface SnoreEvent {
  id: string;
  secondsFromStart: number;
  level: number;
  previewLabel: string;
}

export interface SnoreSession {
  id: string;
  createdAt: string;
  startTime: string;
  durationMinutes: number;
  threshold: number;
  mode: "sample" | "microphone";
  eventCount: number;
  previewOnly: boolean;
  events: SnoreEvent[];
}

export interface PremiumState {
  unlocked: boolean;
  mode: "fallback" | "locked";
  priceLabel: string;
  launchPriceLabel: string;
}

export interface WaitlistLead {
  id: string;
  email: string;
  createdAt: string;
  source: "landing-page";
}

export interface AppState {
  sleepLogs: SleepLog[];
  settings: SleepSettings;
  onboarding: OnboardingState;
  permissions: PermissionsState;
  napTimer: NapTimerState;
  napHistory: NapTimerHistoryItem[];
  snoreSessions: SnoreSession[];
  premium: PremiumState;
  waitlist: WaitlistLead[];
}

export interface DashboardMetrics {
  lastNightMinutes: number;
  sevenDayAverageMinutes: number;
  sleepDebtMinutes: number;
  napCount7d: number;
  bedtimeRangeMinutes: number;
  wakeRangeMinutes: number;
}

export interface TrendPoint {
  date: string;
  totalMinutes: number;
  debtMinutes: number;
  naps: number;
}

export interface WatchSummary {
  lastSleepMinutes: number;
  currentDebtMinutes: number;
  nextNapPreset: NapPreset;
  syncStatus: string;
}

export interface AppSummary {
  metrics: DashboardMetrics;
  trends: TrendPoint[];
  recentLogs: SleepLog[];
  premiumLocked: boolean;
}
