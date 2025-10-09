"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import styles from "@/shared/styles/Toast.module.css"

type ToastTone = "success" | "error" | "warning" | "info"
type Toast = { id: string; title?: string; message: string; tone: ToastTone; timeout?: number }

type Ctx = {
  showToast: (t: Omit<Toast, "id">) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<Ctx | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((t: Omit<Toast, "id">) => {
    const id = crypto.randomUUID()
    const toast: Toast = { id, timeout: 3500, ...t }
    setToasts(prev => [...prev, toast])
    // auto dismiss
    const timeout = toast.timeout ?? 3500
    if (timeout > 0) {
      setTimeout(() => dismissToast(id), timeout)
    }
  }, [dismissToast])

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.toastContainer} aria-live="polite" aria-atomic="true">
        {toasts.map(t => (
          <div key={t.id} className={`${styles.toast} ${styles[`toast_${t.tone}`]}`} role="status">
            {t.title && <div className={styles.toastTitle}>{t.title}</div>}
            <div className={styles.toastMsg}>{t.message}</div>
            <button className={styles.toastClose} onClick={() => dismissToast(t.id)} title="Cerrar" type="button">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>")
  return ctx
}
