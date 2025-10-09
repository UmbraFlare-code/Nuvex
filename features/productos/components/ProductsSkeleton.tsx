// features/productos/components/ProductsSkeleton.tsx
"use client"

import card from "@/shared/styles/primitives/card.module.css"
import sk from "@/shared/styles/primitives/skeleton.module.css"
import styles from "@/features/productos/styles/ProductsView.module.css"

export default function ProductsSkeleton() {
  return (
    <div className={styles.productsView} aria-busy="true" aria-live="polite">
      <div className={styles.header}>
        <div>
          <div className={sk.skelTitle} />
          <div className={sk.skelSubtitle} />
        </div>
        <div className={`${card.dataCard}`} style={{ padding: "0.5rem 0.75rem", width: 160 }}>
          <div className={sk.skelTitle} />
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={card.dataCard} style={{ padding: "0.5rem", flex: 1 }}>
          <div className={sk.skelTitleWide} />
        </div>
        <div className={card.dataCard} style={{ padding: "0.5rem", width: 220 }}>
          <div className={sk.skelTitle} />
        </div>
      </div>

      <div className={styles.cardsGrid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`${card.dataCard}`} style={{ minHeight: 180 }}>
            <div className={sk.skelSectionTitle} />
            <div className={sk.skelSubtitle} />
            <div className={sk.skelTable} />
          </div>
        ))}
      </div>
    </div>
  )
}
