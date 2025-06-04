import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import VoiceflowWidgetLoader from '@/components/voiceflow-widget/VoiceflowWidgetLoader'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QuizGenius AI",
  description: "Tu asistente de aprendizaje inteligente",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            {/* Widget de Voiceflow con funcionalidades de voz activadas */}
            <VoiceflowWidgetLoader
              theme="light"
              position="bottom-right"
              enableTTS={true}
              enableSTT={true}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
