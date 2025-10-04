"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import DashboardLayout from "./DashboardLayout"
import DashboardView from "./DashboardView"

import ProductsView from "@/features/productos/commponents/ProductsView"
import ActionsView from "@/shared/commponents/ActionsView"
import NotesView from "@/features/notes/commponents/NotesView"
import ReportsView from "@/features/reports/commponents/ReportsView"
import ItemRequestsView from "@/features/requests/commponents/ItemRequestsView"
import UserManagementView from "@/features/users/commponents/UserManagementView"
import { useGlobal } from "@/features/context/GlobalContext"
import { SidebarView } from "@/shared/commponents/Sidebar"

export default function AdminDashboard() {
  const { currentUser } = useGlobal()
  const searchParams = useSearchParams()
  const router = useRouter()
  const defaultView: SidebarView = "dashboard"

  const [activeView, setActiveView] = useState<SidebarView>(
    (searchParams.get("view") as SidebarView) || defaultView
  )

  useEffect(() => {
    router.replace(`?view=${activeView}`)
  }, [activeView, router])

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView}>
      {activeView === "dashboard" && <DashboardView />}
      {activeView === "products" && <ProductsView />}
      {activeView === "actions" && <ActionsView />}
      {activeView === "notes" && <NotesView />}
      {activeView === "reports" && <ReportsView />}
      {activeView === "requests" && (
        <ItemRequestsView isAdmin={true} currentUser={currentUser?.name ?? ""} />
      )}
      {activeView === "users" && <UserManagementView />}
    </DashboardLayout>
  )
}
