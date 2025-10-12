/**
 * @file tests/unit/auth/Login.test.tsx
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import Login from "@/features/auth/components/Login"

// Mock explícito del hook useAuth
jest.mock("@/features/auth/hooks/useAuth", () => {
  return {
    useAuth: () => ({
      login: jest.fn((email, password) => {
        if (email === "admin@inventario.com" && password === "admin123") {
          return Promise.resolve({
            id: 1,
            name: "Administrador General",
            email,
            role: "admin",
            status: "active",
            created_at: "2025-10-04",
          })
        }
        return Promise.reject(new Error("Credenciales incorrectas o cuenta inactiva"))
      }),
      requestRegister: jest.fn(),
      loading: false,
      error: null,
      success: null,
      setError: jest.fn(),
      setSuccess: jest.fn(),
    }),
  }
})

describe("Login Component", () => {
  it("renderiza el formulario de login por defecto", () => {
    render(<Login />)
    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument()
  })

  it("permite login con credenciales correctas", async () => {
    render(<Login />)

    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
      target: { value: "admin@inventario.com" },
    })
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "admin123" },
    })
    fireEvent.click(screen.getByRole("button", { name: /Iniciar Sesión/i }))

    await waitFor(() =>
      expect(screen.getByText(/Bienvenido, Administrador General/i)).toBeInTheDocument()
    )
  })

  it("muestra error con credenciales inválidas", async () => {
    render(<Login />)

    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
      target: { value: "wrong@test.com" },
    })
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "wrongpass" },
    })
    fireEvent.click(screen.getByRole("button", { name: /Iniciar Sesión/i }))

    await waitFor(() =>
      expect(screen.getByText(/Credenciales incorrectas o cuenta inactiva/i)).toBeInTheDocument()
    )
  })
})
