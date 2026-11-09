'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

/* Blurred, taped-down snapshots of the archive: a tease, not a gallery */
const CARDS = [
  { title: 'Skipper',           img: '/projects/skipper/thumbnail.webp', left: 10,  top: 60,  rot: -7, tape: -4, w: 260, h: 190, depth: 40 },
  { title: 'Corazón Artesanal', img: '/projects/corazon/slide-1.webp',   left: 330, top: 10,  rot: 5,  tape: 3,  w: 220, h: 220, depth: -30 },
  { title: 'Yasí',              img: '/projects/yasi/slide-1.webp',      left: 160, top: 250, rot: 2,  tape: -2, w: 260, h: 185, depth: 20 },
  { title: 'Termomate',         img: '/projects/rolan/slide-1.webp',     left: 400, top: 300, rot: -4, tape: 5,  w: 230, h: 150, depth: -50 },
]

function Card({ c, progress }: { c: typeof CARDS[number]; progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const y = useTransform(progress, [0, 1], [c.depth, -c.depth])
  return (
    <motion.div style={{ position: 'absolute', left: c.left, top: c.top, y }}>
      <Link
        href="/work"
        aria-label={`Open ${c.title} in the archive`}
        className="teaser-card"
        style={{ '--rot': `${c.rot}deg` } as React.CSSProperties}
      >
        <span aria-hidden className="teaser-tape" style={{ transform: `rotate(${c.tape}deg)` }} />
        <span style={{ display: 'block', width: c.w, height: c.h, overflow: 'hidden', background: 'var(--plum-2)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.img} alt="" loading="lazy" className="teaser-img" />
        </span>
        <span className="teaser-label">{c.title}</span>
      </Link>
    </motion.div>
  )
}

export default function WorkTeaser() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })

  return (
    <section ref={sectionRef} id="work" style={{ background: 'var(--plum)', color: 'var(--pearl)', overflow: 'hidden' }}>
      <div className="teaser-wrap" style={{
        maxWidth: 1440, margin: '0 auto', padding: '104px var(--gutter)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '56px 64px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: .85, ease: [.16, 1, .3, 1] }}
          style={{ flex: '1 1 360px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 22 }}
        >
          <h2 className="t-display">
            The work has<br />its own <span className="t-script" style={{ color: 'var(--rose)' }}>room</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 420 }}>
            <p className="t-body" style={{ color: 'var(--muted-on-dark)' }}>
              Ten projects across branding, editorial, motion, and everything in between. An interactive archive built to explore.
            </p>
            <Link href="/work" className="btn btn--line on-dark" style={{ alignSelf: 'flex-start', '--c': 'var(--pearl)' } as React.CSSProperties}>
              Fine, I&apos;m curious &rarr;
            </Link>
          </div>
        </motion.div>

        <div className="teaser-board" style={{ position: 'relative', flex: '0 1 660px', height: 560, minWidth: 0 }}>
          {CARDS.map(c => <Card key={c.title} c={c} progress={scrollYProgress} />)}
        </div>
      </div>

      <style>{`
        .teaser-card {
          position: relative; display: flex; flex-direction: column; gap: 14px;
          padding: 12px 12px 18px; background: #FBF8F5; color: var(--plum); text-decoration: none;
          box-shadow: 0 1px 0 rgba(0,0,0,.25); cursor: none;
          transform: rotate(var(--rot));
          transition: transform .5s cubic-bezier(.16,1,.3,1), box-shadow .5s;
        }
        .teaser-card:hover, .teaser-card:focus-visible {
          transform: rotate(0deg) translateY(-6px) scale(1.03); z-index: 2;
          box-shadow: 0 18px 40px rgba(0,0,0,.35);
        }
        .teaser-tape {
          position: absolute; left: 50%; top: -12px; margin-left: -38px;
          width: 76px; height: 24px; background: rgba(238,217,219,.85);
        }
        .teaser-img {
          display: block; width: 100%; height: 100%; object-fit: cover;
          filter: blur(2.5px); transform: scale(1.04); transition: filter .5s;
        }
        .teaser-label {
          font-family: var(--font-display); font-style: italic; font-size: 22px; line-height: 1;
          text-align: center; filter: blur(1.2px); transition: filter .5s;
        }
        .teaser-card:hover .teaser-img, .teaser-card:hover .teaser-label { filter: blur(.6px); }
        @media (max-width: 768px) {
          .teaser-wrap { padding: 88px 20px !important; }
          .teaser-board { flex-basis: 100% !important; height: 300px !important; transform: scale(.52); transform-origin: top left; }
        }
      `}</style>
    </section>
  )
}
