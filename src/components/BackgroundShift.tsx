import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

const COLORS = {
  blush: 'bg-blush',
  sun: 'bg-sun',
  lilac: 'bg-lilac',
  mint: 'bg-mint',
} as const

export type BgKey = keyof typeof COLORS

/**
 * Transição de cor de fundo entre seções.
 *
 * Como funciona: cada <section data-bg="sun|lilac|mint|blush"> avisa qual cor
 * quer de fundo. Aqui ficam 4 camadas fixas atrás da página e só a
 * opacidade delas muda (60fps, sem repintar o fundo).
 *
 * Este componente precisa ser renderizado DEPOIS das seções (fim do App),
 * para que as seções fixadas (pin) já tenham criado seus espaçamentos.
 */
export function BackgroundShift() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const layers = gsap.utils.toArray<HTMLElement>('[data-layer]', root.current)
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      let current: string | null = null

      const show = (key: string) => {
        if (key === current) return
        current = key
        gsap.to(layers, {
          autoAlpha: (_i: number, el: HTMLElement) => (el.dataset.layer === key ? 1 : 0),
          duration: reduce ? 0 : 0.9,
          ease: 'power2.out',
          overwrite: true,
        })
      }

      // ANIMAÇÃO: troca de cor quando o meio da tela entra em uma nova seção
      // Busca no documento inteiro (não dentro do "scope" deste componente)
      document.querySelectorAll<HTMLElement>('section[data-bg]').forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && show(section.dataset.bg ?? 'blush'),
        })
      })

      show('blush')
    },
    { scope: root },
  )

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {Object.entries(COLORS).map(([key, cls]) => (
        <div
          key={key}
          data-layer={key}
          className={`absolute inset-0 ${cls}`}
          style={{ opacity: key === 'blush' ? 1 : 0 }}
        />
      ))}
    </div>
  )
}
