// shared/components/EmptyState.tsx
"use client"
import card from "@/shared/styles/primitives/card.module.css"

export default function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className={card.dataCard} style={{ padding: "1rem", textAlign: "center" }}>
      {children}
    </div>
  )
}
