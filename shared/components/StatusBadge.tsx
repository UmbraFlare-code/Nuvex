// shared/components/StatusBadge.tsx
"use client"
import badge from "@/shared/styles/primitives/badge.module.css"

type Props = {
  label: string
  tone?: "success" | "warning" | "danger" | "info"
}
export default function StatusBadge({ label, tone = "info" }: Props) {
  const toneClass =
    tone === "success" ? badge.statusSuccess :
    tone === "warning" ? badge.statusWarning :
    tone === "danger"  ? badge.statusDanger  :
                         badge.statusInfo
  return <span className={`${badge.statusBadge} ${toneClass}`}>{label}</span>
}
