"use client"

import {
  MdDashboard,
  MdInventory,
  MdBolt,
  MdNote,
  MdAssessment,
  MdLogout,
  MdShoppingCart,
  MdPeople,
} from "react-icons/md"
import { useState } from "react"
import { useGlobal } from "@/features/context/GlobalContext"
import styles from "../styles/Sidebar.module.css"
import { useRouter } from "next/navigation"

// 👇 Unificamos todas las vistas posibles
export type SidebarView =
  | "dashboard"
  | "products"
  | "actions"
  | "notes"
  | "reports"
  | "requests"
  | "users"
  | "stock"

interface SidebarProps {
  activeView: SidebarView
  onViewChange: (view: SidebarView) => void
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { currentUser, logout , setCurrentUser} = useGlobal()
  const router = useRouter()

  const handleLogout = () => {
    try {
      logout()
      setCurrentUser(null)
      router.push("/") // o "/login"
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      setIsOpen(false)
    }
}

  // 🔹 Menús dinámicos según rol
  const menuItems =
    currentUser?.role === "employee"
      ? [
          { id: "products" as SidebarView, label: "Productos", icon: MdInventory },
          { id: "stock" as SidebarView, label: "Control Stock", icon: MdDashboard },
          { id: "requests" as SidebarView, label: "Solicitudes", icon: MdShoppingCart },
          { id: "notes" as SidebarView, label: "Notas", icon: MdNote },
        ]
      : [
          { id: "dashboard" as SidebarView, label: "Dashboard", icon: MdDashboard },
          { id: "products" as SidebarView, label: "Productos", icon: MdInventory },
          { id: "actions" as SidebarView, label: "Acciones", icon: MdBolt },
          { id: "notes" as SidebarView, label: "Notas", icon: MdNote },
          { id: "reports" as SidebarView, label: "Reportes", icon: MdAssessment },
          { id: "requests" as SidebarView, label: "Solicitudes", icon: MdShoppingCart },
          { id: "users" as SidebarView, label: "Usuarios", icon: MdPeople },
        ]

  return (
    <>
      {/* === Botón Hamburger === */}
      <button
        className={styles.hamburger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Abrir menú"
        aria-expanded={isOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {/* === Sidebar === */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#2563eb" />
              <path
                d="M16 8L22 12V20L16 24L10 20V12L16 8Z"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className={styles.appName}>InventoryApp</h1>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => {
            const IconComponent = item.icon
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  onViewChange(item.id)
                  setIsOpen(false)
                }}
              >
                <span className={styles.navIcon}>
                  <IconComponent size={20} />
                </span>
                <span className={styles.navLabel}>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "?"}
            </div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{currentUser?.name ?? "Invitado"}</div>
              <div className={styles.userRole}>
                {currentUser?.role === "admin" ? "Manager" : "Empleado"}
              </div>
            </div>
          </div>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <MdLogout size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
