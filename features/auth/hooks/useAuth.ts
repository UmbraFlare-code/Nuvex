"use client"

import { useCallback, useEffect, useState } from "react"
import { AuthUser } from "../types"
import {
  loadAuthUser,
  loginWithEmailPassword,
  logout as serviceLogout,
  emailExists,
  createRegistrationRequest,
} from "../services/authService"

// --- Pequeño bus de eventos para sincronizar estado entre instancias del hook ---
const AUTH_EVENT = "auth:change"

function emitAuthChange(user: AuthUser | null) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: user }))
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Cargar sesión inicial desde localStorage
  useEffect(() => {
    const u = loadAuthUser()
    setUser(u)
    setLoading(false)
  }, [])

  // Escuchar cambios de sesión disparados por otras instancias del hook (mismo tab)
  useEffect(() => {
    const onAuthChange = (e: Event) => {
      const custom = e as CustomEvent<AuthUser | null>
      setUser(custom.detail ?? null)
    }
    window.addEventListener(AUTH_EVENT, onAuthChange)

    // Escuchar cambios desde otras pestañas/ventanas
    const onStorage = (e: StorageEvent) => {
      if (e.key === "auth:user") setUser(loadAuthUser())
    }
    window.addEventListener("storage", onStorage)

    return () => {
      window.removeEventListener(AUTH_EVENT, onAuthChange)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const u = await loginWithEmailPassword(email, password) // guarda en localStorage dentro del service
      setUser(u)
      emitAuthChange(u) // <-- notifica a otras instancias del hook (sin refresh)
      setSuccess(`Bienvenido, ${u.name}`)
      return u
    } catch (e: any) {
      setError(e?.message ?? "Error de autenticación")
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await serviceLogout() // limpia localStorage en el service
      setUser(null)
      emitAuthChange(null) // <-- notifica a otras instancias del hook (sin refresh)
      setSuccess("Sesión cerrada")
    } catch (e: any) {
      setError(e?.message ?? "No se pudo cerrar sesión")
    } finally {
      setLoading(false)
    }
  }, [])

  const requestRegister = useCallback(
    async (name: string, email: string, password: string, role: "admin" | "employee" = "employee") => {
      setLoading(true)
      setError(null)
      setSuccess(null)
      try {
        if (password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres")
        const exists = await emailExists(email)
        if (exists) throw new Error("El correo electrónico ya está registrado o pendiente")
        await createRegistrationRequest({ name, email, password, role })
        setSuccess("Solicitud enviada. Un administrador revisará su registro.")
        return true
      } catch (e: any) {
        setError(e?.message ?? "Hubo un problema al enviar la solicitud")
        throw e
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    user,
    loading,
    error,
    success,
    isAdmin: user?.role === "admin",
    isEmployee: user?.role === "employee",
    login,
    logout,
    requestRegister,
    setError,
    setSuccess,
  }
}
