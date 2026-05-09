import { NextRequest, NextResponse } from "next/server";
import { deleteLog, normalizeLogInput, upsertLog } from "@/lib/app-state";
import { updateState } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    id?: string;
    start: string;
    end: string;
    kind: "main" | "nap";
    source?: "manual" | "healthkit" | "nap_timer";
    notes?: string;
  };

  const nextLog = normalizeLogInput({
    ...body,
    source: body.source ?? "manual",
  });
  const state = await updateState((current) => upsertLog(current, nextLog));
  return NextResponse.json({ ok: true, state });
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing log id." }, { status: 400 });
  }

  const state = await updateState((current) => deleteLog(current, id));
  return NextResponse.json({ ok: true, state });
}
