"use client"

import { useState } from "react"
import { useGlobal } from "@/features/context/GlobalContext"
import type { Product } from "@/features/context/GlobalContext"
import styles from "../styles/ProductModal.module.css"

interface EmployeeRequestModalProps {
  product: Product | null
  onClose: () => void
}

export default function EmployeeRequestModal({ product, onClose }: EmployeeRequestModalProps) {
  const { addRequest, currentUser } = useGlobal()

  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  if (!product) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (!currentUser) {
        setError("Debe iniciar sesión para solicitar productos")
        return
      }

      if (quantity <= 0) {
        setError("La cantidad debe ser mayor a 0")
        return
      }

      await addRequest({
        userId: currentUser.id,
        productId: product.id,
        title: `Solicitud de ${product.name}`,
        reason,
        quantity,
        status: "pending",
      })

      setSuccess("Solicitud enviada correctamente ✅")
      setTimeout(() => onClose(), 2000)
    } catch (err) {
      setError("Error al enviar la solicitud")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Solicitar {product.name}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="quantity" className={styles.label}>
              Cantidad *
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reason" className={styles.label}>
              Motivo
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={styles.textarea}
              placeholder="Ej. Reposición para el área de mantenimiento"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? "Enviando..." : "Enviar Solicitud"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
