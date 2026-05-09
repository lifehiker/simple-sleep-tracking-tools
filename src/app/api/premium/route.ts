import { NextRequest, NextResponse } from "next/server";
import { togglePremium } from "@/lib/app-state";
import { updateState } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { unlocked: boolean };
  const state = await updateState((current) => togglePremium(current, Boolean(body.unlocked)));
  return NextResponse.json({
    ok: true,
    state,
    message:
      "Premium fallback toggled locally. Replace with StoreKit or Stripe only when credentials and account flows are available.",
  });
}
