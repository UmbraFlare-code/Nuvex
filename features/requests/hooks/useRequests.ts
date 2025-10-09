"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { UIRequest, RequestStatus } from "../types"
import { listRequests, updateRequestStatus } from "../services/requestsService"
import { cancelRequestByEmployee } from "../services/requestsService"

type Mode = "admin" | "employee"

export function useRequests(mode: Mode, currentUserId?: string) {
  const [requests, setRequests] = useState<UIRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAdminMode = mode === "admin"
  const isEmployeeMode = mode === "employee"

  const reload = useCallback(async (opts?: { status?: RequestStatus | "all"; q?: string }) => {
    setLoading(true)
    setError(null)
    try {
      const data = await listRequests({
        mineOnly: isEmployeeMode,
        userId: currentUserId,
        status: opts?.status ?? "all",
        q: opts?.q,
      })
      setRequests(data)
    } catch (e: any) {
      setError(e.message ?? "No se pudieron cargar las solicitudes")
    } finally {
      setLoading(false)
    }
  }, [isEmployeeMode, currentUserId])

  useEffect(() => { reload() }, [reload])

  // ---- Helpers de permisos por fila
  const canApprove = useCallback((r: UIRequest) => isAdminMode && r.status === "pending", [isAdminMode])
  const canReject  = useCallback((r: UIRequest) => isAdminMode && r.status === "pending", [isAdminMode])
  const canCancel  = useCallback(
    (r: UIRequest) => isEmployeeMode && r.status === "pending" && r.userId === currentUserId,
    [isEmployeeMode, currentUserId]
  )

  // ---- Acciones (con guardas)
  const approve = useCallback(async (id: string) => {
    if (!isAdminMode) throw new Error("Solo administradores pueden aprobar.")
    await updateRequestStatus(id, "accepted")
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "accepted" } : r))
  }, [isAdminMode])

  const reject = useCallback(async (id: string) => {
    if (!isAdminMode) throw new Error("Solo administradores pueden rechazar.")
    await updateRequestStatus(id, "rejected")
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r))
  }, [isAdminMode])

  const cancel = useCallback(async (id: string) => {
    if (!isEmployeeMode) throw new Error("Solo empleados pueden cancelar.")
    const row = requests.find(r => r.id === id)
    if (!row) throw new Error("Solicitud no encontrada.")
    if (!canCancel(row)) throw new Error("No puedes cancelar esta solicitud.")
    await cancelRequestByEmployee(id, currentUserId!)
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: "rejected", reason: "Cancelado por el empleado" } : r)
    )
  }, [isEmployeeMode, currentUserId, requests, canCancel])

  return {
    requests, loading, error, reload,
    isAdminMode, isEmployeeMode,
    canApprove, canReject, canCancel,
    approve, reject, cancel,
  }
}
