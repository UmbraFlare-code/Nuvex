// app/page.tsx
"use client"

import AdminDashboard from "@/features/dashboard/AdminDashboard"
import EmployeeDashboard from "@/features/dashboard/EmployeeDashboard"
import DashboardSkeleton from "@/features/dashboard/components/DashboardSkeleton"
import { useAuth } from "@/features/auth/hooks/useAuth"
import PublicLanding from "@/features/landing/views/LandingView"

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) return <DashboardSkeleton />
  if (!user) return <PublicLanding />
  if (user.role === "admin") return <AdminDashboard />

  return <EmployeeDashboard />
}

export default function HomePage() {
  return <AppContent />
}
