'use client'
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import CustomCursor  from '@/components/CustomCursor'
import ProjectDial, { projectNum } from '@/components/work/ProjectDial'
import ProjectPanel  from '@/components/work/ProjectPanel'
import MobileList    from '@/components/work/MobileList'
import { allProjects } from '@/data/projects'

type Filter = 'all' | 'graphic' | 'motion'

const count = (f: Filter) =>
  String(f === 'all' ? allProjects.length : allProjects.filter(p => p.type === f).length).padStart(2, '0')

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',     label: `All (${count('all')})` },
  { key: 'graphic', label: `Graphic (${count('graphic')})` },
  { key: 'motion',  label: `Motion (${count('motion')})` },
]

export default function WorkPage() {
  const [filter,    setFilter]    = useState<Filter>('all')
  const [activeIdx, setActiveIdx] = useState(0)
  const desktopRef = useRef<HTMLDivElement>(null)

  const projects = useMemo(
    () => filter === 'all' ? allProjects : allProjects.filter(p => p.type === filter),
    [filter]
  )
  const active = projects[Math.min(activeIdx, projects.length - 1)]

  const step = useCallback((d: number) => {
    setActiveIdx(i => (i + d + projects.length) % projects.length)
  }, [projects.length])

  const handleFilterChange = (f: Filter) => {
    setFilter(f)
    setActiveIdx(0)
  }

  // Scroll turns the dial one notch at a time; arrow keys do too
  useEffect(() => {
    const el = desktopRef.current
    if (!el) return
    let last = 0
    const onWheel = (e: WheelEvent) => {
      if (document.querySelector('[role="dialog"]')) return
      const target = e.target as HTMLElement
      // Let the panel scroll natively if its content overflows
      const panel = target.closest('.work-panel') as HTMLElement | null
      if (panel && panel.scrollHeight > panel.clientHeight + 4) return
      e.preventDefault()
      if (Math.abs(e.deltaY) < 4) return
      const now = Date.now()
      if (now - last < 550) return
      last = now
      step(e.deltaY > 0 ? 1 : -1)
    }
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('[role="dialog"]')) return
      if (window.innerWidth <= 860) return
      if (e.key === 'ArrowDown') { e.preventDefault(); step(1) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); step(-1) }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => { el.removeEventListener('wheel', onWheel); window.removeEventListener('keydown', onKey) }
  }, [step])

  return (
    <div className="work-page" style={{ background: 'var(--plum)', color: 'var(--pearl)' }}>
      <CustomCursor />

      {/* Desktop: dial + panel */}
      <div ref={desktopRef} className="work-desktop">
        <header style={{
          position: 'relative', height: 72, flexShrink: 0, padding: '0 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
          borderBottom: '1px solid rgba(246,240,236,0.18)',
        }}>
          <Link href="/" className="back-link">← Back home</Link>
          <span className="work-title" style={{ fontFamily: 'var(--font-display)', fontSize: 22, whiteSpace: 'nowrap' }}>
            See how I <span style={{ fontFamily: 'var(--font-script)', fontSize: 48, color: 'var(--rose)', lineHeight: 0, margin: '0 16px 0 14px' }}>think</span> through work
          </span>
          <div role="group" aria-label="Filter projects" className="tabs-dark" style={{ display: 'flex', gap: 22 }}>
            {FILTERS.map(f => (
              <button key={f.key} type="button" className="tab" aria-pressed={filter === f.key} onClick={() => handleFilterChange(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        </header>

        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <ProjectDial
            projects={projects}
            activeIdx={activeIdx}
            onSelect={setActiveIdx}
            counter={`${projectNum(active)}/${String(allProjects.length).padStart(2, '0')}`}
          />
          <ProjectPanel project={active} onPrev={() => step(-1)} onNext={() => step(1)} />
        </div>
      </div>

      {/* Mobile: list */}
      <div className="work-mobile">
        <MobileList projects={allProjects} filter={filter} onFilterChange={handleFilterChange} />
      </div>

      <style>{`
        .back-link {
          display: inline-flex; align-items: center; height: 44px; text-decoration: none; cursor: none;
          font-family: var(--font-display); font-style: italic; font-size: 22px; color: var(--pearl); transition: color .25s;
        }
        .back-link:hover { color: var(--rose); }
        @media (max-width: 1180px) { .work-title { display: none; } }
      `}</style>
    </div>
  )
}
