import Link from 'next/link'

export default function WorkHeader() {
  return (
    <header style={{
      display: 'flex', justifyContent: 'flex-start',
      alignItems: 'center', gap: '2rem',
      padding: '1.2rem 2.5rem',
      borderBottom: '1px solid rgba(242,122,174,.18)',
      flexShrink: 0, position: 'relative', zIndex: 10,
      background: 'var(--deep)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link
          href="/"
          className="t-ui"
          style={{
            color: 'var(--pink)', cursor: 'none',
            display: 'flex', alignItems: 'center', gap: '.5rem',
            textDecoration: 'none',
            transition: 'color .25s', whiteSpace: 'nowrap',
            letterSpacing: '.2em',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--pink)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--pink)')}
        >
          <span style={{ fontSize: '1rem' }}>&larr;</span> Go back
        </Link>

        <h1 className="font-display-title" style={{
          fontSize: 'clamp(1.6rem,2.4vw,2.5rem)',
          color: 'var(--white)', letterSpacing: '.01em',
        }}>
          See how I <span style={{ color: 'var(--pink)', fontStyle: 'italic', fontWeight: 100 }}>think</span> through work.
        </h1>
      </div>
    </header>
  )
}
