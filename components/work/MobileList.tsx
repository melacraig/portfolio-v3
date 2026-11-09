'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Project } from '@/data/projects'
import { projectNum } from '@/components/work/ProjectDial'

type Filter = 'all' | 'graphic' | 'motion'

interface Props {
  projects: Project[]
  filter: Filter
  onFilterChange: (f: Filter) => void
}

function MobileItem({ p }: { p: Project }) {
  const [open, setOpen] = useState(false)
  const [slide, setSlide] = useState(0)
  const images = p.images ?? []
  const bodyId = `mob-${p.id}`

  return (
    <li className={`mob-item${open ? ' open' : ''}`} style={{ borderBottom: '1px solid rgba(246,240,236,.18)' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={bodyId}
        style={{
          width: '100%', display: 'flex', alignItems: 'baseline', gap: 14, padding: '18px 0',
          background: 'none', border: 'none', color: 'inherit', textAlign: 'left', cursor: 'pointer',
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 17, color: open ? 'var(--rose)' : 'var(--muted-on-dark)' }}>
          {projectNum(p)}
        </span>
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 15, color: 'var(--rose)' }}>{p.discipline}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 30, lineHeight: 1.05 }}>{p.title}</span>
        </span>
        <span aria-hidden style={{
          fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--rose)',
          transition: 'transform .3s cubic-bezier(.16,1,.3,1)', transform: open ? 'rotate(45deg)' : 'none',
        }}>+</span>
      </button>

      <div id={bodyId} className="mob-item-body">
        <div style={{ padding: '4px 0 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', overflow: 'hidden', background: 'var(--plum-2)' }}>
            {p.isVideo && p.video ? (
              <video src={p.video} poster={images[0]} controls playsInline preload="none"
                     style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : p.sideBySide && p.videos ? (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 8, padding: 12, justifyContent: 'center', background: 'var(--plum-deep)' }}>
                {p.videos.map(src => (
                  <video key={src} src={src} controls playsInline preload="none" style={{ height: '100%', aspectRatio: '9 / 16', objectFit: 'cover' }} />
                ))}
              </div>
            ) : images.length > 0 ? (
              <>
                {images.map((src, j) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src} src={src} alt={`${p.title}, slide ${j + 1}`} loading="lazy"
                       style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: j === slide ? 1 : 0, transition: 'opacity .35s' }} />
                ))}
                {images.length > 1 && (
                  <span style={{
                    position: 'absolute', right: 14, bottom: 14, zIndex: 3, display: 'inline-flex', alignItems: 'center',
                    height: 36, borderRadius: 999, background: 'rgba(43,22,34,.8)',
                    fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18,
                  }}>
                    <button type="button" aria-label="Previous image" className="mob-arrow" onClick={() => setSlide(s => (s - 1 + images.length) % images.length)}>‹</button>
                    {slide + 1} / {images.length}
                    <button type="button" aria-label="Next image" className="mob-arrow" onClick={() => setSlide(s => (s + 1) % images.length)}>›</button>
                  </span>
                )}
              </>
            ) : null}
            <div aria-hidden style={{ position: 'absolute', inset: 8, border: '1px dashed rgba(246,240,236,.75)', pointerEvents: 'none', zIndex: 2 }} />
            <div aria-hidden style={{ position: 'absolute', left: '50%', top: 0, marginLeft: -5, zIndex: 2, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '8px solid var(--plum)' }} />
          </div>

          <div style={{ display: 'flex', gap: 16, fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 19, color: 'var(--muted-on-dark)' }}>
            <span>{p.year}</span><span>{p.type === 'motion' ? 'Motion' : 'Graphic'}</span>
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--body-on-dark)', fontWeight: 400 }}>{p.desc}</p>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', listStyle: 'none' }}>
            {p.skills.map(s => (
              <li key={s} style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, color: 'var(--muted-on-dark)' }}>+ {s}</li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  )
}

export default function MobileList({ projects, filter, onFilterChange }: Props) {
  const filtered = filter === 'all' ? projects : projects.filter(p => p.type === filter)

  return (
    <div>
      <div style={{
        position: 'sticky', top: 0, zIndex: 20, background: 'var(--plum)',
        padding: '14px 20px 0', borderBottom: '1px solid rgba(246,240,236,.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, color: 'var(--pearl)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20 }}>
            ← Home
          </Link>
          <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20, color: 'var(--muted-on-dark)' }}>
            {String(filtered.length).padStart(2, '0')} projects
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 40, lineHeight: 1.1, margin: '18px 0 6px' }}>
          See how I <span className="t-script" style={{ color: 'var(--rose)' }}>think</span>
        </h1>
        <div role="group" aria-label="Filter projects" className="tabs-dark" style={{ display: 'flex', gap: 20 }}>
          {(['all', 'graphic', 'motion'] as const).map(f => (
            <button key={f} type="button" className="tab" aria-pressed={filter === f} onClick={() => onFilterChange(f)} style={{ fontSize: 16 }}>
              {f === 'all' ? 'All' : f === 'graphic' ? 'Graphic' : 'Motion'}
            </button>
          ))}
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: '0 20px 48px' }}>
        {filtered.map(p => <MobileItem key={p.id} p={p} />)}
      </ul>

      <style>{`
        .mob-arrow { width: 36px; height: 36px; border: none; background: none; color: var(--pearl); font-size: 20px; cursor: pointer; }
      `}</style>
    </div>
  )
}
