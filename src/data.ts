/* Foto ufficiali della locanda (CDN del sito ilportolotto.it) — nessuna immagine generata */
const CDN = "https://globaluserfiles.com/media/";
export const REAL_PHOTOS = [
  {
    src: `${CDN}4183_d92ad4a87606834d475a067b8ee138fed441994c.jpeg/v1/w_1400,h_0/portolotto02mod2.jpg`,
    alt: "La locanda Il Portolotto",
    cap: "la locanda",
  },
  {
    src: `${CDN}4183_2ba2dee4ba20715c25beba5da746fa8a9df234a9.jpeg/v1/w_1200,h_0/medium_dsc0011.jpg`,
    alt: "Interni e piatti del Portolotto",
    cap: "in tavola",
  },
  {
    src: `${CDN}4183_4f7e1d4ec11fcc49ac985ec699fddc1fd7715e9f.jpeg/v1/w_1200,h_0/medium_dsc0124.jpg`,
    alt: "Il pescato e la cucina",
    cap: "dal mercato",
  },
  {
    src: `${CDN}4183_059d0aa98515039e58b10cdf19f9c8ddc404acbe.jpeg/v1/w_1200,h_0/dsc00034.jpg`,
    alt: "Serata al Portolotto",
    cap: "sera in darsena",
  },
  {
    src: `${CDN}4183_3e9f6359b8615dba572d7fd668da358aacc33384.jpeg/v1/w_900,h_0/sidebar_copiadifotoinsieme.jpg`,
    alt: "I portolotti, foto di famiglia",
    cap: "i portolotti",
  },
  {
    src: `${CDN}4183_5f414553bf96f32a346cbce7e07bc43fb59db906.jpeg/v1/w_900,h_0/sidebar_fasebook3.jpg`,
    alt: "Scorci del locale",
    cap: "scorci di casa",
  },
  {
    src: `${CDN}4183_8c7c992ec118eab086f885d1c3f85200e1cb7172.jpeg/v1/w_900,h_0/sidebar_fot.jpg`,
    alt: "Dettagli marinari",
    cap: "memorie di mare",
  },
];

export const INFO = {
  name: "Il Portolotto",
  tagline: "Locanda di pesce",
  address: "Viale Ortigara 51, 47921 Rimini RN",
  quarter: "San Giuliano Mare · Rimini",
  phone: "0541 709491",
  phoneHref: "tel:+390541709491",
  email: "ilportolotto@ilportolotto.it",
  coords: "44.0742° N · 12.5687° E",
  plusCode: "3HFC+RF Rimini",
  rating: 4.3,
  reviews: 1501,
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Il+Portolotto+Viale+Ortigara+51+Rimini",
};

export type MenuCategory = {
  id: string;
  label: string;
  note: string;
  items: {
    name: string;
    desc: string;
    en?: string;
    price: string;
    tags?: ("gf" | "day" | "top")[];
  }[];
};

export const MENU: MenuCategory[] = [
  {
    id: "antipasti",
    label: "Antipasti",
    note: "dal banco del pesce, ogni mattina",
    items: [
      {
        name: "Piatto marinati e carpacci del giorno",
        desc: "Alici marinate, carpaccio di cefalo e spada",
        en: "Marinated anchovies, mullet & swordfish carpaccio",
        price: "13,00",
        tags: ["gf", "day"],
      },
      {
        name: "Crostini alici e burro",
        desc: "Con pomodorini, olive e pane caldo",
        en: "Anchovies, butter, tomatoes and olives",
        price: "9,00",
        tags: ["top"],
      },
      {
        name: "Misto fritto rustico del giorno",
        desc: "Sarde, cozze, baccalà e cipolla fritta",
        en: "Mixed fried fish",
        price: "13,00",
        tags: ["day"],
      },
      {
        name: "Cozze alla marinara o portolotta piccante",
        desc: "Con limone e aglio, oppure pomodoro e basilico",
        en: "Mussels with garlic or tomato",
        price: "12,00",
        tags: ["gf"],
      },
      {
        name: "Misto gratinato del giorno",
        desc: "Cozze, canelli, canestrini e sardoni · con radicchio, cipolla e piada",
        en: "Roasted shellfish with salad and onion",
        price: "16,00",
        tags: ["day"],
      },
    ],
  },
  {
    id: "primi",
    label: "Primi",
    note: "pasta tirata a mano, come in barca",
    items: [
      {
        name: "Passatelli con le vongole",
        desc: "La firma della casa: brodo leggero, vongole veraci e prezzemolo",
        en: "Handmade pasta with clams",
        price: "14,00",
        tags: ["top"],
      },
      {
        name: "Tagliolini allo scoglio",
        desc: "Con pesce del giorno, crostacei e pomodorini",
        en: "Handmade pasta with seafood",
        price: "14,00",
        tags: ["top", "day"],
      },
      {
        name: "Strozzapreti del giorno",
        desc: "Conditi con il pescato della mattina",
        en: "Handmade pasta with day's seafood",
        price: "14,00",
        tags: ["day"],
      },
    ],
  },
  {
    id: "secondi",
    label: "Secondi",
    note: "dalla paranza al piatto",
    items: [
      {
        name: "3 spiedini misti di calamari e gamberi",
        desc: "Alla griglia, profumati al limone",
        en: "Squid and shrimp skewers",
        price: "12,00",
        tags: ["gf", "top"],
      },
      {
        name: "Frittura mista di paranza",
        desc: "Calamari, gamberi, pesce pescato misto e verdure",
        en: "Fried fish with vegetables",
        price: "16,00",
        tags: ["top"],
      },
      {
        name: "Guazzetto di mare",
        desc: "Brodetto con poche spine, pomodoro e crostini",
        en: "Stewed seafood with tomato",
        price: "21,00",
        tags: ["day"],
      },
      {
        name: "Pesce del giorno",
        desc: "Con verdure miste, al forno o all'acqua pazza",
        en: "Fish of the day with vegetables",
        price: "50,00 / kg",
        tags: ["gf", "day"],
      },
    ],
  },
  {
    id: "contorni",
    label: "Contorni & Piada",
    note: "per accompagnare, come si deve",
    items: [
      { name: "Misticanza con cipolla e piada", desc: "Scarola, olive taggiasche e peperoncino", price: "5,00", tags: ["top"] },
      { name: "Insalata mista con cipolla e piada", desc: "Verdure fresche dell'orto", price: "7,00" },
      { name: "Erbe saltate con aglio in padella e piada", desc: "Verdure di stagione", price: "5,00" },
      { name: "Patate fritte con origano", desc: "Come una volta", price: "3,50" },
      { name: "Piadina", desc: "Doc, di Cattolica", price: "1,00" },
      { name: "Piadina senza glutine / pane senza glutine", desc: "Su richiesta", price: "2,50", tags: ["gf"] },
    ],
  },
];

export const DISHES = [
  {
    img: REAL_PHOTOS[1].src,
    name: "Il pranzo del porto",
    desc: "Passatelli con le vongole, tagliolini allo scoglio e il pescato del giorno: la tavola come la intendono i portolotti.",
    tag: "In tavola",
  },
  {
    img: REAL_PHOTOS[2].src,
    name: "Dal mercato al piatto",
    desc: "Ogni mattina il banco decide il menù: quello che il mare dà, la cucina lo racconta. Semplice e genuino.",
    tag: "Il pescato",
  },
  {
    img: REAL_PHOTOS[0].src,
    name: "La locanda",
    desc: "Lampadari di vimini, stampe marinare, conchiglie e tovagliette di carta: sovraccarico ma tipico, come dev'essere.",
    tag: "L'atmosfera",
  },
  {
    img: REAL_PHOTOS[6].src,
    name: "Memorie di mare",
    desc: "Lanterne, reti e fotografie d'epoca: ogni oggetto appeso ha un viaggio dietro, come chi li ha raccolti.",
    tag: "La storia",
  },
  {
    img: REAL_PHOTOS[3].src,
    name: "Sera in darsena",
    desc: "Sotto i fili di luce, oltre il ponte: si cena dentro lo scafo di un vecchio peschereccio. Prenotatelo.",
    tag: "Fuori",
  },
];

export const REVIEWS = [
  {
    name: "Dom Bologna",
    meta: "Local Guide · 57 recensioni",
    stars: 5,
    text: "Location da trattoria di mare, arredamento sovraccarico ma tipico. Tavoli esterni ed interni: vista la dimensione, quantomai opportuno prenotare. Tutto molto buono.",
  },
  {
    name: "Roberto Capucci",
    meta: "Local Guide · 235 recensioni",
    stars: 5,
    text: "Frittura mista di pesce fresco gustosa, con poca impanatura e per nulla unta. Gustoso anche il contorno di scarola con cipolla, olive taggiasche e peperoncino. Torneremo.",
  },
  {
    name: "Miriam Tacconi",
    meta: "Local Guide · 99 recensioni",
    stars: 5,
    text: "Oltre all'ospitalità dei romagnoli, il cibo è ottimo. Consiglio vivamente la location. Complimenti a tutto lo staff del locale!",
  },
  {
    name: "EasternVoyager",
    meta: "Bologna · 520 contributi",
    stars: 5,
    text: "Una locanda da non perdere se si va a Rimini. Spiedini di calamari e gamberi di ottima qualità, ben conditi. Un ricco contorno di scarole alla napoletana, squisito. Prezzo contenuto.",
  },
  {
    name: "Rossana C",
    meta: "Reggio Emilia · 27 contributi",
    stars: 5,
    text: "Consigliatissimo! Materie prime di qualità, servizio eccellente. La polenta con le vongole in sugo rosso assieme alla frittura… top. Prenotate con anticipo.",
  },
  {
    name: "Annalovatti",
    meta: "Riva Ligure · 131 contributi",
    stars: 5,
    text: "Le delizie dei piatti cucinati in modo semplicemente superbo. Passatelli alle vongole, misto gratinato, crudi di pesce… Abbiamo firmato la resa davanti alla torta di riso.",
  },
  {
    name: "Caterina",
    meta: "12 contributi",
    stars: 5,
    text: "Davvero un'ottima cena di pesce in un ambiente delizioso lungo la Darsena. Antipasto freddo e spiedini squisiti! Personale gentilissimo, ottimo rapporto qualità-prezzo.",
  },
  {
    name: "Matteo T",
    meta: "Reggello · 326 contributi",
    stars: 5,
    text: "Passatelli con le vongole mondiali! Frittura mista buona e non unta. Posto carino, intimo, con un'aria di allegria che fa sempre piacere. Domani torniamo per il bis.",
  },
];

export const RATING_BARS = [
  { stars: 5, pct: 74 },
  { stars: 4, pct: 15 },
  { stars: 3, pct: 6 },
  { stars: 2, pct: 3 },
  { stars: 1, pct: 2 },
];

export const TIMELINE = [
  {
    year: "Trecento",
    title: "Patronus",
    text: "Negli antichi statuti della città il capobarca è chiamato patronus: già allora marinai e pescatori del porto si esprimevano in quel dialetto veneto che è il Portolotto.",
  },
  {
    year: "1850",
    title: "La lingua del porto",
    text: "Tutti gli abitanti del porto e dei borghi di Marina e San Giuliano parlano correntemente — e spesso esclusivamente — il Portolotto.",
  },
  {
    year: "1864",
    title: "Cinquemila anime",
    text: "Luigi Tonini censisce oltre cinquemila persone tra pescatori, naviganti, calafati, facchini e commercianti, con le loro famiglie.",
  },
  {
    year: "1867",
    title: "«Nè vedva nè da maridè»",
    text: "Nella farsa di Ubaldo Valaperta parla Bartulein, il marinaio redivivo: «Da sto momento dago un bon dì al mare per star colla mi fantolina e la mi Sabèta».",
  },
  {
    year: "1920",
    title: "Il silenzio",
    text: "Il Portolotto si estingue del tutto. Ne restano tracce minime, più rare — si dice — delle testimonianze in etrusco.",
  },
  {
    year: "Oggi",
    title: "La locanda",
    text: "Da sempre il Portolotto è l'abitante del porto. Qui, tra lampadari di vimini e tavoli di marmo, la sua memoria torna a tavola ogni sera.",
  },
];

export const PHRASES = [
  { p: "Porta e' lumèto", t: "Porta la lanterna" },
  { p: "Aspèta che m'impiza la pipa", t: "Aspetta che m'accenda la pipa" },
  { p: "Da nun us magna quel cù iè!", t: "Qui non si mangia quello che c'è… se non sai accontentarti" },
  { p: "Prista nu pavlo", t: "Prestami un paolo" },
  { p: "Ciò, so mi che passe!", t: "Ehi, sono io che sto passando!" },
  { p: "Fora, gente tuta, portèmo el gran in tera!", t: "Fuori tutti, portiamo il grano a terra!" },
];

export const SUPPLIERS = [
  "Ariminum Pesca · Mercato coperto",
  "Battistini Pesce · Cesenatico",
  "Consorzio Linea Azzurra · Rimini",
  "Borgognoni Uova · Coriano",
  "Adriano Frutta e Verdura · Borgo San Giuliano",
  "Igea Carni · Igea Marina",
  "Piadina Doc · Cattolica",
  "Esse Caffè · Bologna",
];

export const HOURS = [
  { d: "Lunedì", h: "Chiuso", closed: true },
  { d: "Martedì — Venerdì", h: "12:00 – 14:30 · 19:00 – 22:30" },
  { d: "Sabato", h: "12:00 – 15:00 · 19:00 – 23:00" },
  { d: "Domenica", h: "12:00 – 15:00 · 19:00 – 22:30" },
];
