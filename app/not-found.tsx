export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-blue-600">404</h1>
      <p className="mt-4 text-gray-700">Página no encontrada</p>
      <a href="/" className="mt-6 text-blue-500 underline">
        Volver al inicio
      </a>
    </div>
  )
}
