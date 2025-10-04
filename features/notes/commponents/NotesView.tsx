"use client"

import { useState, useMemo } from "react"
import { MdAdd, MdEdit, MdDelete, MdPushPin } from "react-icons/md"
import { useGlobal } from "@/features/context/GlobalContext"
import styles from "../styles/NotesView.module.css"

export default function NotesView() {
  const { notes, addNote, updateNote, deleteNote, users } = useGlobal()
  const [filterUser, setFilterUser] = useState("todos")

  const filteredNotes = useMemo(
    () => notes.filter((n) => filterUser === "todos" || n.userId === filterUser),
    [notes, filterUser]
  )

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned)
  const regularNotes = filteredNotes.filter((n) => !n.isPinned)

  const togglePin = (id: string, isPinned: boolean) => updateNote(id, { isPinned: !isPinned })

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de eliminar esta nota?")) deleteNote(id)
  }

  const handleAddTestNote = () => {
    if (!users.length) {
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

  return (
    <div className={styles.notesView}>
      {/* Header */}
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

      {/* Filters */}
      <div className={styles.filters}>
        <FilterSelect
          label="Usuario:"
          value={filterUser}
          onChange={setFilterUser}
          options={[{ value: "todos", label: "Todos" }, ...users.map((u) => ({ value: u.id, label: u.name }))]}
        />
        <div className={styles.stats}>
          <Stat label="Total" value={notes.length} />
          <Stat label="Fijadas" value={pinnedNotes.length} />
        </div>
      </div>

      {/* Sections */}
      {pinnedNotes.length > 0 && (
        <Section title="Notas Fijadas">
          {pinnedNotes.map((n) => (
            <NoteCard key={n.id} note={n} users={users} onTogglePin={togglePin} onDelete={handleDelete} />
          ))}
        </Section>
      )}

      {regularNotes.length > 0 && (
        <Section title="Todas las Notas">
          {regularNotes.map((n) => (
            <NoteCard key={n.id} note={n} users={users} onTogglePin={togglePin} onDelete={handleDelete} />
          ))}
        </Section>
      )}

      {filteredNotes.length === 0 && <div className={styles.emptyState}>No se encontraron notas</div>}
    </div>
  )
}

/* ===========================
   Componentes UI reutilizables
=========================== */

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (val: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className={styles.filterGroup}>
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={styles.select}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className={styles.statItem}>
      {label}: <strong>{value}</strong>
    </span>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.notesGrid}>{children}</div>
    </div>
  )
}

function NoteCard({
  note,
  users,
  onTogglePin,
  onDelete,
}: {
  note: any
  users: any[]
  onTogglePin: (id: string, isPinned: boolean) => void
  onDelete: (id: string) => void
}) {
  const author = users.find((u) => u.id === note.userId)

  return (
    <div className={`${styles.noteCard} ${note.isPinned ? styles.noteCardPinned : ""}`}>
      <div className={styles.noteHeader}>
        <span className={styles.categoryBadge}>
          {author?.role === "admin" ? "Administración" : "General"}
        </span>
        <button
          className={`${styles.pinButton} ${note.isPinned ? styles.pinButtonActive : ""}`}
          onClick={() => onTogglePin(note.id, note.isPinned)}
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
          <span className={styles.noteDate}>{new Date(note.createdAt).toLocaleDateString("es-ES")}</span>
        </div>
        <div className={styles.noteActions}>
          <IconButton icon={<MdEdit size={16} />} title="Editar" />
          <IconButton icon={<MdDelete size={16} />} title="Eliminar" danger onClick={() => onDelete(note.id)} />
        </div>
      </div>
    </div>
  )
}

function IconButton({
  icon,
  title,
  onClick,
  danger,
}: {
  icon: React.ReactNode
  title: string
  onClick?: () => void
  danger?: boolean
}) {
  return (
    <button
      className={danger ? styles.actionButtonDanger : styles.actionButton}
      onClick={onClick}
      title={title}
    >
      {icon}
    </button>
  )
}