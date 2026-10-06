import { useRef } from 'react'
import { InstagramLogo } from '@phosphor-icons/react'
import { gsap, useGSAP, MQ } from '../lib/gsap'
import { CtaButton } from './ui/CtaButton'
import { INSTAGRAM_URL } from '../data/site'
import { photos } from '../data/photos'

/**
 * Fotos reais de clientes (a prova social disponível).
 * Alturas alternadas criam um ritmo de "varal" na faixa horizontal.
 */
const gallery = [
  { photo: photos.vestido8, size: 'lg:h-[64dvh]', align: 'lg:self-start' },
  { photo: photos.noivaENoivinha, size: 'lg:h-[50dvh]', align: 'lg:self-end' },
  { photo: photos.caipirinha1, size: 'lg:h-[58dvh]', align: 'lg:self-center' },
  { photo: photos.vestido2, size: 'lg:h-[66dvh]', align: 'lg:self-start' },
  { photo: photos.infantil1, size: 'lg:h-[48dvh]', align: 'lg:self-end' },
  { photo: photos.vestido6, size: 'lg:h-[62dvh]', align: 'lg:self-center' },
  { photo: photos.noiva3, size: 'lg:h-[66dvh]', align: 'lg:self-end' },
  { photo: photos.caipirinha2, size: 'lg:h-[52dvh]', align: 'lg:self-start' },
  { photo: photos.vestido10, size: 'lg:h-[60dvh]', align: 'lg:self-center' },
  { photo: photos.infantil4, size: 'lg:h-[56dvh]', align: 'lg:self-end' },
  { photo: photos.vestido1, size: 'lg:h-[64dvh]', align: 'lg:self-start' },
  { photo: photos.caipirinha5, size: 'lg:h-[50dvh]', align: 'lg:self-center' },
  { photo: photos.vestido5, size: 'lg:h-[62dvh]', align: 'lg:self-end' },
  { photo: photos.infantil5, size: 'lg:h-[54dvh]', align: 'lg:self-start' },
  { photo: photos.caipirinha3, size: 'lg:h-[60dvh]', align: 'lg:self-center' },
]

/**
 * GALERIA (prova social com fotos reais).
 * Fundo: verde-menta (data-bg="mint").
 *
 * ANIMAÇÕES:
 * - Desktop: SCROLL HORIZONTAL FIXADO. A seção trava no topo e a faixa de fotos
 *   anda para a esquerda conforme a rolagem vertical. Cada foto tem parallax
 *   interno (containerAnimation), parecendo uma janela.
 * - Celular: faixa com arraste nativo (scroll-snap) e fotos entrando em cascata.
 */
export function Gallery() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add(MQ.desktop, () => {
        const el = track.current!
        const distance = () => el.scrollWidth - window.innerWidth

        const pan = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })

        // Parallax interno de cada foto, ligado ao movimento horizontal
        q('[data-gallery-img]').forEach((img) => {
          gsap.set(img, { scale: 1.06 }) // ampliação mínima: as fotos originais são pequenas
          gsap.fromTo(
            img,
            { xPercent: -2.5 },
            {
              xPercent: 2.5,
              ease: 'none',
              scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: pan,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
        })

        // Título entra antes do pin começar
        gsap.from(q('[data-head] > *'), {
          y: 60,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        })
      })

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from(q('[data-head] > *'), {
          y: 40,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        })
        gsap.from(q('[data-gallery-item]'), {
          x: 80,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: q('[data-gallery-list]')[0], start: 'top 85%' },
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="galeria" ref={root} data-bg="mint" className="overflow-hidden py-28 md:py-36 lg:py-0">
      <div
        ref={track}
        className="flex flex-col gap-12 lg:h-[100dvh] lg:motion-safe:w-max lg:flex-row lg:items-center lg:gap-10 lg:pr-[8vw] lg:pl-[max(2rem,calc((100vw-80rem)/2+1rem))]"
      >
        <div data-head className="shrink-0 px-4 lg:w-[34vw] lg:max-w-xl lg:px-0">
          <h2 className="font-display text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1.02] font-extrabold tracking-tight text-balance">
            Feito aqui, usado nos dias mais especiais.
          </h2>
          <p className="mt-5 max-w-[40ch] text-lg text-ink/80">
            Algumas clientes que já passaram pelo ateliê. Tem muito mais lá no Instagram.
          </p>
          <div className="mt-8">
            <CtaButton href={INSTAGRAM_URL} variant="outline" icon={<InstagramLogo weight="bold" className="size-6" />}>
              Ver no Instagram
            </CtaButton>
          </div>
        </div>

        <ul
          data-gallery-list
          aria-label="Fotos de clientes do ateliê"
          className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:h-[72dvh] min-w-0 lg:gap-8 lg:px-0 lg:motion-safe:snap-none lg:motion-safe:overflow-visible lg:pb-0"
        >
          {gallery.map(({ photo, size, align }) => (
            <li
              key={photo.src}
              data-gallery-item
              className={`h-[62vh] max-h-[520px] w-[70vw] max-w-[340px] shrink-0 snap-center overflow-hidden rounded-[1.75rem] lg:max-h-none lg:w-auto lg:max-w-none lg:aspect-[3/4] ${size} ${align}`}
            >
              <img
                data-gallery-img
                src={photo.src}
                alt={photo.alt}
                width={photo.w}
                height={photo.h}
                loading="lazy"
                className="h-full w-full object-cover object-[50%_25%]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
