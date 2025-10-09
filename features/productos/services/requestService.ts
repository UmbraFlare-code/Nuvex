// features/productos/services/requestService.ts
import { supabase } from "@/lib/supabaseClient"

export type CreateRequestInput = {
  userId: string
  productId: string
  title: string
  reason?: string
  quantity: number
  status?: "pending" | "accepted" | "rejected"
}

export async function createRequest(input: CreateRequestInput) {
  const payload = {
    user_id: input.userId,
    product_id: input.productId,
    title: input.title,
    reason: input.reason ?? null,
    quantity: input.quantity,
    status: input.status ?? "pending",
  }
  const { error } = await supabase.from("requests").insert(payload)
  if (error) throw error
  return true
}
