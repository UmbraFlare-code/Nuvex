"use client"

import Login from "@/features/auth/components/Login"
import { ToastProvider } from "@/shared/components/ToastProvider"
import ErrorBoundary from "@/shared/components/ErrorBoundary"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) router.push("/") // redirigir si ya está logueado
  }, [user, router])

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Login />
      </ToastProvider>
    </ErrorBoundary>
  )
}
