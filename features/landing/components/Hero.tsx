"use client"

import styles from "../styles/landing.module.css"
import { Button } from "./button"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Hero() {
  const router = useRouter()

  return (
    <section className={styles.hero + " bg-gray-50"}>
      <div className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Texto */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Energía confiable para tu hogar y empresa
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            En <span className="font-semibold text-blue-600">Eléctrica CV</span> 
            contamos con más de 15 años de experiencia en reparación, instalación y mantenimiento de sistemas eléctricos.  
            Nuestro compromiso es brindar soluciones rápidas, seguras y con garantía.
          </p>

          <div className="flex gap-4 mt-8">
            {/* Navegación con router.push */}
            <Button
              onClick={() => router.push("/contacto")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            >
              Solicitar Presupuesto
            </Button>
          </div>
        </div>

        {/* Imagen */}
        <div className="flex justify-center">
          <Image
            src="/imagenes/hero-electricidad.jpg"
            alt="Servicios eléctricos profesionales"
            width={500}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}
