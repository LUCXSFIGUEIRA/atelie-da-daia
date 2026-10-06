import { useRef } from 'react'
import { Sparkle } from '@phosphor-icons/react'
import { gsap, ScrollTrigger, useGSAP, MQ } from '../lib/gsap'

const items = [
  'Vestido de festa',
  'Noiva',
  'Daminha',
  'Formatura',
  'Madrinha',
  'Festa junina',
  'Fantasia infantil',
  'Barra',
  'Ajuste',
  'Troca de zíper',
  'Reforma',
]

/**
 * Faixa de palavras-chave em movimento contínuo (o único marquee da página).
 *
 * ANIMAÇÃO: loop infinito em xPercent (-50%, porque a lista é duplicada).
 * A velocidade acelera quando a pessoa rola rápido (ScrollTrigger.getVelocity).
 * Com "reduzir movimento", a faixa fica parada.
 */
export function Marquee() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const loop = gsap.to(track.current, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 })

        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 5)
            gsap.to(loop, { timeScale: boost, duration: 0.2, overwrite: true })
            gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.2, ease: 'power2.out' })
          },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-label="O que o ateliê faz" className="relative overflow-hidden py-10 md:py-14">
      <div className="-mx-[5%] w-[110%] -rotate-2 bg-ink py-5 text-white md:py-7">
        <div ref={track} className="flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-6 px-6 font-display text-4xl font-bold tracking-tight whitespace-nowrap md:gap-8 md:px-8 md:text-6xl"
                >
                  {item}
                  <Sparkle weight="fill" aria-hidden className="size-7 text-sun md:size-10" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
