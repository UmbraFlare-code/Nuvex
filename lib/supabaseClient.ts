// lib/supabaseClient.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const globalForSupabase = globalThis as unknown as {
  __sb?: SupabaseClient
}

export const supabase =
  globalForSupabase.__sb ??
  (globalForSupabase.__sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "inventario-auth", // 🔑 usa SIEMPRE el mismo storageKey
      },
    }
  ))
