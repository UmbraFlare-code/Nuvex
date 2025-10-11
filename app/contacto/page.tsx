"use client"

import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
import Navbar from "@/features/landing/components/Navbar"
import Footer from "@/features/landing/components/Footer"
import styles from "@/features/landing/styles/contacto.module.css"

export default function ContactoPage() {
  return (
    <main className={styles.main}>
      <Navbar />

      <section className={styles.section}>
        <div className={styles.contactContainer}>
          <h1 className={styles.contactTitle}>Hablemos</h1>
          <p className={styles.contactSubtitle}>
            Cuéntanos sobre tu proyecto eléctrico y te responderemos lo antes posible.
          </p>

          {/* Formulario */}
          <form className={styles.contactForm}>
            <div className={styles.inputGroup}>
              <input type="text" required className={styles.input} />
              <label className={styles.label}>Nombre completo</label>
            </div>
            <div className={styles.inputGroup}>
              <input type="email" required className={styles.input} />
              <label className={styles.label}>Correo electrónico</label>
            </div>
            <div className={styles.inputGroup}>
              <textarea rows={4} required className={styles.textarea}></textarea>
              <label className={styles.label}>Tu mensaje</label>
            </div>
            <button type="submit" className={styles.button}>
              Enviar Mensaje
            </button>
          </form>
          {/* Mapa */}
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.046567488915!2d-99.17329248509336!3d19.390681886905853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff36b0bca9ab%3A0x9c1ecf3c2fffcf87!2sAv.%20Revoluci%C3%B3n%201234%2C%20Col.%20N%C3%A1poles%2C%20CDMX!5e0!3m2!1ses!2smx!4v1700000000000"
              width="100%"
              height="350"
              allowFullScreen={true}
              loading="lazy"
              className={styles.map}
            ></iframe>
          </div>
          {/* Información */}
          <div className={styles.contactInfo}>
            <p><FaPhone /> (55) 1234-5678</p>
            <p><FaEnvelope /> contacto@electricacv.com</p>
            <p><FaMapMarkerAlt /> Av. Revolución 1234, Col. Nápoles, CDMX</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
