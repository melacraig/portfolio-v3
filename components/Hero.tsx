'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion'

// Half a frame at 30fps — seeks closer than this are invisible, skip them
const SEEK_EPSILON = 1 / 60
// If a seek never completes (decoder hiccup), stop waiting and re-issue
const SEEK_STALL_MS = 250
// Rolling-average seek latency above this means the machine can't scrub
// smoothly even with the optimized encode — fall back to the static poster
const SLOW_SEEK_AVG_MS = 100
const SLOW_SEEK_MIN_SAMPLES = 24

const POSTER = '/hero-poster.jpg'

type VideoMode = 'pending' | 'video' | 'static'

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null)
  const videoRef    = useRef<HTMLVideoElement>(null)
  const durationRef = useRef(0)

  // Seek pipeline state — never let more than one seek be in flight.
  // Flooding the decoder with a seek per scroll event is what causes
  // stutter on Windows integrated GPUs.
  const targetTimeRef    = useRef(0)
  const seekingRef       = useRef(false)
  const seekStartedAtRef = useRef(0)
  const latenciesRef     = useRef<number[]>([])

  const [mode, setMode] = useState<VideoMode>('pending')
  const [videoSrc, setVideoSrc] = useState<string | null>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70, damping: 25, mass: 0.4,
    restDelta: 0.001, // default 0.01 ≈ 3 video frames — too coarse for a scrub
  })

  // ── Scroll choreography ──
  // 0 → ~50%: the name sinks behind its mask while the needle runs along the tape.
  // ~55 → 85%: the last frame is trimmed into a pattern piece on Pearl.
  const asideOpacity = useTransform(smoothProgress, [0, 0.22], [1, 0])
  const asideY       = useTransform(smoothProgress, [0, 0.22], ['0px', '-24px'])
  const nameY        = useTransform(smoothProgress, [0.08, 0.5], ['0%', '105%'])
  const washOpacity  = useTransform(smoothProgress, [0.45, 0.75], [1, 0])
  const tapeOpacity  = useTransform(smoothProgress, [0.78, 0.9], [1, 0])
  const needleLeft   = useTransform(smoothProgress, v => `${Math.min(1, v / 0.9) * 100}%`)
  const tapeLabel    = useTransform(smoothProgress, v => `${Math.round(Math.min(1, v / 0.9) * 150)} cm`)
  const cropT        = useTransform(smoothProgress, [0.55, 0.85], [0, 1])
  const mediaClip    = useTransform(cropT, t =>
    `inset(${t * 18}px ${t * 24}px calc(${t * 26}vh) ${t * 24}px)`)
  const seamOpacity  = useTransform(smoothProgress, [0.72, 0.88], [0, 1])
  const seamTop      = useTransform(cropT, t => t * 18 + 8)
  const seamSide     = useTransform(cropT, t => t * 24 + 8)
  const seamBottom   = useTransform(cropT, t => `calc(${t * 26}vh + 8px)`)

  const requestSeek = () => {
    const video = videoRef.current
    if (!video || video.readyState < 2) return // no decodable data yet

    if (seekingRef.current) {
      // Safety valve: if 'seeked' never fired, don't stay wedged forever
      if (performance.now() - seekStartedAtRef.current < SEEK_STALL_MS) return
      seekingRef.current = false
    }

    if (Math.abs(video.currentTime - targetTimeRef.current) < SEEK_EPSILON) return

    seekingRef.current = true
    seekStartedAtRef.current = performance.now()
    video.currentTime = targetTimeRef.current
  }

  // Scrub video on scroll — only records the target; requestSeek decides
  // whether the decoder is free to take it
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    if (durationRef.current > 0) {
      targetTimeRef.current = latest * durationRef.current
      requestSeek()
    }
  })

  // Pick the right asset for the device. Runs client-side only, so SSR
  // paints the poster first and the video upgrades in.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMode('static')
      return
    }
    const nav = navigator as Navigator & {
      deviceMemory?: number
      connection?: { saveData?: boolean }
    }
    const small    = window.innerWidth < 768
    const lowMem   = (nav.deviceMemory ?? 8) <= 4
    const saveData = nav.connection?.saveData === true
    setVideoSrc(small || lowMem || saveData ? '/hero-scrub-720.mp4' : '/hero-scrub-1080.mp4')
    setMode('video')
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onMeta = () => { durationRef.current = video.duration }

    // Seek completed: chain to the latest scroll target if it moved while
    // we were busy. This coalesces a burst of scroll events into a clean
    // seek → seeked → seek sequence the hardware decoder can keep up with.
    const onSeeked = () => {
      const latency = performance.now() - seekStartedAtRef.current
      seekingRef.current = false

      const samples = latenciesRef.current
      samples.push(latency)
      if (samples.length > SLOW_SEEK_MIN_SAMPLES) samples.shift()
      if (samples.length >= SLOW_SEEK_MIN_SAMPLES) {
        const avg = samples.reduce((a, b) => a + b, 0) / samples.length
        if (avg > SLOW_SEEK_AVG_MS) {
          setMode('static')
          return
        }
      }
      requestSeek()
    }

    // Once frames are decodable, sync to wherever the user already scrolled
    const onLoadedData = () => { requestSeek() }

    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('loadeddata', onLoadedData)
    if (video.readyState >= 1) durationRef.current = video.duration

    return () => {
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('loadeddata', onLoadedData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSrc])

  const mediaStyle = {
    position: 'absolute' as const, inset: 0,
    width: '100%', height: '100%',
    objectFit: 'cover' as const,
    objectPosition: '70% center',
  }

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      style={{ height: '300vh', position: 'relative', background: 'var(--pearl)' }}
    >
      <div style={{
        position: 'sticky', top: 0,
        width: '100%', height: '100vh',
        overflow: 'hidden',
      }}>

        {/* ── Media: trimmed into a pattern piece at the end of the scroll ── */}
        <motion.div
          style={{
            position: 'absolute', inset: 0, overflow: 'hidden',
            background: 'var(--plum-deep)',
            clipPath: mediaClip, WebkitClipPath: mediaClip,
          }}
        >
          {/* Poster: paints immediately (SSR), backs the video so a slow
              load or seek never flashes black */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={POSTER} alt="" aria-hidden style={{ ...mediaStyle, zIndex: 0 }} />

          {/* Video: scroll-scrubbed, upgrades in over the poster */}
          {mode === 'video' && videoSrc && (
            <video
              ref={videoRef}
              src={videoSrc}
              poster={POSTER}
              muted
              playsInline
              preload="auto"
              style={{ ...mediaStyle, zIndex: 0 }}
            />
          )}

          {/* Plum wash from the bottom, a little at the top for the nav */}
          <motion.div
            aria-hidden
            style={{
              opacity: washOpacity,
              position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
              background: 'linear-gradient(to top, rgba(43,22,34,0.96) 0%, rgba(43,22,34,0.62) 38%, rgba(43,22,34,0.04) 70%, rgba(43,22,34,0.4) 100%)',
            }}
          />
        </motion.div>

        {/* ── Seam allowance + notches, drawn once the piece is cut ── */}
        <motion.div
          aria-hidden
          className="hero-seam"
          style={{ opacity: seamOpacity, top: seamTop, left: seamSide, right: seamSide, bottom: seamBottom }}
        />

        {/* ── Copy layer ── */}
        <div style={{
          position: 'relative', zIndex: 3, height: '100%',
          maxWidth: 1440, margin: '0 auto',
          padding: '22px var(--gutter) 26px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          color: 'var(--pearl)', pointerEvents: 'none',
        }}>
          <motion.nav
            aria-label="Main"
            className="hero-nav"
            style={{
              opacity: asideOpacity, pointerEvents: 'auto',
              display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16,
            }}
          >
            <a href="#top" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
               aria-label="Melanie Craig, home" style={{ display: 'flex', alignItems: 'center', minHeight: 44, cursor: 'none' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.webp" alt="" style={{ height: 30, width: 'auto' }} />
            </a>
            <div className="hero-nav-links" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 32 }}>
              {[
                ['About', 'section-about'], ['Work', 'section-work'],
                ['Also me', 'section-hobby'], ['Contact', 'section-contact'],
              ].map(([label, id]) => (
                <a key={id} href={`#${id}`} onClick={goTo(id)} className="hero-link">{label}</a>
              ))}
            </div>
          </motion.nav>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 28 }}>

              {/* Name: sinks behind its own mask as you scroll */}
              <div style={{ overflow: 'hidden', paddingTop: '.1em' }}>
                <motion.div style={{ y: nameY, position: 'relative', paddingBottom: 50 }}>
                  <h1 className="t-hero hero-name" style={{ color: 'var(--pearl)' }}>Melanie Craig</h1>
                  <span
                    className="hero-subtitle"
                    style={{
                      position: 'absolute', right: '2%', bottom: 2,
                      fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400,
                      fontSize: 'clamp(28px, 3.2vw, 46px)', lineHeight: 1,
                      color: 'var(--rose)', whiteSpace: 'nowrap',
                    }}
                  >
                    design &amp; motion
                  </span>
                </motion.div>
              </div>

              <motion.div
                className="hero-aside"
                style={{
                  opacity: asideOpacity, y: asideY, pointerEvents: 'auto',
                  width: 380, maxWidth: '100%', paddingBottom: 8,
                  display: 'flex', flexDirection: 'column', gap: 18,
                }}
              >
                <p className="t-body" style={{ color: '#EADDE1' }}>
                  I&apos;ve spent 9 years shaping how brands look and 6 making them move. Thinking in two dimensions from the start.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <a href="#section-contact" onClick={goTo('section-contact')} className="btn btn--fill">Work with me</a>
                  <a href="#section-about" onClick={goTo('section-about')} className="btn btn--line on-dark hero-secondary">Scroll to meet me</a>
                </div>
              </motion.div>
            </div>

            {/* Tape measure: the needle measures how far you've scrolled */}
            <motion.div aria-hidden style={{ opacity: tapeOpacity, display: 'flex', alignItems: 'flex-end', gap: 14 }}>
              <div className="tape" style={{ flex: 1 }}>
                <motion.div style={{ position: 'absolute', left: needleLeft, top: -9, width: 1, height: 26, background: 'var(--rose)' }} />
              </div>
              <motion.span style={{
                fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22,
                color: 'var(--pearl)', minWidth: '3.6em', textAlign: 'right',
              }}>
                {tapeLabel}
              </motion.span>
            </motion.div>
          </div>
        </div>

      </div>

      <style>{`
        .hero-link {
          font-family: var(--font-body); font-weight: 400; font-size: 17px; letter-spacing: .02em;
          color: var(--pearl); text-decoration: none; padding: 14px 0; cursor: none; transition: color .25s;
        }
        .hero-link:hover { color: var(--rose); }
        .hero-seam { position: absolute; z-index: 2; pointer-events: none; border: 1px dashed rgba(246,240,236,.85); }
        .hero-seam::before, .hero-seam::after {
          content: ''; position: absolute; left: 50%; margin-left: -5px;
          border-left: 5px solid transparent; border-right: 5px solid transparent;
        }
        .hero-seam::before { top: -9px; border-top: 8px solid var(--pearl); }
        .hero-seam::after  { bottom: -9px; border-bottom: 8px solid var(--pearl); }
        @media (max-width: 768px) {
          .hero-nav-links { display: none !important; }
          .hero-name { font-size: clamp(64px, 19vw, 96px) !important; }
          .hero-subtitle { position: static !important; display: block; margin-top: 10px; }
          .hero-secondary { display: none !important; }
        }
      `}</style>
    </section>
  )
}
