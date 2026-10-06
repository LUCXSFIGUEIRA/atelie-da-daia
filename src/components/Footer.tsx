import { InstagramLogo, MapPin, Scissors, WhatsappLogo } from '@phosphor-icons/react'
import { ADDRESS, INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, WHATSAPP_URL } from '../data/site'

/**
 * RODAPÉ: contato, redes e direitos. Continua o bloco escuro do CTA final.
 * Sem animação de entrada: é a parte final e precisa estar sempre legível.
 */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink px-4 pb-28 text-white md:pb-12">
      <div className="mx-auto max-w-6xl border-t border-white/15 pt-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <a href="#topo" className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight">
              <Scissors weight="bold" aria-hidden className="size-7" />
              Ateliê da Daia
            </a>
            <p className="mt-3 max-w-[32ch] text-white/75">Vestidos para toda ocasião e consertos com capricho.</p>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold">Contato</h2>
            <ul className="mt-4 space-y-3 text-white/85">
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                  <WhatsappLogo weight="fill" aria-hidden className="size-5" />
                  {WHATSAPP_DISPLAY}
                </a>
              </li>
              {ADDRESS && (
                <li className="inline-flex items-start gap-2">
                  <MapPin weight="fill" aria-hidden className="mt-1 size-5 shrink-0" />
                  {ADDRESS}
                </li>
              )}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold">Redes</h2>
            <ul className="mt-4 space-y-3 text-white/85">
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                  <InstagramLogo weight="bold" aria-hidden className="size-5" />
                  {INSTAGRAM_HANDLE}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 text-[16px] text-white/60">© {year} Ateliê da Daia. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
