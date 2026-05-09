import { NextRequest, NextResponse } from "next/server";
import { cancelNapTimer, completeNapTimer, startNapTimer } from "@/lib/app-state";
import type { NapPreset } from "@/lib/types";
import { updateState } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { action: "start" | "complete" | "cancel"; presetMinutes?: NapPreset };

  const state = await updateState((current) => {
    if (body.action === "start") {
      return startNapTimer(current, body.presetMinutes ?? 20);
    }
    if (body.action === "complete") {
      return completeNapTimer(current);
    }
    return cancelNapTimer(current);
  });

  return NextResponse.json({ ok: true, state });
}
