'use client'
import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null)
  const videoRef    = useRef<HTMLVideoElement>(null)
  const durationRef = useRef(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Smooth the raw scroll progress for butter-smooth animations
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 25, mass: 0.4 })

  // Text + gradient slide off-screen to the left
  // Remapped for 450vh: same absolute distances (225vh, 126vh)
  const contentX    = useTransform(smoothProgress, [0, 0.50], ['0vw', '-110vw'])
  const textOpacity = useTransform(smoothProgress, [0, 0.28], [1, 0])

  // Control video scrubbing + horizontal bias via direct DOM (no re-renders)
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const video = videoRef.current
    if (!video) return

    // Video scrubs through the full hero scroll — no dead space at the end
    const videoProgress = latest
    const dur = durationRef.current
    if (dur > 0) {
      const t = videoProgress * dur
      const v = video as HTMLVideoElement & { fastSeek?: (n: number) => void }
      v.fastSeek ? v.fastSeek(t) : (video.currentTime = t)
    }

    // Shift object-position using same clamped progress
    const xPct = 140 - videoProgress * 90   // 140% → 50%
    video.style.objectPosition = `${Math.max(50, xPct).toFixed(1)}% 50%`
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onMeta = () => { durationRef.current = video.duration }
    video.addEventListener('loadedmetadata', onMeta)
    if (video.readyState >= 1) durationRef.current = video.duration
    return () => video.removeEventListener('loadedmetadata', onMeta)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      style={{ height: '300vh', position: 'relative', background: '#020A2A' }}
    >
      <div style={{
        position: 'sticky', top: 0,
        width: '100vw', height: '100vh', overflow: 'hidden',
      }}>

        {/* ── Video ── */}
        <video
          ref={videoRef}
          src="/hero.mp4"
          muted
          playsInline
          preload="auto"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: '140% 50%',
            zIndex: 0,
          }}
        />

        {/* ── Gradient overlay — slides left with content ── */}
        <motion.div
          aria-hidden
          style={{
            x: contentX,
            position: 'absolute', inset: 0,
            // Extra width so the solid-dark wall fully pushes out of frame
            width: '130%',
            background:
              'linear-gradient(to right,' +
              '#000115 0%,' +
              '#000115 22%,' +
              'rgba(0,1,21,0.88) 40%,' +
              'rgba(0,1,21,0.42) 58%,' +
              'transparent 76%)',
            zIndex: 1,
          }}
        />

        {/* ── Text content — slides left + fades ── */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center',
          paddingLeft: 'clamp(2.5rem, 8vw, 7rem)',
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          <motion.div
            style={{ x: contentX, opacity: textOpacity }}
          >
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 6.5vw, 7.5rem)',
              fontWeight: 500,
              color: '#fff',
              lineHeight: 1,
              marginBottom: '0.25em',
              whiteSpace: 'nowrap',
            }}>
              Melanie Craig
            </h1>

            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3.4vw, 4rem)',
              fontWeight: 100,
              fontStyle: 'italic',
              color: 'var(--pink)',
              lineHeight: 1,
              marginBottom: '2rem',
            }}>
              Design &amp; Motion
            </p>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(.82rem, 1vw, 1rem)',
              fontWeight: 300,
              color: 'rgba(255,255,255,.75)',
              lineHeight: 1.75,
              maxWidth: '360px',
              marginBottom: '0.35rem',
            }}>
              I&apos;ve spent 7 years shaping how brands look and 4 making them move.
            </p>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(.82rem, 1vw, 1rem)',
              fontWeight: 300,
              color: 'rgba(255,255,255,.75)',
              lineHeight: 1.75,
              maxWidth: '360px',
              marginBottom: '2.2rem',
            }}>
              Thinking in two dimensions from the start.
            </p>

            <div style={{
              display: 'flex', flexDirection: 'column',
              gap: '0.75rem', alignItems: 'flex-start',
              pointerEvents: 'all',
            }}>
              <a
                href="mailto:melanieycraig@gmail.com"
                style={{
                  display: 'inline-block', minWidth: '232px', textAlign: 'center',
                  padding: '.82rem 1.8rem',
                  background: 'var(--pink)', color: '#fff',
                  fontFamily: 'var(--font-display)',
                  fontSize: '.68rem', fontWeight: 600,
                  letterSpacing: '.1em', textTransform: 'uppercase',
                  textDecoration: 'none', cursor: 'none',
                  transition: 'background .25s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#ff4da0')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--pink)')}
              >
                Work with me
              </a>

              <Link
                href="/work"
                style={{
                  display: 'inline-block', minWidth: '232px', textAlign: 'center',
                  padding: '.82rem 1.8rem',
                  background: 'transparent', color: '#fff',
                  fontFamily: 'var(--font-display)',
                  fontSize: '.68rem', fontWeight: 600,
                  letterSpacing: '.1em', textTransform: 'uppercase',
                  textDecoration: 'none', cursor: 'none',
                  border: '1.5px solid rgba(255,255,255,.5)',
                  transition: 'border-color .25s, color .25s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#fff'
                  ;(e.currentTarget as HTMLAnchorElement).style.color = '#fff'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,.5)'
                }}
              >
                Show me your work
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
