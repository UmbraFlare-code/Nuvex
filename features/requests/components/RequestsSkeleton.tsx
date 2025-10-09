"use client"

import tbl from "@/shared/styles/primitives/table.module.css"
import sk from "@/shared/styles/primitives/skeleton.module.css"
import styles from "@/shared/styles/primitives/skeleton.module.css"

export default function RequestsSkeleton() {
  return (
    <div className={styles.requestsView}>
      {/* Header */}
      <header className={styles.header}>
        <div className={sk.skelTitle} style={{ width: 240 }} />
        <div className={sk.skelSubtitle} style={{ width: 380, marginTop: 6 }} />
      </header>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={`${sk.skelInput} ${styles.searchGrow}`} />
        <div className={sk.skelInput} style={{ width: 180 }} />
      </div>

      {/* Tabla placeholder */}
      <div className={tbl.tableWrapper}>
        <div className={sk.skelTable} style={{ height: 280 }} />
      </div>
    </div>
  )
}
