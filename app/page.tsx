"use client"

import Login from "@/features/auth/components/Login"
import AdminDashboard from "@/features/dashboard/commponents/AdminDashboard"
import EmployeeDashboard from "@/features/dashboard/commponents/EmployeeDashboard" // ✅ corregido
import { useGlobal, GlobalProvider } from "@/features/context/GlobalContext"
import Loadingx from "@/shared/commponents/Loading"
import ErrorBoundary from "@/shared/commponents/ErrorBoundary"
import "./globals.css"

function AppContent() {
  const { currentUser, loading } = useGlobal()

  // ⏳ Mientras carga datos iniciales (usuarios, productos, etc.)
  if (loading) {
    return <Loadingx />
  }

  // 👤 Si no hay usuario -> login
  if (!currentUser) {
    return <Login />
  }

  // 🏠 Dashboard según rol
  return (
    <div className="app-container">
      {currentUser.role === "admin" ? <AdminDashboard /> : <EmployeeDashboard />}
    </div>
  )
}

export default function Home() {
  return (
    <GlobalProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </GlobalProvider>
  )
}
