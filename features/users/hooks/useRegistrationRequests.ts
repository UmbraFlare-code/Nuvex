"use client"

import { useCallback, useEffect, useState } from "react"
import type { UIRegistrationRequest } from "../types"
import {
  listRegistrationRequests,
  deleteRegistrationRequest,
} from "../services/registrationRequestsService"

export function useRegistrationRequestsSimple() {
  const [rows, setRows] = useState<UIRegistrationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listRegistrationRequests()
      setRows(data)
    } catch (e: any) {
      setError(e.message ?? "No se pudieron cargar las solicitudes")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  const remove = useCallback(async (id: string) => {
    await deleteRegistrationRequest(id)
    setRows(prev => prev.filter(r => r.id !== id))
  }, [])

  return { rows, loading, error, reload, remove }
}
