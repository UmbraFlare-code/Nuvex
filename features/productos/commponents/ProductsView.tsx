"use client"

import { useState } from "react"
import { MdSearch, MdAdd, MdEdit, MdDelete, MdInventory } from "react-icons/md"
import { useGlobal } from "@/features/context/GlobalContext" // ✅ usamos el global
import ProductModal from "@/features/productos/commponents/ProductModal"
import type { Product } from "@/features/context/GlobalContext" // ✅ Product del global
import styles from "../styles/ProductsView.module.css"

export default function ProductsView() {
  const { products, addProduct, updateProduct, deleteProduct } = useGlobal()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // --- Handlers ---
  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Está seguro de eliminar este producto?")) {
      await deleteProduct(id)
    }
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  return (
    <div className={styles.productsView}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Productos</h1>
          <p className={styles.subtitle}>
            Administre el catálogo de productos del inventario
          </p>
        </div>
        <button className={styles.addButton} onClick={handleAddNew}>
          <MdAdd size={20} />
          <span>Agregar Producto</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>
            <MdSearch size={20} />
          </span>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            Total: <strong>{products.length}</strong>
          </span>
          <span className={styles.statItem}>
            Mostrando: <strong>{filteredProducts.length}</strong>
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className={styles.cardsGrid}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <MdInventory size={24} />
              </div>
              <div className={styles.cardActions}>
                <button
                  className={styles.cardActionButton}
                  onClick={() => handleEdit(product)}
                  title="Editar"
                >
                  <MdEdit size={18} />
                </button>
                <button
                  className={styles.cardActionButtonDanger}
                  onClick={() => handleDelete(product.id)}
                  title="Eliminar"
                >
                  <MdDelete size={18} />
                </button>
              </div>
            </div>

            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{product.name}</h3>
              <p className={styles.cardDescription}>{product.description}</p>

              <div className={styles.cardInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Categoría:</span>
                  <span className={styles.categoryBadge}>
                    {product.category}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Precio:</span>
                  <span className={styles.priceValue}>
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Stock Actual:</span>
                  <span className={styles.stockValue}>
                    {product.stock} unidades
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Stock Mínimo:</span>
                  <span className={styles.minStockValue}>
                    {product.minStock} unidades
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.cardFooter}>
              {product.stock <= product.minStock ? (
                <span className={styles.statusBadgeLow}>Stock Bajo</span>
              ) : product.stock <= product.minStock * 2 ? (
                <span className={styles.statusBadgeWarning}>Advertencia</span>
              ) : (
                <span className={styles.statusBadgeGood}>Disponible</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <div className={styles.emptyState}>
          <p>No se encontraron productos</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
