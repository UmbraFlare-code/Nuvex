"use client"

import { useState, useMemo } from "react"
import { MdDownload, MdFilterList } from "react-icons/md"
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

// ⚡ Importar pdfmake
import pdfMake from "pdfmake/build/pdfmake"
import * as pdfFonts from "pdfmake/build/vfs_fonts"

;(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs

export default function ReportsView() {
  const { products, actions, users } = useGlobal()
  const [filterType, setFilterType] = useState<"producto" | "empleado">("producto")
  const [selectedProduct, setSelectedProduct] = useState<string>("todos")
  const [selectedEmployee, setSelectedEmployee] = useState<string>("todos")
  const [dateFrom, setDateFrom] = useState<string>("2024-01-01")
  const [dateTo, setDateTo] = useState<string>("2024-12-31")

  // === Movimientos (acciones) por mes ===
  const productMovements = useMemo(() => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const result = months.map((m) => ({ month: m, entradas: 0, salidas: 0 }))

    actions.forEach((a) => {
      const d = new Date(a.createdAt)
      if (d >= new Date(dateFrom) && d <= new Date(dateTo)) {
        const idx = d.getMonth()
        if (a.type === "entrada") result[idx].entradas += a.quantity
        if (a.type === "salida") result[idx].salidas += Math.abs(a.quantity)
      }
    })
    return result
  }, [actions, dateFrom, dateTo])

  // === Acciones por empleado ===
  const employeeActions = useMemo(() => {
    const counts: Record<string, number> = {}
    actions.forEach((a) => {
      const user = users.find((u) => u.id === a.userId)
      if (user) counts[user.name] = (counts[user.name] || 0) + 1
    })
    return Object.entries(counts).map(([name, acciones]) => ({ name, acciones }))
  }, [actions, users])

  // === Descargar reporte PDF con pdfmake ===
  const handleDownloadPDF = () => {
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)

    const docDefinition: any = {
      content: [
        { text: "REPORTE DE INVENTARIO", style: "header" },
        {
          text: `Tipo de Reporte: ${filterType === "producto" ? "Por Producto" : "Por Empleado"}`,
          margin: [0, 10, 0, 0],
        },
        { text: `Fecha: ${new Date().toLocaleDateString("es-ES")}` },
        { text: `Período: ${dateFrom} - ${dateTo}`, margin: [0, 0, 0, 10] },

        { text: "Resumen", style: "subheader" },
        {
          ul: [
            `Total de Productos: ${products.length}`,
            `Valor Total del Inventario: $${totalValue.toFixed(2)}`,
            `Productos con Stock Bajo: ${products.filter((p) => p.stock <= p.minStock).length}`,
            `Categorías Activas: ${new Set(products.map((p) => p.category)).size}`,
          ],
        },

        { text: "Productos", style: "subheader", margin: [0, 15, 0, 5] },
        {
          table: {
            widths: ["*", "auto", "auto", "auto"],
            body: [
              ["Producto", "Categoría", "Stock", "Valor Total"],
              ...products.map((p) => [
                p.name,
                p.category,
                p.stock,
                `$${(p.price * p.stock).toFixed(2)}`,
              ]),
            ],
          },
        },

        { text: "Acciones por Empleado", style: "subheader", margin: [0, 15, 0, 5] },
        {
          table: {
            widths: ["*", "auto"],
            body: [
              ["Empleado", "Acciones"],
              ...employeeActions.map((e) => [e.name, e.acciones.toString()]),
            ],
          },
        },

        { text: "Movimientos Mensuales", style: "subheader", margin: [0, 15, 0, 5] },
        {
          table: {
            widths: ["auto", "auto", "auto"],
            body: [
              ["Mes", "Entradas", "Salidas"],
              ...productMovements.map((m) => [m.month, m.entradas, m.salidas]),
            ],
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: "center", margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
      },
      defaultStyle: { fontSize: 10 },
    }

    pdfMake.createPdf(docDefinition).download(`reporte-inventario-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  return (
    <div className={styles.reportsView}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Reportes</h1>
          <p className={styles.subtitle}>Genere y descargue reportes de inventario</p>
        </div>
        <button className={styles.downloadButton} onClick={handleDownloadPDF}>
          <MdDownload size={20} />
          <span>Descargar PDF</span>
        </button>
      </div>

      {/* Filtros */}
      <div className={styles.filtersCard}>
        <div className={styles.filtersHeader}>
          <MdFilterList size={20} />
          <h2>Filtros de Reporte</h2>
        </div>
        <div className={styles.filtersGrid}>
          <div className={styles.filterGroup}>
            <label>Tipo de Reporte:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "producto" | "empleado")}
              className={styles.select}
            >
              <option value="producto">Por Producto</option>
              <option value="empleado">Por Empleado</option>
            </select>
          </div>

          {filterType === "producto" ? (
            <div className={styles.filterGroup}>
              <label>Producto:</label>
              <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className={styles.select}>
                <option value="todos">Todos los productos</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className={styles.filterGroup}>
              <label>Empleado:</label>
              <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className={styles.select}>
                <option value="todos">Todos los empleados</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.filterGroup}>
            <label>Fecha Desde:</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={styles.input} />
          </div>

          <div className={styles.filterGroup}>
            <label>Fecha Hasta:</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={styles.input} />
          </div>
        </div>
      </div>

      {/* Charts (se mantienen con Recharts) */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Movimientos de Productos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productMovements}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
              <Legend />
              <Bar dataKey="entradas" fill="#10b981" name="Entradas" />
              <Bar dataKey="salidas" fill="#ef4444" name="Salidas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Acciones por Empleado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employeeActions} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" stroke="#6b7280" width={120} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
              <Bar dataKey="acciones" fill="#2563eb" name="Acciones" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
