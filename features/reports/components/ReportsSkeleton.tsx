"use client"

import card from "@/shared/styles/primitives/card.module.css"
import sk from "@/shared/styles/primitives/skeleton.module.css"

export default function ReportsSkeleton() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className={`${card.dataCard}`} style={{ padding: 16 }}>
        <div className={sk.skelTitle} />
        <div className={sk.skelSubtitle} />
      </div>
      <div className={`${card.dataCard}`} style={{ padding: 16, minHeight: 260 }}>
        <div className={sk.skelChartCard} />
      </div>
      <div className={`${card.dataCard}`} style={{ padding: 16, minHeight: 320 }}>
        <div className={sk.skelTable} />
      </div>
    </div>
  )
}
