import { useRef } from 'react'
import { CheckCircle } from '@phosphor-icons/react'
import { gsap, useGSAP, MQ } from '../lib/gsap'
import { photos } from '../data/photos'

// [CONFIRMAR] Diferenciais de qualidade. Ajuste para o que é verdade no ateliê.
const quality = [
  'Acabamento bonito por dentro e por fora',
  'Prova e ajuste até ficar perfeito no seu corpo',
  'Costura firme, feita pra durar muitas festas',
]

/**
 * SOBRE A DAIA (autoridade + proximidade + diferencial: QUALIDADE).
 * Fundo: amarelo (data-bg="sun").
 *
 * ANIMAÇÕES:
 * 1. Foto revelada por CORTINA: uma camada lilás sobe (scaleY de 1 para 0) e a foto faz zoom out.
 * 2. Parallax leve no quadro da foto (só desktop).
 * 3. Texto e lista entram deslizando da DIREITA, em cascata.
 */
export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%' } })
        // ANIMAÇÃO 1
        tl.fromTo(q('[data-curtain]'), { scaleY: 1 }, { scaleY: 0, duration: 1.1, ease: 'expo.inOut' }, 0)
          .from(q('[data-about-img]'), { scale: 1.3, duration: 1.4, ease: 'expo.out' }, 0.2)
          // ANIMAÇÃO 3
          .from(
            q('[data-about-text] > *'),
            { x: 70, autoAlpha: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out' },
            0.25,
          )
      })

      // ANIMAÇÃO 2
      mm.add(MQ.desktop, () => {
        gsap.fromTo(
          q('[data-about-frame]'),
          { yPercent: 6 },
          {
            yPercent: -6,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="sobre" ref={root} data-bg="sun" className="px-4 py-28 md:py-40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div data-about-frame className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_60px_-25px_rgba(35,16,43,0.45)]">
            <img
              data-about-img
              src={photos.daia.src}
              alt={photos.daia.alt}
              width={photos.daia.w}
              height={photos.daia.h}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover object-[35%_30%]"
            />
            <div data-curtain aria-hidden className="absolute inset-0 origin-top bg-lilac motion-reduce:hidden" />
          </div>
        </div>

        <div data-about-text className="lg:col-span-6 lg:col-start-7">
          <h2 className="font-display text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] font-extrabold tracking-tight">
            Oi, eu sou a Daia!
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink/85">
            Costuro com o mesmo cuidado que teria com uma roupa minha. Cada ponto, cada barra e cada ajuste passam pela
            minha mão até ficar do jeito que você imaginou.
          </p>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink/85">
            Pra mim, qualidade é isso: você vestir e nem lembrar que a roupa foi ajustada. Só lembrar que ficou linda.
          </p>
          <ul className="mt-8 space-y-3">
            {quality.map((item) => (
              <li key={item} className="flex items-start gap-3 text-lg font-medium">
                <CheckCircle weight="fill" aria-hidden className="mt-0.5 size-7 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
