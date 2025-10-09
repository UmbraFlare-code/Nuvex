"use client"

import { useMemo, useState } from "react"
import { MdAdd, MdEdit, MdDelete, MdInventory } from "react-icons/md"
import card from "@/shared/styles/primitives/card.module.css"
import badge from "@/shared/styles/primitives/badge.module.css"
import styles from "../styles/ProductsView.module.css"

import EmptyState from "@/shared/components/EmptyState"
import IconButton from "@/shared/components/IconButton"
import ProductsSkeleton from "../components/ProductsSkeleton"
import ProductModal from "../components/ProductModal"
import EmployeeRequestModal from "../components/EmployeeRequestModal"
import { useProducts } from "../hooks/useProducts"
import type { UIProduct, UIProductInput } from "../types"
import { useToast } from "@/shared/components/ToastProvider"
import SearchBox from "@/shared/components/SearchBox"   // ✅ Importa tu componente

type Mode = "admin" | "employee"

export default function ProductsBaseView({ mode }: { mode: Mode }) {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useProducts()
  const { showToast } = useToast()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<UIProduct | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployeeProduct, setSelectedEmployeeProduct] = useState<UIProduct | null>(null)

  const filtered = useMemo(
    () =>
      products.filter(({ name, category }) =>
        [name, category].some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [products, searchTerm]
  )

  const openModal = (p: UIProduct | null = null) => {
    setEditing(p)
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setEditing(null)
    setIsModalOpen(false)
  }

  const handleSave = async (data: UIProductInput | UIProduct) => {
    try {
      if ("id" in data) {
        await updateProduct(data.id, {
          name: data.name,
          category: data.category,
          price: data.price,
          stock: data.stock,
          minStock: data.minStock,
          description: data.description,
        })
        showToast({ tone: "success", message: "Producto actualizado" })
      } else {
        await addProduct(data)
        showToast({ tone: "success", message: "Producto creado" })
      }
      closeModal()
    } catch (e: any) {
      showToast({ tone: "error", message: e?.message ?? "No se pudo guardar" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este producto?")) return
    try {
      await deleteProduct(id)
      showToast({ tone: "success", message: "Producto eliminado" })
    } catch (e: any) {
      showToast({ tone: "error", message: e?.message ?? "No se pudo eliminar" })
    }
  }

  if (loading) return <ProductsSkeleton />
  if (error) return <EmptyState>⚠️ {error}</EmptyState>

  return (
    <div className={styles.productsView}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {mode === "admin" ? "Gestión de Productos" : "Catálogo de Productos"}
          </h1>
          <p className={styles.subtitle}>
            {mode === "admin"
              ? "Administre el catálogo de productos del inventario"
              : "Consulte y solicite los insumos necesarios."}
          </p>
        </div>

        {mode === "admin" && (
          <button className={styles.addButton} onClick={() => openModal()}>
            <MdAdd size={20} />
            <span>Nuevo Producto</span>
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          {/* ✅ Sustituimos el input manual por el componente SearchBox */}
          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar productos..."
            ariaLabel="Buscar productos"
            className={styles.searchInput}
            onClear={() => setSearchTerm("")}
          />
          <div className={styles.stats}>
            <span>Total: <strong>{products.length}</strong></span>
            <span>Mostrando: <strong>{filtered.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className={styles.cardsGrid}>
        {filtered.map((p) => (
          <div key={p.id} className={`${card.dataCard} ${styles.productCard}`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}><MdInventory size={24} /></div>

              <div className={styles.cardActions}>
                {mode === "admin" ? (
                  <>
                    <IconButton icon={<MdEdit size={18} />} title="Editar" onClick={() => openModal(p)} />
                    <IconButton icon={<MdDelete size={18} />} title="Eliminar" onClick={() => handleDelete(p.id)} variant="danger" />
                  </>
                ) : (
                  <button className={styles.requestButton} onClick={() => setSelectedEmployeeProduct(p)}>
                    Solicitar
                  </button>
                )}
              </div>
            </div>

            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{p.name}</h3>
              <p className={styles.cardDescription}>{p.description || "Sin descripción"}</p>
              <div className={styles.cardInfo}>
                <span className={styles.categoryBadge}>{p.category}</span>
                <span className={styles.priceValue}>${p.price.toFixed(2)}</span>
              </div>
              <div className={styles.stockInfo}>
                <span className={styles.stockValue}>Stock: {p.stock}</span>
                <span className={styles.minStockValue}>Min: {p.minStock}</span>
              </div>
            </div>

            <div className={styles.cardFooter}>
              {p.stock <= p.minStock ? (
                <span className={`${badge.statusBadge} ${badge.statusDanger}`}>Stock Bajo</span>
              ) : p.stock <= p.minStock * 2 ? (
                <span className={`${badge.statusBadge} ${badge.statusWarning}`}>Advertencia</span>
              ) : (
                <span className={`${badge.statusBadge} ${badge.statusSuccess}`}>Disponible</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <EmptyState>No se encontraron productos</EmptyState>}

      {/* Modals */}
      {mode === "admin" && isModalOpen && (
        <ProductModal product={editing} onClose={closeModal} onSave={handleSave} />
      )}

      {mode === "employee" && selectedEmployeeProduct && (
        <EmployeeRequestModal product={selectedEmployeeProduct} onClose={() => setSelectedEmployeeProduct(null)} />
      )}
    </div>
  )
}
