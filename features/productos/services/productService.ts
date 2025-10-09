// features/productos/services/productService.ts
import { supabase } from "@/lib/supabaseClient"
import type { DBProduct, UIProduct, UIProductInput } from "../types"

const toUI = (p: DBProduct): UIProduct => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: Number(p.price),
  stock: p.stock,
  minStock: p.min_stock,
  description: p.description ?? undefined,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
})

const toDB = (p: UIProductInput) => ({
  name: p.name,
  category: p.category,
  price: p.price,
  stock: p.stock,
  min_stock: p.minStock,
  description: p.description ?? null,
})

export async function fetchProducts(): Promise<UIProduct[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return (data as DBProduct[]).map(toUI)
}

export async function createProduct(input: UIProductInput): Promise<UIProduct> {
  const { data, error } = await supabase.from("products").insert(toDB(input)).select("*").single()
  if (error) throw error
  return toUI(data as DBProduct)
}

export async function updateProduct(id: string, patch: Partial<UIProductInput>): Promise<UIProduct> {
  const { data, error } = await supabase.from("products").update(toDB(patch as UIProductInput)).eq("id", id).select("*").single()
  if (error) throw error
  return toUI(data as DBProduct)
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw error
}

export async function fetchCategories(): Promise<string[]> {
  const { data, error } = await supabase.from("products").select("category")
  if (error) throw error
  return Array.from(new Set((data ?? []).map((d: any) => d.category))).sort()
}
