import { useRef } from 'react'
import { Scissors, WhatsappLogo } from '@phosphor-icons/react'
import { gsap, useGSAP, MQ } from '../lib/gsap'
import { CtaButton } from './ui/CtaButton'
import { WHATSAPP_URL } from '../data/site'

const links = [
  { href: '#servicos', label: 'Vestidos' },
  { href: '#consertos', label: 'Consertos' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#duvidas', label: 'Dúvidas' },
]

/**
 * Menu flutuante em formato de pílula (vidro fosco).
 * ANIMAÇÃO: desce do topo logo na abertura da página (0,2s de atraso).
 */
export function Navbar() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from(root.current, { yPercent: -150, duration: 1, ease: 'expo.out', delay: 0.2 })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <header ref={root} className="fixed inset-x-0 top-3 z-40 px-4">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 rounded-full border border-ink/10 bg-white/80 pr-2 pl-5 shadow-[0_12px_40px_-18px_rgba(35,16,43,0.45)] backdrop-blur-xl"
      >
        <a href="#topo" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight md:text-xl">
          <Scissors weight="bold" className="size-6" aria-hidden />
          Ateliê da Daia
        </a>

        <ul className="hidden items-center gap-8 text-[16px] font-medium lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="relative py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-300 hover:after:scale-x-100">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <CtaButton href={WHATSAPP_URL} size="sm" icon={<WhatsappLogo weight="fill" className="size-5" />} ariaLabel="Chamar no WhatsApp">
          <span className="hidden sm:inline">Chamar no </span>WhatsApp
        </CtaButton>
      </nav>
    </header>
  )
}
