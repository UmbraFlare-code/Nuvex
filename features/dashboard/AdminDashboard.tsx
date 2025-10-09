// features/dashboard/AdminDashboard.tsx
"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import DashboardLayout from "@/features/dashboard/components/DashboardLayout"
import DashboardView from "@/features/dashboard/views/DashboardView"

import AdminProductsView from "@/features/productos/views/AdminProductsView"
import ItemRequestsView from "@/features/requests/views/ItemRequestsView"
import NotesView from "@/features/notes/views/NotesView"
import ReportsView from "@/features/reports/views/ReportsView"
import RegistrationRequestsView from "@/features/users/views/RegistrationRequestsView"

//import ActionsView from "@/shared/components/ActionsView"
//import UserManagementView from "@/features/users/components/UserManagementView"

import { SidebarView } from "@/shared/components/Sidebar"

const DEFAULT_VIEW: SidebarView = "dashboard"

export default function AdminDashboard() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const defaultView: SidebarView = "dashboard"
  const [activeView, setActiveView] = useState<SidebarView>(
    (searchParams.get("view") as SidebarView) || defaultView
  )

  useEffect(() => {
    router.replace(`?view=${activeView}`, { scroll: false })
  }, [activeView, router])
  
  // Si el usuario cambia la URL manualmente, refleja el cambio en el estado
  useEffect(() => {
    const spView = (searchParams.get("view") as SidebarView) || DEFAULT_VIEW
    if (spView !== activeView) setActiveView(spView)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <DashboardLayout role="admin" activeView={activeView} onViewChange={setActiveView}>
      {activeView === "dashboard" && <DashboardView />}
      {activeView === "products" && <AdminProductsView />}
      {activeView === "requests" && <ItemRequestsView isAdmin={true}/>}
      {activeView === "notes" && <NotesView />}
      {activeView === "reports" && <ReportsView isAdmin={true} />}
      {activeView === "users" && <RegistrationRequestsView />}
    </DashboardLayout>
  )
}
