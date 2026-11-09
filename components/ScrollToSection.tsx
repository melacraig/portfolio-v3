'use client'
import { useLayoutEffect } from 'react'

export default function ScrollToSection() {
  useLayoutEffect(() => {
    const target = sessionStorage.getItem('scrollTo')
    if (!target) return
    sessionStorage.removeItem('scrollTo')
    const el = document.getElementById(target)
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
    document.documentElement.style.visibility = ''
  }, [])

  return null
}
