import { NextResponse } from "next/server";
import { computeSummary } from "@/lib/metrics";
import { readState } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await readState();
  return NextResponse.json({ state, summary: computeSummary(state) });
}
