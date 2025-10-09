"use client"

import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend, Cell } from "recharts"
import {
  HiCube,
  HiCurrencyDollar,
  HiExclamationTriangle,
  HiTag,
  HiUserGroup,
} from "react-icons/hi2"

import layout from "@/features/dashboard/styles/Layout.module.css"
import dv from "@/features/dashboard/styles/DashboardView.module.css"
import met from "@/features/dashboard/styles/Metrics.module.css"
import ch from "@/features/dashboard/styles/Charts.module.css"
import tbl from "@/features/dashboard/styles/Tables.module.css"
import nt from "@/features/dashboard/styles/Notes.module.css"

import MetricCard from "../components/MetricCard"
import ChartCard from "../components/ChartCard"
import SectionCard from "../components/SectionCard"
import DashboardSkeleton from "../components/DashboardSkeleton"
import { useDashboardMetrics } from "../hooks/useDashboardMetrics"
import { formatCurrency, CHART_COLORS } from "../services/dashboardService"

export default function DashboardView() {
  const {
    loading,
    error,
    products,
    totalValue,
    categoriesCount,
    lowStockCount,
    activeUsersCount,
    categoryDistribution,
    pinnedNotes,
  } = useDashboardMetrics()

  return (
    <div className={layout.dashboard}>
      {/* Sidebar siempre visible, nunca skeleton */}
      <aside className={layout.sidebarFixed}>
        {/* Aquí va tu Sidebar real */}
      </aside>

      {/* Main con skeleton de contenido */}
      <main className={layout.mainContent}>
        {loading ? (
          <DashboardSkeleton />
        ) : error ? (
          <div className={dv.errorBox}>Error: {error}</div>
        ) : (
          <div className={dv.dashboardView}>
            {/* HEADER */}
            <header className={dv.header}>
              <div>
                <h1 className={dv.title}>Dashboard Gerencial</h1>
                <p className={dv.subtitle}>Resumen estratégico del sistema de inventario</p>
              </div>
              <div className={dv.headerMeta}>
                <span className={dv.metaItem}>
                  Actualizado: {new Date().toLocaleString("es-ES")}
                </span>
              </div>
            </header>

            {/* MÉTRICAS */}
            <div className={met.metricsGrid}>
              <MetricCard
                label="Total Productos"
                value={products.length}
                badge="INVENTARIO"
                description="Productos activos en inventario"
                icon={<HiCube className={met.metricIcon} />}
              />
              <MetricCard
                label="Valor Inventario"
                value={`$${formatCurrency(totalValue)}`}
                badge="FINANZAS"
                description="Valor total del stock actual"
                icon={<HiCurrencyDollar className={met.metricIcon} />}
              />
              <MetricCard
                label="Stock Bajo"
                value={lowStockCount}
                badge="ALERTAS"
                description="Productos requieren reposición"
                icon={<HiExclamationTriangle className={met.metricIcon} />}
              />
              <MetricCard
                label="Categorías"
                value={categoriesCount}
                badge="SISTEMA"
                description="Categorías de productos activas"
                icon={<HiTag className={met.metricIcon} />}
              />
              <MetricCard
                label="Usuarios Activos"
                value={activeUsersCount}
                badge="EQUIPO"
                description="Colaboradores habilitados"
                icon={<HiUserGroup className={met.metricIcon} />}
              />
            </div>

            {/* GRÁFICO */}
            <div className={ch.chartsGrid}>
              <ChartCard title="Distribución por Categoría" subtitle="Porcentaje del valor del inventario">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Tooltip formatter={(v: number) => `$${formatCurrency(Number(v))}`} />
                    <Legend />
                    <Pie
                      data={categoryDistribution}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {categoryDistribution.map((_, idx) => (
                        <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* TABLA */}
            <SectionCard title="Detalle por Categoría" subtitle="Valor total y cantidad de productos">
              <div className={tbl.tableWrapper}>
                <table className={tbl.table}>
                  <thead>
                    <tr>
                      <th>Categoría</th>
                      <th>Valor Total</th>
                      <th>Cantidad Productos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryDistribution.map((row) => (
                      <tr key={row.name}>
                        <td>{row.name}</td>
                        <td>${formatCurrency(row.value)}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* NOTAS */}
            <SectionCard title="Notas Fijadas" subtitle="Recordatorios clave del equipo">
              <div className={nt.notesGrid}>
                {pinnedNotes.length > 0 ? (
                  pinnedNotes.map((n) => (
                    <div key={n.id} className={nt.noteCard}>
                      <div className={nt.noteHeader}>
                        <h4 className={nt.noteTitle}>{n.title}</h4>
                        <span className={nt.noteDate}>
                          {new Date(n.created_at ?? Date.now()).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                      <p className={nt.noteBody}>{n.description}</p>
                    </div>
                  ))
                ) : (
                  <div className={tbl.tableEmpty}>No hay notas fijadas</div>
                )}
              </div>
            </SectionCard>
          </div>
        )}
      </main>
    </div>
  )
}
