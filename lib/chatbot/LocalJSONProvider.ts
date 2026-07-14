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

/**
 * Local mock provider: interview flow + FAQ intents from KnowledgeBase.json.
 * Replace with OpenAIProvider later implementing the same LLMProvider interface.
 */
export class LocalJSONProvider implements LLMProvider {
  private kb: Knowledge;

  constructor(kb: Knowledge = knowledge) {
    this.kb = kb;
  }

  getWelcome(): LLMResponse {
    return {
      content: this.kb.welcome,
      quickReplies: quickRepliesFor("welcome", this.kb),
      nextState: { step: "welcome" },
    };
  }

  async getResponse(msg: string, context: LLMContext): Promise<LLMResponse> {
    // Simula procesamiento de IA (~1.5s) mientras la UI muestra «Escribiendo…».
    await new Promise((r) => setTimeout(r, 1500));

    const { state } = context;
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
        return this.handleAfterService(trimmed, state);
      case "welcome":
      case "need":
      default:
        return this.handleDiscovery(trimmed, state);
    }
  }

  private handleDiscovery(
    msg: string,
    state: ConversationState,
  ): LLMResponse {
    const n = normalize(msg);

    if (/hola|buenas|buenos|saludos|hey/.test(n) && state.step === "welcome") {
      return {
        content: this.kb.greeting,
        quickReplies: quickRepliesFor("welcome", this.kb),
        nextState: { step: "need" },
      };
    }

    const scheduleIntent = matchIntent(msg, this.kb);
    if (scheduleIntent?.id === "schedule" || wantsSchedule(msg)) {
      return {
        content: this.kb.askName,
        nextState: { step: "ask_name" },
        analyze: true,
      };
    }

    if (scheduleIntent && scheduleIntent.id !== "schedule") {
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

    return {
      content: this.kb.needPrompt,
      quickReplies: quickRepliesFor("welcome", this.kb),
      nextState: { step: "need" },
    };
  }

  private handleAfterService(
    msg: string,
    state: ConversationState,
  ): LLMResponse {
    if (wantsSchedule(msg) || matchIntent(msg, this.kb)?.id === "schedule") {
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
    if (intent && intent.id !== "schedule") {
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
        { label: "Ver ubicación", href: "/ubicacion" },
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
    if (intent && intent.id !== "schedule") {
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
        "Si necesitas algo más, estoy disponible. También puedes agendar tu valoración en línea cuando gustes.",
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
