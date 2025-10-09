// features/auth/services/authService.ts
import { supabase } from "@/lib/supabaseClient"
import { AuthUser, Role } from "../types"

// —— Helpers de almacenamiento local (sesión muy simple) ——
const STORAGE_KEY = "auth:user"

export function saveAuthUser(user: AuthUser | null) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function loadAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

// —— Login con email/password (texto plano según tu seed) ——
export async function loginWithEmailPassword(email: string, password: string): Promise<AuthUser> {
  // 1) Buscar usuario activo por email
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("status", "active")
    .single()

  if (error || !data) {
    throw new Error("Credenciales incorrectas o cuenta inactiva")
  }

  // 2) Validar password (en producción: usar hash)
  if (data.password !== password) {
    throw new Error("Contraseña incorrecta")
  }

  const user: AuthUser = {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status,
    created_at: data.created_at,
  }

  // 3) Guardar sesión en localStorage
  saveAuthUser(user)
  return user
}

export async function logout() {
  // Si usaras Auth de Supabase, aquí iría supabase.auth.signOut()
  saveAuthUser(null)
}

// —— Registro: crear solicitud en registration_requests ——
export async function emailExists(email: string): Promise<boolean> {
  const [{ count: inUsers }, { count: inReqs }] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }).eq("email", email),
    supabase.from("registration_requests").select("*", { count: "exact", head: true }).eq("email", email),
  ])

  return (inUsers ?? 0) > 0 || (inReqs ?? 0) > 0
}

export async function createRegistrationRequest(payload: {
  name: string
  email: string
  password: string // ⚠️ hashear en prod
  role: "admin" | "employee"
}) {
  const { error } = await supabase
    .from("registration_requests") // 👈 correcto
    .insert([{
      name: payload.name,
      email: payload.email,
      password: payload.password, // ⚠️ hashear en prod
      role: payload.role,
      status: "pending",
      requested_at: new Date().toISOString(),
    }])

  if (error) throw error
  return true
}
