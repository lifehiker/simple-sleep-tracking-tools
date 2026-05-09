import { NextRequest, NextResponse } from "next/server";
import { createSnoreCheck } from "@/lib/app-state";
import { DEFAULT_THRESHOLD } from "@/lib/constants";
import { updateState } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { threshold?: number };
  const threshold = typeof body.threshold === "number" ? body.threshold : DEFAULT_THRESHOLD;
  const state = await updateState((current) => createSnoreCheck(current, threshold));
  return NextResponse.json({
    ok: true,
    state,
    message:
      "Created a sample snore session with loud-event markers. Browser-safe fallback is active because native overnight recording is not available in this build environment.",
  });
}
