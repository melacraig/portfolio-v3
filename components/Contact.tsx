'use client'
import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <section id="contact" style={{ background: 'var(--plum)', color: 'var(--pearl)' }}>
      <motion.div
        className="contact-wrap"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: .9, ease: [.16, 1, .3, 1] }}
        style={{
          maxWidth: 1440, margin: '0 auto', padding: '148px var(--gutter) 40px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 52, textAlign: 'center',
        }}
      >
        <h2 className="font-display" style={{ fontSize: 'clamp(43px, 6.8vw, 109px)', lineHeight: .95, paddingBottom: '.35em' }}>
          Let&apos;s build something<br />
          <span className="t-script" style={{ color: 'var(--rose)' }}>amazing</span>
        </h2>

        <a href="mailto:melanieycraig@gmail.com" className="contact-mail">melanieycraig@gmail.com</a>

        <span className="t-body" style={{ color: 'var(--muted-on-dark)', letterSpacing: '.01em' }}>
          Available for new opportunities
        </span>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
          <a href="https://www.linkedin.com/in/melanieycraig/" target="_blank" rel="noopener noreferrer"
             className="btn btn--fill btn--pearl" style={{ height: 52, padding: '0 28px' }}>
            LinkedIn
          </a>
          <a href="/Melanie-Craig-CV.pdf" target="_blank" rel="noopener noreferrer"
             className="btn btn--line on-dark" style={{ height: 52, padding: '0 28px' }}>
            Download my CV
          </a>
        </div>
      </motion.div>

      <style>{`
        .contact-mail {
          font-family: var(--font-display); font-weight: 400; font-size: clamp(26px, 2.3vw, 41px);
          color: var(--pearl); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 12px;
          cursor: none; transition: color .25s; overflow-wrap: anywhere;
        }
        .contact-mail:hover { color: var(--rose); }
        @media (max-width: 768px) {
          .contact-wrap { padding: 104px 20px 32px !important; gap: 36px !important; }
        }
      `}</style>
    </section>
  )
}
