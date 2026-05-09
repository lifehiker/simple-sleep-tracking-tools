import { NextRequest, NextResponse } from "next/server";
import { updateOnboarding, updatePermission, updateSettings } from "@/lib/app-state";
import { updateState } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    settings?: Parameters<typeof updateSettings>[1];
    onboarding?: Parameters<typeof updateOnboarding>[1];
    permission?: { name: "healthKit" | "notifications" | "microphone"; value: "pending" | "granted" | "declined" };
  };

  const state = await updateState((current) => {
    let next = current;
    if (body.settings) {
      next = updateSettings(next, body.settings);
    }
    if (body.onboarding) {
      next = updateOnboarding(next, body.onboarding);
    }
    if (body.permission) {
      next = updatePermission(next, body.permission.name, body.permission.value);
    }
    return next;
  });

  return NextResponse.json({ ok: true, state });
}
