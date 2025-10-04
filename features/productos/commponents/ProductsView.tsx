"use client"

import { useState, useMemo } from "react"
import { MdSearch, MdAdd, MdEdit, MdDelete, MdInventory } from "react-icons/md"
import { useGlobal } from "@/features/context/GlobalContext"
import ProductModal from "@/features/productos/commponents/ProductModal"
import type { Product } from "@/features/context/GlobalContext"
import styles from "../styles/ProductsView.module.css"

export default function ProductsView() {
  const { products, addProduct, updateProduct, deleteProduct } = useGlobal()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = useMemo(
    () =>
      products.filter(({ name, category }) =>
        [name, category].some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [products, searchTerm]
  )

  const openModal = (product: Product | null = null) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setEditingProduct(null)
    setIsModalOpen(false)
  }

  const handleSaveProduct = async (
    data: Omit<Product, "id" | "createdAt" | "updatedAt"> | Product
  ) => {
    editingProduct
      ? await updateProduct(editingProduct.id, data as Partial<Product>)
      : await addProduct(data as Omit<Product, "id" | "createdAt" | "updatedAt">)
    closeModal()
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Está seguro de eliminar este producto?")) await deleteProduct(id)
  }

  const renderStatus = (stock: number, minStock: number) => {
    if (stock <= minStock) return <StatusBadge type="low" label="Stock Bajo" />
    if (stock <= minStock * 2) return <StatusBadge type="warn" label="Advertencia" />
    return <StatusBadge type="good" label="Disponible" />
  }

  return (
    <div className={styles.productsView}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Productos</h1>
          <p className={styles.subtitle}>Administre el catálogo de productos del inventario</p>
        </div>
        <button className={styles.addButton} onClick={() => openModal()}>
          <MdAdd size={20} />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <MdSearch size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.stats}>
          <Stat label="Total" value={products.length} />
          <Stat label="Mostrando" value={filteredProducts.length} />
        </div>
      </div>

      {/* Product Cards */}
      <div className={styles.cardsGrid}>
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <MdInventory size={24} />
              </div>
              <div className={styles.cardActions}>
                <IconButton
                  icon={<MdEdit size={18} />}
                  title="Editar"
                  onClick={() => openModal(product)}
                />
                <IconButton
                  icon={<MdDelete size={18} />}
                  title="Eliminar"
                  danger
                  onClick={() => handleDelete(product.id)}
                />
              </div>
            </div>

            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{product.name}</h3>
              <p className={styles.cardDescription}>{product.description || "Sin descripción"}</p>
              <div className={styles.cardInfo}>
                <span className={styles.categoryBadge}>{product.category}</span>
                <span className={styles.priceValue}>${product.price.toFixed(2)}</span>
              </div>
              <div className={styles.stockInfo}>
                <span className={styles.stockValue}>Stock: {product.stock}</span>
                <span className={styles.minStockValue}>Min: {product.minStock}</span>
              </div>
            </div>

            <div className={styles.cardFooter}>{renderStatus(product.stock, product.minStock)}</div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className={styles.emptyState}>No se encontraron productos</div>
      )}
      
      {isModalOpen && (
        <ProductModal product={editingProduct} onClose={closeModal} onSave={handleSaveProduct} />
      )}
    </div>
  )
}

/* ===========================
   Componentes UI reutilizables
=========================== */

function Card({ children }: { children: React.ReactNode }) {
  return <div className={styles.productCard}>{children}</div>
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span>
      {label}: <strong>{value}</strong>
    </span>
  )
}

function IconButton({
  icon,
  title,
  onClick,
  danger,
}: {
  icon: React.ReactNode
  title: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      className={danger ? styles.cardActionButtonDanger : styles.cardActionButton}
      onClick={onClick}
      title={title}
    >
      {icon}
    </button>
  )
}

function StatusBadge({ type, label }: { type: "low" | "warn" | "good"; label: string }) {
  const styleMap = {
    low: styles.statusBadgeLow,
    warn: styles.statusBadgeWarning,
    good: styles.statusBadgeGood,
  }
  return <span className={styleMap[type]}>{label}</span>
}