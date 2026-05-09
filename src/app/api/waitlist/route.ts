import { NextRequest, NextResponse } from "next/server";
import { addWaitlistLead } from "@/lib/app-state";
import { updateState } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email: string };
  const state = await updateState((current) => addWaitlistLead(current, body.email));
  return NextResponse.json({
    ok: true,
    count: state.waitlist.length,
    message:
      "Saved locally. This is a safe fallback for PRD email capture and does not require a third-party email platform.",
  });
}
