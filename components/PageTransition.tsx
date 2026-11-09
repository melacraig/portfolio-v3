'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const prevPath = useRef(pathname)

  // Fade in overlay on route change, then fade out once settled
  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname

    // Show overlay immediately
    setVisible(true)

    // Fade it out after a short hold
    const t = setTimeout(() => setVisible(false), 350)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <>
      {children}
      {/* Full-screen overlay — covers any flash during page swap */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'var(--deep)',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: visible ? 'none' : 'opacity 0.65s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
    </>
  )
}
