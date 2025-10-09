// features/users/services/registrationRequestsService.ts
import { supabase } from "@/lib/supabaseClient"
import type { UIRegistrationRequest } from "../types"

const TABLE = "registration_requests"

function mapRow(r: any): UIRegistrationRequest {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    status: r.status,
    requested_at: r.requested_at,          // ✅ existe
    updated_at: r.updated_at ?? null,      // ✅ existe
  }
}

export async function listRegistrationRequests(): Promise<UIRegistrationRequest[]> {
  const { data, error } = await supabase
    .from(TABLE)
    // ⛔️ NO pedir created_at (no existe en la tabla)
    .select("id, name, email, role, status, requested_at, updated_at")
    .order("requested_at", { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapRow)
}

export async function deleteRegistrationRequest(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id)
  if (error) throw error
}
