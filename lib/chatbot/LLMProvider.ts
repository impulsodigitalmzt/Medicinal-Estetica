import type { ChatMessage, QuickReply } from "./types";

/** Partial conversation state managed by ConversationEngine. */
export type ConversationState = {
  step:
    | "welcome"
    | "need"
    | "service_detail"
    | "ask_name"
    | "ask_whatsapp"
    | "ask_email"
    | "closing"
    | "booking_guide";
  selectedService: "botox" | "fillers" | "endolift" | null;
  /** Index within reservation walkthrough (0-based). */
  bookingGuideIndex: number;
  lead: {
    name: string;
    whatsapp: string;
    email: string;
  };
};

export type LLMLink = { label: string; href: string };

export type LLMContext = {
  history: ChatMessage[];
  state: ConversationState;
  pathname?: string;
};

export type LLMResponse = {
  content: string;
  links?: LLMLink[];
  nextState?: Partial<ConversationState>;
  quickReplies?: QuickReply[];
  /** Prefer longer “analyzing” UI for clinical questions. */
  analyze?: boolean;
};

/**
 * Abstract LLM contract — swap LocalJSONProvider for OpenAI later
 * without touching ChatUI.
 */
export interface LLMProvider {
  getResponse(msg: string, context: LLMContext): Promise<LLMResponse>;
  getWelcome(context?: { pathname?: string }): LLMResponse;
  /** Proactive tip when user opens chat on /reservar. */
  getBookingAssistIntro?(): LLMResponse;
}

export function createInitialState(): ConversationState {
  return {
    step: "welcome",
    selectedService: null,
    bookingGuideIndex: 0,
    lead: { name: "", whatsapp: "", email: "" },
  };
}
