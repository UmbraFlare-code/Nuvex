"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useMemo } from "react"
import { useGlobal } from "@/features/context/GlobalContext"
import styles from "../styles/DashboardView.module.css"
import {
  HiCube,
  HiCurrencyDollar,
  HiExclamationTriangle,
  HiTag,
  HiUserGroup,
} from "react-icons/hi2"

// Helpers
const currency = (n: number) =>
  n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function DashboardView() {
  const {
    products,
    users,
    notes,
    getLowStockProducts,
    getTotalValue,
    getCategories,
  } = useGlobal()

  // ========== MÉTRICAS BASE ==========
  const lowStock = getLowStockProducts()
  const lowStockCount = lowStock.length
  const totalValue = getTotalValue()
  const categoriesCount = getCategories().length
  const activeUsersCount = useMemo(
    () => users?.filter(u => u.status === "active").length ?? 0,
    [users]
  )

  // ========== DISTRIBUCIÓN POR CATEGORÍA (Pie + tabla fija) ==========
  const categoryDistribution = [
    { name: "Motores", value: 8500, count: 1 },
    { name: "Componentes", value: 7200, count: 2 },
    { name: "Repuestos", value: 1500, count: 1 },
    { name: "Transformadores", value: 2400, count: 1 },
  ]

  // ========== NOTAS FIJADAS ==========
  const pinnedNotes = useMemo(() => notes.filter(n => n.isPinned).slice(0, 4), [notes])

  return (
    <div className={styles.dashboardView}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard Gerencial</h1>
          <p className={styles.subtitle}>Resumen estratégico del sistema de inventario</p>
        </div>
        <div className={styles.headerMeta}>
          <span className={styles.metaItem}>Actualizado: {new Date().toLocaleString("es-ES")}</span>
        </div>
      </div>

      {/* MÉTRICAS PRINCIPALES */}
      <div className={styles.metricsGrid}>
        <MetricCard
          label="Total Productos"
          value={products.length}
          badge="INVENTARIO"
          description="Productos activos en inventario"
          icon={<HiCube className={styles.metricIcon} />}
        />
        <MetricCard
          label="Valor Inventario"
          value={`$${currency(totalValue)}`}
          badge="FINANZAS"
          description="Valor total del stock actual"
          icon={<HiCurrencyDollar className={styles.metricIcon} />}
        />
        <MetricCard
          label="Stock Bajo"
          value={lowStockCount}
          badge="ALERTAS"
          description="Productos requieren reposición"
          icon={<HiExclamationTriangle className={styles.metricIcon} />}
        />
        <MetricCard
          label="Categorías"
          value={categoriesCount}
          badge="SISTEMA"
          description="Categorías de productos activas"
          icon={<HiTag className={styles.metricIcon} />}
        />
        <MetricCard
          label="Usuarios Activos"
          value={activeUsersCount}
          badge="EQUIPO"
          description="Colaboradores habilitados"
          icon={<HiUserGroup className={styles.metricIcon} />}
        />
      </div>

      {/* GRÁFICO DE CATEGORÍAS */}
      <div className={styles.chartsGrid}>
        <ChartCard
          title="Distribución por Categoría"
          subtitle="Porcentaje del valor del inventario"
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Tooltip formatter={(v: number) => `$${currency(v)}`} />
              <Legend />
              <Pie
                data={categoryDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {categoryDistribution.map((_, idx) => (
                  <Cell key={idx} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* TABLA DE CATEGORÍAS */}
      <SectionCard
        title="Detalle por Categoría"
        subtitle="Valor total y cantidad de productos"
      >
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Valor Total</th>
                <th>Cantidad Productos</th>
              </tr>
            </thead>
            <tbody>
              {categoryDistribution.map(row => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>${currency(row.value)}</td>
                  <td>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* NOTAS FIJADAS */}
      <SectionCard title="Notas Fijadas" subtitle="Recordatorios clave del equipo">
        <div className={styles.notesGrid}>
          {pinnedNotes.map(n => (
            <div key={n.id} className={styles.noteCard}>
              <div className={styles.noteHeader}>
                <h4 className={styles.noteTitle}>{n.title}</h4>
                <span className={styles.noteDate}>
                  {new Date(n.createdAt).toLocaleDateString("es-ES")}
                </span>
              </div>
              <p className={styles.noteBody}>{n.description}</p>
            </div>
          ))}
          {pinnedNotes.length === 0 && (
            <div className={styles.tableEmpty}>No hay notas fijadas</div>
          )}
        </div>
      </SectionCard>
    </div>
  )
}

/* ===========================
   Componentes UI reutilizables
=========================== */

function MetricCard({
  label,
  value,
  badge,
  description,
  icon,
}: {
  label: string
  value: number | string
  badge: string
  description: string
  icon?: React.ReactNode
}) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricHeader}>
        <span className={styles.metricLabel}>{label}</span>
        {icon}
      </div>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricFooter}>
        <span className={styles.metricBadge}>{badge}</span>
      </div>
      <div className={styles.metricDescription}>{description}</div>
    </div>
  )
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>{title}</h3>
        {subtitle && <p className={styles.chartSubtitle}>{subtitle}</p>}
      </div>
      <div className={styles.chartContainer}>{children}</div>
    </div>
  )
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
