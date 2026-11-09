'use client'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Project } from '@/data/projects'
import Lightbox, { type LightboxItem } from '@/components/Lightbox'
import { projectNum } from '@/components/work/ProjectDial'

/* Everything a project can show in its media box, in order */
export function projectMedia(p: Project): LightboxItem[] {
  if (p.isVideo && p.video) return [{ type: 'video', src: p.video }]
  if (p.sideBySide && p.videos) return p.videos.map(src => ({ type: 'video' as const, src }))
  return [
    ...(p.images ?? []).map((src, i) => ({ type: 'image' as const, src, alt: `${p.title}, slide ${i + 1}` })),
    ...(p.videos ?? []).map(src => ({ type: 'video' as const, src })),
  ]
}

const badge: React.CSSProperties = {
  position: 'absolute', zIndex: 3, display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px',
  borderRadius: 999, background: 'rgba(43,22,34,0.8)', color: 'var(--pearl)',
  fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20,
}

/* Media box: a pattern piece with a seam allowance and two notches */
function Media({ p }: { p: Project }) {
  const media = projectMedia(p)
  const [slide, setSlide] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  useEffect(() => { setSlide(0); setPlaying(false); setLightbox(null) }, [p.id])

  const total = media.length
  const cur = media[slide]
  const poster = p.images?.[0]

  return (
    <div className="work-media" style={{ position: 'relative', flexShrink: 0, overflow: 'hidden', background: 'var(--plum-2)' }}>
      {p.isVideo && p.video ? (
        playing ? (
          <video src={p.video} poster={poster} controls autoPlay playsInline
                 style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000', cursor: 'auto' }} />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${p.title}`} className="media-hit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {poster && <img src={poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            <span aria-hidden className="media-play"><span /></span>
          </button>
        )
      ) : p.sideBySide && p.videos ? (
        <div style={{ display: 'flex', gap: 10, height: '100%', padding: 18, justifyContent: 'center', background: 'var(--plum-deep)' }}>
          {p.videos.map((src, j) => (
            <button key={src} type="button" onClick={() => setLightbox(j)} aria-label={`Play video ${j + 1} of ${p.title}`}
                    className="media-hit" style={{ position: 'relative', height: '100%', aspectRatio: '9 / 16', width: 'auto', flex: '0 1 auto' }}>
              <video src={src} muted playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
              <span aria-hidden className="media-play"><span /></span>
            </button>
          ))}
        </div>
      ) : (
        <>
          {media.map((m, j) => (
            <div key={m.src} className={`gallery-slide${j === slide ? ' active' : ''}`}>
              {m.type === 'image' ? (
                <button type="button" onClick={() => setLightbox(j)} aria-label={`Open ${m.alt} full screen`} className="media-hit" style={{ cursor: 'zoom-in' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.src} alt={m.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ) : j === slide ? (
                <video src={m.src} controls playsInline style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000', cursor: 'auto' }} />
              ) : null}
            </div>
          ))}
        </>
      )}

      {/* Seam allowance + notches (top centre, left middle) */}
      <div aria-hidden style={{ position: 'absolute', inset: 10, border: '1px dashed rgba(246,240,236,0.75)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden style={{ position: 'absolute', left: '50%', top: 0, marginLeft: -6, zIndex: 2, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '9px solid var(--plum)' }} />
      <div aria-hidden style={{ position: 'absolute', left: 0, top: '50%', marginTop: -6, zIndex: 2, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '9px solid var(--plum)' }} />

      {(p.isVideo || p.sideBySide || cur?.type === 'video') && (
        <span style={{ ...badge, left: 22, top: 22, pointerEvents: 'none' }}>▶ Video</span>
      )}
      {total > 1 && !p.sideBySide && (
        <span style={{ ...badge, right: 22, bottom: 22, padding: '0 4px' }}>
          <button type="button" aria-label="Previous image" className="badge-btn" onClick={() => setSlide(s => (s - 1 + total) % total)}>‹</button>
          <span aria-live="polite">{slide + 1} / {total}</span>
          <button type="button" aria-label="Next image" className="badge-btn" onClick={() => setSlide(s => (s + 1) % total)}>›</button>
        </span>
      )}

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox items={media} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} label={p.title} />
        )}
      </AnimatePresence>
    </div>
  )
}

interface Props {
  project: Project
  onPrev: () => void
  onNext: () => void
}

export default function ProjectPanel({ project: p, onPrev, onNext }: Props) {
  const [expanded, setExpanded] = useState(false)
  useEffect(() => { setExpanded(false) }, [p.id])

  return (
    <div className="work-panel" style={{ flex: 1, minWidth: 0, padding: '30px 44px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <AnimatePresence mode="wait">
        <motion.article
          key={p.id}
          initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <Media p={p} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 18, lineHeight: 1.4, letterSpacing: '.02em', color: 'var(--rose)' }}>
                {p.discipline}
              </span>
              <h1 className="t-title">{p.title}</h1>
            </div>
            <span style={{ display: 'flex', gap: 8, paddingBottom: 6 }}>
              <button type="button" onClick={onPrev} aria-label="Previous project" className="btn btn--line on-dark btn--icon">←</button>
              <button type="button" onClick={onNext} aria-label="Next project" className="btn btn--line on-dark btn--icon">→</button>
            </span>
          </div>

          <div style={{
            display: 'flex', gap: 20, alignItems: 'center',
            fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, color: 'var(--muted-on-dark)',
            borderTop: '1px dashed rgba(246,240,236,0.3)', paddingTop: 12,
          }}>
            <span style={{
              width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--rose)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: 'var(--rose)',
            }}>
              {Number(projectNum(p))}
            </span>
            <span>{p.year}</span>
            <span>{p.type === 'motion' ? 'Motion' : 'Graphic'}</span>
          </div>

          <div>
            <p className={expanded ? '' : 'clamp-3'} style={{ maxWidth: 700, fontSize: 18, lineHeight: '29px', color: 'var(--body-on-dark)', fontWeight: 400 }}>
              {p.desc}
            </p>
            <button type="button" onClick={() => setExpanded(e => !e)} aria-expanded={expanded} className="more-btn">
              {expanded ? 'Less' : 'Read more'}
            </button>
          </div>

          <ul aria-label="Tools and skills" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', listStyle: 'none' }}>
            {p.skills.map(s => (
              <li key={s} style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20, color: 'var(--muted-on-dark)' }}>+ {s}</li>
            ))}
          </ul>
        </motion.article>
      </AnimatePresence>

      <style>{`
        .work-media { height: clamp(240px, 46vh, 420px); }
        .media-hit { display: block; width: 100%; height: 100%; padding: 0; border: none; background: none; cursor: none; position: relative; }
        .media-play {
          position: absolute; left: 50%; top: 50%; width: 60px; height: 60px; margin: -30px 0 0 -30px;
          border-radius: 50%; border: 1px solid rgba(246,240,236,.8); background: rgba(43,22,34,.45);
          display: flex; align-items: center; justify-content: center; transition: background .25s, transform .25s;
        }
        .media-play span { margin-left: 4px; border-left: 14px solid var(--pearl); border-top: 8px solid transparent; border-bottom: 8px solid transparent; }
        .media-hit:hover .media-play { background: var(--peony); transform: scale(1.06); }
        .badge-btn { width: 30px; height: 30px; border: none; background: none; color: inherit; font-size: 20px; cursor: none; border-radius: 50%; }
        .badge-btn:hover { color: var(--rose); }
        .clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .more-btn {
          margin-top: 6px; min-height: 32px; padding: 0; background: none; border: none; cursor: none;
          font-family: var(--font-display); font-style: italic; font-size: 18px; color: var(--rose);
          text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 5px;
        }
      `}</style>
    </div>
  )
}
