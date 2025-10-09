"use client"

import { useId } from "react"
import { MdSearch, MdClose } from "react-icons/md"
import clsx from "clsx"
import styles from "../styles/SearchBox.module.css"

type Props = {
  value: string
  onChange: (v: string) => void
  onClear?: () => void
  placeholder?: string
  ariaLabel?: string
  className?: string
  onEnter?: (v: string) => void
}

export default function SearchBox({
  value,
  onChange,
  onClear,
  placeholder = "Buscar…",
  ariaLabel = "Buscar",
  className,
  onEnter,
}: Props) {
  const id = useId()

  return (
    <div className={clsx(styles.searchBox, className)}>
      <label htmlFor={id} className="sr-only">{ariaLabel}</label>
      <MdSearch className={styles.searchIcon} aria-hidden />
      <input
        id={id}
        className={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) onEnter(value)
        }}
      />
    </div>
  )
}
