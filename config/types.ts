export type SiteHours = {

  days: string;

  time: string;

};



export type SiteFaq = {

  q: string;

  a: string;

};



export type ProcessStep = {

  title: string;

  description: string;

  image: string;

  /** Video vertical opcional (reels clinicos). Si existe, tiene prioridad sobre image. */

  video?: string;

};



export type SiteConfig = {

  doctor: {

    shortName: string;

    displayName: string;

    specialty: string;

  };

  clinic: {

    name: string;

    fullName: string;

  };

  contact: {

    phone: string;

    phoneE164: string;

    whatsapp: string;

    email: string | null;

    address: string;

    city: string;

    state: string;

    postalCode: string;

    country: string;

    landmark: string;

    locationQuery: string;

    geo: { latitude: number; longitude: number };

  };

  social: {

    facebook: string | null;

    instagram: string | null;

    tiktok: string | null;

    googleReviews: string | null;

    ultherapy: string | null;

    handles: {

      facebook?: string;

      instagram?: string;

      tiktok?: string;

    };

  };

  legal: {

    cofeprisNumber: string;

    professionalLicense: string;

    cofeprisNotice: string;

    professionalLicenseNotice: string;

  };

  seo: {

    titleDefault: string;

    titleTemplate: string;

    description: string;

    keywords: string[];

    openGraphDescription: string;

  };

  copy: {

    heroEyebrow: string;

    heroHeadline: string;

    heroSubcopy: string;

    introTitle: string;

    introParagraphs: string[];

    footerBlurb: string;

    locationTitle: string;

    locationDescription: string;

    storeDescription: string;

    ultherapyBadge: string | null;

    finalCtaTitle: string;

    finalCtaSubcopy: string;

    whatsappTechInquiry: string;

    whatsappBookingClinicName: string;

    chatbotWelcome: string;

    chatbotGreeting: string;

    chatbotTechReply: string;

    processSteps: ProcessStep[];

    faqs: SiteFaq[];

  };

  hours: SiteHours[];

  assets: {

    root: string;

    logo: string;
    /** Versión clara del logo para fondos oscuros (hero, footer). */
    logoOnDark: string;

    clinicExterior: string;

    clinicInterior: string;

    brandStrip: string;

    ultherapyLogo: string | null;

    heroImage: string;

    finalCtaImage: string;

    equipos: {

      almaPrimeX: string;

      lumecca: string;

      morpheus8: string;

      beforeAfterDir: string;

    };

    fotos: { root: string };

    videos: {

      root: string;

      doctor: string;

      labios: string;

      procedimiento: string;

      morpheus8: string;

    };

  };

};


