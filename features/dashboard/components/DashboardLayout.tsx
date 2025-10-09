// features/dashboard/components/DashboardLayout.tsx
"use client"

import { ReactNode } from "react"
import Sidebar, { SidebarView } from "@/shared/components/Sidebar"
import layout from "@/features/dashboard/styles/Layout.module.css"

type DashboardLayoutProps = {
  activeView: SidebarView
  onViewChange: (view: SidebarView) => void
  role?: "admin" | "employee"
  children: ReactNode
}

export default function DashboardLayout({
  activeView,
  onViewChange,
  role = "admin",
  children,
}: DashboardLayoutProps) {
  return (
    <div className={layout.dashboardContainer}>
      <Sidebar role={role} activeView={activeView} onViewChange={onViewChange} />
      <main className={layout.Content}>{children}</main>
    </div>
  )
}
