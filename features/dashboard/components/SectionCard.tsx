// features/dashboard/components/SectionCard.tsx
"use client"

import type { PropsWithChildren } from "react"
import card from "@/shared/styles/primitives/card.module.css"
import section from "@/features/dashboard/styles/Section.module.css"

type Props = PropsWithChildren<{
  title: string
  subtitle?: string
}>

export default function SectionCard({ title, subtitle, children }: Props) {
  return (
    <section className={`${card.dataCard} ${section.sectionCard}`} aria-labelledby="section-title">
      <header className={section.sectionHeader}>
        <h3 id="section-title" className={section.sectionTitle}>
          {title}
        </h3>
        {subtitle && <p className={section.sectionSubtitle}>{subtitle}</p>}
      </header>
      <div className={section.sectionBody}>{children}</div>
    </section>
  )
}
