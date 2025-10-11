// features/landing/components/Navbar.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "../styles/navbar.module.css"
import { Button } from "./button"
import { FaBars, FaTimes } from "react-icons/fa"
import Link from "next/link"

export default function Navbar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={styles.navbar}>
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => router.push("/")}
        >
          Eléctrica CV
        </div>

        {/* Menú escritorio */}
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
          <li><Link href="/" className={styles.link}>Inicio</Link></li>
          <li><Link href="/#elegirnos" className={styles.link}>¿Por qué elegirnos?</Link></li>
          <li><Link href="/#servicios" className={styles.link}>Servicios</Link></li>
          <li><Link href="/contacto" className={styles.link}>Contacto</Link></li>
        </ul>

        {/* Botón escritorio */}
        <div className="hidden md:block">
          <Button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
          >
            Iniciar Sesión
          </Button>
        </div>

        {/* Botón menú móvil */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-gray-700 focus:outline-none"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col gap-4 px-6 py-4 text-gray-700 font-medium">
            <li onClick={() => { router.push("/"); setMenuOpen(false) }}>Inicio</li>
            <li onClick={() => { router.push("/#elegirnos"); setMenuOpen(false) }}>¿Por qué elegirnos?</li>
            <li onClick={() => { router.push("/contacto"); setMenuOpen(false) }}>Contacto</li>
            <li><Link href="/login">Iniciar Sesión</Link></li>
          </ul>
        </div>
      )}
    </nav>
  )
}
