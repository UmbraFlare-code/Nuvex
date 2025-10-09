"use client"

import layout from "@/features/dashboard/styles/Layout.module.css"
import dv from "@/features/dashboard/styles/DashboardView.module.css"
import met from "@/features/dashboard/styles/Metrics.module.css"
import ch from "@/features/dashboard/styles/Charts.module.css"
import section from "@/features/dashboard/styles/Section.module.css"
import card from "@/shared/styles/primitives/card.module.css"
import sk from "@/shared/styles/primitives/skeleton.module.css"

export default function DashboardSkeleton() {
  return (
    <main className={`${layout.mainContent} ${sk.mainNoSidebarOnMobile}`} aria-busy="true" aria-live="polite">
      {/* Header */}
      <header className={dv.header}>
        <div>
          <div className={sk.skelTitle} />
          <div className={sk.skelSubtitle} />
        </div>
        <div className={dv.headerMeta}>
          <div className={sk.skelMeta} />
        </div>
      </header>

      {/* Métricas */}
      <div className={met.metricsGrid}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={sk.skelMetricCard} />
        ))}
      </div>

      {/* Chart */}
      <div className={ch.chartsGrid}>
        <div className={`${card.dataCard} ${ch.chartCard}`}>
          <div className={sk.skelChartCard} />
        </div>
      </div>

      {/* Sección (tabla) */}
      <section className={`${card.dataCard} ${section.sectionCard}`}>
        <header className={section.sectionHeader}>
          <div className={sk.skelSectionTitle} />
          <div className={sk.skelSectionSubtitle} />
        </header>
        <div className={sk.skelTable} />
      </section>
    </main>
  )
}
