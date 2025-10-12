/**
 * @file tests/unit/notes/useNotes.test.ts
 */
import { renderHook, act, waitFor } from "@testing-library/react"
import { useNotes } from "@/features/notes/hooks/useNotes"

// --- Mock de notesService ---
jest.mock("@/features/notes/services/notesService", () => ({
  listNotes: jest.fn(),
  createNote: jest.fn(),
  updateNote: jest.fn(),
  deleteNote: jest.fn(),
}))

// --- Mock de useAuth (para simular usuario logueado) ---
jest.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}))

import {
  listNotes,
  createNote,
  updateNote as svcUpdate,
  deleteNote as svcDelete,
} from "@/features/notes/services/notesService"
import { useAuth } from "@/features/auth/hooks/useAuth"

describe("useNotes Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { id: "u1", name: "Tester" },
    })
  })

  it("carga notas al inicializar", async () => {
    const mockNotes = [
      { id: "n1", title: "Nota 1", description: "desc", userId: "u1", userName: "Tester", isPinned: false },
      { id: "n2", title: "Nota 2", description: "otra", userId: "u2", userName: "María", isPinned: true },
    ]
    ;(listNotes as jest.Mock).mockResolvedValueOnce(mockNotes)

    const { result } = renderHook(() => useNotes())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.notes).toHaveLength(2)
    expect(result.current.authors).toEqual([
      { id: "u1", name: "Tester" },
      { id: "u2", name: "María" },
    ])
  })

  it("maneja error si listNotes falla", async () => {
    ;(listNotes as jest.Mock).mockRejectedValueOnce(new Error("Error DB"))

    const { result } = renderHook(() => useNotes())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe("Error DB")
    expect(result.current.notes).toEqual([])
  })

  it("permite agregar nota", async () => {
    const newNote = { id: "n3", title: "Nueva", description: "texto", userId: "u1", userName: "Tester", isPinned: false }
    ;(createNote as jest.Mock).mockResolvedValueOnce(newNote)
    ;(listNotes as jest.Mock).mockResolvedValueOnce([]) // primera carga vacía

    const { result } = renderHook(() => useNotes())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.add({ title: "Nueva", description: "texto" })
    })

    expect(createNote).toHaveBeenCalledWith({ userId: "u1", title: "Nueva", description: "texto" })
    expect(result.current.notes).toContainEqual(newNote)
  })

  it("permite actualizar nota", async () => {
    const mockNotes = [{ id: "n1", title: "Original", description: "desc", isPinned: false }]
    ;(listNotes as jest.Mock).mockResolvedValueOnce(mockNotes)

    const { result } = renderHook(() => useNotes())
    await waitFor(() => expect(result.current.loading).toBe(false))

    ;(svcUpdate as jest.Mock).mockResolvedValueOnce(true)

    await act(async () => {
      await result.current.update("n1", { title: "Actualizado" })
    })

    expect(svcUpdate).toHaveBeenCalledWith("n1", { title: "Actualizado" })
    expect(result.current.notes[0].title).toBe("Actualizado")
  })

  it("permite hacer toggle de pin", async () => {
    const mockNotes = [{ id: "n1", title: "Nota", description: "desc", isPinned: false }]
    ;(listNotes as jest.Mock).mockResolvedValueOnce(mockNotes)

    const { result } = renderHook(() => useNotes())
    await waitFor(() => expect(result.current.loading).toBe(false))

    ;(svcUpdate as jest.Mock).mockResolvedValueOnce(true)

    await act(async () => {
      await result.current.togglePin("n1")
    })

    expect(svcUpdate).toHaveBeenCalledWith("n1", { isPinned: true })
    expect(result.current.notes[0].isPinned).toBe(true)
  })

  it("permite eliminar nota", async () => {
    const mockNotes = [{ id: "n1", title: "Borrar", description: "desc", isPinned: false }]
    ;(listNotes as jest.Mock).mockResolvedValueOnce(mockNotes)

    const { result } = renderHook(() => useNotes())
    await waitFor(() => expect(result.current.loading).toBe(false))

    ;(svcDelete as jest.Mock).mockResolvedValueOnce(true)

    await act(async () => {
      await result.current.remove("n1")
    })

    expect(svcDelete).toHaveBeenCalledWith("n1")
    expect(result.current.notes).toHaveLength(0)
  })
})
