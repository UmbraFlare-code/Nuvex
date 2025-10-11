import styles from "../styles/landing.module.css"
import { FaBolt, FaTools, FaShieldAlt, FaUserTie, FaCertificate, FaClock } from "react-icons/fa"

export default function Features() {
  const features = [
    {
      title: "Experiencia Comprobada",
      desc: "Más de 15 años brindando soluciones eléctricas confiables a hogares y empresas en todo el país.",
      icon: <FaUserTie className="text-4xl text-blue-600 mb-4" />,
    },
    {
      title: "Técnicos Certificados",
      desc: "Contamos con personal altamente capacitado y certificado para garantizar la calidad en cada proyecto.",
      icon: <FaCertificate className="text-4xl text-blue-600 mb-4" />,
    },
    {
      title: "Atención Rápida",
      desc: "Resolvemos emergencias eléctricas 24/7 con tiempos de respuesta inmediatos.",
      icon: <FaClock className="text-4xl text-blue-600 mb-4" />,
    },
    {
      title: "Seguridad Primero",
      desc: "Cumplimos con todas las normas de seguridad eléctrica para proteger a tu familia y tu empresa.",
      icon: <FaShieldAlt className="text-4xl text-blue-600 mb-4" />,
    },
    {
      title: "Soluciones Integrales",
      desc: "Desde reparaciones menores hasta instalaciones industriales completas, todo en un solo lugar.",
      icon: <FaBolt className="text-4xl text-blue-600 mb-4" />,
    },
    {
      title: "Mantenimiento Confiable",
      desc: "Programas preventivos que prolongan la vida útil de tus equipos y reducen costos futuros.",
      icon: <FaTools className="text-4xl text-blue-600 mb-4" />,
    },
  ]

  return (
    <section id="elegirnos" className={styles.features + " py-16 bg-gray-50"}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          ¿Por qué elegirnos?
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          En <span className="font-semibold text-blue-600">Eléctrica CV</span> 
          nos enfocamos en ofrecer confianza, rapidez y seguridad en cada proyecto eléctrico. 
          Estas son las razones que nos hacen tu mejor opción:
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {features.map((item, i) => (
            <div
              key={i}
              className={
                styles.featureCard +
                " bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              }
            >
              <div className="flex flex-col items-center text-center">
                {item.icon}
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
