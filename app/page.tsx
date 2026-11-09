import CustomCursor    from '@/components/CustomCursor'
import Hero            from '@/components/Hero'
import About           from '@/components/About'
import WorkTeaser      from '@/components/WorkTeaser'
import HobbyStrip      from '@/components/HobbyStrip'
import Contact         from '@/components/Contact'
import Footer          from '@/components/Footer'
import NavBar          from '@/components/NavBar'
import ScrollToSection from '@/components/ScrollToSection'

export default function Home() {
  return (
    <>
      <ScrollToSection />
      <CustomCursor />
      <NavBar />
      <main>
        <Hero />
        <div id="section-about" style={{ position: 'relative', zIndex: 5, marginTop: '-40vh' }}>
          <About />
        </div>
        <div id="section-work">
          <WorkTeaser />
        </div>
        <div id="section-hobby">
          <HobbyStrip />
        </div>
        <div id="section-contact">
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  )
}
