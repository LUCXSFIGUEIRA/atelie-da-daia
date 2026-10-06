import { useRef } from 'react'
import { gsap, SplitText, useGSAP, MQ } from '../lib/gsap'

/**
 * PROBLEMA: a dor do público, com as palavras dele.
 * Fundo: amarelo (data-bg="sun").
 *
 * ANIMAÇÕES:
 * 1. Título desliza da esquerda (deslize lateral).
 * 2. Parágrafo revelado palavra por palavra conforme a rolagem
 *    (opacidade 0,12 para 1, com scrub). A pessoa "lê junto" com o scroll.
 */
export function Problem() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add(MQ.motion, () => {
        // ANIMAÇÃO 1
        gsap.from(q('[data-slide]'), {
          x: -80,
          autoAlpha: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        })

        // ANIMAÇÃO 2
        const split = SplitText.create(q('[data-scrub]'), { type: 'words' })
        gsap.fromTo(
          split.words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: q('[data-scrub]')[0], start: 'top 80%', end: 'bottom 50%', scrub: true },
          },
        )
        return () => split.revert()
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} data-bg="sun" className="px-4 py-28 md:py-40">
      <div className="mx-auto max-w-5xl">
        <h2
          data-slide
          className="max-w-4xl font-display text-[clamp(2.25rem,5.5vw,4.75rem)] leading-[1.02] font-extrabold tracking-tight text-balance"
        >
          Tem festa chegando e nada no armário?
        </h2>

        <p
          data-scrub
          className="mt-10 font-display text-[clamp(1.5rem,3.2vw,2.6rem)] leading-[1.25] font-semibold tracking-tight md:mt-14"
        >
          Convite na mão, data marcada e nenhum vestido que tenha a sua cara. Sem falar na calça esperando a barra há
          meses e no zíper que abriu justo no dia da festa. Relaxa: é exatamente isso que a Daia resolve.
        </p>
      </div>
    </section>
  )
}
