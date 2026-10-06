import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

/**
 * Barra de progresso de leitura no topo da página.
 * ANIMAÇÃO: scaleX de 0 a 1 ligado à rolagem (ScrollTrigger com scrub).
 * É feedback funcional, por isso continua ativa mesmo com "reduzir movimento".
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(bar.current, { scaleX: 0 }, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: 'max',
        scrub: 0.3,
      },
    })
  })

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1">
      <div ref={bar} className="h-full w-full origin-left bg-ink" />
    </div>
  )
}
