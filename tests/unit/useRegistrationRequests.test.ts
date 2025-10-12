import { renderHook, act } from "@testing-library/react"
import { useRegistrationRequestsSimple } from "@/features/users/hooks/useRegistrationRequests"
import * as service from "@/features/users/services/registrationRequestsService"

// 🚀 Evitamos error de supabase
jest.mock("@/lib/supabaseClient", () => ({
  supabase: {},
}))

// Mock de los servicios
jest.mock("@/features/users/services/registrationRequestsService")
const mockedService = service as jest.Mocked<typeof service>

const mockRows = [
  {
    id: "r1",
    name: "Juan Pérez",
    email: "juan@test.com",
    role: "employee",
    status: "pending",
    requested_at: "2025-01-01",
    updated_at: null,
  },
  {
    id: "r2",
    name: "Ana García",
    email: "ana@test.com",
    role: "admin",
    status: "approved",
    requested_at: "2025-01-02",
    updated_at: "2025-01-03",
  },
]

describe("useRegistrationRequestsSimple (caja negra)", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("carga registros al inicializar", async () => {
    mockedService.listRegistrationRequests.mockResolvedValue(mockRows as any)

    const { result } = renderHook(() => useRegistrationRequestsSimple())

    // Inicialmente loading = true
    expect(result.current.loading).toBe(true)

    // Esperar a que termine el useEffect
    await act(async () => { await Promise.resolve() })

    expect(result.current.rows).toEqual(mockRows)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it("maneja error al cargar registros", async () => {
    mockedService.listRegistrationRequests.mockRejectedValue(new Error("fallo"))

    const { result } = renderHook(() => useRegistrationRequestsSimple())

    await act(async () => { await Promise.resolve() })

    expect(result.current.rows).toEqual([])
    expect(result.current.error).toBe("fallo")
    expect(result.current.loading).toBe(false)
  })

  it("remove elimina un registro del estado", async () => {
    mockedService.listRegistrationRequests.mockResolvedValue(mockRows as any)
    mockedService.deleteRegistrationRequest.mockResolvedValue()

    const { result } = renderHook(() => useRegistrationRequestsSimple())
    await act(async () => { await Promise.resolve() })

    expect(result.current.rows).toHaveLength(2)

    await act(async () => {
      await result.current.remove("r1")
    })

    expect(mockedService.deleteRegistrationRequest).toHaveBeenCalledWith("r1")
    expect(result.current.rows).toEqual([mockRows[1]])
  })

  it("reload vuelve a cargar los registros", async () => {
    mockedService.listRegistrationRequests
      .mockResolvedValueOnce([mockRows[0]] as any) // primera carga
      .mockResolvedValueOnce(mockRows as any)     // segunda carga

    const { result } = renderHook(() => useRegistrationRequestsSimple())
    await act(async () => { await Promise.resolve() })

    expect(result.current.rows).toEqual([mockRows[0]])

    await act(async () => {
      await result.current.reload()
    })

    expect(mockedService.listRegistrationRequests).toHaveBeenCalledTimes(2)
    expect(result.current.rows).toEqual(mockRows)
  })
})
