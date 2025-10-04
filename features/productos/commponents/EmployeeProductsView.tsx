"use client"

import { useState, useMemo } from "react"
import { useGlobal } from "@/features/context/GlobalContext"
import type { Product } from "@/features/context/GlobalContext"
import EmployeeRequestModal from "@/features/productos/commponents/EmployeeRequestModal"
import styles from "../styles/EmployeeView.module.css"

export default function EmployeeProductsView() {
  const { products, getCategories } = useGlobal()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // categorías únicas
  const categories = useMemo(() => ["all", ...getCategories()], [products])

  // filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, selectedCategory])

  return (
    <div className={styles.employeeView}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Catálogo de Productos</h1>
          <p className={styles.subtitle}>
            Consulte la información de productos disponibles y solicite los que necesite.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterBox}>
          <label htmlFor="category" className={styles.filterLabel}>
            Categoría:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.filterSelect}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "Todas" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className={styles.productsGrid}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.productHeader}>
              <h3 className={styles.productName}>{product.name}</h3>
              <span className={styles.categoryBadge}>{product.category}</span>
            </div>

            <p className={styles.productDescription}>{product.description}</p>

            <div className={styles.productDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Precio:</span>
                <span className={styles.detailValue}>
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Stock:</span>
                <span className={styles.detailValue}>
                  {product.stock} unidades
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Stock Mínimo:</span>
                <span className={styles.detailValue}>
                  {product.minStock} unidades
                </span>
              </div>
            </div>

            <div className={styles.productFooter}>
              {product.stock <= product.minStock ? (
                <span className={styles.statusBadgeLow}>Stock Bajo</span>
              ) : product.stock <= product.minStock * 2 ? (
                <span className={styles.statusBadgeWarning}>Advertencia</span>
              ) : (
                <span className={styles.statusBadgeGood}>Disponible</span>
              )}

              <button
                className={styles.requestButton}
                onClick={() => setSelectedProduct(product)}
              >
                Solicitar
              </button>
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
      {selectedProduct && (
        <EmployeeRequestModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
