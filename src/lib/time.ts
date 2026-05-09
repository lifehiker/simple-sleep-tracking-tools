const MINUTES_IN_DAY = 24 * 60;

export function toIso(input: Date | string): string {
  return typeof input === "string" ? new Date(input).toISOString() : input.toISOString();
}

export function addMinutes(input: Date | string, minutes: number) {
  const date = new Date(input);
  return new Date(date.getTime() + minutes * 60_000);
}

export function diffMinutes(start: Date | string, end: Date | string) {
  return Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60_000));
}

export function startOfDay(input: Date | string) {
  const date = new Date(input);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function formatMinutes(totalMinutes: number) {
  const abs = Math.abs(totalMinutes);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  if (hours === 0) {
    return `${minutes}m`;
  }
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
}

export function formatHours(totalMinutes: number) {
  const sign = totalMinutes < 0 ? "-" : "";
  const hours = Math.abs(totalMinutes) / 60;
  return `${sign}${hours.toFixed(1)}h`;
}

export function formatDateLabel(input: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(input));
}

export function formatDateTime(input: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(input));
}

export function formatTime(input: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(input));
}

export function minutesSinceMidnight(input: Date | string) {
  const date = new Date(input);
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}

export function minuteDistance(a: number, b: number) {
  const diff = Math.abs(a - b);
  return Math.min(diff, MINUTES_IN_DAY - diff);
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(max, Math.max(min, num));
}

export function formatClock(minutes: number) {
  const normalized = ((minutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const hours24 = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${mins.toString().padStart(2, "0")} ${suffix}`;
}
