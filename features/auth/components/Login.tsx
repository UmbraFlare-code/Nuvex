"use client"

import type React from "react"
import { useState } from "react"
import { MdLogin, MdPersonAdd } from "react-icons/md"
import { useGlobal } from "@/features/context/GlobalContext"
import { supabase } from "@/lib/supabaseClient"
import styles from "../styles/Login.module.css"

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { users, registrationRequests, setCurrentUser } = useGlobal()

  // ----------------------------
  // Login handler
  // ----------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const { data, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("status", "active")
      .single()

    if (dbError || !data) {
      setError("Credenciales incorrectas o cuenta inactiva")
      return
    }

    // ⚠️ Validación simple (demo)
    if (
      (email === "admin@inventario.com" && password !== "admin123") ||
      (email === "empleado@inventario.com" && password !== "empleado123")
    ) {
      setError("Contraseña incorrecta")
      return
    }

    // ✅ Guardamos usuario en el contexto global
    setCurrentUser({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
    })

    setSuccess(`Bienvenido, ${data.name}`)
  }

  // ----------------------------
  // Registro handler
  // ----------------------------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    const exists =
      users.some((u) => u.email === email) ||
      registrationRequests.some((r) => r.email === email)

    if (exists) {
      setError("El correo electrónico ya está registrado o pendiente")
      return
    }

    const { error: dbError } = await supabase
      .from("registration_requests")
      .insert([
        {
          name,
          email,
          password, // ⚠️ en producción encriptar
          status: "pending",
          requested_at: new Date().toISOString(),
        },
      ])

    if (dbError) {
      setError("Hubo un problema al enviar la solicitud")
      return
    }

    setSuccess("Solicitud enviada. Un administrador revisará su registro.")
    setName("")
    setEmail("")
    setPassword("")

    setTimeout(() => {
      setIsRegistering(false)
      setSuccess("")
    }, 3000)
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#2563eb" />
              <path
                d="M16 8L22 12V20L16 24L10 20V12L16 8Z"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className={styles.title}>Sistema de Inventario</h1>
        </div>

        {/* Tabs */}
        <div className={styles.tabSwitcher}>
          <button
            className={`${styles.tab} ${!isRegistering ? styles.tabActive : ""}`}
            onClick={() => {
              setIsRegistering(false)
              setError("")
              setSuccess("")
            }}
          >
            <MdLogin size={18} />
            Iniciar Sesión
          </button>
          <button
            className={`${styles.tab} ${isRegistering ? styles.tabActive : ""}`}
            onClick={() => {
              setIsRegistering(true)
              setError("")
              setSuccess("")
            }}
          >
            <MdPersonAdd size={18} />
            Solicitar Registro
          </button>
        </div>

        {/* Forms */}
        {!isRegistering ? (
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <button type="submit" className={styles.submitButton}>
              Iniciar Sesión
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg-email" className={styles.label}>
                Correo electrónico
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg-password" className={styles.label}>
                Contraseña
              </label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <button type="submit" className={styles.submitButton}>
              Enviar Solicitud
            </button>
          </form>
        )}

        {/* Demo accounts */}
        {!isRegistering && (
          <div className={styles.demoCredentials}>
            <p className={styles.demoTitle}>Credenciales de prueba:</p>
            <div className={styles.demoItem}>
              <strong>Admin:</strong> admin@inventario.com / admin123
            </div>
            <div className={styles.demoItem}>
              <strong>Empleado:</strong> empleado@inventario.com / empleado123
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
