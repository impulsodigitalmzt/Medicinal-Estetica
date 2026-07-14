import type { LLMProvider, LLMResponse, ConversationState } from "./LLMProvider";
import { createInitialState } from "./LLMProvider";
import { defaultLLMProvider } from "./LocalJSONProvider";
import { addLead } from "@/lib/leads/demo";
import type { ChatMessage, QuickReply } from "./types";

export type EngineStatus = "idle" | "analyzing" | "typing";

export type ConversationSnapshot = {
  messages: ChatMessage[];
  state: ConversationState;
  quickReplies: QuickReply[];
  status: EngineStatus;
};

function createMessage(
  role: ChatMessage["role"],
  content: string,
  links?: ChatMessage["links"],
): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content,
    links,
  };
}

function mergeState(
  current: ConversationState,
  patch?: Partial<ConversationState>,
): ConversationState {
  if (!patch) return current;
  return {
    ...current,
    ...patch,
    lead: {
      ...current.lead,
      ...(patch.lead ?? {}),
    },
  };
}

/**
 * Owns message history + interview state.
 * UI never talks to the knowledge base or a concrete LLM — only this engine.
 */
export class ConversationEngine {
  private provider: LLMProvider;
  private messages: ChatMessage[] = [];
  private state: ConversationState = createInitialState();
  private quickReplies: QuickReply[] = [];
  private status: EngineStatus = "idle";
  private listeners = new Set<() => void>();
  /** Prevents duplicate Supabase inserts if the closing step re-renders. */
  private leadPersisted = false;
  /** Cached for useSyncExternalStore — must keep referential equality until change. */
  private snapshot: ConversationSnapshot;

  constructor(provider: LLMProvider = defaultLLMProvider) {
    this.provider = provider;
    this.snapshot = this.buildSnapshot();
    void this.bootstrapWelcome();
  }

  /** Swap providers (e.g. OpenAI) without resetting UI code. */
  setProvider(provider: LLMProvider) {
    this.provider = provider;
  }

  /** Welcome with Analizando… → Escribiendo… for a professional first impression. */
  private async bootstrapWelcome() {
    this.status = "analyzing";
    this.commit();
    await delay(520);

    this.status = "typing";
    this.commit();
    await delay(680);

    const welcome = this.provider.getWelcome();
    this.applyAssistantResponse(welcome);
    this.status = "idle";
    this.commit();
  }

  private buildSnapshot(): ConversationSnapshot {
    return {
      messages: this.messages,
      state: this.state,
      quickReplies: this.quickReplies,
      status: this.status,
    };
  }

  /** Publish a new immutable snapshot and notify subscribers. */
  private commit() {
    this.snapshot = this.buildSnapshot();
    this.listeners.forEach((l) => l());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getSnapshot(): ConversationSnapshot {
    return this.snapshot;
  }

  reset() {
    this.messages = [];
    this.state = createInitialState();
    this.quickReplies = [];
    this.status = "idle";
    this.leadPersisted = false;
    this.commit();
    void this.bootstrapWelcome();
  }

  async send(userText: string): Promise<ChatMessage | null> {
    const trimmed = userText.trim();
    if (!trimmed || this.status !== "idle") return null;

    this.messages = [...this.messages, createMessage("user", trimmed)];
    this.quickReplies = [];
    this.status = "analyzing";
    this.commit();
    await delay(350);

    this.status = "typing";
    this.commit();

    // LocalJSONProvider simula IA (~1.5s) mientras status = typing.
    const response = await this.provider.getResponse(trimmed, {
      history: this.messages,
      state: this.state,
    });

    const assistant = this.applyAssistantResponse(response);
    this.status = "idle";
    this.commit();
    return assistant;
  }

  private applyAssistantResponse(response: LLMResponse): ChatMessage {
    this.state = mergeState(this.state, response.nextState);
    this.quickReplies = response.quickReplies ?? [];
    const assistant = createMessage(
      "assistant",
      response.content,
      response.links,
    );
    this.messages = [...this.messages, assistant];

    if (
      this.state.step === "closing" &&
      !this.leadPersisted &&
      this.state.lead.name &&
      this.state.lead.whatsapp &&
      this.state.lead.email
    ) {
      this.leadPersisted = true;
      void this.persistLead();
    }

    return assistant;
  }

  /** Demo: persists lead in localStorage (`leads_demo`) for the dashboard. */
  private persistLead() {
    try {
      const { name, whatsapp, email } = this.state.lead;
      addLead({
        name,
        whatsapp,
        email,
        service: this.state.selectedService,
      });
    } catch (err) {
      console.error("[chatbot] No se pudo guardar el lead en localStorage:", err);
      this.leadPersisted = false;
    }
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Shared site instance — keeps conversation across panel open/close. */
let sharedEngine: ConversationEngine | null = null;

export function getChatEngine(provider?: LLMProvider): ConversationEngine {
  if (!sharedEngine) {
    sharedEngine = new ConversationEngine(provider ?? defaultLLMProvider);
  } else if (provider) {
    sharedEngine.setProvider(provider);
  }
  return sharedEngine;
}

export function resetChatEngine() {
  sharedEngine?.reset();
}
