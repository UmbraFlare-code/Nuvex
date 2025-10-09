"use client"

import { useMemo, useState } from "react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useToast } from "@/shared/components/ToastProvider"
import SearchBox from "@/shared/components/SearchBox"

import { useRegistrationRequestsSimple } from "../hooks/useRegistrationRequests"
import RegistrationRequestsSkeleton from "../components/RegistrationRequestsSkeleton"

import tbl from "@/shared/styles/primitives/table.module.css"
import card from "@/shared/styles/primitives/card.module.css"
import { HiTrash } from "react-icons/hi2"
import styles from "../styles/RegistrationRequestsView.module.css"   // ✅ nuevo CSS

export default function RegistrationRequestsView() {
  const { isAdmin } = useAuth()
  const { showToast } = useToast()
  const { rows, loading, error, reload, remove } = useRegistrationRequestsSimple()
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    const qx = q.trim().toLowerCase()
    if (!qx.length) return rows
    return rows.filter(r =>
      [r.name, r.email, r.role, r.status]
        .some(f => (f ?? "").toLowerCase().includes(qx))
    )
  }, [rows, q])

  if (!isAdmin) {
    return <div className={card.dataCard} style={{ padding: 16 }}>No autorizado.</div>
  }

  const onDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta solicitud?")) return
    try {
      await remove(id)
      showToast({ tone: "success", message: "Solicitud eliminada" })
    } catch (e: any) {
      showToast({ tone: "error", message: e?.message ?? "No se pudo eliminar" })
    }
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={`${card.dataCard} ${styles.header}`}>
        <div>
          <h2>Solicitudes de Registro</h2>
          <p>Visualiza y elimina solicitudes del personal.</p>
        </div>
        <div>
          <button className="btn" onClick={() => reload()}>Actualizar</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className={`${card.dataCard} ${styles.toolbar}`}>
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder="Buscar por nombre, correo, rol o estado…"
          ariaLabel="Buscar registro"
          className={styles.searchBox}
        />
      </div>

      {/* Loading / Error */}
      {loading && <RegistrationRequestsSkeleton />}

      {/* Tabla */}
      {!loading && !error && (
        <div className={card.dataCard} style={{ padding: 0 }}>
          <div className={`${tbl.tableWrapper} ${styles.tableWrapper}`}>
            <table className={tbl.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th style={{ width: 140 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td>{new Date(r.requested_at ?? Date.now()).toLocaleDateString("es-ES")}</td>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.role === "admin" ? "Administrador" : "Empleado"}</td>
                    <td>{r.status}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className="btn" onClick={() => onDelete(r.id)} title="Eliminar solicitud">
                          <HiTrash /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: 16 }}>
                      No hay solicitudes para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
