// features/productos/types.ts
export type DBProduct = {
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

export type UIProduct = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  minStock: number
  description?: string
  createdAt?: string
  updatedAt?: string
}

export type UIProductInput = Omit<UIProduct, "id" | "createdAt" | "updatedAt">
