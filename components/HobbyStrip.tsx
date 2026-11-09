'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ScissorLine from '@/components/ScissorLine'

/* Pinned snapshots from the Also-me gallery */
const SNAPS = [
  { src: '/also-me/12.webp', alt: 'Hand-sewn corset with beaded butterfly', cap: 'Sewing · 01',     left: 0,   top: 40,  rot: -6 },
  { src: '/also-me/4.webp',  alt: 'Ink drawing of a capybara wearing a crown', cap: 'Drawing · 02', left: 170, top: 0,   rot: 4 },
  { src: '/also-me/5.webp',  alt: 'Embroidered flower',                    cap: 'Embroidery · 03', left: 300, top: 150, rot: -2 },
  { src: '/also-me/16.webp', alt: 'White corset with painted roses',       cap: 'Sewing · 04',     left: 430, top: 30,  rot: 6 },
]

export default function HobbyStrip() {
  return (
    <section id="also" style={{ background: 'var(--blush)', color: 'var(--plum)', overflow: 'hidden' }}>
      <div className="hobby-wrap" style={{
        maxWidth: 1440, margin: '0 auto', padding: '104px var(--gutter)',
        display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', justifyContent: 'space-between', gap: '56px 64px',
      }}>
        <div className="hobby-board" style={{ position: 'relative', flex: '0 1 670px', height: 500, minWidth: 0 }}>
          {SNAPS.map((s, i) => (
            <motion.figure
              key={s.src}
              className="hobby-snap"
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: s.rot }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: .9, ease: [.16, 1, .3, 1], delay: i * 0.1 }}
              whileHover={{ rotate: 0, y: -8, zIndex: 5 }}
              style={{ left: s.left, top: s.top }}
            >
              <span aria-hidden className="hobby-pin" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt={s.alt} loading="lazy" style={{ width: '100%', height: 270, objectFit: 'cover', display: 'block' }} />
              <figcaption style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20, color: 'var(--mauve)' }}>{s.cap}</figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: .85, ease: [.16, 1, .3, 1] }}
          style={{ flex: '1 1 360px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 22 }}
        >
          <h2 className="t-display" style={{ fontSize: 'clamp(45px, 4.8vw, 78px)', paddingBottom: '.45em' }}>
            Off the clock, still <span className="t-script" style={{ color: 'var(--peony)' }}>making things</span>
          </h2>
          <p className="t-body" style={{ color: 'var(--ink-soft)' }}>
            Drawing, sewing, building with my hands. No brief, no client, no reason other than I genuinely cannot help it. Send help.
          </p>
          <div style={{ marginTop: 8 }}>
            <ScissorLine initial={0.22} hint="drag the scissors" />
          </div>
          <Link href="/also-me" className="btn btn--line on-light" style={{ alignSelf: 'flex-start' }}>
            How does she have time for this? &rarr;
          </Link>
        </motion.div>
      </div>

      <style>{`
        .hobby-snap {
          position: absolute; width: 220px; margin: 0; padding: 10px 10px 14px; background: #fff;
          display: flex; flex-direction: column; gap: 10px;
          box-shadow: 0 1px 0 rgba(43,22,34,.15);
        }
        .hobby-pin {
          position: absolute; left: 50%; top: -6px; margin-left: -6px;
          width: 12px; height: 12px; border-radius: 50%; background: var(--peony);
        }
        @media (max-width: 768px) {
          .hobby-wrap { padding: 88px 20px !important; }
          .hobby-board { flex-basis: 100% !important; height: 260px !important; transform: scale(.5); transform-origin: top left; }
        }
      `}</style>
    </section>
  )
}
