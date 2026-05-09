import type { NapPreset } from "@/lib/types";

export const FREE_LOG_LIMIT_DAYS = 7;
export const PREMIUM_TREND_WINDOWS = [7, 30, 90] as const;
export const NAP_PRESETS: NapPreset[] = [10, 20, 30, 90];
export const FREE_NAP_PRESET: NapPreset = 20;
export const DEFAULT_THRESHOLD = 0.62;
