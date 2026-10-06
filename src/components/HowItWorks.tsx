import { useRef } from 'react'
import { ChatCircleDots, Confetti, Ruler, type Icon } from '@phosphor-icons/react'
import { gsap, useGSAP, MQ } from '../lib/gsap'
import { photos, type Photo } from '../data/photos'

type Step = { icon: Icon; title: string; text: string; photo: Photo }

const steps: Step[] = [
  {
    icon: ChatCircleDots,
    title: 'Chama no WhatsApp',
    text: 'Conta o que você precisa e manda uma foto ou referência. Daí a gente já conversa sobre ideia, prazo e valor.',
    photo: photos.vestido9,
  },
  {
    icon: Ruler,
    title: 'Prova e medidas',
    text: 'Você vem ao ateliê, a Daia tira suas medidas e combina cada detalhe com você. Ajusta quantas vezes precisar.',
    photo: photos.caipirinha4,
  },
  {
    icon: Confetti,
    title: 'Retira prontinho',
    text: 'No dia combinado sua peça está pronta, ajustada e caprichada. É só vestir e aproveitar.',
    photo: photos.vestido4,
  },
]

/**
 * COMO FUNCIONA (3 passos).
 * Fundo: rosa claro (data-bg="blush").
 *
 * ANIMAÇÕES:
 * - Desktop: SEÇÃO FIXADA (pin). Enquanto a pessoa rola, a seção fica parada,
 *   a linha de progresso cresce, o passo ativo acende e a foto da direita
 *   troca por cortina (clip-path de baixo para cima). Duração: 200% da altura da tela.
 * - Celular: sem pin. Cada passo entra deslizando da esquerda ao aparecer.
 */
export function HowItWorks() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      // Desktop: pin + troca de conteúdo
      mm.add(MQ.desktop, () => {
        const items = q('[data-step]')
        const imgs = q('[data-step-img]')

        gsap.from(q('[data-head]'), {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        })

        gsap.set(items.slice(1), { opacity: 0.3 })
        gsap.set(imgs.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' })

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        })

        tl.fromTo(q('[data-line-fill]'), { scaleY: 0.12 }, { scaleY: 1, ease: 'none', duration: 2 }, 0)

        for (let i = 1; i < items.length; i++) {
          const at = i - 0.6
          tl.to(items[i - 1], { opacity: 0.3, duration: 0.3 }, at)
            .to(items[i], { opacity: 1, duration: 0.3 }, at)
            .to(imgs[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6 }, at)
            .fromTo(imgs[i].querySelector('img'), { scale: 1.25 }, { scale: 1, duration: 0.8 }, at)
        }
      })

      // Celular e tablet: entrada simples por passo
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from(q('[data-head]'), {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        })
        q('[data-step]').forEach((el) => {
          gsap.from(el, {
            x: -50,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%' },
          })
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="como-funciona" ref={root} data-bg="blush" className="px-4 py-28 md:py-36 lg:py-0">
      <div className="mx-auto grid max-w-6xl gap-12 lg:min-h-[100dvh] lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <h2
            data-head
            className="font-display text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] font-extrabold tracking-tight text-balance"
          >
            Do primeiro “oi” até a peça pronta.
          </h2>

          <ol className="relative mt-12 space-y-10 pl-16">
            {/* Linha de progresso (preenche com o scroll no desktop) */}
            <span aria-hidden className="absolute top-3 bottom-3 left-[23px] hidden w-0.5 bg-ink/15 lg:block">
              <span data-line-fill className="block h-full w-full origin-top bg-ink" />
            </span>

            {steps.map(({ icon: StepIcon, title, text, photo }) => (
              <li key={title} data-step className="relative">
                <span className="absolute top-0 -left-16 flex size-12 items-center justify-center rounded-full bg-ink text-white">
                  <StepIcon weight="bold" className="size-6" aria-hidden />
                </span>
                <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h3>
                <p className="mt-2 max-w-[44ch] text-ink/80">{text}</p>

                {/* Foto do passo: no celular (e no desktop com "reduzir movimento") */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.w}
                  height={photo.h}
                  loading="lazy"
                  className="mt-6 aspect-[4/5] w-full max-w-sm rounded-[1.75rem] object-cover lg:motion-safe:hidden"
                />
              </li>
            ))}
          </ol>
        </div>

        {/* Pilha de fotos que troca com a rolagem (desktop) */}
        <div className="relative hidden h-[74dvh] max-h-[680px] lg:motion-safe:block">
          {steps.map(({ title, photo }, i) => (
            <div
              key={title}
              data-step-img
              className="absolute inset-0 overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-25px_rgba(35,16,43,0.5)]"
              style={{ zIndex: i + 1 }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                width={photo.w}
                height={photo.h}
                loading="lazy"
                className="h-full w-full object-cover object-[50%_25%]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
