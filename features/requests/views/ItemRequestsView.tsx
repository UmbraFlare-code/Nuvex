"use client"

import { useMemo, useState } from "react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useToast } from "@/shared/components/ToastProvider"
import { useRequests } from "../hooks/useRequests"
import type { RequestStatus } from "../types"

import SearchBox from "@/shared/components/SearchBox"
import RequestsSkeleton from "../components/RequestsSkeleton"
import RequestCard from "../components/RequestCard"

import card from "@/shared/styles/primitives/card.module.css"
import styles from "../styles/RequestsView.module.css"

export default function ItemRequestsView({ isAdmin = false }: { isAdmin?: boolean }) {
  const { user } = useAuth()
  const { showToast } = useToast()

  const mode: "admin" | "employee" = isAdmin ? "admin" : "employee"
  const {
    requests, loading, error, reload,
    isAdminMode, isEmployeeMode,
    canApprove, canReject, canCancel,
    approve, reject, cancel,
  } = useRequests(mode, user?.id)

  const [q, setQ] = useState("")
  const [status, setStatus] = useState<RequestStatus | "all">("all")

  const filtered = useMemo(() => {
    const qx = q.trim().toLowerCase()
    return requests.filter(r => {
      const okStatus = status === "all" ? true : r.status === status
      const okQ = !qx.length ? true : [r.title, r.reason ?? "", r.productName ?? "", r.userName ?? ""]
        .some(f => f.toLowerCase().includes(qx))
      return okStatus && okQ
    })
  }, [requests, q, status])

  const onApprove = async (id: string) => {
    try { await approve(id); showToast({ tone: "success", message: "Solicitud aceptada" }) }
    catch (e: any) { showToast({ tone: "error", message: e?.message ?? "No se pudo aceptar" }) }
  }
  const onReject = async (id: string) => {
    try { await reject(id); showToast({ tone: "success", message: "Solicitud rechazada" }) }
    catch (e: any) { showToast({ tone: "error", message: e?.message ?? "No se pudo rechazar" }) }
  }
  const onCancel = async (id: string) => {
    if (!confirm("¿Cancelar esta solicitud?")) return
    try { await cancel(id); showToast({ tone: "success", message: "Solicitud cancelada" }) }
    catch (e: any) { showToast({ tone: "error", message: e?.message ?? "No se pudo cancelar" }) }
  }

  return (
    <div className={styles.requestsView}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{isAdminMode ? "Solicitudes de Productos" : "Mis Solicitudes"}</h1>
          <p className={styles.subtitle}>
            {isAdminMode ? "Aprueba o rechaza solicitudes de inventario." : "Revisa y cancela tus solicitudes pendientes."}
          </p>
        </div>
        <div className={styles.headerRight}>
          <button className="btn" onClick={() => reload({ status, q })}>Actualizar</button>
        </div>
      </header>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder="Buscar por producto, solicitante o motivo…"
          ariaLabel="Buscar solicitudes"
          className={styles.searchGrow}
        />
        <select className={styles.statusSelect} value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="all">Todos</option>
          <option value="pending">Pendientes</option>
          <option value="accepted">Aceptadas</option>
          <option value="rejected">Rechazadas</option>
        </select>
      </div>

      {/* Loading / Error */}
      {loading && <RequestsSkeleton />}
      {error && <div className={`${card.dataCard} ${styles.errorCard}`}>⚠️ {error}</div>}

      {/* Cards Grid */}
      {!loading && !error && (
        <>
          <div className={styles.grid}>
            {filtered.map(r => (
              <RequestCard
                key={r.id}
                data={r}
                isAdmin={isAdminMode}
                onApprove={onApprove}
                onReject={onReject}
                onCancel={onCancel}
                canApprove={canApprove}
                canReject={canReject}
                canCancel={canCancel}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className={`${card.dataCard} ${styles.emptyCard}`}>
              No hay solicitudes para mostrar.
            </div>
          )}
        </>
      )}
    </div>
  )
}
