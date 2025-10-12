/**
 * @file tests/unit/dashboard/useDashboardMetrics.test.ts
 */
import { renderHook, waitFor } from "@testing-library/react"
import { useDashboardMetrics } from "@/features/dashboard/hooks/useDashboardMetrics"

// --- Mock completo de dashboardService ---
jest.mock("@/features/dashboard/services/dashboardService", () => ({
  fetchProducts: jest.fn(),
  fetchUsers: jest.fn(),
  fetchNotes: jest.fn(),
  getLowStock: jest.fn(),
  getTotalValue: jest.fn(),
  getCategories: jest.fn(),
  getCategoryDistribution: jest.fn(),
}))

import {
  fetchProducts,
  fetchUsers,
  fetchNotes,
  getLowStock,
  getTotalValue,
  getCategories,
  getCategoryDistribution,
} from "@/features/dashboard/services/dashboardService"

describe("useDashboardMetrics Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("carga métricas exitosamente", async () => {
    // Mock de data
    const mockProducts = [
      { id: 1, name: "Prod A", stock: 5, category: "Cat1", price: 100 },
      { id: 2, name: "Prod B", stock: 1, category: "Cat2", price: 200 },
    ]
    const mockUsers = [
      { id: 1, name: "María", status: "active" },
      { id: 2, name: "Pedro", status: "inactive" },
    ]
    const mockNotes = [{ id: "n1", title: "Nota Importante", isPinned: true }]

    ;(fetchProducts as jest.Mock).mockResolvedValueOnce(mockProducts)
    ;(fetchUsers as jest.Mock).mockResolvedValueOnce(mockUsers)
    ;(fetchNotes as jest.Mock).mockResolvedValueOnce(mockNotes)

    ;(getLowStock as jest.Mock).mockReturnValue([mockProducts[1]])
    ;(getTotalValue as jest.Mock).mockReturnValue(300)
    ;(getCategories as jest.Mock).mockReturnValue(["Cat1", "Cat2"])
    ;(getCategoryDistribution as jest.Mock).mockReturnValue({
      Cat1: 1,
      Cat2: 1,
    })

    const { result } = renderHook(() => useDashboardMetrics())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(fetchProducts).toHaveBeenCalled()
    expect(fetchUsers).toHaveBeenCalled()
    expect(fetchNotes).toHaveBeenCalledWith({ pinnedOnly: true })

    expect(result.current.products).toHaveLength(2)
    expect(result.current.activeUsersCount).toBe(1) // solo María activa
    expect(result.current.totalValue).toBe(300)
    expect(result.current.lowStockCount).toBe(1)
    expect(result.current.categoriesCount).toBe(2)
    expect(result.current.categoryDistribution).toEqual({ Cat1: 1, Cat2: 1 })
    expect(result.current.pinnedNotes).toHaveLength(1)
  })

  it("maneja error en la carga", async () => {
    ;(fetchProducts as jest.Mock).mockRejectedValueOnce(
      new Error("Fallo al cargar productos")
    )
    ;(fetchUsers as jest.Mock).mockResolvedValueOnce([])
    ;(fetchNotes as jest.Mock).mockResolvedValueOnce([])

    const { result } = renderHook(() => useDashboardMetrics())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe("Fallo al cargar productos")
    expect(result.current.products).toEqual([])
  })
})
