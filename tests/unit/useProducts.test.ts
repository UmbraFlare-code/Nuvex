import { renderHook, act, waitFor } from "@testing-library/react"
import { useProducts } from "@/features/productos/hooks/useProducts"
import * as productService from "@/features/productos/services/productService"

// 🔹 Mock completo del servicio
jest.mock("@/features/productos/services/productService")
// 🚀 Evitamos error de Supabase
jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      eq: jest.fn(),
      order: jest.fn(),
      single: jest.fn(),
    })),
  },
}))
const mockedService = productService as jest.Mocked<typeof productService>

const mockProducts = [
  {
    id: "1",
    name: "Laptop",
    category: "Electrónica",
    price: 1000,
    stock: 5,
    minStock: 2,
    description: "Notebook gamer",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "2",
    name: "Mouse",
    category: "Accesorios",
    price: 50,
    stock: 20,
    minStock: 5,
    description: "Mouse óptico",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
]

const mockCategories = ["Accesorios", "Electrónica"]

describe("useProducts hook (caja negra)", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("carga productos y categorías al inicializar", async () => {
    mockedService.fetchProducts.mockResolvedValue(mockProducts)
    mockedService.fetchCategories.mockResolvedValue(mockCategories)

    const { result } = renderHook(() => useProducts())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.products).toHaveLength(2)
      expect(result.current.categories).toEqual(mockCategories)
    })
  })

  it("maneja errores al cargar productos", async () => {
    mockedService.fetchProducts.mockRejectedValue(new Error("DB Error"))
    mockedService.fetchCategories.mockResolvedValue([])

    const { result } = renderHook(() => useProducts())

    await waitFor(() => {
      expect(result.current.error).toBe("DB Error")
      expect(result.current.loading).toBe(false)
    })
  })

  it("puede agregar un producto", async () => {
    mockedService.fetchProducts.mockResolvedValue([])
    mockedService.fetchCategories.mockResolvedValue([])
    const newProduct = { ...mockProducts[0], id: "3" }
    mockedService.createProduct.mockResolvedValue(newProduct)

    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.addProduct(newProduct)
    })

    expect(result.current.products).toContainEqual(newProduct)
    expect(result.current.categories).toContain(newProduct.category)
  })

  it("puede actualizar un producto", async () => {
    mockedService.fetchProducts.mockResolvedValue([mockProducts[0]])
    mockedService.fetchCategories.mockResolvedValue([mockProducts[0].category])
    const updated = { ...mockProducts[0], name: "Laptop Pro" }
    mockedService.updateProduct.mockResolvedValue(updated)

    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.updateProduct("1", { name: "Laptop Pro" })
    })

    expect(result.current.products[0].name).toBe("Laptop Pro")
  })

  it("puede eliminar un producto", async () => {
    mockedService.fetchProducts.mockResolvedValue([mockProducts[0]])
    mockedService.fetchCategories.mockResolvedValue([mockProducts[0].category])
    mockedService.deleteProduct.mockResolvedValue()

    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.deleteProduct("1")
    })

    expect(result.current.products).toHaveLength(0)
  })

  it("devuelve productos filtrados por categoría", async () => {
    mockedService.fetchProducts.mockResolvedValue(mockProducts)
    mockedService.fetchCategories.mockResolvedValue(mockCategories)

    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.loading).toBe(false))

    const accesorios = result.current.byCategory("Accesorios")
    const all = result.current.byCategory("all")

    expect(accesorios).toHaveLength(1)
    expect(accesorios[0].category).toBe("Accesorios")
    expect(all).toHaveLength(2)
  })

  it("calcula correctamente los totales", async () => {
    mockedService.fetchProducts.mockResolvedValue(mockProducts)
    mockedService.fetchCategories.mockResolvedValue(mockCategories)

    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.totals.count).toBe(2)
    expect(result.current.totals.value).toBe(1000 * 5 + 50 * 20) // 5000 + 1000
  })
})
