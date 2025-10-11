import type { Metadata } from "next"
import "./globals.css"
import { ToastProvider } from "@/shared/components/ToastProvider"
import ErrorBoundary from "@/shared/components/ErrorBoundary"

export const metadata: Metadata = {
  title: "Eléctrica CV",
  description: "Reparación, instalación y mantenimiento de sistemas eléctricos",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <ErrorBoundary>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
