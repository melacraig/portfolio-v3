'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

export type LightboxItem = { type: 'image' | 'video'; src: string; alt?: string }

/* Full-screen viewer on a plum ground. Arrow keys, Escape and the on-screen controls all work. */
export default function Lightbox({
  items, index, onIndex, onClose, label,
}: {
  items: LightboxItem[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
  label?: string
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const total = items.length
  const go = (d: number) => onIndex((index + d + total) % total)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && total > 1) go(1)
      if (e.key === 'ArrowLeft' && total > 1) go(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total])

  if (!mounted || !items[index]) return null
  const cur = items[index]

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={label ?? 'Media viewer'}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(26,13,20,0.94)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'auto',
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '88vw', height: '84vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="sync">
          {cur.type === 'image' ? (
            <motion.img
              key={cur.src}
              src={cur.src}
              alt={cur.alt ?? ''}
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ position: 'absolute', maxWidth: '88vw', maxHeight: '84vh', objectFit: 'contain' }}
            />
          ) : (
            <motion.video
              key={cur.src}
              src={cur.src}
              controls autoPlay playsInline
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ position: 'absolute', maxWidth: '88vw', maxHeight: '84vh' }}
            />
          )}
        </AnimatePresence>
      </div>

      <button type="button" onClick={onClose} aria-label="Close" className="btn btn--line on-dark btn--icon lb-close">✕</button>
      {total > 1 && (
        <>
          <button type="button" aria-label="Previous" onClick={e => { e.stopPropagation(); go(-1) }} className="btn btn--line on-dark btn--icon lb-prev">←</button>
          <button type="button" aria-label="Next" onClick={e => { e.stopPropagation(); go(1) }} className="btn btn--line on-dark btn--icon lb-next">→</button>
        </>
      )}
      <span style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20, color: 'var(--muted-on-dark)',
      }}>
        {index + 1} / {total}
      </span>
      <style>{`
        .lb-close { position: absolute !important; top: 24px; right: 24px; cursor: pointer !important; }
        .lb-prev, .lb-next { position: absolute !important; top: 50%; margin-top: -23px; cursor: pointer !important; }
        .lb-prev { left: 24px; } .lb-next { right: 24px; }
      `}</style>
    </motion.div>,
    document.body
  )
}
