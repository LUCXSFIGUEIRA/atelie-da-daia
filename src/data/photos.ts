/**
 * Catálogo das fotos reais do ateliê (convertidas para WebP em /public/img).
 * Para trocar uma foto: substitua o arquivo em /public/img mantendo o nome,
 * ou altere o nome aqui. Sempre mantenha um "alt" descritivo (SEO + acessibilidade).
 */
export type Photo = { src: string; alt: string; w: number; h: number }

const base = import.meta.env.BASE_URL

const photo = (name: string, w: number, h: number, alt: string): Photo => ({
  src: `${base}img/${name}.webp`,
  w,
  h,
  alt,
})

export const photos = {
  daia: photo('Daia', 888, 897, 'Daia, costureira do ateliê, sorrindo e segurando uma tesoura de costura'),

  caipirinha1: photo('caipirinha_1', 697, 891, 'Duas amigas em festa junina à noite com vestidos caipiras xadrez, um rosa e um azul'),
  caipirinha2: photo('caipirinha_2', 570, 899, 'Cliente em festa junina com saia caipira xadrez bege e babados vermelhos'),
  caipirinha3: photo('caipirinha_3', 585, 898, 'Cliente tirando selfie com vestido caipira xadrez azul com renda'),
  caipirinha4: photo('caipirinha_4', 604, 895, 'Vestido caipira xadrez lilás com laços e renda, no manequim do ateliê'),
  caipirinha5: photo('caipirinha_5', 741, 818, 'Vestido caipira xadrez preto e branco com babados e fitas pink, no manequim do ateliê'),

  infantil1: photo('infantil_1', 893, 875, 'Menina em ensaio de aniversário com vestido infantil roxo, sentada em manta de girassóis'),
  infantil2: photo('infantil_2', 894, 892, 'Bebê sorrindo com vestido amarelo de princesa e laço vermelho no cabelo'),
  infantil3: photo('infantil_3', 872, 900, 'Bebê com fantasia de príncipe azul com detalhes dourados e coroa'),
  infantil4: photo('infantil_4', 476, 896, 'Criança com fantasia de encanador, macacão azul e camiseta vermelha, no ateliê'),
  infantil5: photo('infantil_5', 609, 860, 'Menino com conjunto azul de capuz com orelhinhas, no ateliê'),

  noiva1: photo('noiva_1', 663, 859, 'Noiva de costas com vestido branco ombro a ombro e cauda de renda, em evento à noite'),
  noiva2: photo('noiva_2', 670, 849, 'Noiva sorrindo com vestido branco de mangas bufantes e buquê de rosas'),
  noiva3: photo('noiva_3', 713, 902, 'Noiva com vestido de renda de mangas longas e saia rodada, segurando buquê vermelho'),
  noivaENoivinha: photo('noiva_e_noivinha', 880, 880, 'Noiva de mãos dadas com uma daminha, as duas com vestidos brancos de renda'),

  vestido1: photo('vestido', 684, 898, 'Cliente com vestido longo preto com fenda em uma festa'),
  vestido2: photo('vestido_2', 770, 893, 'Cliente com vestido longo laranja à beira da piscina'),
  vestido3: photo('vestido_3', 868, 894, 'Cliente com vestido longo pink com fenda, esvoaçando ao vento'),
  vestido4: photo('vestido_4', 705, 898, 'Duas clientes com vestidos de festa, um vinho e um verde-esmeralda com renda'),
  vestido5: photo('vestido_5', 720, 898, 'Cliente com vestido preto midi de manga curta e fenda'),
  vestido6: photo('vestido_6', 626, 910, 'Senhora com vestido longo verde-água em cerimônia de casamento'),
  vestido7: photo('vestido_7', 720, 902, 'Duas madrinhas com vestidos longos azul royal e rosé, ao lado de uma daminha de rosa'),
  vestido8: photo('vestido_8', 676, 899, 'Cliente com vestido longo lilás brilhante em festa ao ar livre'),
  vestido9: photo('vestido_9', 809, 907, 'Cliente tirando selfie com vestido longo azul royal frente única com fenda'),
  vestido10: photo('vestido_10', 775, 886, 'Cliente com vestido preto ombro a ombro com fenda, em uma biblioteca'),
} satisfies Record<string, Photo>
