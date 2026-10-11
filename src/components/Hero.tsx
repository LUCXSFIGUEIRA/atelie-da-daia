import { useRef } from 'react'
import { InstagramLogo, WhatsappLogo } from '@phosphor-icons/react'
import { gsap, SplitText, useGSAP, MQ } from '../lib/gsap'
import { CtaButton } from './ui/CtaButton'
import { CTA_LABEL, INSTAGRAM_URL, WHATSAPP_URL } from '../data/site'
import { photos } from '../data/photos'

/**
 * HERO (foco em vestidos de noiva)
 * Layout: texto à esquerda; à direita, duas fotos reais de noivas em colunas
 * desencontradas (a maior começa no topo, a menor desce), como página de revista.
 * Sem colagem inclinada, sem marca-texto: as fotos fazem o trabalho.
 *
 * ANIMAÇÕES:
 * 1. Entrada coreografada (timeline): headline palavra por palavra (SplitText com máscara),
 *    subtítulo e CTAs em sequência. Tudo começa antes de 1s.
 * 2. Revelação das fotos por cortina (clip-path) + zoom de dentro para fora, uma depois da outra.
 * 3. Parallax no desktop: as duas colunas rolam em velocidades diferentes (data-speed).
 */
export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      // ANIMAÇÃO 1 e 2: entrada coreografada
      mm.add(MQ.motion, () => {
        const split = SplitText.create(q('[data-hero-title]'), { type: 'words', mask: 'words' })

        const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1 }, delay: 0.1 })
        tl.from(split.words, { yPercent: 110, stagger: 0.06 }, 0)
          .from(q('[data-hero-sub]'), { y: 24, autoAlpha: 0, duration: 0.8 }, 0.35)
          .from(q('[data-hero-cta] > *'), { y: 20, autoAlpha: 0, stagger: 0.08, duration: 0.7 }, 0.45)
          .fromTo(
            q('[data-hero-photo]'),
            { clipPath: 'inset(100% 0% 0% 0% round 1.75rem)' },
            { clipPath: 'inset(0% 0% 0% 0% round 1.75rem)', duration: 1.3, ease: 'expo.inOut', stagger: 0.18 },
            0.1,
          )
          .from(q('[data-hero-photo] img'), { scale: 1.25, duration: 1.6, stagger: 0.18 }, 0.1)

        return () => split.revert()
      })

      // ANIMAÇÃO 3: parallax em camadas (só desktop)
      mm.add(MQ.desktop, () => {
        q('[data-speed]').forEach((el) => {
          gsap.to(el, {
            yPercent: -Number((el as HTMLElement).dataset.speed),
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
          })
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      id="topo"
      ref={root}
      data-bg="blush"
      className="relative flex min-h-[100dvh] items-center px-4 pt-24 pb-16 lg:pb-10"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Texto */}
        <div className="lg:col-span-6">
          <h1
            data-hero-title
            className="max-w-[18ch] font-display text-[clamp(2.4rem,4.4vw,3.75rem)] leading-[1.04] font-extrabold tracking-tight text-balance"
          >
            Seu vestido de noiva, feito sob medida pela Daia.
          </h1>

          <p data-hero-sub className="mt-6 max-w-[36ch] text-lg leading-relaxed text-ink/80 md:text-xl">
            Desenhado com você e ajustado prova a prova até o dia do sim. Também tem festa, infantil e consertos.
          </p>

          <div data-hero-cta className="mt-9 flex flex-wrap items-center gap-3">
            <div>
              <CtaButton href={WHATSAPP_URL} icon={<WhatsappLogo weight="fill" className="size-6" />}>
                {CTA_LABEL}
              </CtaButton>
            </div>
            <div>
              <CtaButton href={INSTAGRAM_URL} variant="outline" icon={<InstagramLogo weight="bold" className="size-6" />}>
                Ver no Instagram
              </CtaButton>
            </div>
          </div>
        </div>

        {/* Duas noivas em colunas desencontradas, com parallax em velocidades diferentes.
            Celular: só a foto principal, em largura total, para a noiva aparecer inteira. */}
        <div className="flex items-start gap-3 sm:gap-4 lg:col-span-6 lg:gap-5">
          <div data-speed="6" className="w-full sm:w-[60%]">
            <div
              data-hero-photo
              className="aspect-[4/5] overflow-hidden sm:aspect-auto sm:h-[min(112vw,560px)] rounded-[1.75rem] bg-ink shadow-[0_30px_60px_-28px_rgba(35,16,43,0.55)] lg:h-[min(78dvh,680px)]"
            >
              <img
                src={photos.noiva4.src}
                alt={photos.noiva4.alt}
                width={photos.noiva4.w}
                height={photos.noiva4.h}
                fetchPriority="high"
                className="h-full w-full object-cover object-[50%_100%] sm:object-[46%_62%]"
              />
            </div>
          </div>

          <div data-speed="18" className="mt-[22%] hidden w-[40%] sm:block lg:mt-[16%]">
            <div
              data-hero-photo
              className="h-[min(76vw,380px)] overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-28px_rgba(35,16,43,0.5)] lg:h-[min(54dvh,460px)]"
            >
              <img
                src={photos.noiva3.src}
                alt={photos.noiva3.alt}
                width={photos.noiva3.w}
                height={photos.noiva3.h}
                className="h-full w-full object-cover object-[50%_30%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
