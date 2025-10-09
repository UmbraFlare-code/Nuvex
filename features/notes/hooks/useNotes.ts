"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { UINote } from "../types"
import { listNotes, createNote, updateNote as svcUpdate, deleteNote as svcDelete } from "../services/notesService"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function useNotes() {
  const { user } = useAuth()

  const [notes, setNotes] = useState<UINote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listNotes()
      setNotes(data)
    } catch (e: any) {
      setError(e.message ?? "No se pudieron cargar las notas")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  const authors = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>()
    for (const n of notes) {
      if (n.userId && n.userName) map.set(n.userId, { id: n.userId, name: n.userName })
    }
    return Array.from(map.values())
  }, [notes])

  const add = useCallback(async (payload: { title: string; description: string; isPinned?: boolean }) => {
    if (!user?.id) throw new Error("No hay usuario autenticado")
    const created = await createNote({ userId: user.id, ...payload })
    setNotes(prev => [created, ...prev])
  }, [user?.id])

  const update = useCallback(async (id: string, patch: Partial<Pick<UINote, "title" | "description" | "isPinned">>) => {
    await svcUpdate(id, patch)
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, ...patch } as UINote : n)))
  }, [])

  const togglePin = useCallback(async (id: string) => {
    const target = notes.find(n => n.id === id)
    if (!target) return
    await svcUpdate(id, { isPinned: !target.isPinned })
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)))
  }, [notes])

  const remove = useCallback(async (id: string) => {
    await svcDelete(id)
    setNotes(prev => prev.filter(n => n.id !== id))
  }, [])

  return {
    user,
    notes,
    authors,
    loading,
    error,
    reload,
    add,
    update,
    togglePin,
    remove,
  }
}
