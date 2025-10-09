// app/page.tsx
"use client"

import "./globals.css"

import { ToastProvider } from "@/shared/components/ToastProvider"
import Login from "@/features/auth/components/Login"
import AdminDashboard from "@/features/dashboard/AdminDashboard"
import EmployeeDashboard from "@/features/dashboard/EmployeeDashboard"
import DashboardSkeleton from "@/features/dashboard/components/DashboardSkeleton"
import ErrorBoundary from "@/shared/components/ErrorBoundary"
import { useAuth } from "@/features/auth/hooks/useAuth"

function AppContent() {
  const { user, loading } = useAuth()

    // ⏳ Paso 1: Mientras se valida sesión → skeleton
  if (loading) {
    return <DashboardSkeleton />
  }

  // 👤 Paso 2: Si no hay sesión → login
  if (!user) {
    return <Login />
  }

  // 🏠 Paso 3: Si hay sesión → dashboard según rol
  if (user.role === "admin") {
    return <AdminDashboard />
  }

  return <EmployeeDashboard />
}

export default function HomePage() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  )
}
