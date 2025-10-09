"use client"

import { useMemo, useState } from "react"
import { MdAdd } from "react-icons/md"

import { useNotes } from "../hooks/useNotes"
import NoteCard from "../components/NoteCard"
import NoteModal from "../components/NoteModal"
import NotesSkeleton from "../components/NotesSkeleton"

import SearchBox from "@/shared/components/SearchBox"
import { useToast } from "@/shared/components/ToastProvider"
import card from "@/shared/styles/primitives/card.module.css"
import styles from "../styles/NotesView.module.css"

export default function NotesView() {
  const { user, notes, authors, loading, error, add, update, togglePin, remove } = useNotes()
  const { showToast } = useToast()

  const [q, setQ] = useState("")
  const [authorFilter, setAuthorFilter] = useState<string>("all")
  const [editing, setEditing] = useState<null | { id?: string; title?: string; description?: string; isPinned?: boolean }>(null)

  const filtered = useMemo(() => {
    const byAuthor = authorFilter === "all" ? notes : notes.filter(n => n.userId === authorFilter)
    const qx = q.trim().toLowerCase()
    if (!qx) return byAuthor
    return byAuthor.filter(n =>
      [n.title, n.description, n.userName ?? ""].some(f => f.toLowerCase().includes(qx))
    )
  }, [notes, authorFilter, q])

  const pinned = filtered.filter(n => n.isPinned)
  const regular = filtered.filter(n => !n.isPinned)

  const createQuick = async () => {
    try {
      await add({ title: "Nueva nota", description: "Ejemplo de contenido", isPinned: false })
      showToast({ tone: "success", message: "Nota creada" })
    } catch (e: any) {
      showToast({ tone: "error", message: e?.message ?? "No se pudo crear la nota" })
    }
  }

  const saveModal = async (data: { title: string; description: string; isPinned?: boolean }) => {
    try {
      if (editing?.id) {
        await update(editing.id, data)
        showToast({ tone: "success", message: "Nota actualizada" })
      } else {
        await add(data)
        showToast({ tone: "success", message: "Nota creada" })
      }
    } catch (e: any) {
      showToast({ tone: "error", message: e?.message ?? "No se pudo guardar" })
      throw e
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta nota?")) return
    try {
      await remove(id)
      showToast({ tone: "success", message: "Nota eliminada" })
    } catch (e: any) {
      showToast({ tone: "error", message: e?.message ?? "No se pudo eliminar" })
    }
  }

  if (loading) return <NotesSkeleton />
  if (error) return <div className={`${card.dataCard} ${styles.errorBox}`}>⚠️ {error}</div>

  return (
    <div className={styles.notesView}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Notas</h1>
          <p className={styles.subtitle}>Gestione notas y recordatorios del inventario</p>
        </div>

        <button className={styles.addButton} onClick={() => setEditing({})}>
          <MdAdd size={20} />
          <span>Nueva Nota</span>
        </button>
      </header>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder="Buscar notas (título, autor, contenido)…"
          ariaLabel="Buscar notas"
          className={styles.searchGrow}
        />
        <div className={styles.filterGroup}>
          <label className={styles.label}>Autor:</label>
          <select
            className={styles.select}
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            {authors.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
            {user?.id && !authors.some(a => a.id === user.id) && (
              <option value={user.id}>{user.name}</option>
            )}
          </select>
        </div>

        <button className={styles.quickButton} onClick={createQuick}>Nota rápida</button>
      </div>

      {/* Secciones */}
      {pinned.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Notas fijadas</h2>
          <div className={styles.notesGrid}>
            {pinned.map(n => (
              <NoteCard
                key={n.id}
                note={n}
                onEdit={(note) => setEditing(note)}
                onDelete={onDelete}
                onTogglePin={togglePin}
              />
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Todas las notas</h2>
        <div className={styles.notesGrid}>
          {regular.map(n => (
            <NoteCard
              key={n.id}
              note={n}
              onEdit={(note) => setEditing(note)}
              onDelete={onDelete}
              onTogglePin={togglePin}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className={`${card.dataCard} ${styles.emptyState}`}>No se encontraron notas</div>
        )}
      </section>

      {/* Modal */}
      {editing && (
        <NoteModal
          note={editing?.id ? (notes.find(n => n.id === editing.id) ?? null) : null}
          onClose={() => setEditing(null)}
          onSave={saveModal}
        />
      )}
    </div>
  )
}
