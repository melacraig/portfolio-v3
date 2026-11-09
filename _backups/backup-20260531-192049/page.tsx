import CustomCursor from '@/components/CustomCursor'
import Hero         from '@/components/Hero'
import About        from '@/components/About'
import WorkTeaser   from '@/components/WorkTeaser'
import HobbyStrip   from '@/components/HobbyStrip'
import Contact      from '@/components/Contact'
import Footer       from '@/components/Footer'

export default function Home() {
  return (
    <>
      <CustomCursor />
      <main>
        <Hero />
        <div style={{ position: 'relative', zIndex: 5, marginTop: '-40vh' }}>
          <About />
        </div>
        <WorkTeaser />
        <HobbyStrip />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
