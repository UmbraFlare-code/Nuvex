// features/dashboard/services/dashboardService.ts
import { createClient } from "@supabase/supabase-js"

/**
 * ENV requeridos:
 * NEXT_PUBLIC_SUPABASE_URL
 * NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseKey)

// ===============================
// Tipos (derivados del schema)
// ===============================
export type Role = "admin" | "employee"
export type UserStatus = "active" | "inactive"
export type RequestStatus = "pending" | "accepted" | "rejected"
export type ActionType = "entrada" | "salida" | "ajuste" | "uso" | "retorno"
export type ActionStatus = "completada" | "pendiente" | "cancelada"

export interface DBUser {
  id: string
  username: string
  name: string
  email: string
  password: string
  role: Role
  status: UserStatus
  created_at: string
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  min_stock: number
  description: string | null
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  description: string
  is_pinned: boolean
  created_at: string
  updated_at?: string
}

export interface RequestRow {
  id: string
  user_id: string
  title: string
  reason: string | null
  status: RequestStatus
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
}

export interface ActionRow {
  id: string
  type: ActionType
  product_id: string
  user_id: string
  quantity: number // puede ser negativo para "uso/salida"
  reason: string
  status: ActionStatus
  created_at: string
  updated_at: string
}

// ===============================
// Helpers (cálculos de dashboard)
// ===============================
export function getLowStock(products: Product[]) {
  return products.filter(p => p.stock <= p.min_stock)
}

export function getTotalValue(products: Product[]) {
  return products.reduce((acc, p) => acc + Number(p.price) * Number(p.stock), 0)
}

export function getCategories(products: Product[]) {
  const categories = products.map(p => p.category)
  const unique: string[] = []
  categories.forEach(c => { if (!unique.includes(c)) unique.push(c) })
  return unique
}

export function getCategoryDistribution(products: Product[]) {
  const grouped = products.reduce((acc, p) => {
    const cat = p.category
    if (!acc[cat]) acc[cat] = { value: 0, count: 0 }
    acc[cat].value += Number(p.price) * Number(p.stock)
    acc[cat].count += 1
    return acc
  }, {} as Record<string, { value: number; count: number }>)
  return Object.entries(grouped).map(([name, { value, count }]) => ({ name, value, count }))
}

export function formatCurrency(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export const CHART_COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#8B5CF6"]

// ===============================
// Queries: READ
// ===============================
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return data as Product[]
}

export async function fetchUsers(): Promise<DBUser[]> {
  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return data as DBUser[]
}

export async function fetchNotes(params?: { pinnedOnly?: boolean; userId?: string }): Promise<Note[]> {
  let query = supabase.from("notes").select("*").order("created_at", { ascending: false })
  if (params?.pinnedOnly) query = query.eq("is_pinned", true)
  if (params?.userId) query = query.eq("user_id", params.userId)
  const { data, error } = await query
  if (error) throw error
  return data as Note[]
}

export async function fetchRequests(params?: { status?: RequestStatus; userId?: string }): Promise<RequestRow[]> {
  let query = supabase.from("requests").select("*").order("created_at", { ascending: false })
  if (params?.status) query = query.eq("status", params.status)
  if (params?.userId) query = query.eq("user_id", params.userId)
  const { data, error } = await query
  if (error) throw error
  return data as RequestRow[]
}

export async function fetchActions(params?: { type?: ActionType; status?: ActionStatus }): Promise<ActionRow[]> {
  let query = supabase.from("actions").select("*").order("created_at", { ascending: false })
  if (params?.type) query = query.eq("type", params.type)
  if (params?.status) query = query.eq("status", params.status)
  const { data, error } = await query
  if (error) throw error
  return data as ActionRow[]
}

// ===============================
// Mutations: CRUD comunes
// ===============================
// Products
export async function createProduct(input: Omit<Product, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("products").insert(input).select().single()
  if (error) throw error
  return data as Product
}
export async function updateProduct(id: string, patch: Partial<Product>) {
  const { data, error } = await supabase.from("products").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id).select().single()
  if (error) throw error
  return data as Product
}
export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw error
}

// Users
export async function updateUserStatus(id: string, status: UserStatus) {
  const { data, error } = await supabase.from("users").update({ status }).eq("id", id).select().single()
  if (error) throw error
  return data as DBUser
}

// Notes
export async function createNote(input: Omit<Note, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("notes").insert(input).select().single()
  if (error) throw error
  return data as Note
}
export async function updateNote(id: string, patch: Partial<Note>) {
  const { data, error } = await supabase.from("notes").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id).select().single()
  if (error) throw error
  return data as Note
}
export async function deleteNote(id: string) {
  const { error } = await supabase.from("notes").delete().eq("id", id)
  if (error) throw error
}
export async function togglePinNote(id: string, is_pinned: boolean) {
  return updateNote(id, { is_pinned })
}

// Requests
export async function createRequest(input: Omit<RequestRow, "id" | "created_at" | "updated_at" | "status"> & { status?: RequestStatus }) {
  const { data, error } = await supabase.from("requests").insert({ ...input, status: input.status ?? "pending" }).select().single()
  if (error) throw error
  return data as RequestRow
}
export async function updateRequest(id: string, patch: Partial<RequestRow>) {
  const { data, error } = await supabase.from("requests").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id).select().single()
  if (error) throw error
  return data as RequestRow
}
export async function deleteRequest(id: string) {
  const { error } = await supabase.from("requests").delete().eq("id", id)
  if (error) throw error
}

// Actions
export async function createAction(input: Omit<ActionRow, "id" | "created_at" | "updated_at" | "status"> & { status?: ActionStatus }) {
  const { data, error } = await supabase.from("actions").insert({ ...input, status: input.status ?? "pendiente" }).select().single()
  if (error) throw error
  return data as ActionRow
}
export async function updateAction(id: string, patch: Partial<ActionRow>) {
  const { data, error } = await supabase.from("actions").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id).select().single()
  if (error) throw error
  return data as ActionRow
}
export async function deleteAction(id: string) {
  const { error } = await supabase.from("actions").delete().eq("id", id)
  if (error) throw error
}
