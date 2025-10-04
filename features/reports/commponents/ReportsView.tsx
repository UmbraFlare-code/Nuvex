"use client"

import { useState, useMemo } from "react"
import { MdFilterList } from "react-icons/md"
import { useGlobal } from "@/features/context/GlobalContext"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import styles from "../styles/ReportsView.module.css"

export default function ReportsView() {
  const { products, actions, users } = useGlobal()
  const [filterType, setFilterType] = useState<"producto" | "empleado">("producto")
  const [selectedProduct, setSelectedProduct] = useState("todos")
  const [selectedEmployee, setSelectedEmployee] = useState("todos")
  const [dateFrom, setDateFrom] = useState("2024-01-01")
  const [dateTo, setDateTo] = useState("2024-12-31")

  const productMovements = useMemo(() => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const result = months.map(m => ({ month: m, entradas: 0, salidas: 0 }))

    actions.forEach(a => {
      const d = new Date(a.createdAt)
      if (d >= new Date(dateFrom) && d <= new Date(dateTo)) {
        const idx = d.getMonth()
        if (a.type === "entrada") result[idx].entradas += a.quantity
        if (a.type === "salida") result[idx].salidas += Math.abs(a.quantity)
      }
    })
    return result
  }, [actions, dateFrom, dateTo])

  const employeeActions = useMemo(() => {
    const counts: Record<string, number> = {}
    actions.forEach(a => {
      const user = users.find(u => u.id === a.userId)
      if (user) counts[user.name] = (counts[user.name] || 0) + 1
    })
    return Object.entries(counts).map(([name, acciones]) => ({ name, acciones }))
  }, [actions, users])

  return (
    <div className={styles.reportsView}>
      <Header />
      <Filters
        filterType={filterType}
        setFilterType={setFilterType}
        products={products}
        users={users}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />
      <div className={styles.chartsGrid}>
        <ChartCard title="Movimientos de Productos">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productMovements}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="entradas" fill="#10b981" name="Entradas" />
              <Bar dataKey="salidas" fill="#ef4444" name="Salidas" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Acciones por Empleado">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employeeActions} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" stroke="#6b7280" width={120} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="acciones" fill="#2563eb" name="Acciones" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

const tooltipStyle = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
}

function Header() {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Reportes</h1>
        <p className={styles.subtitle}>Visualiza el inventario y sus movimientos</p>
      </div>
    </div>
  )
}

function Filters({
  filterType,
  setFilterType,
  products,
  users,
  selectedProduct,
  setSelectedProduct,
  selectedEmployee,
  setSelectedEmployee,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}: any) {
  return (
    <div className={styles.filtersCard}>
      <div className={styles.filtersHeader}>
        <MdFilterList size={20} />
        <h2>Filtros de Reporte</h2>
      </div>
      <div className={styles.filtersGrid}>
        <FilterGroup label="Tipo de Reporte:">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as "producto" | "empleado")}
            className={styles.select}
          >
            <option value="producto">Por Producto</option>
            <option value="empleado">Por Empleado</option>
          </select>
        </FilterGroup>

        {filterType === "producto" ? (
          <FilterGroup label="Producto:">
            <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className={styles.select}>
              <option value="todos">Todos los productos</option>
              {products.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </FilterGroup>
        ) : (
          <FilterGroup label="Empleado:">
            <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} className={styles.select}>
              <option value="todos">Todos los empleados</option>
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </FilterGroup>
        )}

        <FilterGroup label="Fecha Desde:">
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className={styles.input} />
        </FilterGroup>

        <FilterGroup label="Fecha Hasta:">
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className={styles.input} />
        </FilterGroup>
      </div>
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.filterGroup}>
      <label>{label}</label>
      {children}
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>{title}</h3>
      {children}
    </div>
  )
}