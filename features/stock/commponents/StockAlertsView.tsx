"use client"

import { useState } from "react"
import { useGlobal, type Product } from "@/features/context/GlobalContext" // ✅ usa GlobalContext
import ProductModal from "@/features/productos/commponents/ProductModal"
import styles from "../styles/StockAlertsView.module.css"

export default function StockAlertsView() {
  const { products, updateProduct, getLowStockProducts } = useGlobal()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // productos críticos
  const lowStockProducts = getLowStockProducts()

  // productos con advertencia (entre minStock y minStock * 2)
  const warningProducts = products.filter(
    (p) =>
      p.stock > p.minStock &&
      p.stock <= p.minStock * 2 &&
      !lowStockProducts.includes(p)
  )

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleQuickRestock = (product: Product) => {
    const amount = prompt(
      `¿Cuántas unidades desea agregar a "${product.name}"?`
    )
    if (amount && !isNaN(Number.parseInt(amount))) {
      const newStock = product.stock + Number.parseInt(amount)
      updateProduct(product.id, { stock: newStock })
    }
  }

  return (
    <div className={styles.alertsView}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Alertas y Acciones</h1>
          <p className={styles.subtitle}>
            Gestione productos con stock bajo y tome acciones rápidas
          </p>
        </div>
      </div>

      {/* tarjetas resumen */}
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>⚠️</div>
          <div className={styles.summaryContent}>
            <div className={styles.summaryValue}>{lowStockProducts.length}</div>
            <div className={styles.summaryLabel}>Stock Crítico</div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>⚡</div>
          <div className={styles.summaryContent}>
            <div className={styles.summaryValue}>{warningProducts.length}</div>
            <div className={styles.summaryLabel}>Advertencias</div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>✓</div>
          <div className={styles.summaryContent}>
            <div className={styles.summaryValue}>
              {products.length -
                lowStockProducts.length -
                warningProducts.length}
            </div>
            <div className={styles.summaryLabel}>Stock Normal</div>
          </div>
        </div>
      </div>

      {/* sección críticos */}
      {lowStockProducts.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Stock Crítico</h2>
            <span className={styles.sectionBadge}>
              {lowStockProducts.length} productos
            </span>
          </div>

          <div className={styles.alertsList}>
            {lowStockProducts.map((product) => (
              <div key={product.id} className={styles.alertCard}>
                <div className={styles.alertIcon}>🔴</div>
                <div className={styles.alertContent}>
                  <div className={styles.alertHeader}>
                    <h3 className={styles.alertTitle}>{product.name}</h3>
                    <span className={styles.categoryBadge}>
                      {product.category}
                    </span>
                  </div>
                  <p className={styles.alertDescription}>
                    {product.description}
                  </p>
                  <div className={styles.alertStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Stock actual:</span>
                      <span className={styles.statValueDanger}>
                        {product.stock} unidades
                      </span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Stock mínimo:</span>
                      <span className={styles.statValue}>
                        {product.minStock} unidades
                      </span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Diferencia:</span>
                      <span className={styles.statValueDanger}>
                        -{product.minStock - product.stock} unidades
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.alertActions}>
                  <button
                    className={styles.actionButtonPrimary}
                    onClick={() => handleQuickRestock(product)}
                  >
                    Reabastecer
                  </button>
                  <button
                    className={styles.actionButtonSecondary}
                    onClick={() => handleEdit(product)}
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* sección advertencias */}
      {warningProducts.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Advertencias</h2>
            <span className={styles.sectionBadge}>
              {warningProducts.length} productos
            </span>
          </div>

          <div className={styles.warningList}>
            {warningProducts.map((product) => (
              <div key={product.id} className={styles.warningCard}>
                <div className={styles.warningIcon}>🟡</div>
                <div className={styles.warningContent}>
                  <div className={styles.warningHeader}>
                    <h3 className={styles.warningTitle}>{product.name}</h3>
                    <span className={styles.categoryBadge}>
                      {product.category}
                    </span>
                  </div>
                  <div className={styles.warningStats}>
                    <span className={styles.warningStatItem}>
                      Stock: <strong>{product.stock}</strong>
                    </span>
                    <span className={styles.warningStatItem}>
                      Mínimo: <strong>{product.minStock}</strong>
                    </span>
                  </div>
                </div>
                <div className={styles.warningActions}>
                  <button
                    className={styles.actionButtonSmall}
                    onClick={() => handleQuickRestock(product)}
                  >
                    Reabastecer
                  </button>
                  <button
                    className={styles.actionButtonSmall}
                    onClick={() => handleEdit(product)}
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* estado vacío */}
      {lowStockProducts.length === 0 && warningProducts.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✓</div>
          <h3 className={styles.emptyTitle}>Todo en orden</h3>
          <p className={styles.emptyMessage}>
            No hay productos con alertas de stock en este momento
          </p>
        </div>
      )}

      {isModalOpen && (
        <ProductModal product={editingProduct} onClose={handleCloseModal} />
      )}
    </div>
  )
}
