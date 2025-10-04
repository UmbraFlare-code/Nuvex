"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useGlobal } from "@/features/context/GlobalContext"
import styles from "../styles/DashboardView.module.css"
import {
  HiCube,
  HiCurrencyDollar,
  HiExclamationTriangle,
  HiTag,
} from "react-icons/hi2"

export default function DashboardView() {
  const { products, actions, getLowStockProducts, getTotalValue, getCategories } =
    useGlobal()

  // 🔹 Métricas
  const lowStockCount = getLowStockProducts().length
  const totalValue = getTotalValue()
  const categoriesCount = getCategories().length

  // 🔹 Movimientos reales: agrupamos entradas y salidas por mes
  const monthlyMovements = actions.reduce<Record<string, { month: string; ventas: number; compras: number }>>(
    (acc, action) => {
      const date = new Date(action.createdAt)
      const month = date.toLocaleString("es-ES", { month: "short" })
      if (!acc[month]) {
        acc[month] = { month, ventas: 0, compras: 0 }
      }
      if (action.type === "salida" || action.type === "uso") {
        acc[month].ventas += action.quantity
      } else if (action.type === "entrada" || action.type === "retorno") {
        acc[month].compras += action.quantity
      }
      return acc
    },
    {}
  )
  const monthlyMovementsData = Object.values(monthlyMovements)

  // 🔹 Tendencia del inventario: valor acumulado mes a mes
  const inventoryTrend = products.reduce<Record<string, { month: string; valor: number }>>(
    (acc, product) => {
      const date = product.updatedAt || product.createdAt
      const month = date.toLocaleString("es-ES", { month: "short" })
      if (!acc[month]) {
        acc[month] = { month, valor: 0 }
      }
      acc[month].valor += product.price * product.stock
      return acc
    },
    {}
  )
  const inventoryTrendData = Object.values(inventoryTrend)

  return (
    <div className={styles.dashboardView}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard Gerencial</h1>
          <p className={styles.subtitle}>
            Resumen ejecutivo del sistema de inventario
          </p>
        </div>
      </div>

      {/* 🔹 Métricas */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Total Productos</span>
            <HiCube className={styles.metricIcon} />
          </div>
          <div className={styles.metricValue}>{products.length}</div>
          <div className={styles.metricFooter}>
            <span className={styles.metricBadge}>INVENTARIO</span>
          </div>
          <div className={styles.metricDescription}>
            Productos activos en inventario
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Valor Inventario</span>
            <HiCurrencyDollar className={styles.metricIcon} />
          </div>
          <div className={styles.metricValue}>
            $
            {totalValue.toLocaleString("es-ES", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className={styles.metricFooter}>
            <span className={styles.metricBadge}>FINANZAS</span>
          </div>
          <div className={styles.metricDescription}>
            Valor total del stock actual
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Stock Bajo</span>
            <HiExclamationTriangle className={styles.metricIcon} />
          </div>
          <div className={styles.metricValue}>{lowStockCount}</div>
          <div className={styles.metricFooter}>
            <span className={styles.metricBadge}>ALERTAS</span>
          </div>
          <div className={styles.metricDescription}>
            Productos requieren reposición
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Categorías</span>
            <HiTag className={styles.metricIcon} />
          </div>
          <div className={styles.metricValue}>{categoriesCount}</div>
          <div className={styles.metricFooter}>
            <span className={styles.metricBadge}>SISTEMA</span>
          </div>
          <div className={styles.metricDescription}>
            Categorías de productos activas
          </div>
        </div>
      </div>

      {/* 🔹 Gráficos */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Movimientos Mensuales</h3>
            <p className={styles.chartSubtitle}>
              Comparación de ventas vs compras
            </p>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyMovementsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" stroke="#737373" fontSize={12} />
                <YAxis stroke="#737373" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="ventas" fill="#2563eb" name="Ventas" radius={[4, 4, 0, 0]} />
                <Bar dataKey="compras" fill="#64748b" name="Compras" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Tendencia de Inventario</h3>
            <p className={styles.chartSubtitle}>
              Evolución del valor del inventario
            </p>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={inventoryTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" stroke="#737373" fontSize={12} />
                <YAxis stroke="#737373" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: "#2563eb", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
