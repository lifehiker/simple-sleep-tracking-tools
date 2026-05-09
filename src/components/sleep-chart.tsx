import { formatMinutes } from "@/lib/time";
import type { TrendPoint } from "@/lib/types";

export function SleepChart({ points }: { points: TrendPoint[] }) {
  const maxMinutes = Math.max(...points.map((point) => point.totalMinutes), 1);

  return (
    <div className="card p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Recent sleep</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em]">7-day rhythm</h2>
        </div>
        <p className="text-sm text-[var(--muted)]">Total sleep + naps per day</p>
      </div>
      <div className="mt-6 flex h-64 items-end gap-3">
        {points.map((point) => {
          const height = `${Math.max(14, (point.totalMinutes / maxMinutes) * 100)}%`;
          return (
            <div key={point.date} className="flex min-w-0 flex-1 flex-col items-center gap-3">
              <div className="flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-[1.4rem] bg-gradient-to-t from-[var(--accent)] to-[var(--sun)]"
                  style={{ height }}
                  title={`${point.date}: ${formatMinutes(point.totalMinutes)}`}
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-[var(--foreground)]">{point.date}</p>
                <p className="text-[11px] text-[var(--muted)]">{formatMinutes(point.totalMinutes)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
