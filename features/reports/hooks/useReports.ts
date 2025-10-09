"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { Dataset, ReportData, ReportFilters, FilterOptions } from "../types"
import { loadFilterOptions, listMovements, listReportRequests } from "../services/reportsService"

export function useReports(initial: ReportFilters) {
  const [filters, setFilters] = useState<ReportFilters>(initial)
  const [options, setOptions] = useState<FilterOptions>({ users: [], products: [] })
  const [data, setData] = useState<ReportData>({
    movements: [],
    requests: [],
    byActionType: {},
    byRequestStatus: {},
    totals: { movements: 0, requests: 0, quantitiesByType: {} },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async (next?: Partial<ReportFilters>) => {
    setLoading(true)
    setError(null)
    try {
      const merged: ReportFilters = { ...filters, ...(next ?? {}) }
      const [movs, reqs] = await Promise.all([
        merged.dataset === "actions" ? listMovements(merged) : Promise.resolve([]),
        merged.dataset === "requests" ? listReportRequests(merged) : Promise.resolve([]),
      ])

      // agregados
      const byActionType: Record<string, number> = {}
      const qtyByType: Record<string, number> = {}
      movs.forEach(m => {
        byActionType[m.type] = (byActionType[m.type] ?? 0) + 1
        qtyByType[m.type] = (qtyByType[m.type] ?? 0) + Math.abs(m.quantity)
      })

      const byRequestStatus: Record<string, number> = {}
      reqs.forEach(r => {
        byRequestStatus[r.status] = (byRequestStatus[r.status] ?? 0) + 1
      })

      setData({
        movements: movs,
        requests: reqs,
        byActionType,
        byRequestStatus,
        totals: {
          movements: movs.length,
          requests: reqs.length,
          quantitiesByType: qtyByType,
        },
      })
      setFilters(merged)
    } catch (e: any) {
      setError(e.message ?? "No se pudieron cargar los reportes")
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    (async () => {
      try {
        const opts = await loadFilterOptions()
        setOptions(opts)
      } catch { /* opcional */ }
    })()
  }, [])

  // búsqueda client-side adicional
  const filteredMovements = useMemo(() => {
    const q = (filters.q ?? "").trim().toLowerCase()
    if (!q) return data.movements
    return data.movements.filter(m =>
      [m.productName ?? "", m.userName ?? "", m.reason ?? "", m.type]
        .some(f => f.toLowerCase().includes(q))
    )
  }, [data.movements, filters.q])

  const filteredRequests = useMemo(() => {
    const q = (filters.q ?? "").trim().toLowerCase()
    if (!q) return data.requests
    return data.requests.filter(r =>
      [r.productName ?? "", r.userName ?? "", r.reason ?? "", r.title]
        .some(f => f.toLowerCase().includes(q))
    )
  }, [data.requests, filters.q])

  return {
    filters, setFilters, reload,
    options, data,
    rows: filters.dataset === "actions" ? filteredMovements : filteredRequests,
    loading, error,
  }
}
