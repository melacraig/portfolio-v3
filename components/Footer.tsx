'use client'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--plum)', color: 'var(--muted-on-dark)' }}>
      <div className="footer-row" style={{
        maxWidth: 1440, margin: '0 auto', padding: '0 var(--gutter) 40px',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)', alignItems: 'center', gap: 12,
          borderTop: '1px dashed rgba(246,240,236,.35)', paddingTop: 22,
          fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(17px, 1.5vw, 22px)',
        }}>
          <span style={{ textAlign: 'left' }}>&copy; 2026 Melanie Craig</span>
          <span style={{ textAlign: 'center' }}>Argentina — GMT−3</span>
          <a
            href="#top"
            onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="footer-top"
          >
            Back to top ↑
          </a>
        </div>
      </div>
      <style>{`
        .footer-top { justify-self: end; color: inherit; text-decoration: none; cursor: none; min-height: 44px; display: inline-flex; align-items: center; transition: color .25s; }
        .footer-top:hover { color: var(--rose); }
        @media (max-width: 768px) {
          .footer-row { padding: 0 20px 28px !important; }
          .footer-row > div { grid-template-columns: 1fr !important; text-align: center; }
          .footer-row > div > * { text-align: center !important; justify-self: center !important; }
        }
      `}</style>
    </footer>
  )
}
