import { useRef } from 'react'
import { Scissors, WhatsappLogo } from '@phosphor-icons/react'
import { gsap, useGSAP, MQ } from '../lib/gsap'
import { CtaButton } from './ui/CtaButton'
import { CTA_LABEL, WHATSAPP_URL } from '../data/site'
import { photos, type Photo } from '../data/photos'

type Service = { title: string; text: string; photo: Photo; className: string; position?: string }

/**
 * Bento grid (desktop, 4 colunas x 3 linhas, sem células vazias):
 *   linha 1: [Festa Festa] [Noiva Noiva]
 *   linha 2: [Festa Festa] [Infantil] [Junina]
 *   linha 3: [Consertos  Consertos  Consertos  Consertos]
 * Tablet: 2 colunas. Celular: 1 coluna.
 */
const services: Service[] = [
  {
    title: 'Vestidos de festa',
    text: 'Madrinha, formatura, aniversário. Um vestido que veste bem e faz você se sentir linda.',
    photo: photos.vestido7,
    className: 'md:col-span-2 lg:row-span-2 h-[460px] md:h-[520px] lg:h-auto',
  },
  {
    title: 'Noivas',
    text: 'Seu vestido de noiva feito com calma, prova a prova, até ficar do jeitinho que você sonhou.',
    photo: photos.noiva2,
    className: 'md:col-span-2 h-[420px] lg:h-auto',
    position: 'object-[50%_25%]',
  },
  {
    title: 'Infantil e fantasias',
    text: 'Daminha, aniversário e aquela fantasia que a criança pediu.',
    photo: photos.infantil3,
    className: 'h-[420px] lg:h-auto',
  },
  {
    title: 'Festa junina',
    text: 'Vestido caipira cheio de babado pra arrasar no arraiá.',
    photo: photos.caipirinha4,
    className: 'h-[420px] lg:h-auto',
  },
]

/**
 * SERVIÇOS (solução em benefícios).
 * Fundo: lilás (data-bg="lilac").
 *
 * ANIMAÇÕES:
 * 1. Título sobe com fade.
 * 2. Cards entram em cascata (stagger) com zoom suave; a foto de dentro faz zoom out.
 * 3. Tesoura do card de consertos gira com a rolagem (scrub).
 * 4. Microinteração: inclinação 3D dos cards seguindo o mouse (só desktop).
 */
export function Services() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add(MQ.motion, () => {
        // ANIMAÇÃO 1
        gsap.from(q('[data-head] > *'), {
          y: 50,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        })

        // ANIMAÇÃO 2
        gsap.from(q('[data-card]'), {
          scale: 0.9,
          y: 60,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: q('[data-grid]')[0], start: 'top 80%' },
        })
        gsap.from(q('[data-card-img]'), {
          scale: 1.25,
          stagger: 0.12,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: q('[data-grid]')[0], start: 'top 80%' },
        })

        // ANIMAÇÃO 3
        gsap.fromTo(
          q('[data-scissors]'),
          { rotate: -30 },
          {
            rotate: 30,
            ease: 'none',
            scrollTrigger: { trigger: q('[data-scissors]')[0], start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })

      // ANIMAÇÃO 4: tilt 3D
      mm.add(MQ.finePointer, () => {
        const cards = q('[data-tilt]') as HTMLElement[]
        const cleanups = cards.map((card) => {
          gsap.set(card, { transformPerspective: 900 })
          const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' })
          const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' })
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect()
            ry(((e.clientX - r.left) / r.width - 0.5) * 8)
            rx(-((e.clientY - r.top) / r.height - 0.5) * 8)
          }
          const leave = () => {
            rx(0)
            ry(0)
          }
          card.addEventListener('pointermove', move)
          card.addEventListener('pointerleave', leave)
          return () => {
            card.removeEventListener('pointermove', move)
            card.removeEventListener('pointerleave', leave)
          }
        })
        return () => cleanups.forEach((fn) => fn())
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="servicos" ref={root} data-bg="lilac" className="px-4 py-28 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div data-head className="max-w-3xl">
          <h2 className="font-display text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.02] font-extrabold tracking-tight text-balance">
            Um ateliê pra cada momento seu.
          </h2>
          <p className="mt-5 max-w-[52ch] text-lg text-ink/80 md:text-xl">
            Vestido pra arrasar na festa ou aquela roupa que só precisa de um ajuste: aqui tem jeito pra tudo.
          </p>
        </div>

        <div
          data-grid
          className="mt-14 grid grid-flow-dense grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:grid-rows-[300px_300px_auto]"
        >
          {services.map((s) => (
            <article
              key={s.title}
              data-card
              data-tilt
              className={`group relative overflow-hidden rounded-[1.75rem] bg-ink will-change-transform ${s.className}`}
            >
              <img
                data-card-img
                src={s.photo.src}
                alt={s.photo.alt}
                width={s.photo.w}
                height={s.photo.h}
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${s.position ?? 'object-[50%_20%]'}`}
              />
              <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-7">
                <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{s.title}</h3>
                <p className="mt-2 max-w-[40ch] text-[16px] leading-snug text-white/90">{s.text}</p>
              </div>
            </article>
          ))}

          {/* Card de consertos: largura total, sem foto (não há foto de conserto ainda) */}
          <article
            id="consertos"
            data-card
            className="relative flex scroll-mt-28 flex-col gap-8 overflow-hidden rounded-[1.75rem] bg-sun p-7 md:col-span-2 md:p-10 lg:col-span-4 lg:flex-row lg:items-center lg:justify-between lg:p-12"
          >
            <Scissors
              data-scissors
              weight="duotone"
              aria-hidden
              className="pointer-events-none absolute -right-6 -bottom-10 size-48 text-ink/10 md:size-64"
            />
            <div className="relative max-w-2xl">
              <h3 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
                Consertos e ajustes de qualquer peça
              </h3>
              <p className="mt-4 max-w-[52ch] text-lg text-ink/85">
                Barra, bainha, cintura, zíper, reforma. Sua roupa volta firme, bonita e do seu tamanho.
              </p>
            </div>
            <CtaButton
              href={WHATSAPP_URL}
              className="relative self-start lg:self-center"
              icon={<WhatsappLogo weight="fill" className="size-6" />}
            >
              {CTA_LABEL}
            </CtaButton>
          </article>
        </div>
      </div>
    </section>
  )
}
