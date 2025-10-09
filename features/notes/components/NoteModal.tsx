"use client"

import { useEffect, useState } from "react"
import modal from "@/shared/styles/primitives/modal.module.css"
import type { UINote } from "../types"

type Props = {
  note: UINote | null
  onClose: () => void
  onSave: (data: { title: string; description: string; isPinned?: boolean }) => Promise<void>
}

export default function NoteModal({ note, onClose, onSave }: Props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPinned, setIsPinned] = useState(false)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setDescription(note.description)
      setIsPinned(!!note.isPinned)
    } else {
      setTitle("")
      setDescription("")
      setIsPinned(false)
    }
  }, [note])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave({ title, description, isPinned })
    onClose()
  }

  return (
    <div className={modal.overlay} onClick={onClose}>
      <div className={modal.content} onClick={(e) => e.stopPropagation()}>
        <header className={modal.header}>
          <h2 className={modal.title}>{note ? "Editar nota" : "Nueva nota"}</h2>
          <button className={modal.close} onClick={onClose}>✕</button>
        </header>

        <form onSubmit={submit} className={modal.form}>
          <div className={modal.row}>
            <div className={modal.group}>
              <label className={modal.label}>Título *</label>
              <input className={modal.input} value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
          </div>

          <div className={modal.group}>
            <label className={modal.label}>Descripción</label>
            <textarea
              className={modal.textarea}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <label className={modal.checkboxRow}>
            <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} />
            Fijar nota
          </label>

          <div className={modal.actions}>
            <button type="button" className={modal.btnGhost} onClick={onClose}>Cancelar</button>
            <button type="submit" className={modal.btnPrimary}>{note ? "Guardar cambios" : "Crear nota"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
