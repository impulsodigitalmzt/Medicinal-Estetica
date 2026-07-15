import knowledge from "./KnowledgeBase.json";
import type {
  ConversationState,
  LLMContext,
  LLMProvider,
  LLMResponse,
} from "./LLMProvider";
import type { QuickReply } from "./types";

type ServiceId = "botox" | "fillers" | "endolift";
type Knowledge = typeof knowledge;

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function fillTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function matchService(msg: string, kb: Knowledge): ServiceId | null {
  const n = normalize(msg);
  for (const service of Object.values(kb.services)) {
    if (service.keywords.some((k) => n.includes(normalize(k)))) {
      return service.id as ServiceId;
    }
  }
  return null;
}

function matchIntent(msg: string, kb: Knowledge) {
  const n = normalize(msg);
  return kb.intents.find((intent) =>
    intent.keywords.some((k) => n.includes(normalize(k))),
  );
}

function wantsSchedule(msg: string) {
  const n = normalize(msg);
  return /agendar|cita|valoracion|reserva|reservar|si\b|claro|perfecto|adelante/.test(
    n,
  );
}

function wantsBookingGuide(msg: string, kb: Knowledge) {
  const intent = matchIntent(msg, kb);
  if (intent?.id === "booking_help") return true;
  const n = normalize(msg);
  return /paso a paso|guiame|estoy perdido|donde voy|que hago|como reservo|como agendo/.test(
    n,
  );
}

function wantsNextStep(msg: string) {
  const n = normalize(msg);
  return /siguiente|continuar|listo|ya lo hice|hecho|ok\b|dale/.test(n);
}

function wantsRestartGuide(msg: string) {
  const n = normalize(msg);
  return /repetir|desde el inicio|empezar de nuevo|reiniciar/.test(n);
}

function jumpToGuideStep(msg: string): number | null {
  const n = normalize(msg);
  if (/tratamiento|categoria|botox|filler|endolift/.test(n) && /paso|voy|estoy|guia/.test(n))
    return 0;
  if (/horario|hora|calendario|fecha|dia/.test(n)) return 1;
  if (/dato|nombre|telefono|whatsapp/.test(n) && !/dejar mis datos/.test(n))
    return 2;
  if (/pago|pagar|clinica|tarjeta|pasarela/.test(n)) return 3;
  if (/confirma/.test(n)) return 4;
  if (/^tratamiento$/.test(n)) return 0;
  if (/^horario$/.test(n)) return 1;
  if (/^datos$/.test(n)) return 2;
  if (/^pago$/.test(n)) return 3;
  if (/^confirmar$/.test(n)) return 4;
  return null;
}

function serviceLabel(id: ServiceId | null, kb: Knowledge) {
  if (!id) return "medicina estética";
  return kb.services[id]?.label ?? id;
}

function quickRepliesFor(
  key: keyof Knowledge["quickReplies"],
  kb: Knowledge,
): QuickReply[] {
  return kb.quickReplies[key] as QuickReply[];
}

function isOnReservar(pathname?: string) {
  return Boolean(pathname?.startsWith("/reservar"));
}

/**
 * Local mock provider: interview flow + booking guide + FAQ from KnowledgeBase.json.
 */
export class LocalJSONProvider implements LLMProvider {
  private kb: Knowledge;

  constructor(kb: Knowledge = knowledge) {
    this.kb = kb;
  }

  getWelcome(context?: { pathname?: string }): LLMResponse {
    if (isOnReservar(context?.pathname)) {
      return this.startBookingGuide(true);
    }
    return {
      content: this.kb.welcome,
      quickReplies: quickRepliesFor("welcome", this.kb),
      nextState: { step: "welcome", bookingGuideIndex: 0 },
    };
  }

  getBookingAssistIntro(): LLMResponse {
    return this.startBookingGuide(true);
  }

  async getResponse(msg: string, context: LLMContext): Promise<LLMResponse> {
    await new Promise((r) => setTimeout(r, 1500));

    const { state, pathname } = context;
    const trimmed = msg.trim();

    switch (state.step) {
      case "ask_name":
        return this.handleAskName(trimmed, state);
      case "ask_whatsapp":
        return this.handleAskWhatsApp(trimmed, state);
      case "ask_email":
        return this.handleAskEmail(trimmed, state);
      case "closing":
        return this.handleClosingFollowUp(trimmed, state);
      case "service_detail":
        return this.handleAfterService(trimmed, state, pathname);
      case "booking_guide":
        return this.handleBookingGuide(trimmed, state, pathname);
      case "welcome":
      case "need":
      default:
        return this.handleDiscovery(trimmed, state, pathname);
    }
  }

  private startBookingGuide(onPage: boolean): LLMResponse {
    const guide = this.kb.bookingGuide;
    const step0 = guide.steps[0];
    return {
      content: onPage
        ? guide.introOnPage
        : `${guide.introOffPage}\n\n**${step0.title}**\n${step0.body}`,
      links: onPage
        ? undefined
        : [{ label: "Ir a Agendar cita", href: "/reservar" }],
      quickReplies: quickRepliesFor("bookingGuide", this.kb),
      nextState: { step: "booking_guide", bookingGuideIndex: 0 },
      analyze: true,
    };
  }

  private stepResponse(index: number): LLMResponse {
    const guide = this.kb.bookingGuide;
    const steps = guide.steps;
    if (index >= steps.length) {
      return {
        content: guide.done,
        links: [{ label: "Agendar cita", href: "/reservar" }],
        quickReplies: quickRepliesFor("bookingGuideDone", this.kb),
        nextState: {
          step: "booking_guide",
          bookingGuideIndex: steps.length,
        },
      };
    }
    const step = steps[index];
    return {
      content: `**${step.title}**\n${step.body}`,
      quickReplies: quickRepliesFor("bookingGuide", this.kb),
      nextState: { step: "booking_guide", bookingGuideIndex: index },
      analyze: true,
    };
  }

  private handleBookingGuide(
    msg: string,
    state: ConversationState,
    pathname?: string,
  ): LLMResponse {
    const n = normalize(msg);

    if (/dejar mis datos|mis datos de contacto/.test(n)) {
      return {
        content: this.kb.askName,
        nextState: { step: "ask_name" },
      };
    }

    if (wantsRestartGuide(msg)) {
      return this.stepResponse(0);
    }

    if (/perdido|donde voy|ayuda|no se|me trab/.test(n)) {
      return {
        content: this.kb.bookingGuide.lost,
        quickReplies: [
          { id: "t", label: "Tratamiento", message: "Tratamiento" },
          { id: "h", label: "Horario", message: "Horario" },
          { id: "d", label: "Datos", message: "Datos" },
          { id: "p", label: "Pago", message: "Pago" },
          { id: "c", label: "Confirmar", message: "Confirmar" },
          ...quickRepliesFor("bookingGuide", this.kb),
        ],
        nextState: { step: "booking_guide" },
      };
    }

    const jump = jumpToGuideStep(msg);
    if (jump !== null) {
      return this.stepResponse(jump);
    }

    if (wantsNextStep(msg)) {
      const next = (state.bookingGuideIndex ?? 0) + 1;
      return this.stepResponse(next);
    }

    // Allow service Q&A without leaving the guide
    const serviceId = matchService(msg, this.kb);
    if (serviceId) {
      const service = this.kb.services[serviceId];
      return {
        content: `${service.summary}\n\nCuando quieras, seguimos con la reserva: toca **Siguiente paso**.`,
        links: service.links,
        quickReplies: quickRepliesFor("bookingGuide", this.kb),
        nextState: {
          step: "booking_guide",
          selectedService: serviceId,
          bookingGuideIndex: state.bookingGuideIndex,
        },
        analyze: true,
      };
    }

    if (!isOnReservar(pathname) && wantsSchedule(msg)) {
      return {
        content:
          "Perfecto. Abre **Agendar cita** y te sigo guiando ahí mismo. También puedo tomar tus datos ahora si lo prefieres.",
        links: [{ label: "Ir a Agendar cita", href: "/reservar" }],
        quickReplies: [
          ...quickRepliesFor("bookingGuide", this.kb),
          {
            id: "datos",
            label: "Dejar mis datos",
            message: "Quiero dejar mis datos de contacto",
          },
        ],
      };
    }

    return this.stepResponse(state.bookingGuideIndex ?? 0);
  }

  private handleDiscovery(
    msg: string,
    state: ConversationState,
    pathname?: string,
  ): LLMResponse {
    const n = normalize(msg);
    const onReservar = isOnReservar(pathname);

    if (/hola|buenas|buenos|saludos|hey/.test(n) && state.step === "welcome") {
      if (onReservar) return this.startBookingGuide(true);
      return {
        content: this.kb.greeting,
        quickReplies: quickRepliesFor("welcome", this.kb),
        nextState: { step: "need" },
      };
    }

    if (wantsBookingGuide(msg, this.kb) || wantsRestartGuide(msg)) {
      return this.startBookingGuide(onReservar);
    }

    // On /reservar, "agendar" should guide the form, not start lead interview
    const scheduleIntent = matchIntent(msg, this.kb);
    if (scheduleIntent?.id === "schedule" || wantsSchedule(msg)) {
      if (onReservar) return this.startBookingGuide(true);
      return {
        content: this.kb.askName,
        nextState: { step: "ask_name" },
        analyze: true,
      };
    }

    if (scheduleIntent && scheduleIntent.id !== "schedule" && scheduleIntent.id !== "booking_help") {
      return {
        content: scheduleIntent.content ?? this.kb.fallback,
        links: scheduleIntent.links,
        quickReplies: quickRepliesFor("welcome", this.kb),
        analyze: true,
      };
    }

    const serviceId = matchService(msg, this.kb);
    if (serviceId) {
      const service = this.kb.services[serviceId];
      return {
        content: `${service.summary}\n\n${service.followUp}`,
        links: service.links,
        quickReplies: quickRepliesFor("afterService", this.kb),
        nextState: {
          step: "service_detail",
          selectedService: serviceId,
        },
        analyze: true,
      };
    }

    if (onReservar) {
      return this.startBookingGuide(true);
    }

    return {
      content: this.kb.needPrompt,
      quickReplies: quickRepliesFor("welcome", this.kb),
      nextState: { step: "need" },
    };
  }

  private handleAfterService(
    msg: string,
    state: ConversationState,
    pathname?: string,
  ): LLMResponse {
    if (wantsBookingGuide(msg, this.kb)) {
      return this.startBookingGuide(isOnReservar(pathname));
    }

    if (wantsSchedule(msg) || matchIntent(msg, this.kb)?.id === "schedule") {
      if (isOnReservar(pathname)) return this.startBookingGuide(true);
      return {
        content: this.kb.askName,
        nextState: { step: "ask_name" },
      };
    }

    const other = matchService(msg, this.kb);
    if (other) {
      const service = this.kb.services[other];
      return {
        content: `${service.summary}\n\n${service.followUp}`,
        links: service.links,
        quickReplies: quickRepliesFor("afterService", this.kb),
        nextState: {
          step: "service_detail",
          selectedService: other,
        },
        analyze: true,
      };
    }

    const intent = matchIntent(msg, this.kb);
    if (intent && intent.id !== "schedule" && intent.id !== "booking_help") {
      return {
        content: intent.content ?? this.kb.fallback,
        links: intent.links,
        quickReplies: quickRepliesFor("afterService", this.kb),
      };
    }

    return {
      content: this.kb.askName,
      nextState: { step: "ask_name" },
    };
  }

  private handleAskName(
    msg: string,
    state: ConversationState,
  ): LLMResponse {
    if (wantsBookingGuide(msg, this.kb)) {
      return this.startBookingGuide(true);
    }
    if (msg.length < this.kb.validation.nameMinLength) {
      return { content: this.kb.validation.nameInvalid };
    }

    const name = msg.replace(/\s+/g, " ").trim();
    return {
      content: fillTemplate(this.kb.askWhatsApp, { name }),
      nextState: {
        step: "ask_whatsapp",
        lead: { ...state.lead, name },
      },
    };
  }

  private handleAskWhatsApp(
    msg: string,
    state: ConversationState,
  ): LLMResponse {
    const digits = digitsOnly(msg);
    if (digits.length < 10) {
      return { content: this.kb.validation.whatsappInvalid };
    }

    return {
      content: this.kb.askEmail,
      nextState: {
        step: "ask_email",
        lead: { ...state.lead, whatsapp: msg.trim() },
      },
    };
  }

  private handleAskEmail(
    msg: string,
    state: ConversationState,
  ): LLMResponse {
    if (!isValidEmail(msg)) {
      return { content: this.kb.validation.emailInvalid };
    }

    const lead = { ...state.lead, email: msg.trim() };
    const service = serviceLabel(state.selectedService, this.kb);
    const href = state.selectedService
      ? `/reservar?categoria=${state.selectedService}`
      : "/reservar";

    return {
      content: fillTemplate(this.kb.closing, {
        name: lead.name,
        service,
        whatsapp: lead.whatsapp,
        email: lead.email,
      }),
      links: [
        { label: "Agendar valoración", href },
        { label: "Guíame en la reserva", href: "/reservar" },
      ],
      quickReplies: [
        {
          id: "guia",
          label: "Guíame a reservar",
          message: "Ayúdame a reservar paso a paso",
        },
      ],
      nextState: {
        step: "closing",
        lead,
      },
      analyze: true,
    };
  }

  private handleClosingFollowUp(
    msg: string,
    state: ConversationState,
  ): LLMResponse {
    if (wantsBookingGuide(msg, this.kb)) {
      return this.startBookingGuide(true);
    }

    const serviceId = matchService(msg, this.kb);
    if (serviceId) {
      const service = this.kb.services[serviceId];
      return {
        content: `${service.summary}\n\nSi deseas, puedes agendar otra valoración desde el enlace.`,
        links: service.links,
        nextState: { selectedService: serviceId },
      };
    }

    const intent = matchIntent(msg, this.kb);
    if (intent && intent.id !== "schedule" && intent.id !== "booking_help") {
      return {
        content: intent.content ?? this.kb.fallback,
        links: intent.links,
      };
    }

    const href = state.selectedService
      ? `/reservar?categoria=${state.selectedService}`
      : "/reservar";

    return {
      content:
        "Si necesitas algo más, estoy disponible. También puedo guiarte paso a paso en la reserva en línea.",
      links: [
        { label: "Agendar valoración", href },
        { label: "Ver tratamientos", href: "/servicios" },
      ],
      quickReplies: quickRepliesFor("welcome", this.kb),
    };
  }
}

/** Default singleton for the site — swap in OpenAIProvider later. */
export const defaultLLMProvider: LLMProvider = new LocalJSONProvider();
