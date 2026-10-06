/**
 * Dados de contato. Edite aqui e a página inteira é atualizada.
 */
export const WHATSAPP_NUMBER = '5515998035996'
export const WHATSAPP_DISPLAY = '(15) 99803-5996'
export const WHATSAPP_MESSAGE = 'Oi, Daia! Vim pelo site e quero fazer um orçamento.'

/** Monta o link do WhatsApp com uma mensagem já escrita. */
export const whatsappUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

export const WHATSAPP_URL = whatsappUrl(WHATSAPP_MESSAGE)

export const INSTAGRAM_URL = 'https://www.instagram.com/ateliedadaia/'
export const INSTAGRAM_HANDLE = '@ateliedadaia'

export const ADDRESS = 'Av. Adalberto Rocha, 688, Centro, Guareí-SP, 18250-029'
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  'Av. Adalberto Rocha, 688, Centro, Guareí - SP, 18250-029',
)}`

/** Rótulo único do CTA principal. Use sempre o mesmo verbo de ação. */
export const CTA_LABEL = 'Chamar no WhatsApp'
