import { renderHook, act } from "@testing-library/react"
import { useRequests } from "@/features/requests/hooks/useRequests"
import * as service from "@/features/requests/services/requestsService"

// 🚀 Mock de supabase para evitar error de variables de entorno
jest.mock("@/lib/supabaseClient", () => ({
  supabase: {},
}))

// Mock de requestsService
jest.mock("@/features/requests/services/requestsService")
const mockedService = service as jest.Mocked<typeof service>

const mockRequests = [
  {
    id: "r1",
    userId: "u1",
    userName: "Ana",
    productId: "p1",
    productName: "Prod A",
    title: "Solicitud A",
    reason: "Necesito stock",
    status: "pending" as const,
    quantity: 2,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: "r2",
    userId: "u2",
    userName: "Luis",
    productId: "p2",
    productName: "Prod B",
    title: "Solicitud B",
    reason: "",
    status: "accepted" as const,
    quantity: 1,
    created_at: "2025-01-02",
    updated_at: "2025-01-02",
  },
]

describe("useRequests hook (caja negra)", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("carga solicitudes al inicializar", async () => {
    mockedService.listRequests.mockResolvedValue(mockRequests)

    const { result } = renderHook(() => useRequests("admin"))

    expect(result.current.loading).toBe(true)

    await act(async () => { await Promise.resolve() })

    expect(result.current.requests).toEqual(mockRequests)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it("maneja error al cargar solicitudes", async () => {
    mockedService.listRequests.mockRejectedValue(new Error("fallo"))

    const { result } = renderHook(() => useRequests("admin"))

    await act(async () => { await Promise.resolve() })

    expect(result.current.error).toBe("fallo")
    expect(result.current.requests).toEqual([])
  })

  it("approve cambia estado a accepted", async () => {
    mockedService.listRequests.mockResolvedValue([mockRequests[0]])
    mockedService.updateRequestStatus.mockResolvedValue()

    const { result } = renderHook(() => useRequests("admin"))
    await act(async () => { await Promise.resolve() })

    await act(async () => {
      await result.current.approve("r1")
    })

    expect(mockedService.updateRequestStatus).toHaveBeenCalledWith("r1", "accepted")
    expect(result.current.requests[0].status).toBe("accepted")
  })

  it("reject cambia estado a rejected", async () => {
    mockedService.listRequests.mockResolvedValue([mockRequests[0]])
    mockedService.updateRequestStatus.mockResolvedValue()

    const { result } = renderHook(() => useRequests("admin"))
    await act(async () => { await Promise.resolve() })

    await act(async () => {
      await result.current.reject("r1")
    })

    expect(mockedService.updateRequestStatus).toHaveBeenCalledWith("r1", "rejected")
    expect(result.current.requests[0].status).toBe("rejected")
  })

  it("cancel en modo employee cambia estado a rejected", async () => {
    const reqs = [{ ...mockRequests[0], userId: "u123" }]
    mockedService.listRequests.mockResolvedValue(reqs)
    mockedService.cancelRequestByEmployee.mockResolvedValue()

    const { result } = renderHook(() => useRequests("employee", "u123"))
    await act(async () => { await Promise.resolve() })

    await act(async () => {
      await result.current.cancel("r1")
    })

    expect(mockedService.cancelRequestByEmployee).toHaveBeenCalledWith("r1", "u123")
    expect(result.current.requests[0].status).toBe("rejected")
    expect(result.current.requests[0].reason).toBe("Cancelado por el empleado")
  })

  it("helpers funcionan correctamente", async () => {
    mockedService.listRequests.mockResolvedValue([mockRequests[0]])

    const { result } = renderHook(() => useRequests("admin"))
    await act(async () => { await Promise.resolve() })

    const row = result.current.requests[0]

    expect(result.current.canApprove(row)).toBe(true)
    expect(result.current.canReject(row)).toBe(true)
    expect(result.current.canCancel(row)).toBe(false)
  })
})
