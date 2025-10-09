import { supabase } from "@/lib/supabaseClient"
import type {
  ReportFilters, UIMovementRow, UIRequestRow, FilterOptions, Dataset,
} from "../types"

const USERS = "users"
const PRODUCTS = "products"
const ACTIONS = "actions"
const REQUESTS = "requests"

/** Opciones para selects */
export async function loadFilterOptions(): Promise<FilterOptions> {
  const [u, p] = await Promise.all([
    supabase.from(USERS).select("id, name").eq("status", "active").order("name", { ascending: true }),
    supabase.from(PRODUCTS).select("id, name").order("name", { ascending: true }),
  ])

  if (u.error) throw u.error
  if (p.error) throw p.error

  return {
    users: (u.data ?? []) as any[],
    products: (p.data ?? []) as any[],
  }
}

/** Lista movimientos (actions) aplicando filtros */
export async function listMovements(filters: ReportFilters): Promise<UIMovementRow[]> {
  let q = supabase
    .from(ACTIONS)
    .select("id, type, quantity, reason, status, created_at, user_id, product_id, users(name), products(name)")
    .order("created_at", { ascending: false })

  // Filtros
  if (filters.mineOnly && filters.currentUserId) q = q.eq("user_id", filters.currentUserId)
  if (filters.userId && filters.userId !== "all") q = q.eq("user_id", filters.userId)
  if (filters.productId && filters.productId !== "all") q = q.eq("product_id", filters.productId)
  if (filters.actionType && filters.actionType !== "all") q = q.eq("type", filters.actionType)
  if (filters.dateFrom) q = q.gte("created_at", filters.dateFrom)
  if (filters.dateTo) q = q.lte("created_at", filters.dateTo + " 23:59:59")

  const { data, error } = await q
  if (error) throw error

  return (data ?? []).map((r: any) => ({
    id: r.id,
    created_at: r.created_at,
    userId: r.user_id,
    userName: r.users?.name,
    productId: r.product_id,
    productName: r.products?.name,
    type: r.type,
    status: r.status,
    quantity: r.quantity,
    reason: r.reason ?? "",
  }))
}

/** Lista solicitudes aplicando filtros */
export async function listReportRequests(filters: ReportFilters): Promise<UIRequestRow[]> {
  let q = supabase
    .from(REQUESTS)
    .select("id, user_id, product_id, title, reason, status, quantity, created_at, users(name), products(name)")
    .order("created_at", { ascending: false })

  if (filters.mineOnly && filters.currentUserId) q = q.eq("user_id", filters.currentUserId)
  if (filters.userId && filters.userId !== "all") q = q.eq("user_id", filters.userId)
  if (filters.productId && filters.productId !== "all") q = q.eq("product_id", filters.productId)
  if (filters.requestStatus && filters.requestStatus !== "all") q = q.eq("status", filters.requestStatus)
  if (filters.dateFrom) q = q.gte("created_at", filters.dateFrom)
  if (filters.dateTo) q = q.lte("created_at", filters.dateTo + " 23:59:59")

  const { data, error } = await q
  if (error) throw error

  return (data ?? []).map((r: any) => ({
    id: r.id,
    created_at: r.created_at,
    userId: r.user_id,
    userName: r.users?.name,
    productId: r.product_id,
    productName: r.products?.name,
    title: r.title,
    reason: r.reason ?? "",
    status: r.status,
    quantity: r.quantity,
  }))
}

/** Carga dataset seleccionado (actions/requests) */
export async function loadDataset(dataset: Dataset, filters: ReportFilters) {
  if (dataset === "actions") return await listMovements(filters)
  return await listReportRequests(filters)
}
