'use client'
import { allProjects, type Project } from '@/data/projects'

export const projectNum = (p: Project) => String(allProjects.indexOf(p) + 1).padStart(2, '0')

/* The archive as a dial: projects sit on an arc whose centre is off-canvas to
   the left. The active one is always at 3 o'clock; the rest fan out above and
   below, fading with distance. Scroll, arrow keys or a click turn it. */

const CX = -200       // arc centre, px from the dial's left edge
const R = 440         // arc radius
const STEP = 15       // degrees between neighbours

const RINGS = [
  { r: 560, border: '1px solid rgba(246,240,236,0.08)' },
  { r: 440, border: '1px solid rgba(246,240,236,0.4)' },
  { r: 420, border: '1px dashed rgba(242,122,174,0.45)' },
  { r: 220, border: '1px solid rgba(246,240,236,0.08)' },
]

interface Props {
  projects: Project[]
  activeIdx: number
  onSelect: (i: number) => void
  counter: string
}

export default function ProjectDial({ projects, activeIdx, onSelect, counter }: Props) {
  return (
    <div
      className="work-dial"
      style={{
        position: 'relative', width: 'clamp(520px, 44vw, 640px)', flexShrink: 0,
        overflow: 'hidden', borderRight: '1px solid rgba(246,240,236,0.18)',
      }}
    >
      {RINGS.map(ring => (
        <div key={ring.r + ring.border} aria-hidden style={{
          position: 'absolute', left: CX - ring.r, top: `calc(50% - ${ring.r}px)`,
          width: ring.r * 2, height: ring.r * 2, borderRadius: '50%', border: ring.border,
        }} />
      ))}

      <ol aria-label="Projects" style={{ listStyle: 'none' }}>
        {projects.map((p, i) => {
          const deg = (i - activeIdx) * STEP
          const rad = (deg * Math.PI) / 180
          const isActive = i === activeIdx
          const size = isActive ? 18 : 9
          const hidden = Math.abs(deg) > 80
          const x = CX + R * Math.cos(rad)
          const y = R * Math.sin(rad)
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Show ${p.title}`}
                aria-current={isActive ? 'true' : undefined}
                tabIndex={hidden ? -1 : 0}
                className="dial-node"
                style={{
                  left: x, top: `calc(50% + ${y}px)`, marginLeft: -size / 2,
                  opacity: hidden ? 0 : Math.max(0.3, 1 - Math.abs(deg) / 95),
                  pointerEvents: hidden ? 'none' : 'auto',
                }}
              >
                <span aria-hidden style={{
                  width: size, height: size, borderRadius: '50%', flexShrink: 0,
                  background: isActive ? 'var(--rose)' : 'var(--plum)',
                  border: isActive ? 'none' : '1px solid var(--pearl)',
                  boxShadow: isActive ? '0 0 0 6px var(--plum), 0 0 0 7px rgba(242,122,174,0.8)' : 'none',
                  transition: 'width .4s, height .4s',
                }} />
                <span style={{
                  fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18,
                  color: isActive ? 'var(--rose)' : 'var(--muted-on-dark)', marginLeft: isActive ? 8 : 0,
                  transition: 'color .3s, margin .3s',
                }}>
                  {projectNum(p)}
                </span>
                <span className="dial-label" style={{
                  fontSize: isActive ? 30 : 20,
                  color: isActive ? 'var(--pearl)' : 'var(--muted-on-dark)',
                }}>
                  {p.title}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <div aria-hidden style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 260, pointerEvents: 'none',
        background: 'linear-gradient(to top, var(--plum) 0%, var(--plum) 48%, rgba(43,22,34,0.85) 68%, rgba(43,22,34,0) 100%)',
      }} />
      <div style={{ position: 'absolute', left: 40, bottom: 30, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span aria-live="polite" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 52, lineHeight: .95 }}>{counter}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20, color: 'var(--muted-on-dark)' }}>
          Scroll or click to turn the dial
        </span>
      </div>

      <style>{`
        .dial-node {
          position: absolute; transform: translateY(-50%); min-height: 44px;
          display: flex; align-items: center; gap: 14px;
          background: none; border: none; padding: 0; cursor: none; color: var(--pearl);
          transition: left .6s cubic-bezier(.2,.8,.2,1), top .6s cubic-bezier(.2,.8,.2,1), opacity .4s;
        }
        .dial-label {
          font-family: var(--font-display); font-weight: 400; line-height: 1; white-space: nowrap;
          transition: font-size .4s cubic-bezier(.2,.8,.2,1), color .3s;
        }
        .dial-node:hover .dial-label, .dial-node:focus-visible .dial-label { color: var(--pearl) !important; }
        .dial-node:focus-visible { outline: 1px dashed var(--rose); outline-offset: 6px; }
      `}</style>
    </div>
  )
}
