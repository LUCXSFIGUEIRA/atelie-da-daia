/**
 * Registro central dos plugins GSAP.
 * Todos os componentes importam daqui para garantir que ScrollTrigger,
 * SplitText e useGSAP estejam registrados uma única vez.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

/**
 * Media queries usadas em gsap.matchMedia().
 * - motion: só anima quem NÃO pediu "reduzir movimento" no sistema.
 * - desktop: efeitos pesados (parallax, pin, scroll horizontal) só em telas grandes.
 * - finePointer: microinterações de mouse (magnético, tilt 3D).
 */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
  finePointer: '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
} as const

export { gsap, ScrollTrigger, SplitText, useGSAP }
