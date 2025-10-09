"use client"

import type { ReactNode } from "react"
import card from "@/shared/styles/primitives/card.module.css"
import met from "@/features/dashboard/styles/Metrics.module.css"

type Props = {
  label: string
  value: number | string
  badge: string
  description: string
  icon?: ReactNode
}

export default function MetricCard({ label, value, badge, description, icon }: Props) {
  return (
    <div className={`${card.dataCard} ${met.metricCard}`}>
      <div className={met.metricHeader}>
        <span className={met.metricLabel}>{label}</span>
        {icon}
      </div>

      <div className={met.metricValue}>{value}</div>

      <div className={met.metricFooter}>
        <span className={met.metricBadge}>{badge}</span>
      </div>

      <div className={met.metricDescription}>{description}</div>
    </div>
  )
}
