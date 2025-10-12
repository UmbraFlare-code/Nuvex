"use client"

import { useState, type FormEvent } from "react"
import { MdLogin, MdPersonAdd } from "react-icons/md"
import { useAuth } from "@/features/auth/hooks/useAuth"
import styles from "../styles/Login.module.css"

export default function Login() {
  const {
    login,
    requestRegister,
    loading,
    error,
    success,
    setError,
    setSuccess,
  } = useAuth()

  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const validateEmail = (mail: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(mail)
  }

  const validatePassword = (pwd: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-])[A-Za-z\d@$!%*?&_\-]{8,}$/
    return regex.test(pwd)
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!validateEmail(email)) {
      alert("❌ El correo electrónico no tiene un formato válido.")
      return
    }

    try {
      await login(email, password)
    } catch {
      /* error ya gestionado por useAuth */
    }
  }

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!validateEmail(email)) {
      alert("❌ El correo electrónico no tiene un formato válido.")
      return
    }

    if (!validatePassword(password)) {
      alert(
        "❌ La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, un número y un símbolo especial."
      )
      return
    }

    try {
      await requestRegister(name, email, password, "employee")
      setName("")
      setEmail("")
      setPassword("")

      setTimeout(() => {
        setIsRegistering(false)
        setSuccess(null)
      }, 3000)
    } catch {
      /* error ya gestionado por useAuth */
    }
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
            id="tab-login"
            data-testid="tab-login"
            type="button"
            className={`${styles.tab} ${!isRegistering ? styles.tabActive : ""}`}
            onClick={() => {
              setIsRegistering(false)
              setError(null)
              setSuccess(null)
            }}
          >
            <MdLogin size={18} /> Iniciar Sesión
          </button>

          <button
            id="tab-register"
            data-testid="tab-register"
            type="button"
            className={`${styles.tab} ${isRegistering ? styles.tabActive : ""}`}
            onClick={() => {
              setIsRegistering(true)
              setError(null)
              setSuccess(null)
            }}
          >
            <MdPersonAdd size={18} /> Solicitar Registro
          </button>
        </div>

        {/* Formulario de login */}
        {!isRegistering && (
          <form onSubmit={handleLogin} className={styles.form} data-testid="login-form">
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
                minLength={6}
              />
            </div>

            {error && <div className={styles.error} data-testid="error-msg">{error}</div>}
            {success && <div className={styles.success} data-testid="success-msg">{success}</div>}

            <button
              id="login-submit"
              data-testid="login-submit"
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>
        )}

        {/* Formulario de registro */}
        {isRegistering && (
          <form onSubmit={handleRegister} className={styles.form} data-testid="register-form">
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
              <small className={styles.hint}>
                Debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.
              </small>
            </div>

            {error && <div className={styles.error} data-testid="error-msg">{error}</div>}
            {success && <div className={styles.success} data-testid="success-msg">{success}</div>}

            <button
              id="register-submit"
              data-testid="register-submit"
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Solicitud"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
