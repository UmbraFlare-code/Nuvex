// shared/components/IconButton.tsx
"use client"
import clsx from "clsx"
import styles from "../styles/IconButton.module.css" // crea CSS simple o usa utilidades

type Props = {
  icon: React.ReactNode
  title: string
  onClick: () => void
  variant?: "default" | "danger"
}
export default function IconButton({ icon, title, onClick, variant = "default" }: Props) {
  return (
    <button className={clsx(styles.btn, variant === "danger" && styles.danger)} onClick={onClick} title={title} type="button">
      {icon}
    </button>
  )
}
