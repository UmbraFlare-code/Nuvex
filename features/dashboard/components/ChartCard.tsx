"use client"

import type { ReactNode } from "react"
import card from "@/shared/styles/primitives/card.module.css"
import ch from "@/features/dashboard/styles/Charts.module.css"

type Props = {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function ChartCard({ title, subtitle, children }: Props) {
  return (
    <div className={`${card.dataCard} ${ch.chartCard}`}>
      <div className={ch.chartHeader}>
        <h3 className={ch.chartTitle}>{title}</h3>
        {subtitle && <p className={ch.chartSubtitle}>{subtitle}</p>}
      </div>
      <div className={ch.chartContainer}>{children}</div>
    </div>
  )
}
