// features/dashboard/EmployeeDashboard.tsx
"use client"

import { useState } from "react"
import DashboardLayout from "@/features/dashboard/components/DashboardLayout"
import EmployeeProductsView from "@/features/productos/views/EmployeeProductsView"
import NotesView from "@/features/notes/views/NotesView"
import ItemRequestsView from "@/features/requests/views/ItemRequestsView" 

import { SidebarView } from "@/shared/components/Sidebar"

export default function EmployeeDashboard() {
  const [activeView, setActiveView] = useState<SidebarView>("products")

  return (
    <DashboardLayout role="employee" activeView={activeView} onViewChange={setActiveView}>
      {activeView === "products" && <EmployeeProductsView />}
      {activeView === "requests" && <ItemRequestsView isAdmin={false}/>}
      {activeView === "notes" && <NotesView />}
    </DashboardLayout>
  )
}
