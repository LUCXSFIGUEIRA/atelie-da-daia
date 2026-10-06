import { useRef } from 'react'
import { Quotes, WhatsappLogo } from '@phosphor-icons/react'
import { gsap, useGSAP, MQ } from '../lib/gsap'
import { CtaButton } from './ui/CtaButton'
import { CTA_LABEL, WHATSAPP_URL } from '../data/site'

/**
 * DEPOIMENTOS
 * Não foram fornecidos depoimentos reais, então os espaços estão marcados.
 * Substitua "quote", "name" e "occasion" por falas REAIS de clientes
 * (com autorização). Dica: copie de comentários e directs do Instagram.
 */
const testimonials = [
  {
    quote: '[INSERIR DEPOIMENTO REAL]',
    name: '[Nome da cliente]',
    occasion: '[Ocasião, ex.: madrinha de casamento]',
    tone: 'bg-white',
    tilt: '-rotate-2',
  },
  {
    quote: '[INSERIR DEPOIMENTO REAL]',
    name: '[Nome da cliente]',
    occasion: '[Ocasião, ex.: conserto de vestido]',
    tone: 'bg-sun',
    tilt: 'rotate-1 lg:mt-14',
  },
  {
    quote: '[INSERIR DEPOIMENTO REAL]',
    name: '[Nome da cliente]',
    occasion: '[Ocasião, ex.: festa junina da escola]',
    tone: 'bg-lilac',
    tilt: '-rotate-1',
  },
]

/**
 * Fundo: continua verde-menta (data-bg="mint").
 *
 * ANIMAÇÃO: os cards "caem" como bilhetes colados na parede: vêm de cima,
 * girando, e assentam com um leve quique (back.out). Cascata de 0,15s.
 */
export function Testimonials() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from(q('[data-head]'), {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        })
        gsap.from(q('[data-note]'), {
          y: -90,
          rotation: (i: number) => [-14, 10, -8][i % 3],
          autoAlpha: 0,
          stagger: 0.15,
          duration: 1,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: q('[data-notes]')[0], start: 'top 80%' },
        })
        gsap.from(q('[data-cta]'), {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: q('[data-cta]')[0], start: 'top 90%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="depoimentos" ref={root} data-bg="mint" className="px-4 pt-10 pb-28 md:pb-40 lg:pt-32">
      <div className="mx-auto max-w-6xl">
        <h2
          data-head
          className="font-display text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] font-extrabold tracking-tight"
        >
          O que as clientes dizem
        </h2>

        <div data-notes className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              data-note
              className={`rounded-[1.75rem] p-7 shadow-[0_20px_40px_-24px_rgba(35,16,43,0.45)] md:p-8 ${t.tone} ${t.tilt}`}
            >
              <Quotes weight="fill" aria-hidden className="size-9 text-ink/80" />
              <blockquote className="mt-4 font-display text-xl leading-snug font-semibold tracking-tight md:text-2xl">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 text-[16px]">
                <span className="block font-semibold">{t.name}</span>
                <span className="text-ink/70">{t.occasion}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div data-cta className="mt-16 flex justify-center">
          <CtaButton href={WHATSAPP_URL} icon={<WhatsappLogo weight="fill" className="size-6" />}>
            {CTA_LABEL}
          </CtaButton>
        </div>
      </div>
    </section>
  )
}
