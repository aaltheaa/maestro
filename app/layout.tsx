import type { Metadata } from 'next'
import './globals.css'
import { ApiKeyProvider } from '@/lib/api-key-context'
import ApiKeyGate from '@/components/ApiKeyGate'

export const metadata: Metadata = {
  title: 'Maestro — Learn MIT OpenCourseWare',
  description:
    'Maestro is an AI-powered learning platform for MIT OpenCourseWare. Discover courses, get a personalised roadmap, and study with an AI tutor grounded in your course materials.',
  keywords: ['MIT OCW', 'OpenCourseWare', 'AI learning', 'online education'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ApiKeyProvider>
          <ApiKeyGate>{children}</ApiKeyGate>
        </ApiKeyProvider>
      </body>
    </html>
  )
}
