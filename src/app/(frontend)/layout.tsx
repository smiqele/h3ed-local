import type { Metadata } from 'next'
import { Manrope, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Manrope({
  variable: '--font-manrope-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'H3LLO Education',
  description: 'Стань гуру по облакам вместе с H3LLO CLOUD',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
        style={{ fontFamily: 'var(--font-manrope-sans)' }}
      >
        {children}
      </body>
    </html>
  )
}
