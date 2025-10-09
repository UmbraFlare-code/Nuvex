"use client"

import { MdPushPin, MdEdit, MdDelete } from "react-icons/md"
import card from "@/shared/styles/primitives/card.module.css"
import badge from "@/shared/styles/primitives/badge.module.css"
import styles from "../styles/NotesView.module.css"
import IconButton from "@/shared/components/IconButton"
import type { UINote } from "../types"

type Props = {
  note: UINote
  onEdit: (note: UINote) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
}

export default function NoteCard({ note, onEdit, onDelete, onTogglePin }: Props) {
  return (
    <div className={`${card.dataCard} ${styles.noteCard} ${note.isPinned ? styles.noteCardPinned : ""}`}>
      <div className={styles.noteHeader}>
        <span
          className={`${badge.statusBadge} ${
            note.userRole === "admin" ? badge.statusInfo : badge.statusSuccess
          }`}
        >
          {note.userRole === "admin" ? "Administración" : "General"}
        </span>

        <button
          className={`${styles.pinButton} ${note.isPinned ? styles.pinActive : ""}`}
          onClick={() => onTogglePin(note.id)}
          title={note.isPinned ? "Desfijar" : "Fijar"}
        >
          <MdPushPin size={18} />
        </button>
      </div>

      <h3 className={styles.noteTitle}>{note.title}</h3>
      <p className={styles.noteContent}>{note.description}</p>

      <div className={styles.noteFooter}>
        <div className={styles.noteMeta}>
          <span className={styles.noteAuthor}>{note.userName ?? "Usuario"}</span>
          <span className={styles.noteDate}>
            {new Date(note.created_at ?? Date.now()).toLocaleDateString("es-ES")}
          </span>
        </div>
        <div className={styles.noteActions}>
          <IconButton title="Editar" icon={<MdEdit size={16} />} onClick={() => onEdit(note)} />
          <IconButton
            title="Eliminar"
            icon={<MdDelete size={16} />}
            variant="danger"
            onClick={() => onDelete(note.id)}
          />
        </div>
      </div>
    </div>
  )
}
