import { useRef } from 'react'
import { InstagramLogo, WhatsappLogo } from '@phosphor-icons/react'
import { gsap, SplitText, useGSAP, MQ } from '../lib/gsap'
import { CtaButton } from './ui/CtaButton'
import { CTA_LABEL, INSTAGRAM_URL, WHATSAPP_URL } from '../data/site'
import { photos } from '../data/photos'

/**
 * HERO
 * Layout: texto à esquerda, colagem de 3 fotos reais à direita.
 *
 * ANIMAÇÕES:
 * 1. Entrada coreografada (timeline): headline palavra por palavra (SplitText com máscara),
 *    marca-texto amarelo, subtítulo, CTAs e fotos em sequência. Tudo começa antes de 1s.
 * 2. Revelação da foto principal por cortina (clip-path) + zoom de dentro para fora.
 * 3. Parallax em camadas no desktop: cada foto rola em uma velocidade (data-speed).
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
          .from(q('[data-hero-mark]'), { scaleX: 0, duration: 0.8, ease: 'power3.out' }, 0.55)
          .from(q('[data-hero-sub]'), { y: 24, autoAlpha: 0, duration: 0.8 }, 0.35)
          .from(q('[data-hero-cta] > *'), { y: 20, autoAlpha: 0, stagger: 0.08, duration: 0.7 }, 0.45)
          .fromTo(
            q('[data-hero-main]'),
            { clipPath: 'inset(100% 0% 0% 0% round 1.75rem)' },
            { clipPath: 'inset(0% 0% 0% 0% round 1.75rem)', duration: 1.2, ease: 'expo.inOut' },
            0.15,
          )
          .from(q('[data-hero-main] img'), { scale: 1.3, duration: 1.4 }, 0.15)
          .from(q('[data-hero-float]'), { y: 70, autoAlpha: 0, stagger: 0.12, duration: 1 }, 0.55)

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
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Texto */}
        <div className="lg:col-span-7">
          <h1
            data-hero-title
            className="max-w-3xl font-display text-[clamp(2.6rem,6vw,5rem)] leading-[1.02] font-extrabold tracking-tight text-balance"
          >
            Vestidos lindos e consertos{' '}
            <span className="relative isolate inline-block">
              <span
                data-hero-mark
                aria-hidden
                className="absolute inset-x-[-0.08em] bottom-[0.08em] -z-10 h-[0.38em] origin-left rounded-full bg-sun"
              />
              caprichados.
            </span>
          </h1>

          <p data-hero-sub className="mt-6 max-w-[34ch] text-lg leading-relaxed text-ink/80 md:text-xl">
            Da festa junina ao casamento: a Daia faz seu vestido e deixa aquela roupa parada novinha de novo.
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

        {/* Colagem de fotos com parallax em camadas */}
        <div className="relative mx-auto h-[min(118vw,520px)] w-full max-w-[460px] lg:col-span-5 lg:h-[min(76dvh,640px)] lg:max-w-none">
          <div data-speed="8" className="absolute top-0 right-0 h-[86%] w-[76%]">
            <div data-hero-main className="h-full w-full overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-25px_rgba(35,16,43,0.5)]">
              <img
                src={photos.vestido3.src}
                alt={photos.vestido3.alt}
                width={photos.vestido3.w}
                height={photos.vestido3.h}
                fetchPriority="high"
                className="h-full w-full object-cover object-[50%_30%]"
              />
            </div>
          </div>

          <div data-speed="22" className="absolute bottom-0 left-0 w-[44%]">
            <div data-hero-float className="-rotate-6 overflow-hidden rounded-[1.75rem] border-[6px] border-white shadow-[0_24px_50px_-20px_rgba(35,16,43,0.55)]">
              <img
                src={photos.noiva1.src}
                alt={photos.noiva1.alt}
                width={photos.noiva1.w}
                height={photos.noiva1.h}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
          </div>

          <div data-speed="40" className="absolute top-[8%] left-[2%] w-[30%]">
            <div data-hero-float className="rotate-6 overflow-hidden rounded-[1.75rem] border-[6px] border-white shadow-[0_24px_50px_-20px_rgba(35,16,43,0.55)]">
              <img
                src={photos.infantil2.src}
                alt={photos.infantil2.alt}
                width={photos.infantil2.w}
                height={photos.infantil2.h}
                className="aspect-square w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
