"use client"

import { useState } from "react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { createRequest } from "../services/requestService"
import type { UIProduct } from "../types"
import { useToast } from "@/shared/components/ToastProvider"
import styles from "../styles/ProductModal.module.css"

interface Props { product: UIProduct | null; onClose: () => void }

export default function EmployeeRequestModal({ product, onClose }: Props) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  if (!product) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return showToast({ tone: "error", message: "Debe iniciar sesión para solicitar" })
    if (quantity <= 0) return showToast({ tone: "warning", message: "La cantidad debe ser mayor a 0" })

    try {
      setLoading(true)
      await createRequest({
        userId: user.id,
        productId: product.id,
        title: `Solicitud de ${product.name}`,
        reason,
        quantity,
        status: "pending",
      })
      showToast({ tone: "success", message: "Solicitud enviada ✅" })
      onClose()
    } catch (e: any) {
      showToast({ tone: "error", message: e?.message ?? "No se pudo enviar la solicitud" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Solicitar {product.name}</h2>
          <button className={styles.closeButton} onClick={onClose} type="button">✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="quantity">Cantidad *</label>
            <input className={styles.input} id="quantity" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="reason">Motivo</label>
            <textarea className={styles.textarea} id="reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? "Enviando..." : "Enviar Solicitud"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
