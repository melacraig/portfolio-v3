const items = [
  'Branding','Visual Identity','Social Media','Editorial','Illustration','Print',
  'Motion Graphics','Video Editing','Animation','Photoshop','Illustrator','InDesign',
  'Premiere','After Effects','Procreate','Procreate Dreams','Spanish','English',
  'AI-Assisted Design','Generative Image Tools',
]

export default function Marquee() {
  const doubled = [...items, ...items]
  return (
    <div style={{
      borderTop: '1px solid rgba(242,122,174,.15)',
      borderBottom: '1px solid rgba(242,122,174,.15)',
      overflow: 'hidden', padding: '.85rem 0',
      background: 'transparent',
    }}>
      <div style={{
        display: 'flex', whiteSpace: 'nowrap',
        animation: 'marquee 18s linear infinite',
      }}>
        {doubled.map((item, i) => (
          <span key={i}>
            <span className="t-tag" style={{
              letterSpacing: '.22em',
              color: 'rgba(246,240,236,.35)',
              padding: '0 2rem',
            }}>
              {item}
            </span>
            <span style={{ color: 'var(--pink)', opacity: .4 }}> · </span>
          </span>
        ))}
      </div>
    </div>
  )
}
