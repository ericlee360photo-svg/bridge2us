// app/api/users/complete/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { id, email, display_name } = body ?? {};

  if (!id || !email) {
    return NextResponse.json({ error: "Missing id/email" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("users") // or "profiles"
    .upsert({ id, email, display_name }, { onConflict: "id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
