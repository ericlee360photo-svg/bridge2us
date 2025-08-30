// lib/supabaseAdmin.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only

if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL missing");
if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY missing (server)");

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false }
});
