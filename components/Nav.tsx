'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const links = [
  { href: '/',        label: 'Home',        id: null },
  { href: '#about',   label: 'About Me',    id: 'about' },
  { href: '#work',    label: 'The Work',    id: 'work' },
  { href: '#contact', label: 'Contact Me',  id: 'contact' },
]

export default function Nav() {
  const [open, setOpen]     = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const navRef    = useRef<HTMLElement>(null)

  useEffect(() => {
    const sections = links
      .filter(l => l.id)
      .map(l => document.getElementById(l.id!))
      .filter(Boolean) as HTMLElement[]

    const hero = document.querySelector<HTMLElement>('.hero-section')

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id || null)
      })
    }, { threshold: 0.35 })

    const heroIo = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setActive(null)
    }, { threshold: 0.35 })

    sections.forEach(s => io.observe(s))
    if (hero) heroIo.observe(hero)

    return () => { io.disconnect(); heroIo.disconnect() }
  }, [])

  const close = () => { setOpen(false); navRef.current?.classList.remove('is-open') }

  return (
    <>
      <button
        ref={burgerRef}
        className="nav-burger"
        aria-label="Toggle menu"
        onClick={() => {
          const next = !open
          setOpen(next)
          navRef.current?.classList.toggle('is-open', next)
        }}
      >
        <span /><span /><span />
      </button>

      <nav
        ref={navRef}
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: 'var(--nav-w)', zIndex: 100,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '3rem 2.8rem',
          borderRight: '1px solid rgba(242,122,174,0.12)',
          background: 'var(--deep)',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-display)', fontSize: '.82rem',
            fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase',
            color: 'var(--pink)', textDecoration: 'none',
            position: 'absolute', top: '2.5rem', left: '2.8rem',
          }}
        >
          MC
        </Link>

        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.9rem', listStyle: 'none' }}>
          {links.map(l => {
            const isActive = l.id ? active === l.id : active === null
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={close}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '.82rem', fontWeight: isActive ? 600 : 400,
                    letterSpacing: '.16em', textTransform: 'uppercase',
                    color: isActive ? 'var(--pearl)' : 'rgba(246,240,236,.45)',
                    textDecoration: isActive ? 'underline' : 'none',
                    textUnderlineOffset: '4px',
                    transition: 'color .3s',
                    cursor: 'none',
                  }}
                >
                  {l.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <style>{`
        @media (max-width: 900px) {
          nav {
            top: 0; left: 0; right: 0; bottom: auto !important;
            width: 100% !important; height: auto;
            flex-direction: row !important;
            align-items: center; justify-content: center;
            padding: 1.1rem 1.5rem 1.1rem 4.5rem !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(242,122,174,.12);
            transform: translateY(-100%);
            transition: transform .4s cubic-bezier(.16,1,.3,1);
          }
          nav.is-open { transform: translateY(0) !important; }
          nav ul { flex-direction: row !important; gap: 2rem !important; }
        }
      `}</style>
    </>
  )
}
