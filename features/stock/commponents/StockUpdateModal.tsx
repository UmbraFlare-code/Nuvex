"use client"

import type React from "react"
import { useState } from "react"
import { useGlobal, type Product } from "@/features/context/GlobalContext" // ✅ GlobalContext
import styles from "../../productos/styles/ProductModal.module.css"

interface StockUpdateModalProps {
  product: Product
  onClose: () => void
}

export default function StockUpdateModal({ product, onClose }: StockUpdateModalProps) {
  const { updateProduct } = useGlobal() // ✅ ahora usa Global
  const [operation, setOperation] = useState<"add" | "subtract">("add")
  const [quantity, setQuantity] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const amount = Number.parseInt(quantity)
    if (isNaN(amount) || amount <= 0) {
      alert("Por favor ingrese una cantidad válida")
      return
    }

    const newStock = operation === "add" ? product.stock + amount : product.stock - amount

    if (newStock < 0) {
      alert("El stock no puede ser negativo")
      return
    }

    updateProduct(product.id, { stock: newStock })
    onClose()
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Actualizar Stock</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Producto */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Producto</label>
            <div style={{ padding: "0.75rem", background: "#f5f5f5", borderRadius: "0.5rem", fontWeight: 600 }}>
              {product.name}
            </div>
          </div>

          {/* Stock actual */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Stock Actual</label>
            <div style={{ padding: "0.75rem", background: "#f5f5f5", borderRadius: "0.5rem", fontWeight: 600 }}>
              {product.stock} unidades
            </div>
          </div>

          {/* Operación */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Operación *</label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input
                  type="radio"
                  value="add"
                  checked={operation === "add"}
                  onChange={(e) => setOperation(e.target.value as "add")}
                />
                <span>Agregar (+)</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input
                  type="radio"
                  value="subtract"
                  checked={operation === "subtract"}
                  onChange={(e) => setOperation(e.target.value as "subtract")}
                />
                <span>Restar (-)</span>
              </label>
            </div>
          </div>

          {/* Cantidad */}
          <div className={styles.formGroup}>
            <label htmlFor="quantity" className={styles.label}>
              Cantidad *
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={styles.input}
              placeholder="Ingrese la cantidad"
              required
            />
          </div>

          {/* Vista previa de stock nuevo */}
          <div
            style={{
              padding: "1rem",
              background: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "0.5rem",
              marginTop: "1rem",
            }}
          >
            <strong>Nuevo stock:</strong>{" "}
            {quantity && !isNaN(Number.parseInt(quantity))
              ? operation === "add"
                ? product.stock + Number.parseInt(quantity)
                : product.stock - Number.parseInt(quantity)
              : product.stock}{" "}
            unidades
          </div>

          {/* Botones */}
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              Actualizar Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
