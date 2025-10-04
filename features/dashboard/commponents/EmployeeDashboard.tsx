"use client"

import { useState } from "react"
import DashboardLayout from "@/features/dashboard/commponents/DashboardLayout"
import EmployeeProductsView from "@/features/productos/commponents/EmployeeProductsView"
import EmployeeStockView from "@/features/stock/commponents/EmployeeStockView"
import ItemRequestsView from "@/features/requests/commponents/ItemRequestsView"
import NotesView from "@/features/notes/commponents/NotesView"
import { useGlobal } from "@/features/context/GlobalContext"
import { SidebarView } from "@/shared/commponents/Sidebar"

export default function EmployeeDashboard() {
  const { currentUser } = useGlobal()
  const [activeView, setActiveView] = useState<SidebarView>("products")

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView}>
      {activeView === "products" && <EmployeeProductsView />}
      {activeView === "stock" && <EmployeeStockView />}
      {activeView === "requests" && (
        <ItemRequestsView isAdmin={false} currentUser={currentUser?.name ?? ""} />
      )}
      {activeView === "notes" && <NotesView />}
    </DashboardLayout>
  )
}
