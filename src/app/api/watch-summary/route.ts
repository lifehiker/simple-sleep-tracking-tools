import { NextResponse } from "next/server";
import { computeWatchSummary } from "@/lib/metrics";
import { readState } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await readState();
  return NextResponse.json({ watch: computeWatchSummary(state) });
}
