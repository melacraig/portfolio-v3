import type { Metadata, Viewport } from 'next'
import { Bodoni_Moda, Ballet, Hanken_Grotesk } from 'next/font/google'
import './globals.css'
import SmoothScroll      from '@/components/SmoothScroll'
import PageTransition    from '@/components/PageTransition'

// Display: high-contrast didone, roman for titles, italic for labels & data
const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-bodoni',
  display: 'swap',
})

// Script: at most one word inside a title, set at 2.1em
const ballet = Ballet({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-ballet',
  display: 'swap',
})

// Body copy and UI
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['300', '400', '500'],
  variable: '--font-hanken',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Melanie Craig — Graphic & Motion Designer',
  description: '9 years shaping how brands look. 6 making them move.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2B1622',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${ballet.variable} ${hanken.variable}`} suppressHydrationWarning>
      <body>
        {/* Hide page before first paint if a section-jump is pending — avoids hero flash */}
        <script dangerouslySetInnerHTML={{ __html: `if(sessionStorage.getItem('scrollTo'))document.documentElement.style.visibility='hidden'` }} />
        <SmoothScroll><PageTransition>{children}</PageTransition></SmoothScroll>
      </body>
    </html>
  )
}
