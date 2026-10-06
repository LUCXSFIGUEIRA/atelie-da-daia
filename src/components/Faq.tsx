import { useId, useRef, useState } from 'react'
import { Plus, WhatsappLogo } from '@phosphor-icons/react'
import { gsap, useGSAP, MQ } from '../lib/gsap'
import { CtaButton } from './ui/CtaButton'
import { CTA_LABEL, WHATSAPP_URL } from '../data/site'

/**
 * Perguntas respondendo às principais objeções (preço, prazo, tipo de serviço, local).
 * [CONFIRMAR] prazos e endereço com a Daia antes de publicar.
 */
const faqs = [
  {
    q: 'Quanto custa?',
    a: 'Depende da peça, do tecido e dos detalhes. Me chama no WhatsApp com uma foto ou ideia e eu passo o orçamento, sem compromisso.',
  },
  {
    q: 'Você faz vestido sob medida?',
    a: 'Faço sim! Vestido de festa, noiva, daminha, formatura, madrinha e festa junina, tudo nas suas medidas e com provas pra ajustar.',
  },
  {
    q: 'Que tipo de conserto você faz?',
    a: 'Barra, bainha, ajuste de cintura, troca de zíper, reforma e o que mais sua roupa precisar. Na dúvida, manda uma foto que eu te falo.',
  },
  {
    q: 'Quanto tempo demora?',
    a: 'Consertos simples costumam ser rápidos e vestidos levam mais tempo. O prazo certinho a gente combina na conversa. Tem data marcada? Chama com antecedência.',
  },
  {
    q: 'Faz roupa infantil e fantasia?',
    a: 'Faço! Vestido de daminha, roupa de aniversário, fantasia de personagem e vestido caipira pra criançada.',
  },
  {
    q: 'Onde fica o ateliê?',
    a: '[INSERIR ENDEREÇO / CIDADE]. Me chama no WhatsApp que eu mando a localização certinha.',
  },
]

/**
 * DÚVIDAS (FAQ + oferta "preço a consultar").
 * Fundo: lilás (data-bg="lilac").
 *
 * ANIMAÇÕES:
 * 1. Coluna do título entra com zoom suave (scale 0,92 para 1).
 * 2. Perguntas sobem em cascata.
 * 3. Abrir/fechar resposta: transição CSS de grid-rows + rotação do ícone.
 */
export function Faq() {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number | null>(0)
  const baseId = useId()

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        // ANIMAÇÃO 1
        gsap.from(q('[data-head]'), {
          scale: 0.92,
          autoAlpha: 0,
          transformOrigin: 'left center',
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        })
        // ANIMAÇÃO 2
        gsap.from(q('[data-faq]'), {
          y: 40,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: q('[data-faq-list]')[0], start: 'top 80%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="duvidas" ref={root} data-bg="lilac" className="px-4 py-28 md:py-40">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Coluna fixa com título e CTA */}
        <div data-head className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <h2 className="font-display text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] font-extrabold tracking-tight">
            Ficou alguma dúvida?
          </h2>
          <p className="mt-5 max-w-[40ch] text-lg text-ink/80">
            Cada peça é única, então o orçamento é feito na conversa, sem compromisso.
          </p>
          <div className="mt-8">
            <CtaButton href={WHATSAPP_URL} icon={<WhatsappLogo weight="fill" className="size-6" />}>
              {CTA_LABEL}
            </CtaButton>
          </div>
        </div>

        <ul data-faq-list className="space-y-3 lg:col-span-7">
          {faqs.map((item, i) => {
            const isOpen = open === i
            const panelId = `${baseId}-panel-${i}`
            const buttonId = `${baseId}-button-${i}`
            return (
              <li key={item.q} data-faq className="rounded-[1.75rem] bg-white/80 backdrop-blur">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-[64px] w-full items-center justify-between gap-4 rounded-[1.75rem] px-6 py-5 text-left font-display text-xl font-bold tracking-tight md:px-7 md:text-2xl"
                  >
                    {item.q}
                    <Plus
                      weight="bold"
                      aria-hidden
                      className={`size-6 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-45' : ''}`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[60ch] px-6 pb-6 text-ink/85 md:px-7">{item.a}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
