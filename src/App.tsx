import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/gsap'
import { ScrollProgress } from './components/ScrollProgress'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Occasions } from './components/Occasions'
import { Problem } from './components/Problem'
import { Services } from './components/Services'
import { HowItWorks } from './components/HowItWorks'
import { Gallery } from './components/Gallery'
import { About } from './components/About'
import { Faq } from './components/Faq'
import { FinalCta } from './components/FinalCta'
import { Footer } from './components/Footer'
import { WhatsAppFloat } from './components/WhatsAppFloat'
import { BackgroundShift } from './components/BackgroundShift'

export default function App() {
  /**
   * ROLAGEM SUAVE (Lenis) sincronizada com o ScrollTrigger.
   * Desligada para quem pede "reduzir movimento" no sistema.
   * anchors: true faz os links do menu (#servicos etc.) rolarem suavemente.
   */
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return () => window.removeEventListener('load', refresh)
    }

    const lenis = new Lenis({ duration: 1.15, anchors: { offset: -88 } })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <ScrollProgress />
      <Navbar />

      {/* overflow-x-clip impede rolagem horizontal sem quebrar o "sticky" */}
      <main id="conteudo" className="w-full max-w-full overflow-x-clip">
        <Hero />
        <Occasions />
        <Problem />
        <Services />
        <HowItWorks />
        <Gallery />
        <About />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
      <WhatsAppFloat />

      {/* Precisa vir por último: lê as seções [data-bg] já montadas */}
      <BackgroundShift />
    </>
  )
}
