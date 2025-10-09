"use client"

import sk from "@/shared/styles/primitives/skeleton.module.css"
import card from "@/shared/styles/primitives/card.module.css"
import styles from "../styles/NotesView.module.css"

export default function NotesSkeleton() {
  return (
    <div className={styles.notesView}>
      <header className={styles.header}>
        <div className={sk.skelTitle} style={{ width: 220 }} />
        <div className={sk.skelSubtitle} style={{ width: 360, marginTop: 6 }} />
      </header>

      <div className={styles.toolbar}>
        <div className={sk.skelInput} style={{ flex: "1 1 260px" }} />
        <div className={sk.skelInput} style={{ width: 200 }} />
        <div className={sk.skelInput} style={{ width: 160 }} />
      </div>

      <section className={styles.section}>
        <div className={sk.skelSectionTitle} />
        <div className={styles.notesGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`${card.dataCard} ${sk.skelCard}`} style={{ height: 160 }} />
          ))}
        </div>
      </section>
    </div>
  )
}
