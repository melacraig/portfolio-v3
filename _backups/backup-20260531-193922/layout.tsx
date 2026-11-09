import type { Metadata } from 'next'
import { Montserrat, Syne } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500'],
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Melanie Craig — Graphic & Motion Designer',
  description: '7 years shaping how brands look. 4 making them move.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${syne.variable}`}>
      <body><SmoothScroll>{children}</SmoothScroll></body>
    </html>
  )
}
