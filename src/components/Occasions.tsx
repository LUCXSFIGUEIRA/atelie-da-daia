import { useEffect, useRef, useState } from 'react'
import { WhatsappLogo } from '@phosphor-icons/react'
import { gsap, useGSAP, MQ } from '../lib/gsap'
import { CtaButton } from './ui/CtaButton'
import { CTA_LABEL, whatsappUrl } from '../data/site'
import { photos, type Photo } from '../data/photos'

type Occasion = { label: string; phrase: string; photo: Photo }

/**
 * Ocasiões da frase "Oi, Daia! Preciso de ___".
 * "phrase" completa a frase na tela E vira a mensagem pronta do WhatsApp.
 */
const occasions: Occasion[] = [
  { label: 'Madrinha', phrase: 'um vestido de madrinha', photo: photos.vestido7 },
  { label: 'Formatura', phrase: 'um vestido de formatura', photo: photos.vestido10 },
  { label: 'Noiva', phrase: 'um vestido de noiva', photo: photos.noiva3 },
  { label: 'Festa junina', phrase: 'um vestido de festa junina', photo: photos.caipirinha1 },
  { label: 'Infantil', phrase: 'uma roupa pra minha filha', photo: photos.infantil1 },
  { label: 'Conserto', phrase: 'um conserto na minha roupa', photo: photos.daia },
]

const AUTO_MS = 2800

/**
 * SELETOR DE OCASIÃO (substitui a faixa rolante).
 * A cliente escolhe a ocasião, a frase se completa e o botão abre o WhatsApp
 * com a mensagem já escrita. Fundo: rosa claro (data-bg="blush").
 *
 * ANIMAÇÕES:
 * 1. Entrada: frase sobe por máscara, etiquetas em cascata, foto em zoom suave.
 * 2. Troca de ocasião: a frase nova sobe por baixo e a foto nova é revelada
 *    por cortina (clip-path) por cima da anterior.
 * 3. Alternância automática a cada 2,8s enquanto a seção está visível e ninguém
 *    tocou. Para no primeiro toque. Desligada com "reduzir movimento".
 */
export function Occasions() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [touched, setTouched] = useState(false)
  const [inView, setInView] = useState(false)

  const activeRef = useRef(0)

  const select = (i: number, byUser: boolean) => {
    if (byUser) setTouched(true)
    if (i === activeRef.current) return
    setPrev(activeRef.current)
    setActive(i)
    activeRef.current = i
  }

  // Detecta se a seção está na tela (para a alternância automática)
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // ANIMAÇÃO 3: alternância automática
  useEffect(() => {
    if (touched || !inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => select((activeRef.current + 1) % occasions.length, false), AUTO_MS)
    return () => window.clearInterval(id)
  }, [touched, inView])

  // ANIMAÇÃO 1: entrada da seção
  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%' } })
        tl.from(q('[data-intro] > *'), { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.08 })
          .from(q('[data-chip]'), { y: 24, autoAlpha: 0, stagger: 0.05, duration: 0.6, ease: 'power3.out' }, 0.3)
          .from(q('[data-pick-cta]'), { y: 24, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, 0.5)
          .from(q('[data-pick-frame]'), { scale: 0.9, autoAlpha: 0, duration: 1.1, ease: 'expo.out' }, 0.15)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  // ANIMAÇÃO 2: troca de ocasião
  useGSAP(
    () => {
      if (prev === null) return
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.fromTo(q('[data-phrase]'), { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'expo.out' })
        const photo = q(`[data-pick-photo="${active}"]`)
        gsap.fromTo(
          photo,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' },
        )
        gsap.fromTo(photo[0]?.querySelector('img') ?? [], { scale: 1.15 }, { scale: 1, duration: 1, ease: 'expo.out' })
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [active] },
  )

  const current = occasions[active]
  const message = `Oi, Daia! Vim pelo site e preciso de ${current.phrase}.`

  return (
    <section id="ocasioes" ref={root} data-bg="blush" className="px-4 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <h2 className="font-display text-[clamp(2.2rem,4.4vw,3.9rem)] leading-[1.08] font-extrabold tracking-tight">
            <span data-intro className="block overflow-hidden pb-1">
              <span className="block">Oi, Daia! Preciso de</span>
            </span>
            {/* Frase variável: altura reservada para 2 linhas, sem pulo de layout */}
            <span className="block min-h-[2.3em] overflow-hidden pb-1">
              <span key={active} data-phrase className="block" aria-live={touched ? 'polite' : 'off'}>
                <span className="rounded-xl bg-sun box-decoration-clone px-2">{current.phrase}</span>.
              </span>
            </span>
          </h2>

          <div role="group" aria-label="Escolha a ocasião" className="mt-8 flex flex-wrap gap-2.5">
            {occasions.map((o, i) => {
              const on = i === active
              return (
                <button
                  key={o.label}
                  data-chip
                  type="button"
                  aria-pressed={on}
                  onClick={() => select(i, true)}
                  className={`min-h-[48px] rounded-full border-2 px-5 py-2 text-[16px] font-semibold transition-colors duration-300 ${
                    on ? 'border-ink bg-ink text-white' : 'border-ink/25 bg-white/70 text-ink hover:border-ink'
                  }`}
                >
                  {o.label}
                </button>
              )
            })}
          </div>

          <div data-pick-cta className="mt-10">
            <CtaButton href={whatsappUrl(message)} icon={<WhatsappLogo weight="fill" className="size-6" />}>
              {CTA_LABEL}
            </CtaButton>
            <p className="mt-3 text-[16px] text-ink/70">A mensagem já vai escrita, é só enviar.</p>
          </div>
        </div>

        {/* Fotos empilhadas: a ativa fica por cima, a anterior logo abaixo */}
        <div
          data-pick-frame
          className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-25px_rgba(35,16,43,0.5)] lg:col-span-5 lg:max-w-md"
        >
          {occasions.map((o, i) => (
            <div
              key={o.label}
              data-pick-photo={i}
              aria-hidden={i !== active}
              className="absolute inset-0"
              style={{ zIndex: i === active ? 2 : i === prev ? 1 : 0, visibility: i === active || i === prev ? 'visible' : 'hidden' }}
            >
              <img
                src={o.photo.src}
                alt={i === active ? o.photo.alt : ''}
                width={o.photo.w}
                height={o.photo.h}
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
