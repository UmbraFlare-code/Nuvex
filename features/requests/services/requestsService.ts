import { supabase } from "@/lib/supabaseClient"
import type { UIRequest, UIRequestInput, RequestStatus } from "../types"

const TABLE = "requests"

export async function listRequests(opts?: {
  mineOnly?: boolean
  userId?: string
  status?: RequestStatus | "all"
  q?: string
}): Promise<UIRequest[]> {
  let query = supabase
    .from(TABLE)
    .select(`
      id, user_id, product_id, title, reason, status, quantity, created_at, updated_at,
      users(name),
      products(name)
    `)
    .order("created_at", { ascending: false })

  if (opts?.mineOnly && opts.userId) query = query.eq("user_id", opts.userId)
  if (opts?.status && opts.status !== "all") query = query.eq("status", opts.status)

  const { data, error } = await query
  if (error) throw error

  const rows = (data ?? []) as any[]
  let mapped: UIRequest[] = rows.map(r => ({
    id: r.id,
    userId: r.user_id,
    userName: r.users?.name,
    productId: r.product_id,
    productName: r.products?.name,
    title: r.title,
    reason: r.reason ?? "",
    status: r.status,
    quantity: r.quantity,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }))

  if (opts?.q) {
    const q = opts.q.toLowerCase()
    mapped = mapped.filter(m =>
      [m.title, m.reason ?? "", m.productName ?? "", m.userName ?? ""]
        .some(f => f.toLowerCase().includes(q))
    )
  }

  return mapped
}

export async function createRequest(input: UIRequestInput): Promise<UIRequest> {
  const payload = {
    user_id: input.userId,
    product_id: input.productId,
    title: input.title,
    reason: input.reason ?? null,
    status: input.status ?? "pending",
    quantity: input.quantity,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from(TABLE).insert([payload]).select().single()
  if (error) throw error

  return {
    id: data.id,
    userId: data.user_id,
    productId: data.product_id,
    title: data.title,
    reason: data.reason ?? "",
    status: data.status,
    quantity: data.quantity,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

/** Transición de estado genérica (útil para admin). */
export async function updateRequestStatus(
  id: string,
  status: RequestStatus,
  opts?: { reason?: string }
): Promise<void> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      status,
      ...(opts?.reason ? { reason: opts.reason } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, status")
    .single()

  if (error) throw error
  if (!data) throw new Error("No se pudo actualizar la solicitud (quizá ya fue procesada).")
}

/** Cancelación por el empleado → conservamos registro y marcamos como rejected. */
export async function cancelRequest(id: string): Promise<void> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      status: "rejected",
      reason: "Cancelado por el empleado",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending")
    .select("id")
    .single()

  if (error) throw error
  if (!data) throw new Error("No se pudo cancelar: la solicitud ya fue procesada.")
}

export async function cancelRequestByEmployee(id: string, userId: string): Promise<void> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      status: "rejected",
      reason: "Cancelado por el empleado",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId)
    .eq("status", "pending")
    .select("id")
    .single()

  if (error) throw error
  if (!data) throw new Error("No se pudo cancelar (ya procesada o no es tuya).")
}

/** Si aún así quisieras borrar (no recomendado para auditoría). */
export async function deleteRequest(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id)
  if (error) throw error
}
