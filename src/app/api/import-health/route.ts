import { NextResponse } from "next/server";
import { importHealthSample } from "@/lib/app-state";
import { updateState } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST() {
  const state = await updateState((current) => importHealthSample(current));
  return NextResponse.json({
    ok: true,
    state,
    message:
      "Imported a segmented Apple Health sample. In production, replace this guarded fallback with HealthKit sync.",
  });
}
