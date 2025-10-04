"use client"

import { FaSpinner } from "react-icons/fa"

export default function Loadingx() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <FaSpinner className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-600 font-medium">Cargando datos...</p>
      </div>
    </div>
  )
}
