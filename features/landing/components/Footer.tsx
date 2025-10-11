// features/landing/components/Footer.tsx
import styles from "../styles/footer.module.css"
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className={styles.footer + " bg-gray-900 text-white py-12"}>
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info empresa */}
        <div>
          <h3 className="text-xl font-bold mb-4">Eléctrica CV</h3>
          <p className="mb-4">
            Expertos en servicios eléctricos residenciales e industriales desde 2005.
          </p>
          <p>&copy; {new Date().getFullYear()} Eléctrica CV. Todos los derechos reservados.</p>
        </div>

        {/* Navegación rápida */}
        <div>
          <h3 className="text-xl font-bold mb-4">Navegación</h3>
          <ul className="space-y-2">
            <li><Link href="/">Inicio</Link></li>
            <li><Link href="/#elegirnos">¿Por qué elegirnos?</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contacto</h3>
          <ul className="space-y-2">
            <li className="flex items-center"><FaPhone className="mr-2" /> (55) 1234-5678</li>
            <li className="flex items-center"><FaEnvelope className="mr-2" /> contacto@electricacv.com</li>
            <li className="flex items-center"><FaMapMarkerAlt className="mr-2" /> CDMX</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
