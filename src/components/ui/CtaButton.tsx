import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, MQ } from '../../lib/gsap'

type Variant = 'primary' | 'outline' | 'light'

type CtaButtonProps = {
  href: string
  children: ReactNode
  icon?: ReactNode
  variant?: Variant
  size?: 'md' | 'sm'
  /** Anel pulsando atrás do botão (usado no CTA final) */
  pulse?: boolean
  /** Brilho percorrendo o botão (usado no CTA final) */
  shine?: boolean
  /** Efeito magnético no desktop */
  magnetic?: boolean
  className?: string
  ariaLabel?: string
}

const variants: Record<Variant, { base: string; fill: string }> = {
  // Única cor de destaque da página: rosa, só nos CTAs
  primary: { base: 'bg-cta text-white', fill: 'bg-cta-dark' },
  outline: { base: 'border-2 border-ink text-ink hover:text-white', fill: 'bg-ink' },
  light: { base: 'border-2 border-white/70 text-white hover:text-ink', fill: 'bg-white' },
}

const sizes = {
  md: 'min-h-[56px] px-7 py-4 text-[17px]',
  sm: 'min-h-[48px] px-5 py-3 text-[16px]',
}

/**
 * Botão de ação reutilizado em toda a página.
 *
 * ANIMAÇÕES:
 * 1. Preenchimento no hover: camada que sobe de baixo (CSS transform scaleY).
 * 2. Magnético: o botão segue levemente o cursor (gsap.quickTo em x/y).
 *    Só em desktop com mouse e sem "reduzir movimento".
 * 3. Pulso e brilho opcionais (classes .cta-pulse e .cta-shine em index.css).
 */
export function CtaButton({
  href,
  children,
  icon,
  variant = 'primary',
  size = 'md',
  pulse = false,
  shine = false,
  magnetic = true,
  className = '',
  ariaLabel,
}: CtaButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const external = href.startsWith('http')
  const v = variants[variant]

  // ANIMAÇÃO: efeito magnético
  useGSAP(
    () => {
      const el = ref.current
      if (!magnetic || !el) return
      const mm = gsap.matchMedia()
      mm.add(MQ.finePointer, () => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          xTo((e.clientX - (r.left + r.width / 2)) * 0.25)
          yTo((e.clientY - (r.top + r.height / 2)) * 0.35)
        }
        const onLeave = () => {
          xTo(0)
          yTo(0)
        }
        el.addEventListener('pointermove', onMove)
        el.addEventListener('pointerleave', onLeave)
        return () => {
          el.removeEventListener('pointermove', onMove)
          el.removeEventListener('pointerleave', onLeave)
        }
      })
      return () => mm.revert()
    },
    { dependencies: [magnetic] },
  )

  return (
    <span className={`relative inline-flex ${className}`}>
      {pulse && (
        <span
          aria-hidden
          className="cta-pulse pointer-events-none absolute inset-0 rounded-full bg-cta"
        />
      )}
      <a
        ref={ref}
        href={href}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={`group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-semibold whitespace-nowrap transition-colors duration-300 active:scale-[0.98] ${sizes[size]} ${v.base}`}
      >
        {/* Camada de preenchimento no hover */}
        <span
          aria-hidden
          className={`absolute inset-0 origin-bottom scale-y-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 ${v.fill}`}
        />
        {/* Brilho percorrendo o botão */}
        {shine && (
          <span
            aria-hidden
            className="cta-shine pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-white/35"
          />
        )}
        {icon && <span className="relative z-10 flex shrink-0">{icon}</span>}
        <span className="relative z-10">{children}</span>
      </a>
    </span>
  )
}
