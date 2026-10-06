/* ==========================================================================
   🥁 CONFIGURAÇÃO DO SITE — SAMBA DO CASSIN
   --------------------------------------------------------------------------
   Tudo que aparece no site (agenda de shows, lançamento, discografia,
   fotos, integrantes e contatos) está centralizado neste arquivo.
   ========================================================================== */

export interface Show {
  /** Data no formato AAAA-MM-DD — ex.: '2026-10-03' */
  date: string;
  /** Cidade / UF — ex.: 'Curitiba / PR' */
  city: string;
  /** Nome do local */
  venue: string;
  /** Horário em texto — ex.: '20h', '19h30' */
  time?: string;
  /** Descrição curta (aparece em caixa alta) */
  description?: string;
  /** Link de venda de ingressos. Deixe vazio se não houver. */
  ticketUrl?: string;
  /** true = evento fechado / particular */
  privateEvent?: boolean;
}

export interface Album {
  title: string;
  year: number;
  type: 'Álbum' | 'EP' | 'Single' | 'Ao Vivo' | 'Projeto';
  /** Imagem da capa. Se não tiver, uma capa é gerada automaticamente com "palette". */
  cover?: string;
  palette?: [string, string];
  /** Link para ouvir */
  url: string;
}

export interface Member {
  name: string;
  role: string;
  /** Foto do integrante. Se não tiver, aparece um avatar com as iniciais. */
  photo?: string;
  instagram?: string;
}

export interface Photo {
  src: string;
  alt: string;
}

export interface InstaPost {
  image: string;
  likes: string;
  comments: string;
  url?: string;
}

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

const ANO_DE_INICIO = 2018;

/* ============================ AGENDA — OUTUBRO ============================ */
/* Agenda de outubro/2026, conferida com o cartaz enviado. */
const shows: Show[] = [
  { date: '2026-10-03', city: 'Curitiba / PR', venue: 'Folhetim', time: '20h', ticketUrl: 'https://www.instagram.com/folhetimbar' },
  { date: '2026-10-04', city: 'Curitiba / PR', venue: 'Cana Benta', time: '19h30', ticketUrl: 'https://www.instagram.com/sambadocassin' },
  { date: '2026-10-09', city: 'Curitiba / PR', venue: 'Feira Bar', time: '19h', ticketUrl: 'https://www.instagram.com/sambadocassin' },
  {
    date: '2026-10-10',
    city: 'Curitiba / PR',
    venue: 'Sociedade 13 de Maio',
    time: '15h',
    description: 'Festa das Crianças',
    ticketUrl: 'https://www.instagram.com/sambadocassin',
  },
  { date: '2026-10-10', city: 'Curitiba / PR', venue: 'Folhetim', time: '20h', ticketUrl: 'https://www.instagram.com/folhetimbar' },
  { date: '2026-10-11', city: 'Curitiba / PR', venue: 'Samba da Pérola', time: '16h', ticketUrl: 'https://www.instagram.com/sambadocassin' },
  { date: '2026-10-11', city: 'Curitiba / PR', venue: 'Cana Benta', time: '19h30', ticketUrl: 'https://www.instagram.com/sambadocassin' },
  {
    date: '2026-10-12',
    city: 'Curitiba / PR',
    venue: 'Nuuk Club — Centro',
    time: '16h',
    description: 'Pandeiro e Cocada',
    ticketUrl: 'https://www.instagram.com/sambadocassin',
  },
  { date: '2026-10-16', city: 'Curitiba / PR', venue: 'Feira Bar', time: '19h', ticketUrl: 'https://www.instagram.com/sambadocassin' },
  { date: '2026-10-17', city: 'Curitiba / PR', venue: 'Folhetim', time: '20h', ticketUrl: 'https://www.instagram.com/folhetimbar' },
  {
    date: '2026-10-18',
    city: 'Curitiba / PR',
    venue: 'Falei que ia Dar Samba',
    time: '16h',
    ticketUrl: 'https://www.instagram.com/sambadocassin',
  },
  { date: '2026-10-18', city: 'Curitiba / PR', venue: 'Cana Benta', time: '19h30', ticketUrl: 'https://www.instagram.com/sambadocassin' },
  { date: '2026-10-18', city: 'Curitiba / PR', venue: 'Capilé Seu Zé', time: '21h', ticketUrl: 'https://www.instagram.com/sambadocassin' },
  { date: '2026-10-24', city: 'Curitiba / PR', venue: 'Folhetim Bar', time: '20h', ticketUrl: 'https://www.instagram.com/folhetimbar' },
  { date: '2026-10-25', city: 'Curitiba / PR', venue: 'Cana Benta', time: '19h30', ticketUrl: 'https://www.instagram.com/sambadocassin' },
  { date: '2026-10-30', city: 'Curitiba / PR', venue: 'Feira Bar', time: '19h', ticketUrl: 'https://www.instagram.com/sambadocassin' },
];

/* =========================== DISCOGRAFIA =========================== */
/* Capas oficiais, direto do perfil do grupo no Deezer */
const DEEZER = 'https://cdn-images.dzcdn.net/images/cover';
const DEEZER_ARTIST = 'https://www.deezer.com/artist/338917561';

const albums: Album[] = [
  {
    title: 'O Princípio',
    year: 2025,
    type: 'Álbum',
    cover: `${DEEZER}/833414011186f498ed176121e9e51707/1000x1000-000000-80-0-0.jpg`,
    url: 'https://www.deezer.com/album/811297031',
  },
  {
    title: 'De Rezar e Sambar',
    year: 2025,
    type: 'Single',
    cover: `${DEEZER}/41c5a4f55ba249316aaa0f001ae9fe24/1000x1000-000000-80-0-0.jpg`,
    url: 'https://www.deezer.com/album/808069081',
  },
  {
    title: 'Quartinha Cheia',
    year: 2025,
    type: 'Single',
    cover: `${DEEZER}/c80d082f77789a44c607fb0bfbe25b0c/1000x1000-000000-80-0-0.jpg`,
    url: 'https://www.deezer.com/album/805315851',
  },
];

/* ------------------------------- FOTOS ------------------------------- */
/* 👉 Substitua pelas fotos oficiais do grupo (salve em public/images) */
const photos: Photo[] = [
  { src: 'images/cassin3.jpg', alt: 'Samba do Cassin no palco' },
  {
    src: 'https://images.pexels.com/photos/38485789/pexels-photo-38485789.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    alt: 'Roda cheia com o público',
  },
  { src: 'images/hero.jpg', alt: 'Show no palco principal' },
  {
    src: 'https://images.pexels.com/photos/39776742/pexels-photo-39776742.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'O pandeiro que comanda a roda',
  },
  {
    src: 'https://images.pexels.com/photos/19943363/pexels-photo-19943363.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Público cantando junto',
  },
  {
    src: 'https://images.pexels.com/photos/27917833/pexels-photo-27917833.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
    alt: 'Violão de sete cordas',
  },
  {
    src: 'https://images.pexels.com/photos/33565506/pexels-photo-33565506.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Bastidores do show ao vivo',
  },
  {
    src: 'https://images.pexels.com/photos/31103528/pexels-photo-31103528.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Batucada na avenida',
  },
];

/* ---------------------------- INTEGRANTES ---------------------------- */
/* 👉 Sem foto: aparece um avatar com as iniciais. Adicione "photo: 'images/x.jpg'" quando tiver as fotos. */
const members: Member[] = [
  {
    name: 'Cassin Vieira',
    role: 'Voz, cavaquinho e direção musical',
    photo: 'images/cassinperfil.png',
    instagram: 'https://www.instagram.com/sambadocassin/',
  },
  {
    name: 'Bruna Alcântara',
    role: 'Voz e percussão',
    photo: 'images/brunaperfil.png',
    instagram: 'https://www.instagram.com/bru.alcantara06/',
  },
  {
    name: 'Marcão',
    role: 'Pandeiro',
    photo: 'images/carcaoperfil.png',
    instagram: 'https://www.instagram.com/marcos.peres1/',
  },
  {
    name: 'Ystuarty Martins',
    role: 'Violão',
    photo: 'images/ystuartyperfil.png',
    instagram: 'https://www.instagram.com/ystuarty_martins/',
  },
  {
    name: 'Gui Graúdo',
    role: 'Percussão',
    photo: 'images/guiperfil.png',
    instagram: 'https://www.instagram.com/guiii.alberti/',
  },
];

/* ----------------------------- INSTAGRAM ----------------------------- */
const instagramPosts: InstaPost[] = [
  { image: 'images/cassin3.jpg', likes: '3,1 mil', comments: '124' },
  { image: 'images/hero.jpg', likes: '2,4 mil', comments: '86' },
  {
    image:
      'https://images.pexels.com/photos/38485789/pexels-photo-38485789.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    likes: '5,1 mil',
    comments: '312',
  },
  {
    image:
      'https://images.pexels.com/photos/39776742/pexels-photo-39776742.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    likes: '1,8 mil',
    comments: '54',
  },
  {
    image:
      'https://images.pexels.com/photos/19943363/pexels-photo-19943363.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    likes: '1,2 mil',
    comments: '37',
  },
  {
    image:
      'https://images.pexels.com/photos/27917833/pexels-photo-27917833.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
    likes: '3,9 mil',
    comments: '158',
  },
];

/* =========================== CONFIG GERAL =========================== */
export const config = {
  /** Nome do grupo (aparece no logo, título e textos) */
  name: 'Samba do Cassin',
  /** Palavrinha acima do logo (deixe '' para remover) */
  logoKicker: 'Curitiba • PR',
  /** Se o grupo tiver um logo em imagem, informe aqui. Ex.: 'images/logo.png' */
  logoImage: '',
  /** Lema do grupo (bio do Instagram) */
  tagline: 'O meu samba te abraça',
  since: ANO_DE_INICIO,
  city: 'Curitiba / PR',

  heroImage: 'images/cassinhero.png',
  bioImage: 'images/cassinbio.png',
  contrateImage:
    'https://images.pexels.com/photos/38485789/pexels-photo-38485789.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',

  /** Esconde automaticamente os shows que já passaram */
  hidePastShows: true,
  shows,

  /* --------- LANÇAMENTO --------- */
  release: {
    label: 'Álbum • 2025',
    song: 'O Princípio',
    title: 'Samba do Cassin — O Princípio',
    /** 👉 ID do vídeo do grupo (o código depois de "watch?v="). Deixe '' para o botão abrir o canal. */
    youtubeId: '',
    poster: `${DEEZER}/833414011186f498ed176121e9e51707/1000x1000-000000-80-0-0.jpg`,
    cover: `${DEEZER}/833414011186f498ed176121e9e51707/1000x1000-000000-80-0-0.jpg`,
    text: 'Primeiro álbum autoral de Cassin Vieira, com composições em parceria com Nego Chandi e arranjos de Gustavo Moro. Gravado no Estúdio Zeroneutro, em Brasília, com os produtores Marcel Papa e Daniel Felix. 8 faixas, 27 minutos de samba.',
  },

  /** Faixas de "O Princípio" (divulgação oficial) */
  tracklist: [
    'Batuque Gira Tempo',
    'Íris de Oyá',
    'Clamor a Xangô',
    'Guerreiro de Jorge',
    'Respeite a Mata',
    'Solitário Caçador',
    'Fez Blem Blem Blem / Gravata e Patuá / Ela Vem',
  ],

  albums,
  photos,
  members,
  instagramPosts,

  bio: {
    title: 'O meu samba te abraça',
    paragraphs: [
      'O Samba do Cassin nasceu em 2018, em Curitiba, da vontade de Cassin Vieira de juntar os amigos em volta de uma boa roda de samba. Músico, compositor e produtor musical, Cassin começou a carreira em 1996, em Brasília, e hoje é diretor musical, cavaquinhista e voz do projeto.',
      'A assinatura do grupo é o "5 Horas de Samba Sem Intervalo", roda que desde 2019 circula por Curitiba e Ponta Grossa e virou ponto de encontro de quem gosta de samba de verdade — sem pressa, com muito pandeiro, cavaquinho e voz.',
      'Em 2025 chegou "O Princípio", o primeiro álbum autoral de Cassin Vieira, com composições em parceria com Nego Chandi, arranjos de Gustavo Moro e produção de Gui Miúdo. O disco reúne ainda Luís Rolim, Marcos Peres, Rossano Lopes e Bruna Alcântara, com participações nos vocais de As Brejeiras, Dow Raiz e Wes Ventura.',
      'Cassin também é autor de "Quartinha Cheia" e já foi homenageado no evento Axé Zumbi e Dandara, da Câmara Municipal de Curitiba, pelo seu trabalho na música. O grupo passa por casas como Folhetim, Feira Bar, Cana Benta, Nuuk Club e a histórica Sociedade Operária Beneficente 13 de Maio.',
    ],
    quote: 'O meu samba é simples, mas é feito com a alma. O samba é um ser de luz que junta pessoas e as faz cantar. Por isso o meu samba te abraça!',
  },

  stats: [
    { value: new Date().getFullYear() - ANO_DE_INICIO, prefix: '+', label: 'anos de estrada' },
    { value: 30, prefix: '+', label: 'anos de carreira' },
    { value: 5, prefix: '', suffix: 'h', label: 'de samba sem intervalo' },
    { value: 9, prefix: '', suffix: 'k', label: 'seguidores no Instagram' },
  ] as Stat[],

  /* --------------------- CONTATO --------------------- */
  contact: {
    /** 👉 PREENCHA com o WhatsApp do grupo (só números, com DDI 55 + DDD). Ex.: 5541999999999 */
    whatsapp: '5541984542307',
    whatsappDisplay: '(41) 98454-2307',
    phone: '+554133334444',
    phoneDisplay: '(41) 3333-4444',
    email: 'contato@sambadocassin.com.br',
    manager: 'Cassin Vieira',
    managerRole: 'Idealizador & Direção Musical',
    area: 'Curitiba / PR — atendemos todo o Paraná',
  },
  eventTypes: ['Casamento', 'Aniversário', 'Evento corporativo', 'Bar / Casa de show', 'Formatura', 'Festa particular', 'Outro'],

  /* ------------------ REDES SOCIAIS ------------------ */
  social: {
    instagram: 'https://www.instagram.com/sambadocassin/',
    instagramHandle: '@sambadocassin',
    youtube: 'https://www.youtube.com/@SAMBADOCASSIN',
    tiktok: '',
    facebook: '',
  },
  instagramStats: '121 publicações • 9,7 mil seguidores',

  /* ------------- PLATAFORMAS DE MÚSICA ------------- */
  streaming: {
    /** Perfil oficial do grupo no Deezer (confirmado) */
    deezer: DEEZER_ARTIST,
    spotify: 'https://open.spotify.com/search/Samba%20do%20Cassin',
    youtube: 'https://www.youtube.com/@SAMBADOCASSIN',
    appleMusic: 'https://music.apple.com/br/search?term=Samba%20do%20Cassin',
  },

  /** Frases da faixa animada que corre na tela */
  marquee: ['Samba de raiz', 'Roda de samba', '5 horas sem intervalo', 'Pagode', 'Curitiba', 'O meu samba te abraça'],

  footerText: `Samba de raiz e muita roda desde ${ANO_DE_INICIO}. Leve o Samba do Cassin para o seu evento!`,
};
