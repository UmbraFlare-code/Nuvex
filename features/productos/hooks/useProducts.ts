// features/productos/hooks/useProducts.ts
"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { UIProduct, UIProductInput } from "../types"
import {
  fetchProducts,
  createProduct,
  updateProduct as serviceUpdate,
  deleteProduct as serviceDelete,
  fetchCategories,
} from "../services/productService"

export function useProducts() {
  const [products, setProducts] = useState<UIProduct[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const [ps, cats] = await Promise.all([fetchProducts(), fetchCategories()])
        setProducts(ps)
        setCategories(cats)
      } catch (e: any) {
        setError(e.message ?? "Error cargando productos")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const addProduct = useCallback(async (input: UIProductInput) => {
    const created = await createProduct(input)
    setProducts((prev) => [created, ...prev])
    if (!categories.includes(created.category)) setCategories((c) => [...c, created.category].sort())
    return created
  }, [categories])

  const updateProduct = useCallback(async (id: string, patch: Partial<UIProductInput>) => {
    const updated = await serviceUpdate(id, patch)
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
    if (!categories.includes(updated.category)) setCategories((c) => [...c, updated.category].sort())
    return updated
  }, [categories])

  const deleteProduct = useCallback(async (id: string) => {
    await serviceDelete(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const getCategories = useCallback(() => categories, [categories])

  const byCategory = useCallback(
    (cat: string) => (cat === "all" ? products : products.filter((p) => p.category === cat)),
    [products]
  )

  const totals = useMemo(
    () => ({
      count: products.length,
      value: products.reduce((acc, p) => acc + p.price * p.stock, 0),
    }),
    [products]
  )

  return {
    products,
    categories,
    loading,
    error,
    totals,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    byCategory,
  }
}
