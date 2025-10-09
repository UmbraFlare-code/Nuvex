"use client"

import { useEffect, useState } from "react"
import type { UIProduct, UIProductInput } from "../types"
import styles from "../styles/ProductModal.module.css"

export type ProductModalProps = {
  product: UIProduct | null
  onClose: () => void
  onSave: (data: UIProduct | UIProductInput) => Promise<void> | void
}

export default function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  const [form, setForm] = useState<UIProductInput>({
    name: "", category: "", price: 0, stock: 0, minStock: 0, description: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        minStock: product.minStock,
        description: product.description ?? "",
      })
    } else {
      setForm({ name: "", category: "", price: 0, stock: 0, minStock: 0, description: "" })
    }
  }, [product])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: ["price","stock","minStock"].includes(name) ? Number(value) : value
    }) as UIProductInput)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      if (product) {
        await onSave({ ...product, ...form })
      } else {
        await onSave(form)
      }
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{product ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button className={styles.closeButton} onClick={onClose} type="button">✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">Nombre *</label>
              <input className={styles.input} id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="category">Categoría *</label>
              <select className={styles.input} id="category" name="category" value={form.category} onChange={handleChange} required>
                <option value="">Seleccionar</option>
                <option value="Motores">Motores</option>
                <option value="Componentes">Componentes</option>
                <option value="Repuestos">Repuestos</option>
                <option value="Transformadores">Transformadores</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="price">Precio *</label>
              <input className={styles.input} id="price" name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="stock">Stock *</label>
              <input className={styles.input} id="stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="minStock">Stock Mínimo *</label>
              <input className={styles.input} id="minStock" name="minStock" type="number" min="0" value={form.minStock} onChange={handleChange} required />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="description">Descripción</label>
            <textarea className={styles.textarea} id="description" name="description" rows={3} value={form.description} onChange={handleChange} />
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={submitting}>Cancelar</button>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? "Guardando..." : (product ? "Actualizar" : "Crear")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
