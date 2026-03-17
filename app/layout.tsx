import type { Metadata } from 'next'
import './globals.css'
import { ApiKeyProvider } from '@/lib/api-key-context'

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
        <ApiKeyProvider>{children}</ApiKeyProvider>
      </body>
    </html>
  )
}
