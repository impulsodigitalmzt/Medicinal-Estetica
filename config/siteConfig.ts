import type { SiteConfig } from "./types";

/**
 * Marca única del proyecto: Dr. Andrés Osuna Lizárraga
 * Fuente: Facebook Medical & health — Medicina estética y Antienvejecimiento
 * https://www.facebook.com/p/Dr-Andrés-Osuna-Lizárraga-100081845254734/
 */
export const siteConfig: SiteConfig = {
  doctor: {
    shortName: "Dr. Andrés Osuna",
    displayName: "Dr. Andrés Osuna Lizárraga",
    specialty: "Medicina Estética y Antienvejecimiento",
  },
  clinic: {
    name: "Dr. Andrés Osuna Lizárraga",
    fullName: "Medicina Estética y Antienvejecimiento — Dr. Andrés Osuna Lizárraga",
  },
  contact: {
    phone: "669 155 7846",
    phoneE164: "+526691557846",
    whatsapp: "526691557846",
    email: "andresosuna23682@gmail.com",
    address: "Alfonso Ortiz 82, Flamingos",
    city: "Mazatlán",
    state: "Sinaloa",
    postalCode: "82149",
    country: "MX",
    landmark: "Flamingos",
    locationQuery:
      "Dr. Andrés Osuna Lizarraga, Alfonso Ortiz 82, Flamingos, 82149 Mazatlán, Sin., México",
    geo: { latitude: 23.2355625, longitude: -106.3880625 },
  },
  social: {
    facebook:
      "https://www.facebook.com/p/Dr-Andr%C3%A9s-Osuna-Liz%C3%A1rraga-100081845254734/",
    instagram: "https://www.instagram.com/dr_andresosuna/",
    tiktok: null,
    googleReviews:
      "https://www.google.com/maps/place/Dr.+Andr%C3%A9s+Osuna+Lizarraga/@23.2355625,-106.3880625,17z/data=!4m8!3m7!1s0x869f5306600f4c77:0x41c69c6a9ff9a358!8m2!3d23.2355625!4d-106.3880625!9m1!1b1",
    ultherapy: null,
    handles: {
      instagram: "@dr_andresosuna",
    },
  },
  legal: {
    cofeprisNumber: "",
    professionalLicense: "",
    cofeprisNotice: "",
    professionalLicenseNotice: "",
  },
  seo: {
    titleDefault:
      "Dr. Andrés Osuna Lizárraga | Medicina Estética en Mazatlán",
    titleTemplate: "%s | Dr. Andrés Osuna",
    description:
      "Medicina estética y antienvejecimiento con el Dr. Andrés Osuna Lizárraga en Mazatlán. Botox, fillers, Endolift y resultados naturales.",
    keywords: [
      "Dr Andrés Osuna Mazatlán",
      "botox Mazatlán",
      "fillers Mazatlán",
      "Endolift Mazatlán",
      "medicina estética Mazatlán",
      "antienvejecimiento Mazatlán",
    ],
    openGraphDescription:
      "Botox, fillers y Endolift con enfoque natural. Agenda tu cita en línea con el Dr. Andrés Osuna Lizárraga en Mazatlán.",
  },
  copy: {
    heroEyebrow: "Mazatlán · Medicina estética y antienvejecimiento",
    heroHeadline: "Resultados naturales con medicina estética de precisión",
    heroSubcopy:
      "Botox, fillers y Endolift con el Dr. Andrés Osuna Lizárraga. Atención médica cercana y resultados que se ven y se sienten naturales.",
    introTitle: "Medicina estética enfocada en naturalidad",
    introParagraphs: [
      "El Dr. Andrés Osuna Lizárraga combina medicina estética y antienvejecimiento para realzar tu armonía facial sin exageraciones. Cada protocolo inicia con una valoración clínica clara y un plan a tu medida.",
      "Desde labios de impacto natural hasta lifting médico con Endolift, el objetivo es el mismo: verse descansado, fresco y como tú — solo mejor.",
    ],
    footerBlurb:
      "Medicina estética y antienvejecimiento en Mazatlán. Botox, fillers, Endolift y acompañamiento médico personalizado.",
    locationTitle: "Agenda tu cita en Mazatlán",
    locationDescription:
      "Consultorio en Alfonso Ortiz 82, Flamingos. Reserva tu horario en la sección Agendar cita y confirma disponibilidad en línea.",
    storeDescription:
      "Catálogo informativo de skincare dermatológico premium. La orientación y compra de productos se realiza en consulta con el Dr. Andrés Osuna.",
    ultherapyBadge: null,
    finalCtaTitle: "¿Listo para tu próximo tratamiento?",
    finalCtaSubcopy:
      "Agenda tu valoración en línea y descubre el protocolo ideal: Botox, fillers o Endolift.",
    whatsappTechInquiry:
      "Hola, me gustaría información sobre Botox, fillers o Endolift con el Dr. Andrés Osuna Lizárraga.",
    whatsappBookingClinicName: "Dr. Andrés Osuna Lizárraga",
    chatbotWelcome:
      "Hola, soy el asistente virtual del Dr. Andrés Osuna Lizárraga. Puedo orientarte sobre Botox, fillers, Endolift y cómo agendar tu cita en Mazatlán.",
    chatbotGreeting:
      "¡Hola! Bienvenido(a). Puedo ayudarte con medicina estética, antienvejecimiento, precios de referencia o agendar cita con el Dr. Andrés Osuna Lizárraga.",
    chatbotTechReply:
      "Contamos con aparatología médica original certificada: Morpheus 8 (radiofrecuencia fraccionada), Lumecca (luz pulsada intensa) y Alma Prime X (contorno corporal). También ofrecemos Botox, fillers y Endolift. Agenda tu orientación en la sección Agendar cita.",
    processSteps: [
      {
        title: "Agenda tu valoración",
        description:
          "Reserva en línea en Agendar cita. Elige tratamiento, fecha y horario con confirmación rápida y personalizada.",
        image: "/fotos/galeria/agenda-cita.jpg",
      },
      {
        title: "Valoración médica",
        description:
          "El Dr. Andrés evalúa tus objetivos y diseña un protocolo seguro: Botox, fillers, Endolift o combinados.",
        image: "/fotos/doctor/retrato-principal.jpg",
        video: "/videos/botox-room-procedimiento.mp4",
      },
      {
        title: "Resultados naturales",
        description:
          "Tratamientos con enfoque antienvejecimiento y seguimiento clínico para resultados que se ven naturales.",
        image: "/fotos/antes-despues/labios-01.jpg",
        video: "/videos/resultados-labios.mp4",
      },
    ],
    faqs: [
      {
        q: "¿Necesito valoración antes del primer tratamiento?",
        a: "Sí. En la primera visita el Dr. Andrés Osuna evalúa tu caso y propone un protocolo personalizado (Botox, fillers, Endolift u otros).",
      },
      {
        q: "¿Cuáles son los tratamientos principales?",
        a: "Botox para líneas de expresión, fillers (ácido hialurónico) para volumen y armonía facial, y Endolift para tensado/lifting médico mínimamente invasivo.",
      },
      {
        q: "¿Cómo agendo mi cita?",
        a: "Agenda desde la sección Agendar cita: elige tratamiento, fecha y horario en línea. Si lo prefieres, también puedes llamar al 669 155 7846.",
      },
      {
        q: "¿Dónde atienden?",
        a: "Atendemos en Alfonso Ortiz 82, Flamingos, Mazatlán, Sinaloa (C.P. 82149). Confirma horario al agendar tu cita en línea.",
      },
      {
        q: "¿Los tratamientos se ven naturales?",
        a: "Ese es el enfoque del consultorio: realzar sin exagerar. Priorizamos proporciones, seguridad y un resultado fresco y armónico.",
      },
    ],
  },
  hours: [
    { days: "Lunes a Viernes", time: "9:00 – 19:00" },
    { days: "Sábado", time: "9:00 – 15:00" },
    { days: "Domingo", time: "Cerrado" },
  ],
  assets: {
    root: "",
    logo: "/logo.png",
    logoOnDark: "/logo-blanco.png",
    clinicExterior: "/fotos/clinica/consultorio-tratamiento.jpg",
    clinicInterior: "/fotos/clinica/sala-espera.jpg",
    brandStrip: "/brands/andres-osuna/logotipos/marcas.png",
    ultherapyLogo: null,
    heroImage: "/fotos/clinica/botox-room.jpg",
    finalCtaImage: "/fotos/doctor/retrato-principal.jpg",
    equipos: {
      almaPrimeX: "/brands/andres-osuna/equipos/Alma Primex1.png",
      lumecca: "/brands/andres-osuna/equipos/lumecca.png",
      morpheus8: "/brands/andres-osuna/equipos/Morpheus 8.png",
      beforeAfterDir: "/brands/andres-osuna/equipos/antes - despues",
    },
    fotos: { root: "/fotos" },
    videos: {
      root: "/videos",
      doctor: "/videos/doctor-antienvejecimiento.mp4",
      labios: "/videos/resultados-labios.mp4",
      procedimiento: "/videos/botox-room-procedimiento.mp4",
      morpheus8: "/videos/morpheus8-inmode.mp4",
    },
  },
};

export function asset(relativePath: string): string {
  const root = siteConfig.assets.root.replace(/\/$/, "");
  const rel = relativePath.replace(/^\//, "");
  return root ? `${root}/${rel}` : `/${rel}`;
}

export type { SiteConfig };
