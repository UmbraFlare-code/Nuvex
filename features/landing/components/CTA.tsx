"use client"

import { useRouter } from "next/navigation"
import styles from "../styles/landing.module.css"
import { Button } from "./button"
import { FaPhoneAlt, FaCalendarCheck } from 'react-icons/fa'

export default function CTA() {
  const router = useRouter()
  
  return (
    <section className={styles.cta + " py-16 bg-blue-700 text-white"}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          ¿Necesita un servicio eléctrico profesional?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Eléctrica CV ofrece servicios de emergencia 24/7 y presupuestos sin compromiso para todos sus proyectos eléctricos.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <Button 
            onClick={() => router.push('/contacto')} 
            className="bg-white text-blue-700 hover:bg-gray-100 flex items-center justify-center gap-2 px-6 py-3"
          >
            <FaPhoneAlt /> Solicitar Presupuesto
          </Button>
          
          <Button 
            onClick={() => router.push('/login')} 
            className="bg-blue-900 text-white hover:bg-blue-800 flex items-center justify-center gap-2 px-6 py-3"
          >
            <FaCalendarCheck /> Agendar Servicio
          </Button>
        </div>
        
        <p className="mt-8 text-blue-100">
          Respuesta garantizada en menos de 24 horas
        </p>
      </div>
    </section>
  )
}
