import { renderHook, act, waitFor } from "@testing-library/react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import * as authService from "@/features/auth/services/authService"

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {},
}))

jest.mock("@/features/auth/services/authService")

const mockedAuthService = authService as jest.Mocked<typeof authService>

const mockUser = {
  id: "1",
  name: "Juan Pérez",
  email: "juan@test.com",
  role: "admin",
  status: "active",
  created_at: "2025-01-01T00:00:00Z",
}

describe("useAuth hook (caja blanca)", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("carga el usuario desde localStorage al inicializar", () => {
    mockedAuthService.loadAuthUser.mockReturnValue(mockUser as any)

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.loading).toBe(false)
  })

  it("muestra error si login falla", async () => {
    mockedAuthService.loginWithEmailPassword.mockRejectedValue(
      new Error("Credenciales incorrectas")
    )

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await expect(
        result.current.login("bad@test.com", "1234")
      ).rejects.toThrow("Credenciales incorrectas")
    })

    await waitFor(() => {
      expect(result.current.error).toBe("Credenciales incorrectas")
    })
  })

  it("realiza login correctamente y actualiza estado", async () => {
    mockedAuthService.loginWithEmailPassword.mockResolvedValue(mockUser as any)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login("juan@test.com", "123456")
    })

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.success).toBe(`Bienvenido, ${mockUser.name}`)
      expect(result.current.error).toBeNull()
    })
  })
})
