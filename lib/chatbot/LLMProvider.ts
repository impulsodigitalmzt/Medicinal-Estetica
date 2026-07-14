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
    | "closing";
  selectedService: "botox" | "fillers" | "endolift" | null;
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
 *
 * Demo: LocalJSONProvider responde desde KnowledgeBase.json con un
 * setTimeout de ~1.5s para simular «Escribiendo…».
 */
export interface LLMProvider {
  getResponse(msg: string, context: LLMContext): Promise<LLMResponse>;
  getWelcome(): LLMResponse;
}

export function createInitialState(): ConversationState {
  return {
    step: "welcome",
    selectedService: null,
    lead: { name: "", whatsapp: "", email: "" },
  };
}
