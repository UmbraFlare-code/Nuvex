// features/dashboard/hooks/useDashboardMetrics.ts
"use client"

import { useEffect, useState } from "react"
import {
  fetchProducts,
  fetchUsers,
  fetchNotes,
  getLowStock,
  getTotalValue,
  getCategories,
  getCategoryDistribution,
} from "../services/dashboardService"

export function useDashboardMetrics() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [products, setProducts] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [notes, setNotes] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [p, u, n] = await Promise.all([
          fetchProducts(),
          fetchUsers(),
          fetchNotes({ pinnedOnly: true }),
        ])
        setProducts(p)
        setUsers(u)
        setNotes(n)
      } catch (err: any) {
        setError(err.message ?? "Error al cargar métricas")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const lowStock = getLowStock(products)
  const totalValue = getTotalValue(products)
  const categoriesCount = getCategories(products).length
  const activeUsersCount = users.filter((u: any) => u.status === "active").length
  const categoryDistribution = getCategoryDistribution(products)
  const pinnedNotes = notes.slice(0, 4)

  return {
    loading,
    error,
    products,
    totalValue,
    categoriesCount,
    lowStockCount: lowStock.length,
    activeUsersCount,
    categoryDistribution,
    pinnedNotes,
  }
}
