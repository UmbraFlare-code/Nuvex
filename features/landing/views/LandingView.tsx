"use client"

import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Features from "../components/Features"
import CTA from "../components/CTA"
import Footer from "../components/Footer"

export default function LandingView() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <section id="servicios" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nuestros Servicios
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                Reparaciones Eléctricas
              </h3>
              <p className="text-gray-600">
                Diagnóstico y reparación rápida de sistemas eléctricos residenciales
                e industriales con garantía.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                Instalaciones Profesionales
              </h3>
              <p className="text-gray-600">
                Montaje de tableros, cableado estructurado y sistemas completos con
                certificación.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                Mantenimiento Preventivo
              </h3>
              <p className="text-gray-600">
                Programas para prevenir fallas y extender la vida útil de tus
                instalaciones eléctricas.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Features />
      <CTA />
      <Footer />
    </main>
  )
}
