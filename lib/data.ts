import { siteConfig } from "@/config/siteConfig";

export const CLINIC_LOCATION_QUERY = siteConfig.contact.locationQuery;

export const CLINIC_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLINIC_LOCATION_QUERY)}`;

export const CLINIC_MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(CLINIC_LOCATION_QUERY)}&hl=es&z=16&output=embed`;

/** Datos de marca / contacto — derivados de `config/siteConfig`. */
export const CLINIC = {
  name: siteConfig.clinic.name,
  fullName: siteConfig.clinic.fullName,
  doctorShortName: siteConfig.doctor.shortName,
  doctorDisplayName: siteConfig.doctor.displayName,
  specialty: siteConfig.doctor.specialty,
  phone: siteConfig.contact.phone,
  phoneE164: siteConfig.contact.phoneE164,
  whatsapp: siteConfig.contact.whatsapp,
  email: siteConfig.contact.email,
  address: siteConfig.contact.address,
  city: siteConfig.contact.city,
  state: siteConfig.contact.state,
  postalCode: siteConfig.contact.postalCode,
  country: siteConfig.contact.country,
  landmark: siteConfig.contact.landmark,
  facebook: siteConfig.social.facebook ?? "",
  instagram: siteConfig.social.instagram ?? "",
  tiktok: siteConfig.social.tiktok ?? "",
  maps: CLINIC_MAPS_URL,
  googleReviews: siteConfig.social.googleReviews ?? "",
  ultherapy: siteConfig.social.ultherapy ?? "",
  ultherapyLogo: siteConfig.assets.ultherapyLogo ?? "",
  cofeprisNumber: siteConfig.legal.cofeprisNumber,
  professionalLicense: siteConfig.legal.professionalLicense,
  cofeprisNotice: siteConfig.legal.cofeprisNotice,
  professionalLicenseNotice: siteConfig.legal.professionalLicenseNotice,
  geo: siteConfig.contact.geo,
  hours: siteConfig.hours,
  socialHandles: siteConfig.social.handles,
  assets: siteConfig.assets,
  copy: siteConfig.copy,
  seo: siteConfig.seo,
} as const;

export function whatsappUrl(message: string) {
  return `https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(message)}`;
}

export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  priceFrom?: boolean;
  requiresValidation?: boolean;
  subItems?: string[];
};

export function formatPriceMXN(amount: number, options?: { from?: boolean }) {
  const formatted = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount);
  return options?.from ? `Desde ${formatted}` : formatted;
}

export type ServiceCategory = {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  services: ServiceItem[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "botox",
    tabLabel: "Botox",
    title: "Botox",
    subtitle: "Suaviza líneas de expresión con resultados naturales y precisos",
    services: [
      {
        id: "botox-frente",
        name: "Botox — Frente y entrecejo",
        description:
          "Toxina botulínica para líneas de expresión en frente y glabela, con técnica que prioriza naturalidad y movimiento controlado.",
        price: 3500,
        priceFrom: true,
      },
      {
        id: "botox-patas-gallo",
        name: "Botox — Contorno de ojos",
        description:
          "Tratamiento de patas de gallo y mirada descansada, ideal para un efecto fresco sin aspecto “congelado”.",
        price: 2800,
        priceFrom: true,
      },
      {
        id: "botox-full-face",
        name: "Botox — Protocolo facial",
        description:
          "Plan personalizado de toxina botulínica en zonas clave del rostro según valoración médica.",
        price: 4500,
        priceFrom: true,
        requiresValidation: true,
      },
      {
        id: "botox-preventivo",
        name: "Botox preventivo",
        description:
          "Aplicación enfocada en prevención de líneas dinámicas para mantener una expresión juvenil y relajada.",
        price: 3200,
        priceFrom: true,
      },
    ],
  },
  {
    id: "fillers",
    tabLabel: "Fillers",
    title: "Fillers",
    subtitle: "Ácido hialurónico para armonía, volumen y labios de impacto natural",
    services: [
      {
        id: "fillers-labios",
        name: "Labios — Fillers",
        description:
          "Aumento y perfilado de labios con ácido hialurónico. Enfoque en labios naturales de impacto y proporción facial.",
        price: 4500,
        priceFrom: true,
      },
      {
        id: "fillers-ojeras",
        name: "Ojeras — Fillers",
        description:
          "Corrección de ojeras y surco lagrimal para una mirada más descansada y uniforme.",
        price: 4800,
        priceFrom: true,
        requiresValidation: true,
      },
      {
        id: "fillers-pomulos",
        name: "Pómulos y mentón",
        description:
          "Proyección y definición de pómulos o mentón para restaurar soporte y armonía del tercio medio/inferior.",
        price: 5200,
        priceFrom: true,
        requiresValidation: true,
      },
      {
        id: "fillers-mandibula",
        name: "Perfilado mandibular",
        description:
          "Definición de línea mandibular y perfil facial con rellenos de grado médico.",
        price: 5500,
        priceFrom: true,
        requiresValidation: true,
      },
      {
        id: "fillers-rinomodelacion",
        name: "Rinomodelación sin cirugía",
        description:
          "Armonización nasal con ácido hialurónico, sin tiempo de baja prolongado.",
        price: 6000,
        priceFrom: true,
        requiresValidation: true,
      },
    ],
  },
  {
    id: "endolift",
    tabLabel: "Endolift",
    title: "Endolift",
    subtitle: "Lifting médico con láser mínimamente invasivo para tensado y redefinición",
    services: [
      {
        id: "endolift-facial",
        name: "Endolift Facial",
        description:
          "Lifting médico mínimamente invasivo con láser para tensar piel, mejorar flacidez y redefinir el óvalo facial.",
        price: 18000,
        priceFrom: true,
        requiresValidation: true,
      },
      {
        id: "endolift-papada",
        name: "Endolift Papada / Cuello",
        description:
          "Protocolo enfocado en papada y cuello para redefinir el contorno y mejorar firmeza.",
        price: 16000,
        priceFrom: true,
        requiresValidation: true,
      },
      {
        id: "endolift-valoracion",
        name: "Valoración Endolift",
        description:
          "Consulta especializada para definir si eres candidato y el plan de tratamiento recomendado.",
        price: 500,
        priceFrom: true,
      },
    ],
  },
  {
    id: "antienvejecimiento",
    tabLabel: "Antienvejecimiento",
    title: "Antienvejecimiento",
    subtitle: "Protocolos médicos para rejuvenecer con naturalidad",
    services: [
      {
        id: "valoracion-medica",
        name: "Valoración médica estética",
        description:
          "Evaluación integral de rostro y objetivos estéticos para diseñar un protocolo personalizado.",
        price: 500,
      },
      {
        id: "combo-botox-fillers",
        name: "Protocolo combinado Botox + Fillers",
        description:
          "Plan combinado para suavizar expresión y restaurar volumen donde aporte naturalidad.",
        price: 7500,
        priceFrom: true,
        requiresValidation: true,
      },
      {
        id: "medicina-general",
        name: "Consulta de medicina general",
        description:
          "Atención médica general como complemento de tu cuidado integral en consultorio.",
        price: 600,
      },
    ],
  },
];

export const ALL_SERVICES = SERVICE_CATEGORIES.flatMap((cat) =>
  cat.services.map((s) => ({ ...s, categoryId: cat.id, categoryName: cat.title })),
);

export function findService(serviceId: string) {
  return ALL_SERVICES.find((s) => s.id === serviceId);
}

export const AVAILABLE_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

export const HIGH_END_SERVICE_IDS = new Set(
  ALL_SERVICES.filter((s) => s.requiresValidation).map((s) => s.id),
);

export type Product = {
  id: string;
  brand: string;
  name: string;
  price: number;
  category:
    | "Limpiadores"
    | "Sueros"
    | "Protectores Solares"
    | "Anti-edad"
    | "Hidratación";
  image: string;
};

const IMG = {
  cleanser:
    "https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=600&h=450&q=80",
  serum:
    "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=600&h=450&q=80",
  cream:
    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&h=450&q=80",
  sunscreen:
    "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=600&h=450&q=80",
  bottle:
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&h=450&q=80",
  dropper:
    "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=600&h=450&q=80",
  gel: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=600&h=450&q=80",
  mask:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&h=450&q=80",
  mist:
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&h=450&q=80",
  jar: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=600&h=450&q=80",
  spa: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&h=450&q=80",
  beauty:
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&h=450&q=80",
};

/** Catálogo informativo de skincare dermatológico premium. */
export const PRODUCTS: Product[] = [
  {
    id: "curacen-essence",
    brand: "Curacen",
    name: "Curacen Essence",
    price: 2800,
    category: "Anti-edad",
    image: "/fotos/productos/curacen-essence.jpg",
  },
  {
    id: "avene-cleanance",
    brand: "Avène",
    name: "Cleanance Gel Limpiador",
    price: 695,
    category: "Limpiadores",
    image: IMG.cleanser,
  },
  {
    id: "avene-thermal",
    brand: "Avène",
    name: "Agua Termal Calmante",
    price: 395,
    category: "Hidratación",
    image: IMG.mist,
  },
  {
    id: "filorga-ncef",
    brand: "Filorga Paris",
    name: "NCEF-Reverse Crema Suprema",
    price: 2950,
    category: "Anti-edad",
    image: IMG.jar,
  },
  {
    id: "filorga-optim-eyes",
    brand: "Filorga Paris",
    name: "Optim-Eyes Contorno de Ojos",
    price: 1580,
    category: "Anti-edad",
    image: IMG.dropper,
  },
  {
    id: "neostrata-foaming",
    brand: "Neostrata",
    name: "Gel Limpiador Espumoso",
    price: 890,
    category: "Limpiadores",
    image: IMG.gel,
  },
  {
    id: "neostrata-bionic",
    brand: "Neostrata",
    name: "Bionic Face Cream",
    price: 1720,
    category: "Anti-edad",
    image: IMG.cream,
  },
  {
    id: "uriage-bariederm",
    brand: "Uriage",
    name: "Bariéderm Cica-Crème Reparadora",
    price: 720,
    category: "Hidratación",
    image: IMG.spa,
  },
  {
    id: "uriage-bariesun",
    brand: "Uriage",
    name: "Bariésun SPF 50+ Fluido",
    price: 650,
    category: "Protectores Solares",
    image: IMG.sunscreen,
  },
  {
    id: "isis-neotone",
    brand: "Isispharma",
    name: "Neotone Serum Despigmentante",
    price: 1380,
    category: "Sueros",
    image: IMG.serum,
  },
  {
    id: "isis-urelia",
    brand: "Isispharma",
    name: "Urelia Gel Keratoregulador",
    price: 780,
    category: "Limpiadores",
    image: IMG.beauty,
  },
  {
    id: "noreva-exfoliac",
    brand: "Noreva",
    name: "Exfoliac Gel Limpiador Purificante",
    price: 590,
    category: "Limpiadores",
    image: IMG.cleanser,
  },
  {
    id: "noreva-cicavit",
    brand: "Noreva",
    name: "Cicavit+ Crema Reparadora",
    price: 840,
    category: "Hidratación",
    image: IMG.cream,
  },
  {
    id: "cumlaude-hidragyn",
    brand: "Cumlaude Lab",
    name: "Hidragyn Gel-Crema Hidratante",
    price: 920,
    category: "Hidratación",
    image: IMG.jar,
  },
  {
    id: "cumlaude-sensiliane",
    brand: "Cumlaude Lab",
    name: "Sensiliane Crema Intensa",
    price: 760,
    category: "Hidratación",
    image: IMG.bottle,
  },
  {
    id: "toskani-ha",
    brand: "Toskani",
    name: "TKN HA 3.5% Suero Hidratante",
    price: 1650,
    category: "Sueros",
    image: IMG.dropper,
  },
  {
    id: "toskani-vitamin-c",
    brand: "Toskani",
    name: "Vitamin C Pro Serum Iluminador",
    price: 1720,
    category: "Sueros",
    image: IMG.serum,
  },
  {
    id: "hd-peel-cleanser",
    brand: "HD Cosmetic Efficiency",
    name: "HD Peel Cleanser",
    price: 1100,
    category: "Limpiadores",
    image: IMG.gel,
  },
  {
    id: "hd-revive",
    brand: "HD Cosmetic Efficiency",
    name: "HD Revive Serum Renovador",
    price: 1980,
    category: "Sueros",
    image: IMG.mist,
  },
  {
    id: "elementre-detox",
    brand: "Elementre",
    name: "Detox Cleansing Gel",
    price: 740,
    category: "Limpiadores",
    image: IMG.beauty,
  },
  {
    id: "elementre-age",
    brand: "Elementre",
    name: "Age Defy Cream",
    price: 1650,
    category: "Anti-edad",
    image: IMG.spa,
  },
  {
    id: "accuderm-foam",
    brand: "Accuderm",
    name: "Gentle Foam Cleanser",
    price: 620,
    category: "Limpiadores",
    image: IMG.cleanser,
  },
  {
    id: "accuderm-retinol",
    brand: "Accuderm",
    name: "Retinol Night Cream",
    price: 1420,
    category: "Anti-edad",
    image: IMG.cream,
  },
];

export type GoogleReview = {
  id: string;
  name: string;
  text: string;
  rating: number;
  localGuide?: boolean;
};

/**
 * Opiniones públicas de Google Business Profile
 * https://www.google.com/maps/place/?q=place_id:0x869f5306600f4c77:0x41c69c6a9ff9a358
 * Rating oficial: 5.0 · 16 opiniones (extraídas 2026-07-14).
 */
export const GOOGLE_REVIEWS = {
  rating: 5.0,
  count: 16,
  reviews: [
    {
      id: "estefania-bernal",
      name: "Estefanía Bernal",
      text: "Excelente atención del Dr Andrés Osuna, se nota la ética profesional desde la consulta, te explica todo sin venderte procedimientos innecesarios. El consultorio impecable, súper limpio y con todas las medidas de higiene. Me sentí en confianza total, resultados naturales, justo lo que buscaba. 100% recomendado",
      rating: 5,
    },
    {
      id: "bestriz-soto",
      name: "Bestriz Soto",
      text: "Excelente atención desde el primer momento. Me hizo sentir súper cómoda y explicó todo con mucho profesionalismo. Los resultados se ven naturales, justo como quería. Sin duda volvería y lo recomiendo muchísimo.",
      rating: 5,
    },
    {
      id: "emma-llorente",
      name: "Emma Llorente",
      text: "Muy buen doctor, todo súper profesional, me encantaron mis labios, para nada dolió y quedaron con muy linda forma. ¡Lo recomiendo totalmente!",
      rating: 5,
    },
    {
      id: "octavio-zazueta",
      name: "Octavio Zazueta",
      text: "Excelente Dr, muy amable y profesional con su trabajo, explica cada procedimiento que va a realizar, súper contento con los resultados, lo recomiendo totalmente.",
      rating: 5,
    },
    {
      id: "lilia-nunez",
      name: "Lilia Nuñez",
      text: "Excelente atención, un médico muy profesional y honesto con sus valoraciones, un trabajo impecable y bonito, ¡recomendado!",
      rating: 5,
    },
    {
      id: "emily-osuna",
      name: "Emily Osuna",
      text: "Excelente doctor!! Le confío 100% mi cara, muy atento con cualquier duda siempre y muy perfeccionista!",
      rating: 5,
    },
    {
      id: "camila-pena",
      name: "Camila Peña",
      text: "Excelente atención y servicio, el Dr. súper amable y explica a detalle cada uno de los procedimientos.",
      rating: 5,
    },
    {
      id: "bryan-avila",
      name: "Bryan Avila",
      text: "Muy buena atención, muy contento con los resultados y el tratamiento, resolvió todas mis dudas y fue muy claro con los cuidados.",
      rating: 5,
      localGuide: true,
    },
    {
      id: "paul-leyva",
      name: "Paul Leyva",
      text: "Muy atento, me explicó muy bien el tratamiento y su seguimiento fue muy oportuno. Volveré con mi esposa.",
      rating: 5,
    },
    {
      id: "maria-urena",
      name: "María Fernanda Ureña",
      text: "Súper recomendado, muy profesional, los mejores productos y cuidado para las pacientes. Lo mejor: sin dolor en procedimientos.",
      rating: 5,
    },
    {
      id: "mayra-morales",
      name: "Mayra Ahilin Morales",
      text: "Excelente el doc, su atención y paciencia para explicar y responder todas mis dudas.",
      rating: 5,
    },
    {
      id: "jose-morales",
      name: "José Antonio Morales",
      text: "Excelente servicio, profesionalismo y calidad en los productos.",
      rating: 5,
    },
  ] satisfies GoogleReview[],
};
