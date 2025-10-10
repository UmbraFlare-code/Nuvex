// shared/components/Sidebar.tsx
"use client"

import styles from "@/shared/styles/Sidebar.module.css"
import {
  HiHome,
  HiCube,
  HiClipboardDocumentList,
  HiUsers,
  HiChartBar,
  HiArrowRightOnRectangle,
} from "react-icons/hi2"
import clsx from "clsx"
import { useAuth } from "@/features/auth/hooks/useAuth"

export type SidebarView =
  | "dashboard"
  | "products"
  | "stock"
  | "requests"
  | "notes"
  | "reports"
  | "actions"
  | "users"

type Props = {
  role?: "admin" | "employee"
  activeView: SidebarView
  onViewChange: (view: SidebarView) => void
}

const ADMIN_ITEMS: Array<{ key: SidebarView; label: string; icon: JSX.Element }> = [
  { key: "dashboard", label: "Dashboard", icon: <HiHome /> },
  { key: "products", label: "Productos", icon: <HiCube /> },
  { key: "requests", label: "Solicitudes", icon: <HiClipboardDocumentList /> },
  { key: "notes", label: "Notas", icon: <HiClipboardDocumentList /> },
  { key: "reports", label: "Reportes", icon: <HiChartBar /> },
  { key: "users", label: "Usuarios", icon: <HiUsers /> },
]

const EMPLOYEE_ITEMS: Array<{ key: SidebarView; label: string; icon: JSX.Element }> = [
  { key: "products", label: "Productos", icon: <HiCube /> },
  { key: "requests", label: "Solicitudes", icon: <HiClipboardDocumentList /> },
  { key: "notes", label: "Notas", icon: <HiClipboardDocumentList /> },
]

export default function Sidebar({ role = "admin", activeView, onViewChange }: Props) {
  const items = role === "admin" ? ADMIN_ITEMS : EMPLOYEE_ITEMS
  const { user, logout, loading } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      onViewChange(role === "admin" ? "dashboard" : "products")
    } catch {
      // opcional: manejar error (toast/snackbar)
    }
  }

  return (
    <aside className={styles.sidebar} aria-label="Navegación lateral">
      {/* Encabezado */}
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarLogo}>📦</span>
        <span className={styles.sidebarTitle}>Inventario</span>
      </div>

      {/* Info del usuario */}
      {user && (
        <div className={styles.sidebarUserBox}>
          <div className={styles.sidebarUserAvatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.sidebarUserInfo}>
            <div className={styles.sidebarUserName}>{user.name}</div>
            <div id="user_role" className={styles.sidebarUserRole}>
              {user.role === "admin" ? "Administrador" : "Empleado"}
            </div>
          </div>
        </div>
      )}

      {/* Navegación */}
      <nav className={styles.sidebarNav} aria-label="Secciones">
        {items.map((item) => {
          const isActive = activeView === item.key
          return (
            <button
              key={item.key}
              className={clsx(styles.sidebarItem, isActive && styles.sidebarItemActive)}
              onClick={() => onViewChange(item.key)}
              aria-current={isActive ? "page" : undefined}
              type="button"
            >
              <span className={styles.sidebarIcon}>{item.icon}</span>
              <span className={styles.sidebarLabel}>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        <button
          className={clsx(styles.sidebarItem, styles.sidebarLogout)}
          onClick={handleLogout}
          disabled={loading}
          title="Cerrar sesión"
          type="button"
        >
          <span className={styles.sidebarIcon}>
            <HiArrowRightOnRectangle />
          </span>
          <span className={styles.sidebarLabel}>
            {loading ? "Cerrando..." : "Cerrar sesión"}
          </span>
        </button>
      </div>
    </aside>
  )
}
