"use client"

import type React from "react"
import { useState } from "react"
import { MdLogin, MdPersonAdd } from "react-icons/md"
import { useAuth } from "@/features/auth/hooks/useAuth"
import styles from "../styles/Login.module.css"

export default function Login() {
  const { login, requestRegister, loading, error, success, setError, setSuccess } = useAuth()

  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      await login(email, password)
      // No hacemos router.push ni refresh:
      // El AuthContext se actualiza y la Home re-renderiza a Dashboard automáticamente.
    } catch {/* error ya seteado */}
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      await requestRegister(name, email, password, "employee")
      setName("")
      setEmail("")
      setPassword("")
      setTimeout(() => {
        setIsRegistering(false)
        setSuccess(null)
      }, 3000)
    } catch {/* error ya seteado */}
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#2563eb" />
              <path d="M16 8L22 12V20L16 24L10 20V12L16 8Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className={styles.title}>Sistema de Inventario</h1>
        </div>

        {/* Tabs */}
        <div className={styles.tabSwitcher}>
          <button
            className={`${styles.tab} ${!isRegistering ? styles.tabActive : ""}`}
            onClick={() => { setIsRegistering(false); setError(null); setSuccess(null) }}
          >
            <MdLogin size={18} /> Iniciar Sesión
          </button>
          <button
            className={`${styles.tab} ${isRegistering ? styles.tabActive : ""}`}
            onClick={() => { setIsRegistering(true); setError(null); setSuccess(null) }}
          >
            <MdPersonAdd size={18} /> Solicitar Registro
          </button>
        </div>

        {/* Forms */}
        {!isRegistering ? (
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Correo electrónico</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className={styles.input} placeholder="usuario@ejemplo.com" required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Contraseña</label>
              <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className={styles.input} placeholder="••••••••" required minLength={6} />
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Nombre completo</label>
              <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className={styles.input} placeholder="Juan Pérez" required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg-email" className={styles.label}>Correo electrónico</label>
              <input id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)} className={styles.input} placeholder="usuario@ejemplo.com" required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg-password" className={styles.label}>Contraseña</label>
              <input id="reg-password" type="password" value={password} onChange={e => setPassword(e.target.value)} className={styles.input} placeholder="••••••••" required minLength={6} />
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? "Enviando..." : "Enviar Solicitud"}
            </button>
          </form>
        )}

        {/* Demo accounts */}
        {!isRegistering && (
          <div className={styles.demoCredentials}>
            <p className={styles.demoTitle}>Credenciales de prueba (en BD):</p>
            <div className={styles.demoItem}><strong>Admin:</strong> admin@inventario.com / admin123</div>
            <div className={styles.demoItem}><strong>Empleado:</strong> empleado@inventario.com / empleado123</div>
          </div>
        )}
      </div>
    </div>
  )
}
