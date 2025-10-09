"use client"

import * as React from "react"
import { HiClock } from "react-icons/hi2"
import styles from "../styles/RequestCard.module.css"
import type { UIRequest } from "../types"

type RequestCardProps = {
  data: UIRequest
  isAdmin?: boolean
  onApprove?: (id: string) => void | Promise<void>
  onReject?: (id: string) => void | Promise<void>
  onCancel?: (id: string) => void | Promise<void>
  canApprove?: (r: UIRequest) => boolean
  canReject?: (r: UIRequest) => boolean
  canCancel?: (r: UIRequest) => boolean
  /** Tamaño de botones en el footer (default: "sm") */
  size?: "sm" | "md"
}

const cx = (...cls: Array<string | false | null | undefined>) =>
  cls.filter(Boolean).join(" ")

export default function RequestCard({
  data,
  isAdmin = false,
  onApprove,
  onReject,
  onCancel,
  canApprove,
  canReject,
  canCancel,
  size = "sm",
}: RequestCardProps) {
  const statusClass = cx(
    styles.status,
    data.status === "pending" && styles["status--pending"],
    data.status === "accepted" && styles["status--accepted"],
    data.status === "rejected" && styles["status--rejected"]
  )

  const btnSize = size === "md" ? styles["btn--md"] : styles["btn--sm"]

  return (
    <div className={styles.requestCard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>{data.title}</h3>

          <div className={styles.metaLine}>
            <span className={styles.metaItem}>
              <strong>Producto:</strong> {data.productName ?? "—"}
            </span>
            <span className={styles.metaItem}>
              <strong>Solicitante:</strong> {data.userName ?? "—"}
            </span>
            <span className={styles.metaItem}>
              <strong>Fecha:</strong>{" "}
              {new Date(data.created_at ?? Date.now()).toLocaleDateString("es-ES")}
            </span>
          </div>
        </div>

        <span className={statusClass}>
          {data.status === "pending" && <HiClock />}
          {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
        </span>
      </header>

      <div className={styles.body}>
        <div className={styles.kv}>
          <div className={styles.kvItem}>
            <div className={styles.kvLabel}>Cantidad</div>
            <div className={styles.kvValue}>{data.quantity}</div>
          </div>
          <div className={styles.kvItem}>
            <div className={styles.kvLabel}>Producto</div>
            <div className={styles.kvValue}>{data.productName ?? "—"}</div>
          </div>
        </div>

        {data.reason && <p className={styles.reason}>{data.reason}</p>}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerInfo}>
          Última actualización:{" "}
          {new Date(data.updated_at ?? data.created_at ?? Date.now()).toLocaleDateString("es-ES")}
        </div>

        <div className={styles.actions}>
          {isAdmin ? (
            <>
              <button
                type="button"
                className={cx(styles.btn, btnSize, styles.btnSuccess)}
                onClick={() => onApprove?.(data.id)}
                disabled={!(canApprove ? canApprove(data) : data.status === "pending")}
                title="Aceptar"
              >
                Aceptar
              </button>
              <button
                type="button"
                className={cx(styles.btn, btnSize, styles.btnDanger)}
                onClick={() => onReject?.(data.id)}
                disabled={!(canReject ? canReject(data) : data.status === "pending")}
                title="Rechazar"
              >
                Rechazar
              </button>
            </>
          ) : (
            <button
              type="button"
              className={cx(styles.btn, btnSize, styles.btnDangerOutline)}
              onClick={() => onCancel?.(data.id)}
              disabled={!(canCancel ? canCancel(data) : data.status === "pending")}
              title="Cancelar"
            >
              Cancelar
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
