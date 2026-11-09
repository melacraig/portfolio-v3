'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

/* A cutting line you can drag a pair of scissors along.
   The path lives in a 1000 × 140 box stretched to the container;
   the cut (peony) trails behind the scissors and gapes open briefly. */

const VB_W = 1000
const VB_H = 140
const D = 'M5.7,132.5c32.9-25.2,114.5-38.5,217.4-12.4,160.5,40.7,255.1,21.6,233.3-30-16.3-38.6,35-49.5,53.7-19.3,18.1,29.1,57.9,29.3,94.9-7,31.6-30.9,93.9-53.2,181.1-35.4,69.5,14.2,87.8-12.2,92.3-23.6'
const SAMPLES = 400
const SEARCH_WINDOW = 90     // samples the scissors may jump per pointer event
const GAPE_WINDOW = 0.08     // fraction of the path behind the blades that gapes open
const GAPE_PX = 6            // max opening, in screen px
const DRIFT_MS = 90000       // full path at the slow drift after release

type Pt = { x: number; y: number }

export default function ScissorLine({
  initial = 0.22,
  height = 96,
  hint,
}: {
  initial?: number
  height?: number
  hint?: string
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const ptsRef = useRef<Pt[]>([])
  const [size, setSize] = useState({ w: 1, h: height })
  const [progress, setProgress] = useState(initial)
  const [ready, setReady] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [touched, setTouched] = useState(false)
  const progressRef = useRef(initial)
  const targetRef = useRef(initial)
  const draggingRef = useRef(false)
  const gapeRef = useRef(0)
  const [gape, setGape] = useState(0)

  // Sample the path once
  useEffect(() => {
    const ns = 'http://www.w3.org/2000/svg'
    const path = document.createElementNS(ns, 'path')
    path.setAttribute('d', D)
    const total = path.getTotalLength()
    const pts: Pt[] = []
    for (let i = 0; i <= SAMPLES; i++) {
      const p = path.getPointAtLength((i / SAMPLES) * total)
      pts.push({ x: p.x, y: p.y })
    }
    ptsRef.current = pts
    setReady(true)
  }, [])

  // Track container size (for screen-space angles and the gape)
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width || 1, h: e.contentRect.height || height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [height])

  // Animation loop: ease toward the drag target, then drift on slowly once released
  useEffect(() => {
    let raf = 0
    let last: number | null = null
    const tick = (ts: number) => {
      const dt = Math.min(ts - (last ?? ts), 50)
      last = ts
      let p = progressRef.current
      if (draggingRef.current) {
        p += (targetRef.current - p) * (1 - Math.pow(0.004, dt / 1000))
        gapeRef.current = Math.min(1, gapeRef.current + dt / 300)
      } else {
        if (touched && p < 1) p = Math.min(1, p + dt / DRIFT_MS)
        gapeRef.current = Math.max(0, gapeRef.current - dt / 900)
      }
      if (Math.abs(p - progressRef.current) > 1e-5) {
        progressRef.current = p
        setProgress(p)
      }
      setGape(g => (Math.abs(g - gapeRef.current) > 0.01 ? gapeRef.current : g))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [touched])

  const sx = size.w / VB_W
  const sy = size.h / VB_H

  const closest = useCallback((clientX: number, clientY: number) => {
    const el = boxRef.current
    const pts = ptsRef.current
    if (!el || !pts.length) return progressRef.current
    const r = el.getBoundingClientRect()
    const cx = clientX - r.left, cy = clientY - r.top
    const kx = r.width / VB_W, ky = r.height / VB_H
    const cur = Math.round(progressRef.current * SAMPLES)
    let best = cur, min = Infinity
    for (let i = Math.max(0, cur - SEARCH_WINDOW); i <= Math.min(SAMPLES, cur + SEARCH_WINDOW); i++) {
      const dx = pts[i].x * kx - cx, dy = pts[i].y * ky - cy
      const d = dx * dx + dy * dy
      if (d < min) { min = d; best = i }
    }
    return best / SAMPLES
  }, [])

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    draggingRef.current = true
    targetRef.current = progressRef.current
    setDragging(true)
    setTouched(true)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current) return
    targetRef.current = closest(e.clientX, e.clientY)
  }
  const onPointerUp = () => {
    draggingRef.current = false
    setDragging(false)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 0.03 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -0.03 : 0
    if (!step) return
    e.preventDefault()
    const p = Math.min(1, Math.max(0, progressRef.current + step))
    progressRef.current = targetRef.current = p
    setProgress(p)
  }

  // ── Geometry for this frame ──
  const pts = ptsRef.current
  const idx = Math.min(SAMPLES, Math.max(0, Math.round(progress * SAMPLES)))
  const here = pts[idx] ?? { x: progress * VB_W, y: VB_H / 2 }
  const ahead = pts[Math.min(SAMPLES, idx + 2)] ?? here
  const behind = pts[Math.max(0, idx - 2)] ?? here
  const angle = Math.atan2((ahead.y - behind.y) * sy, (ahead.x - behind.x) * sx) * 180 / Math.PI

  const toD = (list: Pt[]) => list.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('')
  const cutD = ready ? toD(pts.slice(0, idx + 1)) : ''

  // Two lips of the fresh cut, pushed apart along the normal (in screen px)
  let lipA = '', lipB = ''
  if (ready && gape > 0.01) {
    const from = Math.max(0, Math.round((progress - GAPE_WINDOW) * SAMPLES))
    const a: Pt[] = [], b: Pt[] = []
    for (let i = from; i <= idx; i++) {
      const p = pts[i], q = pts[Math.min(SAMPLES, i + 1)]
      const tx = (q.x - p.x) * sx, ty = (q.y - p.y) * sy
      const len = Math.hypot(tx, ty) || 1
      const nx = -ty / len, ny = tx / len
      const t = (idx - i) / Math.max(1, idx - from)
      const off = GAPE_PX * Math.sin(Math.PI * t) * gape
      a.push({ x: p.x + (nx * off) / sx, y: p.y + (ny * off) / sy })
      b.push({ x: p.x - (nx * off) / sx, y: p.y - (ny * off) / sy })
    }
    lipA = toD(a); lipB = toD(b)
  }

  return (
    <div ref={boxRef} style={{ position: 'relative', height, touchAction: 'none' }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" aria-hidden
           style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        <path d={D} fill="none" stroke="var(--plum)" strokeWidth={1} strokeDasharray="9 7" vectorEffect="non-scaling-stroke" />
        {cutD && <path d={cutD} fill="none" stroke="var(--peony)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />}
        {lipA && <path d={lipA} fill="none" stroke="var(--peony)" strokeWidth={1} vectorEffect="non-scaling-stroke" />}
        {lipB && <path d={lipB} fill="none" stroke="var(--peony)" strokeWidth={1} vectorEffect="non-scaling-stroke" />}
      </svg>

      <button
        type="button"
        role="slider"
        aria-label="Drag the scissors along the line"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className="scissor-handle"
        style={{
          left: `${(here.x / VB_W) * 100}%`,
          top: `${(here.y / VB_H) * 100}%`,
          cursor: dragging ? 'grabbing' : 'grab',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--plum)" strokeWidth="1.2" strokeLinecap="round"
             aria-hidden style={{ transform: `rotate(${angle}deg)` }}>
          <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M8.6 7.6 20 18M8.6 16.4 20 6" />
        </svg>
      </button>

      {hint && (
        <span aria-hidden className="scissor-hint" style={{ opacity: touched ? 0 : 1 }}>{hint}</span>
      )}

      <style>{`
        .scissor-handle {
          position: absolute; width: 52px; height: 52px; margin: -26px 0 0 -26px; padding: 0;
          border-radius: 50%; border: 1px solid var(--plum); background: var(--pearl);
          display: flex; align-items: center; justify-content: center; z-index: 2;
          transition: box-shadow .25s, border-color .25s;
        }
        .scissor-handle:hover, .scissor-handle:focus-visible { border-color: var(--peony); box-shadow: 0 0 0 4px rgba(194,31,96,.12); outline: none; }
        .scissor-hint {
          position: absolute; right: 0; bottom: -4px; pointer-events: none;
          font-family: var(--font-display); font-style: italic; font-size: 22px; color: var(--peony);
          transition: opacity .5s;
        }
      `}</style>
    </div>
  )
}
