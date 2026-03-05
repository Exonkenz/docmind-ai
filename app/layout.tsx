import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { MainLayout } from '@/components/main-layout'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'DocMind AI',
  description: 'Automatically parse technical documentation, extract workflows, and generate diagrams',
  openGraph: {
    title: 'DocMind AI',
    description: 'Automatically parse technical documentation, extract workflows, and generate diagrams',
    images: [
      {
        url: '/docmind open graph image.png',
        width: 1200,
        height: 630,
        alt: 'DocMind AI - Document Intelligence Platform',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocMind AI',
    description: 'Automatically parse technical documentation, extract workflows, and generate diagrams',
    images: ['/docmind open graph image.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icon.svg',
        sizes: 'any',
      },
    ],
    shortcut: '/icon.svg',
  },

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <MainLayout>{children}</MainLayout>
        <Analytics />
      </body>
    </html>
  )
}