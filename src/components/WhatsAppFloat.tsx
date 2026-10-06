import { useRef } from 'react'
import { WhatsappLogo } from '@phosphor-icons/react'
import { gsap, useGSAP, MQ } from '../lib/gsap'
import { WHATSAPP_URL } from '../data/site'

/**
 * Botão fixo de WhatsApp (padrão de serviço local).
 * Sempre visível. ANIMAÇÃO: entra com um "pop" 1s após a abertura,
 * depois que o hero já apareceu, para não competir com ele.
 */
export function WhatsAppFloat() {
  const ref = useRef<HTMLAnchorElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      gsap.from(ref.current, { scale: 0, rotate: -90, duration: 0.8, ease: 'back.out(1.8)', delay: 1 })
    })
    return () => mm.revert()
  })

  return (
    <a
      ref={ref}
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chamar no WhatsApp"
      className="fixed right-4 bottom-4 z-40 flex size-16 items-center justify-center rounded-full bg-cta text-white shadow-[0_14px_30px_-10px_rgba(217,15,107,0.7)] transition-colors duration-300 hover:bg-cta-dark md:right-6 md:bottom-6"
    >
      <WhatsappLogo weight="fill" className="size-8" aria-hidden />
    </a>
  )
}
