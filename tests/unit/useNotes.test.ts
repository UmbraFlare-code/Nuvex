import { renderHook, act } from "@testing-library/react"
import { useNotes } from "@/features/notes/hooks/useNotes"
import * as notesService from "@/features/notes/services/notesService"
import { useAuth } from "@/features/auth/hooks/useAuth"

// 🚀 Mock de supabaseClient para evitar error de variables de entorno
jest.mock("@/lib/supabaseClient", () => ({
  supabase: {},
}))

// Mock de notesService completo
jest.mock("@/features/notes/services/notesService")
const mockedService = notesService as jest.Mocked<typeof notesService>

// Mock de useAuth (hook dependiente)
jest.mock("@/features/auth/hooks/useAuth")
const mockedUseAuth = useAuth as jest.Mock

// --- Datos de prueba ---
const mockUser = {
  id: "u1",
  name: "Ana",
  email: "ana@test.com",
  role: "employee",
  status: "active",
  created_at: "2025-01-01T00:00:00Z",
}

const mockNotes = [
  {
    id: "n1",
    userId: "u1",
    userName: "Ana",
    userRole: "employee",
    title: "Nota A",
    description: "desc A",
    isPinned: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: "n2",
    userId: "u2",
    userName: "Luis",
    userRole: "admin",
    title: "Nota B",
    description: "desc B",
    isPinned: true,
    created_at: "2025-01-02",
    updated_at: "2025-01-02",
  },
]

describe("useNotes hook (caja negra)", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseAuth.mockReturnValue({ user: mockUser } as any)
  })

  it("carga notas al inicializar", async () => {
    mockedService.listNotes.mockResolvedValue(mockNotes as any)

    const { result } = renderHook(() => useNotes())

    // Loading empieza en true
    expect(result.current.loading).toBe(true)

    // Esperamos a que termine el useEffect
    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.notes).toEqual(mockNotes)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.authors).toEqual([
      { id: "u1", name: "Ana" },
      { id: "u2", name: "Luis" },
    ])
  })

  it("maneja error al cargar notas", async () => {
    mockedService.listNotes.mockRejectedValue(new Error("fallo"))

    const { result } = renderHook(() => useNotes())

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.error).toBe("fallo")
    expect(result.current.notes).toEqual([])
  })

  it("agrega una nota", async () => {
    mockedService.listNotes.mockResolvedValue([])
    const newNote = { ...mockNotes[0] }
    mockedService.createNote.mockResolvedValue(newNote  as any)

    const { result } = renderHook(() => useNotes())

    await act(async () => { await Promise.resolve() }) // inicial carga

    await act(async () => {
      await result.current.add({
        title: "Nota nueva",
        description: "desc",
      })
    })

    expect(result.current.notes).toContainEqual(newNote)
  })

  it("actualiza una nota", async () => {
    mockedService.listNotes.mockResolvedValue([mockNotes[0]] as any)
    mockedService.updateNote.mockResolvedValue()

    const { result } = renderHook(() => useNotes())
    await act(async () => { await Promise.resolve() })

    await act(async () => {
      await result.current.update("n1", { title: "Nota editada" })
    })

    expect(result.current.notes[0].title).toBe("Nota editada")
  })

  it("togglea pin de una nota", async () => {
    mockedService.listNotes.mockResolvedValue([mockNotes[0]] as any)
    mockedService.updateNote.mockResolvedValue()

    const { result } = renderHook(() => useNotes())
    await act(async () => { await Promise.resolve() })

    await act(async () => {
      await result.current.togglePin("n1")
    })

    expect(result.current.notes[0].isPinned).toBe(true)
  })

  it("elimina una nota", async () => {
    mockedService.listNotes.mockResolvedValue([mockNotes[0]] as any)
    mockedService.deleteNote.mockResolvedValue()

    const { result } = renderHook(() => useNotes())
    await act(async () => { await Promise.resolve() })

    await act(async () => {
      await result.current.remove("n1")
    })

    expect(result.current.notes).toEqual([])
  })
})
