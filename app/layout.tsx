import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

// 👉 importa tu GlobalProvider
import { GlobalProvider } from "@/features/context/GlobalContext"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Inventario App",
  description: "Sistema de gestión de inventario con Next.js y Supabase",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 🔑 Ahora todo tu app tiene acceso al GlobalContext */}
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  )
}
