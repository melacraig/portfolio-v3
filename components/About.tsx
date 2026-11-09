'use client'
import { motion } from 'framer-motion'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const SKILLS: [string, string][] = [
  ['Design',       'Branding, Visual Identity, Social Media, Editorial, Illustration, Print'],
  ['Motion',       'Motion Graphics, Video Editing, Animation'],
  ['Tools',        'Photoshop, Illustrator, InDesign, Premiere, After Effects, Procreate, Procreate Dreams'],
  ['AI workflows', 'AI-Assisted Design, Generative Image Tools'],
  ['Languages',    'Spanish, English'],
]

const STATS = [
  { num: '9', label: 'Years of experience' },
  { num: '6', label: 'Years in motion graphics' },
]

/* Fade-and-rise as a block scrolls in */
function Reveal({ children, delay = 0, style, className }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties; className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.95, ease: EASE, delay }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  return (
    <section
      id="about"
      style={{ background: 'var(--pearl)', color: 'var(--plum)', position: 'relative' }}
    >
      <div className="about-wrap" style={{
        maxWidth: 1440, margin: '0 auto',
        padding: '136px var(--gutter) 128px',
        display: 'flex', flexDirection: 'column', gap: 104,
      }}>

        {/* ── Intro ── */}
        <Reveal style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44, textAlign: 'center' }}>
          <h2 className="t-h2" style={{ maxWidth: 1000 }}>
            I&apos;ve been making things{' '}
            <span className="t-script" style={{ color: 'var(--peony)' }}>with my hands</span>{' '}
            since before I had the vocabulary to explain why.
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px 56px', maxWidth: 860, textAlign: 'left' }}>
            <p className="t-body" style={{ flex: '1 1 300px', color: 'var(--ink-soft)' }}>
              First freelance client at 16, degree at 22, several agencies, international clients, and a very diverse portfolio later, here we are.
            </p>
            <p className="t-body" style={{ flex: '1 1 300px', color: 'var(--ink-soft)' }}>
              I also sew my own clothes, stay annoyingly active, and still draw for fun — because apparently one creative obsession was never going to be enough.
            </p>
          </div>
        </Reveal>

        {/* ── Stats ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          width: '100%', maxWidth: 720, margin: '0 auto', gap: '40px 48px', textAlign: 'center',
        }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.15} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <span className="t-stat" style={{ position: 'relative' }}>
                {s.num}
                <span style={{ color: 'var(--peony)', position: 'absolute', left: '100%', top: 0 }}>+</span>
              </span>
              <span style={{
                fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(24px, 2.1vw, 30px)',
                lineHeight: 1.15, color: 'var(--mauve)', maxWidth: 230, textWrap: 'balance',
              }}>
                {s.label}
              </span>
            </Reveal>
          ))}
        </div>

        {/* ── Skills & tools ── */}
        <Reveal style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 820, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 28 }}>
            <h3 className="t-h3">Skills &amp; tools</h3>
            <dl style={{ display: 'flex', flexDirection: 'column' }}>
              {SKILLS.map(([term, list]) => (
                <div key={term} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 32px', padding: '14px 0' }}>
                  <dt style={{
                    flex: '0 0 160px', fontFamily: 'var(--font-display)', fontStyle: 'italic',
                    fontSize: 26, lineHeight: 1.25, color: 'var(--peony)',
                    textDecoration: 'underline', textDecorationStyle: 'dashed', textDecorationThickness: 1, textUnderlineOffset: 8,
                  }}>
                    {term}
                  </dt>
                  <dd className="t-body" style={{ flex: '1 1 360px', paddingTop: 4, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                    {list}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        {/* ── What drives me ── */}
        <Reveal style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, textAlign: 'center', padding: '24px 0' }}>
          <h3 className="t-h3">What drives me</h3>
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
            style={{ width: 120, height: 0, borderTop: '1.5px dashed var(--peony)' }}
          />
          <p className="font-display" style={{ maxWidth: 980, fontSize: 'clamp(28px, 2.6vw, 46px)', lineHeight: 1.12 }}>
            Design and motion are two languages I&apos;ve spent years learning to speak fluently, and I&apos;m not done yet.
          </p>
          <p className="t-body" style={{ maxWidth: 640, color: 'var(--ink-soft)' }}>
            Right now, I&apos;m looking to bring that combined perspective into environments where craft is taken seriously.
            Whether that&apos;s an agency, a brand with ambition, or an idea that demands both strategic thinking and visual execution.{' '}
            <span style={{ color: 'var(--peony)' }}>That&apos;s the kind of work that pushes me forward.</span>
          </p>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-wrap { padding: 88px 20px 80px !important; gap: 72px !important; }
          #about dt { flex-basis: 100% !important; }
        }
      `}</style>
    </section>
  )
}
