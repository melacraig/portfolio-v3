'use client'
import { useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import CustomCursor from '@/components/CustomCursor'
import ScissorLine from '@/components/ScissorLine'
import Lightbox from '@/components/Lightbox'

// ─────────────────────────────────────────────────────────────────
// TO ADD OR REMOVE ITEMS: edit this array only. Order = gallery order.
// ─────────────────────────────────────────────────────────────────
type Aspect   = 'portrait' | 'landscape' | 'square'
type Category = 'sewing' | 'drawing' | 'embroidery'
type Item = {
  src: string; preview?: string; poster?: string
  type: 'image' | 'video'; aspect: Aspect; cat: Category; alt: string
}

const ITEMS: Item[] = [
  { src: '/also-me/1.mp4',   preview: '/also-me/1-preview.mp4',  poster: '/also-me/1-poster.webp',  type: 'video', aspect: 'landscape', cat: 'sewing',     alt: 'Floral corset on a dress form, process video' },
  { src: '/also-me/2.webp',  type: 'image', aspect: 'portrait',  cat: 'drawing',    alt: 'Ink drawing of a peacock wearing a crown' },
  { src: '/also-me/10.webp', type: 'image', aspect: 'portrait',  cat: 'sewing',     alt: 'Blue rose brocade corset' },
  { src: '/also-me/5.webp',  type: 'image', aspect: 'landscape', cat: 'embroidery', alt: 'Embroidered red flower' },
  { src: '/also-me/12.webp', type: 'image', aspect: 'portrait',  cat: 'sewing',     alt: 'Corset with beaded butterfly appliqué' },
  { src: '/also-me/4.webp',  type: 'image', aspect: 'portrait',  cat: 'drawing',    alt: 'Ink drawing of a capybara wearing a crown' },
  { src: '/also-me/13.webp', type: 'image', aspect: 'portrait',  cat: 'sewing',     alt: 'Floral top with ribbon shoulder ties' },
  { src: '/also-me/3.mp4',   preview: '/also-me/3-preview.mp4',  poster: '/also-me/3-poster.webp',  type: 'video', aspect: 'portrait',  cat: 'embroidery', alt: 'Embroidery machine at work, process video' },
  { src: '/also-me/15.webp', type: 'image', aspect: 'portrait',  cat: 'drawing',    alt: 'Lost at Sea ink illustration' },
  { src: '/also-me/14.webp', type: 'image', aspect: 'portrait',  cat: 'sewing',     alt: 'Red lace off-shoulder top' },
  { src: '/also-me/6.mp4',   preview: '/also-me/6-preview.mp4',  poster: '/also-me/6-poster.webp',  type: 'video', aspect: 'portrait',  cat: 'sewing',     alt: 'A suit in five days, process video' },
  { src: '/also-me/16.webp', type: 'image', aspect: 'portrait',  cat: 'sewing',     alt: 'White corset with painted roses' },
  { src: '/also-me/7.webp',  type: 'image', aspect: 'portrait',  cat: 'drawing',    alt: 'Ink drawing of a wolf with a crescent moon' },
  { src: '/also-me/9.webp',  type: 'image', aspect: 'portrait',  cat: 'sewing',     alt: 'Blue floral corset with satin ribbons on a dress form' },
  { src: '/also-me/8.mp4',   preview: '/also-me/8-preview.mp4',  poster: '/also-me/8-poster.webp',  type: 'video', aspect: 'portrait',  cat: 'sewing',     alt: 'Sewing close-up, process video' },
  { src: '/also-me/17.webp', type: 'image', aspect: 'portrait',  cat: 'sewing',     alt: 'Floral corset on a dress form' },
  { src: '/also-me/18.webp', type: 'image', aspect: 'portrait',  cat: 'drawing',    alt: 'Pencil drawing of a small dog wearing a tiara' },
  { src: '/also-me/11.mp4',  preview: '/also-me/11-preview.mp4', poster: '/also-me/11-poster.webp', type: 'video', aspect: 'portrait',  cat: 'sewing',     alt: 'Hand finishing, process video' },
]

const ASPECT: Record<Aspect, string> = { portrait: '3 / 4', landscape: '4 / 3', square: '1 / 1' }

const FILTERS: { key: 'all' | Category; label: string }[] = [
  { key: 'all', label: 'All' }, { key: 'sewing', label: 'Sewing' },
  { key: 'drawing', label: 'Drawing' }, { key: 'embroidery', label: 'Embroidery' },
]

export default function AlsoMePage() {
  const [filter, setFilter] = useState<'all' | Category>('all')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const shown = useMemo(() => ITEMS.filter(i => filter === 'all' || i.cat === filter), [filter])
  const lbItems = shown.map(i => ({ type: i.type, src: i.src, alt: i.alt }))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pearl)', color: 'var(--plum)' }}>
      <CustomCursor />

      <div className="am-wrap" style={{
        maxWidth: 1440, margin: '0 auto', padding: '26px var(--gutter) 96px',
        display: 'flex', flexDirection: 'column', gap: 48,
      }}>
        <nav aria-label="Also me">
          <Link href="/" className="am-back">← Back home</Link>
        </nav>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
          <h1 className="font-display" style={{ fontSize: 'clamp(69px, 10.8vw, 166px)', lineHeight: .95, paddingRight: 'clamp(40px, 11vw, 160px)' }}>
            Also <span className="t-script" style={{ color: 'var(--peony)' }}>me</span>
          </h1>
          <p className="t-body" style={{ width: 420, maxWidth: '100%', color: 'var(--ink-soft)' }}>
            Off the clock, still making things — drawing, sewing, building with my hands. No brief, no client, no reason other than I genuinely cannot help it.
          </p>
        </div>

        <ScissorLine initial={0.51} />

        <div role="group" aria-label="Filter" style={{ display: 'flex', flexWrap: 'wrap', gap: 26 }}>
          {FILTERS.map(f => (
            <button key={f.key} type="button" className="tab" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>

        <motion.div layout className="am-grid">
          <AnimatePresence mode="popLayout">
            {shown.map((item, i) => (
              <motion.figure
                key={item.src}
                layout
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: .96 }}
                transition={{ duration: .5, ease: [.16, 1, .3, 1] }}
                className="am-card"
              >
                <button type="button" onClick={() => setLightbox(i)} aria-label={`Open: ${item.alt}`} className="am-hit"
                        style={{ aspectRatio: ASPECT[item.aspect] }}>
                  {item.type === 'video' ? <VideoHover item={item} /> : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.src} alt="" loading="lazy" className="am-media" />
                  )}
                  <span aria-hidden className="am-seam" />
                  <span aria-hidden className="am-notch" />
                  {item.type === 'video' && <span className="am-badge">▶ Process</span>}
                  <span aria-hidden className="am-fade" />
                  <figcaption className="am-cap">
                    <span style={{ fontSize: 24 }}>{item.cat}</span>
                    <span style={{ fontSize: 20 }}>{String(ITEMS.indexOf(item) + 1).padStart(2, '0')}</span>
                  </figcaption>
                </button>
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>

        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 24,
          borderTop: '1px dashed var(--plum)', paddingTop: 32,
        }}>
          <span className="font-display" style={{ fontSize: 'clamp(28px, 2.4vw, 45px)' }}>
            Send help. Or a <span className="t-script" style={{ color: 'var(--peony)' }}>brief</span>
          </span>
          {/* Full page load (like the nav's Contact link) so the home page can jump
              straight to Contact; a client-side Link would reset scroll to the top */}
          <a href="/#section-contact" className="btn btn--fill" onClick={e => {
            e.preventDefault()
            sessionStorage.setItem('scrollTo', 'section-contact')
            window.location.href = '/'
          }}>
            Work with me
          </a>
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox items={lbItems} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} label="Also me gallery" />
        )}
      </AnimatePresence>

      <style>{`
        .am-back {
          display: inline-flex; align-items: center; height: 44px; text-decoration: none; cursor: none;
          font-family: var(--font-display); font-style: italic; font-size: 22px; color: var(--plum); transition: color .25s;
        }
        .am-back:hover { color: var(--peony); }
        .am-grid { columns: 4 260px; column-gap: 28px; }
        .am-card { margin: 0 0 28px; break-inside: avoid; }
        .am-hit {
          position: relative; display: block; width: 100%; overflow: hidden; padding: 0; border: none;
          background: var(--blush); cursor: none;
        }
        .am-media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .8s cubic-bezier(.16,1,.3,1); }
        .am-hit:hover .am-media { transform: scale(1.04); }
        .am-seam { position: absolute; inset: 8px; border: 1px dashed rgba(246,240,236,.85); z-index: 2; pointer-events: none; }
        .am-notch {
          position: absolute; left: 50%; top: 0; margin-left: -5px; z-index: 2;
          border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 8px solid var(--pearl);
        }
        .am-badge {
          position: absolute; left: 16px; top: 16px; z-index: 3; display: inline-flex; align-items: center; height: 34px; padding: 0 10px;
          border-radius: 999px; background: rgba(43,22,34,.8); color: var(--pearl);
          font-family: var(--font-display); font-style: italic; font-size: 20px; transition: opacity .3s;
        }
        .am-hit:hover .am-badge { opacity: 0; }
        .am-fade { position: absolute; left: 0; right: 0; bottom: 0; height: 110px; z-index: 1; background: linear-gradient(to top, rgba(43,22,34,.72), rgba(43,22,34,0)); }
        .am-cap {
          position: absolute; left: 20px; right: 20px; bottom: 16px; z-index: 3;
          display: flex; justify-content: space-between; align-items: baseline;
          font-family: var(--font-display); font-style: italic; line-height: 1.2; color: var(--pearl);
        }
        @media (max-width: 768px) {
          .am-wrap { padding: 20px 20px 72px !important; gap: 32px !important; }
          .am-grid { columns: 2 140px; column-gap: 12px; }
          .am-card { margin-bottom: 12px; }
          .am-cap span:first-child { font-size: 18px !important; }
          .am-badge { font-size: 15px; height: 28px; left: 12px; top: 12px; }
        }
      `}</style>
    </div>
  )
}

// Separated so hover playback doesn't re-render the grid
function VideoHover({ item }: { item: Item }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  return (
    <span
      style={{ position: 'absolute', inset: 0, display: 'block' }}
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => videoRef.current?.pause()}
    >
      <video
        ref={videoRef}
        src={item.preview ?? item.src}
        poster={item.poster}
        muted loop playsInline preload="none"
        className="am-media"
      />
    </span>
  )
}
