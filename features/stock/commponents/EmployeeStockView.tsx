"use client"

import { useState } from "react"
import StockUpdateModal from "@/features/stock/commponents/StockUpdateModal"
import { useGlobal, type Product } from "@/features/context/GlobalContext" // ✅ ahora desde GlobalContext
import {
  MdInventory,
  MdWarning,
  MdSearch,
} from "react-icons/md"
import styles from "../styles/EmployeeStockView.module.css"

// Helpers
const getStockStatus = (product: Product) => {
  if (product.stock <= product.minStock) return "low"
  if (product.stock <= product.minStock * 2) return "warning"
  return "good"
}

const getStockPercentage = (product: Product) =>
  (product.stock / (product.minStock * 3)) * 100

// 🔹 Banner de alerta
function AlertBanner({ count }: { count: number }) {
  return (
    <div className={styles.alertBanner}>
      <MdWarning size={20} className={styles.alertIcon} />
      <div>
        <h3 className={styles.alertTitle}>Atención</h3>
        <p className={styles.alertMessage}>
          {count} producto{count > 1 ? "s" : ""} requiere{count > 1 ? "n" : ""} reposición inmediata
        </p>
      </div>
    </div>
  )
}

// 🔹 Tarjeta de producto
function StockCard({ product, onUpdate }: { product: Product; onUpdate: (p: Product) => void }) {
  const status = getStockStatus(product)
  const stockPercentage = getStockPercentage(product)

  return (
    <div className={styles.productCard}>
      <div className={styles.cardHeader}>
        <MdInventory size={22} className={styles.icon} />
        <div className={styles.headerInfo}>
          <h3 className={styles.productName}>{product.name}</h3>
          <span className={styles.category}>{product.category}</span>
        </div>
        <span className={`${styles.badge} ${styles[`status${status}`]}`}>
          {status === "low" && "Crítico"}
          {status === "warning" && "Bajo"}
          {status === "good" && "Disponible"}
        </span>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.stockNumbers}>
          <div>
            <span className={styles.stockLabel}>Stock</span>
            <span className={styles.stockValue}>{product.stock}</span>
          </div>
          <div>
            <span className={styles.stockLabel}>Mínimo</span>
            <span className={styles.stockValue}>{product.minStock}</span>
          </div>
        </div>

        <div className={styles.stockBar}>
          <div
            className={styles.stockBarFill}
            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
          />
        </div>
      </div>

      <div className={styles.cardFooter}>
        <button
          className={styles.btnPrimary}
          onClick={() => onUpdate(product)} // 👈 abre modal
        >
          Solicitar Reposición
        </button>
      </div>
    </div>
  )
}

// 🔹 Toolbar
function Toolbar({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  total,
}: {
  searchTerm: string
  setSearchTerm: (s: string) => void
  filterStatus: "all" | "low" | "warning" | "good"
  setFilterStatus: (s: "all" | "low" | "warning" | "good") => void
  total: number
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.searchBox}>
        <MdSearch size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value as any)}
        className={styles.select}
      >
        <option value="all">Todos</option>
        <option value="low">Crítico</option>
        <option value="warning">Bajo</option>
        <option value="good">Disponible</option>
      </select>

      <span className={styles.totalCount}>
        {total} producto{total !== 1 && "s"}
      </span>
    </div>
  )
}

// 🔹 Vista principal
export default function EmployeeStockView() {
  const { products } = useGlobal() // ✅ global
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "low" | "warning" | "good">("all")

  const lowStockProducts = products.filter((p) => p.stock <= p.minStock)

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || getStockStatus(product) === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className={styles.stockView}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gestión de Stock</h1>
        <p className={styles.subtitle}>Solicita reposiciones de manera rápida y clara</p>
      </header>

      {lowStockProducts.length > 0 && <AlertBanner count={lowStockProducts.length} />}

      <Toolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        total={filteredProducts.length}
      />

      <div className={styles.stockGrid}>
        {filteredProducts.map((product) => (
          <StockCard
            key={product.id}
            product={product}
            onUpdate={(p) => {
              setSelectedProduct(p)
              setIsModalOpen(true) // 👈 abre modal
            }}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className={styles.emptyState}>
          <MdInventory size={40} />
          <p>No se encontraron productos</p>
        </div>
      )}

      {isModalOpen && selectedProduct && (
        <StockUpdateModal
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
