// app/api/test-service/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// This proves we are bypassing RLS: we attempt an insert that would FAIL under RLS with anon/auth roles.
export async function GET() {
  try {
    const id = crypto.randomUUID();
    const { error } = await supabaseAdmin
      .from("users") // or "profiles" if that's your table
      .insert({ id, email: "service-check@example.com" });

    return NextResponse.json({
      ok: !error,
      error: error?.message ?? null,
      envs: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
