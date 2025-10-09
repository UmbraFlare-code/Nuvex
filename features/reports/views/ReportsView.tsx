"use client"

import { useMemo, useState } from "react"
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend, Cell } from "recharts"

import { useAuth } from "@/features/auth/hooks/useAuth"
import { useReports } from "../hooks/useReports"
import FiltersBar from "../components/FiltersBar"
import ReportsSkeleton from "../components/ReportsSkeleton"

import tbl from "@/shared/styles/primitives/table.module.css"
import card from "@/shared/styles/primitives/card.module.css"
import rpv from "../styles/ReportsView.module.css"

const CHART_COLORS = ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#22c55e","#f97316"]

export default function ReportsView({ isAdmin = false }: { isAdmin?: boolean }) {
  const { user } = useAuth()
  const [dataset, setDataset] = useState<"actions" | "requests">("actions")

  const {
    filters, setFilters, reload, options, data, rows, loading, error,
  } = useReports({
    dataset,
    mineOnly: !isAdmin,
    currentUserId: user?.id,
    userId: "all",
    productId: "all",
    actionType: "all",
    requestStatus: "all",
  })

  const chartData = useMemo(() => {
    if (filters.dataset === "actions") {
      return Object.entries(data.byActionType).map(([name, value]) => ({ name, value }))
    }
    return Object.entries(data.byRequestStatus).map(([name, value]) => ({ name, value }))
  }, [filters.dataset, data])

  const onClearFilters = () => {
    setFilters(f => ({
      ...f,
      userId: "all",
      productId: "all",
      dateFrom: undefined,
      dateTo: undefined,
      q: "",
      actionType: "all",
      requestStatus: "all",
    }))
    reload({})
  }

  const exportCSV = () => {
    const headers =
      filters.dataset === "actions"
        ? ["Fecha","Empleado","Producto","Tipo","Cantidad","Estado","Motivo"]
        : ["Fecha","Solicitante","Producto","Cantidad","Estado","Título","Motivo"]

    const content = rows.map((r: any) =>
      filters.dataset === "actions"
        ? [
            r.created_at ?? "",
            r.userName ?? "",
            r.productName ?? "",
            r.type,
            r.quantity,
            r.status,
            (r.reason ?? "").replaceAll("\n"," ").replaceAll(","," "),
          ].join(",")
        : [
            r.created_at ?? "",
            r.userName ?? "",
            r.productName ?? "",
            r.quantity,
            r.status,
            (r.title ?? "").replaceAll("\n"," ").replaceAll(","," "),
            (r.reason ?? "").replaceAll("\n"," ").replaceAll(","," "),
          ].join(",")
    )

    const csv = [headers.join(","), ...content].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reporte_${filters.dataset}_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={rpv.container}>
      {/* Header */}
      <div className={`${card.dataCard} ${rpv.headerCard}`}>
        <div>
          <h2 className={rpv.headerTitle}>Reportes</h2>
          <p className={rpv.headerSubtitle}>
            {isAdmin
              ? "Analiza el inventario y solicitudes del equipo."
              : "Consulta tus movimientos y solicitudes."}
          </p>
        </div>
        <div className={rpv.headerRight}>
          <label htmlFor="dataset">Dataset:</label>
          <select
            id="dataset"
            className={rpv.datasetSelect}
            value={filters.dataset}
            onChange={(e) => {
              const ds = e.target.value as "actions" | "requests"
              setFilters(f => ({ ...f, dataset: ds }))
              setDataset(ds)
              reload({ dataset: ds })
            }}
          >
            <option value="actions">Movimientos de inventario</option>
            <option value="requests">Solicitudes</option>
          </select>
        </div>
      </div>

      {/* Filtros */}
      <div className={`${card.dataCard} ${rpv.toolbarCard}`}>
        <FiltersBar
          dataset={filters.dataset}
          users={options.users}
          products={options.products}
          value={{
            q: filters.q,
            userId: filters.userId,
            productId: filters.productId,
            dateFrom: filters.dateFrom,
            dateTo: filters.dateTo,
            actionType: filters.actionType,
            requestStatus: filters.requestStatus,
          }}
          onChange={(patch) => setFilters(prev => ({ ...prev, ...patch }))}
        />

        {/* Botones unificados */}
        <div className={rpv.actionsRow}>
          <button className="btn" onClick={() => reload({})}>Actualizar</button>
          <button className="btn btn-secondary" onClick={onClearFilters}>Limpiar</button>
          <button className="btn btn-primary" onClick={exportCSV}>Exportar CSV</button>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && <ReportsSkeleton />}
      {error && <div className={`${card.dataCard} ${rpv.errorCard}`}>⚠️ {error}</div>}

      {/* Métricas + gráfico + tabla */}
      {!loading && !error && (
        <>
          <div className={`${card.dataCard} ${rpv.metricsGrid}`}>
            <Metric label="Filas" value={rows.length} />
            {filters.dataset === "actions" ? (
              <>
                <Metric label="Movimientos" value={data.totals.movements} />
                {Object.entries(data.totals.quantitiesByType).map(([k, v]) => (
                  <Metric key={k} label={`Qty ${k}`} value={v as number} />
                ))}
              </>
            ) : (
              <>
                <Metric label="Solicitudes" value={data.totals.requests} />
                {Object.entries(data.byRequestStatus).map(([k, v]) => (
                  <Metric key={k} label={k} value={v as number} />
                ))}
              </>
            )}
          </div>

          <div className={`${card.dataCard} ${rpv.chartCard}`}>
            <div className={rpv.chartHeader}>
              <h3 className={rpv.chartTitle}>
                {filters.dataset === "actions"
                  ? "Movimientos por tipo"
                  : "Solicitudes por estado"}
              </h3>
            </div>
            <div className={rpv.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    {chartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`${card.dataCard} ${rpv.tableCard}`}>
            <div
              className={tbl.tableWrapper + " " + rpv.tableScroll}
              style={{ border: "none" }}
            >
              <table className={tbl.table}>
                <thead>
                  {filters.dataset === "actions" ? (
                    <tr>
                      <th>Fecha</th>
                      {isAdmin && <th>Empleado</th>}
                      <th>Producto</th>
                      <th>Tipo</th>
                      <th>Cantidad</th>
                      <th>Estado</th>
                      <th>Motivo</th>
                    </tr>
                  ) : (
                    <tr>
                      <th>Fecha</th>
                      {isAdmin && <th>Solicitante</th>}
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Estado</th>
                      <th>Título</th>
                      <th>Motivo</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {rows.map((r: any) =>
                    filters.dataset === "actions" ? (
                      <tr key={r.id}>
                        <td>{new Date(r.created_at ?? Date.now()).toLocaleDateString("es-ES")}</td>
                        {isAdmin && <td>{r.userName ?? "—"}</td>}
                        <td>{r.productName ?? "—"}</td>
                        <td>{r.type}</td>
                        <td>{r.quantity}</td>
                        <td>{r.status}</td>
                        <td>{r.reason || "—"}</td>
                      </tr>
                    ) : (
                      <tr key={r.id}>
                        <td>{new Date(r.created_at ?? Date.now()).toLocaleDateString("es-ES")}</td>
                        {isAdmin && <td>{r.userName ?? "—"}</td>}
                        <td>{r.productName ?? "—"}</td>
                        <td>{r.quantity}</td>
                        <td>{r.status}</td>
                        <td>{r.title}</td>
                        <td>{r.reason || "—"}</td>
                      </tr>
                    )
                  )}
                  {rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={isAdmin ? 7 : 6}
                        style={{ textAlign: "center", padding: 16 }}
                      >
                        No hay resultados para los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className={rpv.metric}>
      <div className={rpv.metricLabel}>{label}</div>
      <div className={rpv.metricValue}>{value}</div>
    </div>
  )
}
