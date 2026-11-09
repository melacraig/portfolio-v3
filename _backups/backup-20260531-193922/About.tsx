'use client'
import { useRef, useEffect } from 'react'
import {
  motion, useScroll, useTransform, useMotionValue, useSpring,
  type MotionValue,
} from 'framer-motion'

/* ── Skill data ── */
const skillsA = [
  {
    label: 'Design Skills',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 12L5 9l6-6 2 2-6 6-3 3z"/><path d="M9 3l2 2"/></svg>,
    skills: ['Branding','Visual Identity','Social Media','Editorial','Illustration','Print'],
  },
  {
    label: 'Motion Skills',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><polygon points="3,2 12,7 3,12"/></svg>,
    skills: ['Motion Graphics','Video Editing','Animation'],
  },
  {
    label: 'Tools',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="7" cy="7" r="2"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.9 2.9l1.4 1.4M9.7 9.7l1.4 1.4M2.9 11.1l1.4-1.4M9.7 4.3l1.4-1.4"/></svg>,
    skills: ['Photoshop','Illustrator','InDesign','Premiere','After Effects','Procreate','Procreate Dreams'],
  },
]

const skillsB = [
  {
    label: 'Languages',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="7" cy="7" r="5.5"/><path d="M7 1.5c-2 2-2 7 0 11M7 1.5c2 2 2 7 0 11M1.5 7h11"/></svg>,
    skills: ['Spanish','English'],
    span: 1,
  },
  {
    label: 'AI Workflows',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M7 1l1.5 3.5L12 6l-3.5 1.5L7 11l-1.5-3.5L2 6l3.5-1.5z"/></svg>,
    skills: ['AI-Assisted Design','Generative Image Tools'],
    span: 2,
  },
]

/* ── Skill group — no header border, staggered tag reveal ── */
function SkillGroup({ label, icon, skills, span }: {
  label: string; icon: React.ReactNode; skills: string[]; span?: number
}) {
  return (
    <div style={{ gridColumn: span === 2 ? 'span 2' : undefined, display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.55rem', paddingBottom: '.65rem' }}>
        <span style={{ color: 'var(--pink)', display: 'flex', alignItems: 'center' }}>{icon}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase' as const, color: 'var(--pink)' }}>{label}</span>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } } }}
        style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '.42rem' }}
      >
        {skills.map(s => (
          <motion.span
            key={s}
            className="skill-tag"
            variants={{
              hidden:  { opacity: 0, scale: 0.78, y: 8 },
              visible: { opacity: 1, scale: 1,    y: 0, transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
          >
            {s}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

/* ── Animated block wrapper ── */
function Block({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.95, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ padding: '3rem 0', ...style }}
    >
      {children}
    </motion.div>
  )
}

/* ── Planet ── */
function Planet({ size, duration, delay, mouseX }: {
  size: number; duration: number; delay: number; mouseX: MotionValue<number>
}) {
  const mult = size > 5.5 ? 1.3 : size < 4.5 ? 0.7 : 1.0
  const x    = useTransform(mouseX, [-0.5, 0.5], [-42 * mult, 42 * mult])

  return (
    // Outer div: CSS animation handles traversal (left) + scale 0→1→0
    // Inner motion.div: Framer Motion handles mouse x-drift (separate transform)
    <div
      style={{
        position:  'absolute',
        top:       '50%',
        marginTop: -(size / 2),
        width:     size,
        height:    size,
        animationName:           'planet-traverse',
        animationDuration:       `${duration}s`,
        animationDelay:          `${delay}s`,
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        animationFillMode:       'both',
      }}
    >
      <motion.div
        style={{
          width:        '100%',
          height:       '100%',
          borderRadius: '50%',
          background:   'var(--pink)',
          boxShadow: `0 0 ${size * 3}px ${size * 1.5}px rgba(247,37,133,.28), 0 0 ${size}px ${size * 0.5}px rgba(247,37,133,.75)`,
          x,
        }}
      />
    </div>
  )
}

/* ── Divider line with planets ── */
function DividerLine({ mouseX, planets }: {
  mouseX: MotionValue<number>
  planets: { size: number; duration: number; delay: number }[]
}) {
  return (
    <div style={{ position: 'relative', height: '28px' }}>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: '1.5px', background: 'rgba(247,37,133,.32)',
          transformOrigin: 'left', translateY: '-50%',
        }}
      />
      {planets.map((p, i) => (
        <Planet key={i} {...p} mouseX={mouseX} />
      ))}
    </div>
  )
}

/* ── Main component ── */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const leftScrollY  = useTransform(scrollYProgress, [0, 1], ['50px', '-50px'])
  const rightScrollY = useTransform(scrollYProgress, [0, 1], ['-50px', '50px'])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 75, damping: 18, mass: 0.4 })

  const leftMouseX  = useTransform(smoothX, [-0.5, 0.5], ['12px', '-12px'])
  const rightMouseX = useTransform(smoothX, [-0.5, 0.5], ['-12px', '12px'])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth)  - 0.5)
      mouseY.set((e.clientY / window.innerHeight) - 0.5)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseX, mouseY])

  const LINE_CONFIGS = [
    [{ size: 5, duration: 55,  delay: 0  }, { size: 6.5, duration: 82,  delay: 18 }, { size: 3.5, duration: 110, delay: 40 }],
    [{ size: 4, duration: 70,  delay: 10 }, { size: 7,   duration: 95,  delay: 32 }, { size: 5,   duration: 50,  delay: 5  }],
    [{ size: 6, duration: 80,  delay: 25 }, { size: 3.5, duration: 60,  delay: 0  }, { size: 5.5, duration: 100, delay: 15 }],
  ]

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        display:             'grid',
        gridTemplateColumns: '1fr 420px',
        background:          'linear-gradient(to bottom, transparent 0, #020A2A 10rem)',
        position:            'relative',
      }}
    >

      {/* ── Left column ── */}
      <motion.div style={{
        padding:       '6rem 6rem 6rem 7rem',
        display:       'flex',
        flexDirection: 'column',
        borderRight:   '1px solid rgba(247,37,133,.12)',
        position:      'relative',
        y:             leftScrollY,
        x:             leftMouseX,
      }}>

        <div style={{ position: 'absolute', left: 0, top: '7rem', bottom: '7rem', width: '1px', background: 'linear-gradient(180deg,transparent,rgba(247,37,133,.22) 30%,rgba(247,37,133,.22) 70%,transparent)' }} />

        <Block>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem,3.4vw,3.4rem)', fontWeight: 100, fontStyle: 'italic', color: '#fff', marginBottom: '1.6rem' }}>
            About Me
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.05rem,1.25vw,1.3rem)', fontWeight: 300, color: '#fff', lineHeight: 1.9 }}>
            I&apos;ve been making things with my hands since before I had the vocabulary to explain why. First freelance
            client <span style={{ color: 'var(--pink)' }}>at 16</span>, degree{' '}
            <span style={{ color: 'var(--pink)' }}>at 22</span>, several agencies, international clients, and a very
            diverse portfolio later, here we are.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.05rem,1.25vw,1.3rem)', fontWeight: 300, color: '#fff', lineHeight: 1.9, marginTop: '1rem' }}>
            I also sew my own clothes, stay annoyingly active, and still draw for fun — because apparently one creative
            obsession was never going to be enough.
          </p>
        </Block>

        <DividerLine mouseX={smoothX} planets={LINE_CONFIGS[0]} />

        <Block>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem 2.5rem' }}>
            {skillsA.map((g, i) => <SkillGroup key={i} {...g} />)}
          </div>
        </Block>

        <DividerLine mouseX={smoothX} planets={LINE_CONFIGS[1]} />

        <Block>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem 2.5rem' }}>
            {skillsB.map((g, i) => <SkillGroup key={i} label={g.label} icon={g.icon} skills={g.skills} span={g.span} />)}
          </div>
        </Block>

        <DividerLine mouseX={smoothX} planets={LINE_CONFIGS[2]} />

        <Block>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem,3.4vw,3.4rem)', fontWeight: 100, fontStyle: 'italic', color: '#fff', marginBottom: '1.6rem' }}>
            What Drives Me
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.05rem,1.25vw,1.3rem)', fontWeight: 300, color: '#fff', lineHeight: 1.9 }}>
            Design and motion are two languages I&apos;ve spent years learning to speak fluently — and I&apos;m not done yet.
            The more I grow in both, the more I understand how deeply they inform each other.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.05rem,1.25vw,1.3rem)', fontWeight: 300, color: '#fff', lineHeight: 1.9, marginTop: '1rem' }}>
            Right now, I&apos;m looking to bring that combined perspective into environments where craft is taken seriously —
            whether that&apos;s an agency, a brand with ambition, or a project that demands both strategic thinking and visual execution.
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem,1.8vw,1.7rem)', fontStyle: 'italic', fontWeight: 100, color: 'var(--pink)', marginTop: '1.6rem', lineHeight: 1.55 }}>
            That&apos;s the kind of work that pushes me forward.
          </p>
        </Block>

      </motion.div>

      {/* ── Right column ── */}
      <motion.div style={{
        padding:       '6rem 4rem',
        display:       'flex',
        flexDirection: 'column',
        position:      'relative',
        y:             rightScrollY,
        x:             rightMouseX,
      }}>

        {[
          { num: '7+', label: 'Years of Experience', note: null },
          { num: '2',  label: 'Core Disciplines',    note: "You won't need to explain the brief twice." },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.15 }}
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              borderBottom: i < 1 ? '1px solid rgba(247,37,133,.1)' : 'none',
              paddingBottom: i < 1 ? '2.2rem' : 0,
              marginBottom:  i < 1 ? '2.2rem' : 0,
            }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '6.5rem', fontWeight: 500, color: 'var(--pink)', lineHeight: 1 }}>{s.num}</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '.92rem', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff', marginTop: '.9rem' }}>{s.label}</div>
            {s.note && <p style={{ fontFamily: 'var(--font-body)', fontSize: '.88rem', fontStyle: 'italic', color: 'rgba(247,37,133,.45)', marginTop: '.6rem', lineHeight: 1.5 }}>{s.note}</p>}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
          style={{ flex: 1, border: '1px solid rgba(247,37,133,.12)', borderLeft: '2px solid var(--pink)', display: 'flex', alignItems: 'flex-end', padding: '2rem', marginTop: '2rem', background: 'rgba(247,37,133,.03)' }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,2vw,1.9rem)', fontWeight: 100, fontStyle: 'italic', color: '#fff', lineHeight: 1.35 }}>
            Let&apos;s make something worth remembering.
          </p>
        </motion.div>

      </motion.div>

      <style>{`
        @keyframes planet-traverse {
          0%   { left: -20px;               transform: scale(0); }
          10%  { transform: scale(1); }
          90%  { transform: scale(1); }
          100% { left: calc(100% + 20px);   transform: scale(0); }
        }
        @media (max-width: 1280px) { #about { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px) {
          #about > div:first-child { padding: 4rem 2rem !important; }
          #about > div:last-child  { padding: 3rem 2rem !important; }
        }
      `}</style>
    </section>
  )
}
