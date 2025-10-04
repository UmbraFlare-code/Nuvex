"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useGlobal } from "@/features/context/GlobalContext" // ✅ ahora usamos el global
import type { Product } from "@/features/context/GlobalContext" // ✅ Product viene del global
import styles from "../styles/ProductModal.module.css"

export type ProductModalProps = {
  product: Product | null
  onClose: () => void
  onSave: (data: Product | Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<void>
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addProduct, updateProduct } = useGlobal() // ✅ usamos acciones del global

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    minStock: "",
    description: "",
  })

  // precargar datos si se está editando
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        minStock: product.minStock.toString(),
        description: product.description,
      })
    } else {
      setFormData({
        name: "",
        category: "",
        price: "",
        stock: "",
        minStock: "",
        description: "",
      })
    }
  }, [product])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      name: formData.name,
      category: formData.category,
      price: Number.parseFloat(formData.price),
      stock: Number.parseInt(formData.stock),
      minStock: Number.parseInt(formData.minStock),
      description: formData.description,
    }

    if (product) {
      await updateProduct(product.id, productData)
    } else {
      await addProduct(productData)
    }

    onClose()
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {product ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Nombre del Producto *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category" className={styles.label}>
                Categoría *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={styles.input}
                required
              >
                <option value="">Seleccionar categoría</option>
                <option value="Herramientas Eléctricas">Herramientas Eléctricas</option>
                <option value="Motores">Motores</option>
                <option value="Componentes">Componentes</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>
                Precio *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="stock" className={styles.label}>
                Stock Actual *
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="minStock" className={styles.label}>
                Stock Mínimo *
              </label>
              <input
                id="minStock"
                name="minStock"
                type="number"
                min="0"
                value={formData.minStock}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              {product ? "Actualizar" : "Crear"} Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
