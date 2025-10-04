"use client"

import { useState } from "react"
import { MdAdd, MdEdit, MdDelete, MdPushPin } from "react-icons/md"
import { useGlobal } from "@/features/context/GlobalContext"
import styles from "../styles/NotesView.module.css"

export default function NotesView() {
  // ✅ Desde GlobalContext
  const { notes, addNote, updateNote, deleteNote, users } = useGlobal()
  const [filterUser, setFilterUser] = useState<string>("todos")

  // Filtro por usuario (en vez de categoría)
  const filteredNotes = notes.filter(
    (note) => filterUser === "todos" || note.userId === filterUser
  )

  const pinnedNotes = filteredNotes.filter((note) => note.isPinned)
  const regularNotes = filteredNotes.filter((note) => !note.isPinned)

  // === Handlers ===
  const togglePin = (id: string, isPinned: boolean) => {
    updateNote(id, { isPinned: !isPinned })
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de eliminar esta nota?")) {
      deleteNote(id)
    }
  }

  const handleAddTestNote = () => {
    if (users.length === 0) {
      alert("No hay usuarios disponibles para crear la nota.")
      return
    }

    addNote({
      userId: users[0].id,
      title: "Nueva nota de prueba",
      description: "Ejemplo de contenido de la nota",
      isPinned: false,
    })
  }

  // === Card ===
  const NoteCard = ({ note }: { note: any }) => {
    const author = users.find((u) => u.id === note.userId)

    return (
      <div className={`${styles.noteCard} ${note.isPinned ? styles.noteCardPinned : ""}`}>
        <div className={styles.noteHeader}>
          <span className={styles.categoryBadge}>
            {author?.role === "admin" ? "Administración" : "General"}
          </span>
          <button
            className={`${styles.pinButton} ${note.isPinned ? styles.pinButtonActive : ""}`}
            onClick={() => togglePin(note.id, note.isPinned)}
            title={note.isPinned ? "Desfijar" : "Fijar"}
          >
            <MdPushPin size={18} />
          </button>
        </div>
        <h3 className={styles.noteTitle}>{note.title}</h3>
        <p className={styles.noteContent}>{note.description}</p>
        <div className={styles.noteFooter}>
          <div className={styles.noteMeta}>
            <span className={styles.noteAuthor}>{author?.name ?? "Usuario desconocido"}</span>
            <span className={styles.noteDate}>
              {new Date(note.createdAt).toLocaleDateString("es-ES")}
            </span>
          </div>
          <div className={styles.noteActions}>
            <button className={styles.actionButton} title="Editar">
              <MdEdit size={16} />
            </button>
            <button
              className={styles.actionButtonDanger}
              onClick={() => handleDelete(note.id)}
              title="Eliminar"
            >
              <MdDelete size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.notesView}>
      {/* === Header === */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Notas</h1>
          <p className={styles.subtitle}>Gestione notas y recordatorios del inventario</p>
        </div>
        <button className={styles.addButton} onClick={handleAddTestNote}>
          <MdAdd size={20} />
          <span>Nueva Nota</span>
        </button>
      </div>

      {/* === Filtros === */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Usuario:</label>
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className={styles.select}
          >
            <option value="todos">Todos</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.stats}>
          <span className={styles.statItem}>
            Total: <strong>{notes.length}</strong>
          </span>
          <span className={styles.statItem}>
            Fijadas: <strong>{pinnedNotes.length}</strong>
          </span>
        </div>
      </div>

      {/* === Secciones === */}
      {pinnedNotes.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Notas Fijadas</h2>
          <div className={styles.notesGrid}>
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}

      {regularNotes.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Todas las Notas</h2>
          <div className={styles.notesGrid}>
            {regularNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}

      {filteredNotes.length === 0 && (
        <div className={styles.emptyState}>
          <p>No se encontraron notas</p>
        </div>
      )}
    </div>
  )
}
