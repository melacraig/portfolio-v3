'use client'
import { useEffect, useRef, useState } from 'react'

const LINKS = [
  { label: 'About',    id: 'section-about'    },
  { label: 'Work',     id: 'section-work'     },
  { label: 'Also me',  id: 'section-hobby'    },
  { label: 'Contact',  id: 'section-contact'  },
]

export default function NavBar() {
  const [isHome,   setIsHome]   = useState(true)
  const [visible,  setVisible]  = useState(false)
  const [active,   setActive]   = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => { if (!isMobile) setMenuOpen(false) }, [isMobile])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const home = window.location.pathname === '/'
    setIsHome(home)
    if (!home) setVisible(true)
  }, [])

  useEffect(() => {
    if (!isHome) { setVisible(true); return }
    const trigger = document.getElementById('section-about')
    if (!trigger) return
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting || e.boundingClientRect.top < 0),
      { threshold: 0, rootMargin: '0px 0px -80% 0px' }
    )
    obs.observe(trigger)
    return () => obs.disconnect()
  }, [isHome])

  useEffect(() => {
    if (!isHome) return
    const observers: IntersectionObserver[] = []
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id) },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [isHome])

  useEffect(() => {
    if (isHome) return
    const path = window.location.pathname
    if (path.startsWith('/work'))     setActive('section-work')
    else if (path.startsWith('/also-me')) setActive('section-hobby')
    else setActive('')
  }, [isHome])

  const handleLink = (id: string) => {
    // No-op if already on the page this link points to
    if (id === 'section-hobby' && window.location.pathname.startsWith('/also-me')) return
    if (id === 'section-work'  && window.location.pathname.startsWith('/work'))    return
    setMenuOpen(false)
    setTimeout(() => {
      if (isHome) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        sessionStorage.setItem('scrollTo', id)
        window.location.href = '/'
      }
    }, 300)
  }

  const handleLogo = () => {
    setMenuOpen(false)
    if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' })
    else window.location.href = '/'
  }

  // ── Mobile: burger button + fullscreen overlay ──
  if (isMobile) {
    return (
      <>
        {/* Burger button — always visible once nav should appear */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{
            position: 'fixed', top: '1.1rem', right: '1.2rem',
            zIndex: 201,
            width: '44px', height: '44px',
            background: 'rgba(43,22,34,0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(246,240,236,0.25)',
            borderRadius: '50%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '7px',
            cursor: 'auto',
            opacity: 1,
            pointerEvents: 'auto',
          }}
        >
          <span style={{
            display: 'block', width: '20px', height: '1px',
            background: 'var(--pearl)', transformOrigin: 'center',
            transition: 'transform 0.35s cubic-bezier(.16,1,.3,1)',
            transform: menuOpen ? 'translateY(4px) rotate(45deg)' : 'none',
          }} />
          <span style={{
            display: 'block', width: '20px', height: '1px',
            background: 'var(--pearl)', transformOrigin: 'center',
            transition: 'transform 0.35s cubic-bezier(.16,1,.3,1)',
            transform: menuOpen ? 'translateY(-4px) rotate(-45deg)' : 'none',
          }} />
        </button>

        {/* Fullscreen overlay menu */}
        <div style={{
          position: 'fixed', inset: 0,
          zIndex: 200,
          background: 'rgba(43,22,34,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '0.5rem',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s cubic-bezier(.16,1,.3,1)',
        }}>
          {/* Logo in menu */}
          <button
            onClick={handleLogo}
            style={{
              background: 'none', border: 'none', cursor: 'auto',
              marginBottom: '2.5rem',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.webp" alt="MCG logo" width={48} height={60} style={{ objectFit: 'contain' }} />
          </button>

          {LINKS.map(({ label, id }, i) => {
            const isActive = active === id
            return (
              <button
                key={id}
                onClick={() => handleLink(id)}
                style={{
                  background: 'none', border: 'none', cursor: 'auto',
                  fontFamily: 'var(--font-display)', fontStyle: isActive ? 'italic' : 'normal',
                  fontSize: '2.6rem', fontWeight: 400,
                  color: isActive ? 'var(--rose)' : 'var(--pearl)',
                  padding: '0.6rem 1rem',
                  transition: 'color 0.2s, font-weight 0.2s',
                  // Stagger in
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
                  transitionDelay: menuOpen ? `${i * 0.06 + 0.1}s` : '0s',
                  transitionProperty: 'opacity, transform, color',
                  transitionDuration: '0.45s',
                  transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </>
    )
  }

  // ── Desktop: pill nav ──
  return (
    <nav
      ref={navRef}
      className="navbar-pill"
      style={{
        position: 'fixed',
        top: '1.4rem', left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex', alignItems: 'center',
        gap: '2.4rem',
        padding: '0.35rem 1.6rem 0.35rem 0.6rem',
        borderRadius: '999px',
        border: '1px dashed rgba(246,240,236,0.3)',
        background: 'rgba(43,22,34,0.86)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: 'none',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <button
        onClick={handleLogo}
        style={{
          background: 'none', border: 'none',
          padding: '0.5rem 0.5rem 0.5rem 1rem',
          cursor: 'none', display: 'flex', alignItems: 'center', flexShrink: 0,
        }}
        aria-label="Back to top"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.webp" alt="" width={22} height={28} style={{ objectFit: 'contain', display: 'block' }} />
      </button>

      {LINKS.map(({ label, id }, i) => {
        const isActive = active === id
        const isLast   = i === LINKS.length - 1
        return (
          <button
            key={id}
            onClick={() => handleLink(id)}
            className="navbar-link"
            aria-current={isActive ? 'true' : undefined}
            style={{
              background: 'none', border: 'none',
              padding: isLast ? '0.7rem 0.5rem 0.55rem 0' : '0.7rem 0 0.55rem',
              cursor: 'none',
              fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 16, letterSpacing: '0.02em',
              color: isActive ? 'var(--rose)' : 'var(--muted-on-dark)',
              borderBottom: isActive ? '1px dashed var(--rose)' : '1px solid transparent',
              transition: 'color 0.25s ease', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--pearl)' }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--muted-on-dark)' }}
          >
            {label}
          </button>
        )
      })}
    </nav>
  )
}
