import { useRef } from 'react'
import { InstagramLogo, WhatsappLogo } from '@phosphor-icons/react'
import { gsap, SplitText, useGSAP, MQ } from '../lib/gsap'
import { CtaButton } from './ui/CtaButton'
import { CTA_LABEL, INSTAGRAM_URL, WHATSAPP_DISPLAY, WHATSAPP_URL } from '../data/site'

/**
 * CTA FINAL
 * Bloco escuro (ink) que fecha a página. Urgência honesta: só lembra que
 * quem tem data marcada deve chamar antes, sem escassez inventada.
 *
 * ANIMAÇÕES:
 * 1. Headline letra por letra, subindo e girando com quique (SplitText chars).
 * 2. Subtítulo e botões sobem em sequência.
 * 3. Botão principal com PULSO (anel) e BRILHO percorrendo (CSS, index.css).
 * 4. Manchas de cor ao fundo com parallax em velocidades diferentes (só desktop).
 */
export function FinalCta() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add(MQ.motion, () => {
        const split = SplitText.create(q('[data-final-title]'), { type: 'words,chars' })
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 65%' } })
        // ANIMAÇÃO 1
        tl.from(split.chars, {
          yPercent: 100,
          rotation: 12,
          autoAlpha: 0,
          stagger: 0.02,
          duration: 0.8,
          ease: 'back.out(1.7)',
        })
          // ANIMAÇÃO 2
          .from(q('[data-final-sub]'), { y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
          .from(q('[data-final-cta] > *'), { y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        return () => split.revert()
      })

      // ANIMAÇÃO 4
      mm.add(MQ.desktop, () => {
        q('[data-blob]').forEach((el) => {
          gsap.to(el, {
            yPercent: -Number((el as HTMLElement).dataset.blob),
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      id="contato"
      ref={root}
      className="relative overflow-hidden rounded-t-[2.5rem] bg-ink px-4 pt-28 pb-24 text-white md:rounded-t-[4rem] md:pt-40 md:pb-32"
    >
      {/* Manchas decorativas com parallax */}
      <div
        data-blob="30"
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(228,215,255,0.28),transparent_65%)]"
      />
      <div
        data-blob="60"
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 size-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,225,90,0.22),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <h2
          data-final-title
          className="font-display text-[clamp(2.6rem,7vw,6rem)] leading-[1.02] font-extrabold tracking-tight text-balance"
        >
          Bora deixar seu look pronto?
        </h2>
        <p data-final-sub className="mx-auto mt-7 max-w-[46ch] text-lg text-white/85 md:text-xl">
          Me chama no WhatsApp, conta o que você precisa e receba seu orçamento. Tem data marcada? Chama com antecedência
          pra garantir o prazo.
        </p>

        <div data-final-cta className="mt-12 flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div>
              <CtaButton href={WHATSAPP_URL} pulse shine icon={<WhatsappLogo weight="fill" className="size-6" />}>
                {CTA_LABEL}
              </CtaButton>
            </div>
            <div>
              <CtaButton href={INSTAGRAM_URL} variant="light" icon={<InstagramLogo weight="bold" className="size-6" />}>
                Ver no Instagram
              </CtaButton>
            </div>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-2xl font-bold tracking-tight underline decoration-white/30 underline-offset-8 transition-colors hover:decoration-white"
          >
            {WHATSAPP_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  )
}
