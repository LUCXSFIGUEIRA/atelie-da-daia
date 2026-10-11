import { useEffect, useRef, type PointerEvent } from 'react'
import { CaretLeft, CaretRight, X } from '@phosphor-icons/react'
import { gsap, MQ } from '../lib/gsap'
import type { Photo } from '../data/photos'

type LightboxProps = {
  photos: Photo[]
  /** Foto aberta; null = fechado */
  index: number | null
  onChange: (index: number) => void
  onClose: () => void
}

/**
 * Foto ampliada em tela cheia (usada pela galeria).
 *
 * Usa o <dialog> nativo: fica na camada do topo (acima do pin da galeria),
 * prende o foco, fecha com Esc e devolve o foco à foto clicada.
 * Navegação: setas na tela, setas do teclado e arrastar para o lado no celular.
 * data-lenis-prevent impede a rolagem suave de mexer na página por trás.
 *
 * ANIMAÇÃO: a foto entra com fade + leve zoom a cada troca (desligada com "reduzir movimento").
 */
export function Lightbox({ photos, index, onChange, onClose }: LightboxProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const startX = useRef<number | null>(null)

  const open = index !== null
  const photo = open ? photos[index] : null
  const go = (step: number) => {
    if (index !== null) onChange((index + step + photos.length) % photos.length)
  }

  // Abre/fecha o <dialog> e trava a rolagem da página enquanto estiver aberto
  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && d.open) {
      d.close()
    }
  }, [open])

  useEffect(() => () => void (document.documentElement.style.overflow = ''), [])

  // ANIMAÇÃO: entrada da foto
  useEffect(() => {
    if (index === null || !img.current || !window.matchMedia(MQ.motion).matches) return
    gsap.fromTo(img.current, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power3.out' })
  }, [index])

  const onPointerDown = (e: PointerEvent) => {
    startX.current = e.clientX
  }
  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
  }

  const navButton =
    'flex size-14 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 active:scale-[0.96]'

  return (
    <dialog
      ref={dialog}
      data-lenis-prevent
      aria-label="Foto ampliada"
      onClose={() => {
        document.documentElement.style.overflow = ''
        onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
      // Clique fora da foto (no fundo escuro) fecha
      onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none flex-col items-center justify-center gap-6 border-0 bg-ink/95 p-4 text-white backdrop:bg-transparent open:flex"
    >
      <button
        type="button"
        onClick={() => dialog.current?.close()}
        aria-label="Fechar"
        className={`absolute top-4 right-4 ${navButton}`}
      >
        <X weight="bold" className="size-6" />
      </button>

      {photo && (
        <img
          ref={img}
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          width={photo.w}
          height={photo.h}
          draggable={false}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          className="max-h-[78dvh] w-auto max-w-full touch-pan-y rounded-[1.25rem] object-contain select-none lg:max-h-[88dvh] lg:max-w-[80vw]"
        />
      )}

      {/* Celular: setas abaixo da foto. Desktop: nas laterais da tela */}
      <div className="flex gap-4 lg:contents">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Foto anterior"
          className={`lg:absolute lg:top-1/2 lg:left-6 lg:-translate-y-1/2 ${navButton}`}
        >
          <CaretLeft weight="bold" className="size-6" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Próxima foto"
          className={`lg:absolute lg:top-1/2 lg:right-6 lg:-translate-y-1/2 ${navButton}`}
        >
          <CaretRight weight="bold" className="size-6" />
        </button>
      </div>
    </dialog>
  )
}
