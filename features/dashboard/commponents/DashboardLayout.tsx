"use client"

import { ReactNode } from "react"
import Sidebar, { SidebarView } from "@/shared/commponents/Sidebar"
import styles from "../styles/DashboardView.module.css"

interface DashboardLayoutProps {
  activeView: SidebarView
  onViewChange: (view: SidebarView) => void
  children: ReactNode
}

export default function DashboardLayout({
  activeView,
  onViewChange,
  children,
}: DashboardLayoutProps) {
  return (
    <div className={styles.dashboardContainer}>
      <Sidebar activeView={activeView} onViewChange={onViewChange} />
      <main className={styles.mainContent}>{children}</main>
    </div>
  )
}
