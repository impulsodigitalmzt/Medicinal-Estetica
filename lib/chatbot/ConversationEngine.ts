import type { LLMProvider, LLMResponse, ConversationState } from "./LLMProvider";
import { createInitialState } from "./LLMProvider";
import { defaultLLMProvider } from "./LocalJSONProvider";
import { addLead } from "@/lib/leads/demo";
import type { ChatMessage, QuickReply } from "./types";
import {
  mapProgressToGuideIndex,
  getLatestBookingProgress,
  type BookingUiProgress,
} from "@/lib/booking/progress";

export type EngineStatus = "idle" | "analyzing" | "typing";

export type ConversationSnapshot = {
  messages: ChatMessage[];
  state: ConversationState;
  quickReplies: QuickReply[];
  status: EngineStatus;
};

/** Saved chat bag so /reservar and el resto del sitio no mezclan mensajes. */
type ChatBag = {
  messages: ChatMessage[];
  state: ConversationState;
  quickReplies: QuickReply[];
  bookingAssistShown: boolean;
  leadPersisted: boolean;
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

function emptyBag(): ChatBag {
  return {
    messages: [],
    state: createInitialState(),
    quickReplies: [],
    bookingAssistShown: false,
    leadPersisted: false,
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
  /** Prevents duplicate lead inserts if the closing step re-renders. */
  private leadPersisted = false;
  private pathname = "/";
  private bookingAssistShown = false;
  /** Highest guide index requested by page sync (coalesced while typing). */
  private pendingGuideTarget: number | null = null;
  private guideSyncing = false;
  private lastProgressMeta: Pick<
    BookingUiProgress,
    "isHighEnd" | "serviceName"
  > = { isHighEnd: false };
  /** Bumps on pathname switch — cancela saludos/avances de otro contexto. */
  private pathEpoch = 0;
  private siteBag: ChatBag | null = null;
  private mode: "site" | "booking" = "site";
  /** Último completed del formulario — si baja, reinicia la guía. */
  private lastUiCompleted = 0;
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

  setPathname(pathname: string) {
    const next = pathname || "/";
    const wasBooking = this.pathname.startsWith("/reservar");
    const nowBooking = next.startsWith("/reservar");

    if (next === this.pathname) return;

    this.pathname = next;
    this.pathEpoch += 1;
    this.pendingGuideTarget = null;

    if (!wasBooking && nowBooking) {
      this.siteBag = this.stash();
      // Cada visita a /reservar empieza la guía desde cero.
      this.lastUiCompleted = 0;
      this.applyBag(emptyBag(), "booking");
      this.commit();
      return;
    }

    if (wasBooking && !nowBooking) {
      // No conserva mensajes de reserva fuera de /reservar.
      this.lastUiCompleted = 0;
      this.applyBag(this.siteBag ?? emptyBag(), "site");
      this.commit();
      if (this.messages.length === 0 && this.status === "idle") {
        void this.bootstrapWelcome();
      }
    }
  }

  /**
   * Limpia el hilo de reserva y vuelve a empezar (nueva cita).
   */
  async restartBookingGuide(progress?: BookingUiProgress | null) {
    if (this.mode !== "booking" && !this.pathname.startsWith("/reservar")) {
      return;
    }

    this.pathEpoch += 1;
    const epoch = this.pathEpoch;
    this.pendingGuideTarget = null;
    this.guideSyncing = false;
    this.messages = [];
    this.state = createInitialState();
    this.quickReplies = [];
    this.bookingAssistShown = false;
    this.status = "idle";
    this.mode = "booking";
    this.commit();

    const p = progress ?? getLatestBookingProgress();
    this.lastUiCompleted = p?.completed ?? 0;

    if (!p || p.completed <= 0) {
      await this.offerBookingAssistIfNeeded();
      return;
    }

    // Ya hay progreso en el formulario: un solo mensaje del paso actual.
    this.lastProgressMeta = {
      isHighEnd: p.isHighEnd,
      serviceName: p.serviceName,
    };
    const target = mapProgressToGuideIndex(p);
    this.bookingAssistShown = true;

    if (target <= 0) {
      await this.offerBookingAssistIfNeeded();
      return;
    }

    const response = this.provider.getBookingGuideStep?.(target, {
      aware: true,
      isHighEnd: p.isHighEnd,
      serviceName: p.serviceName,
    });
    if (!response || epoch !== this.pathEpoch) return;

    this.status = "analyzing";
    this.commit();
    await delay(350);
    if (epoch !== this.pathEpoch) return;
    this.status = "typing";
    this.commit();
    await delay(700);
    if (epoch !== this.pathEpoch) return;

    this.applyAssistantResponse(response);
    this.status = "idle";
    this.commit();
  }

  private stash(): ChatBag {
    return {
      messages: this.messages,
      state: this.state,
      quickReplies: this.quickReplies,
      bookingAssistShown: this.bookingAssistShown,
      leadPersisted: this.leadPersisted,
    };
  }

  private applyBag(bag: ChatBag, mode: "site" | "booking") {
    this.mode = mode;
    this.messages = bag.messages;
    this.state = bag.state;
    this.quickReplies = bag.quickReplies;
    this.bookingAssistShown = bag.bookingAssistShown;
    this.leadPersisted = bag.leadPersisted;
    this.status = "idle";
    this.guideSyncing = false;
    this.pendingGuideTarget = null;
  }

  /**
   * Auto-advance booking guide when /reservar UI completes a stage.
   * Jumps to the highest pending step (no fake “Siguiente paso” from the user).
   */
  async syncBookingProgress(progress: BookingUiProgress) {
    if (!this.pathname.startsWith("/reservar") || this.mode !== "booking") {
      return;
    }

    this.lastProgressMeta = {
      isHighEnd: progress.isHighEnd,
      serviceName: progress.serviceName,
    };

    // El usuario empezó otra reserva (formulario atrás): limpiar y reiniciar.
    if (progress.completed < this.lastUiCompleted) {
      await this.restartBookingGuide(progress);
      return;
    }
    this.lastUiCompleted = progress.completed;

    const target = mapProgressToGuideIndex(progress);
    if (target <= 0) return;

    const current = this.state.bookingGuideIndex ?? 0;
    if (target <= current && this.state.step === "booking_guide") return;

    this.pendingGuideTarget =
      this.pendingGuideTarget === null
        ? target
        : Math.max(this.pendingGuideTarget, target);

    await this.flushBookingGuideSync();
  }

  private async flushBookingGuideSync() {
    if (this.guideSyncing) return;
    this.guideSyncing = true;
    const epoch = this.pathEpoch;

    try {
      while (this.pendingGuideTarget !== null) {
        if (epoch !== this.pathEpoch || this.mode !== "booking") {
          this.pendingGuideTarget = null;
          return;
        }

        for (let i = 0; i < 32 && this.status !== "idle"; i++) {
          await delay(120);
        }
        if (epoch !== this.pathEpoch || this.mode !== "booking") {
          this.pendingGuideTarget = null;
          return;
        }
        if (this.status !== "idle") return;

        const interviewing = ["ask_name", "ask_whatsapp", "ask_email"].includes(
          this.state.step,
        );
        if (interviewing) {
          this.pendingGuideTarget = null;
          return;
        }

        if (this.state.step !== "booking_guide") {
          await this.offerBookingAssistIfNeeded();
          for (let i = 0; i < 20 && this.status !== "idle"; i++) {
            await delay(100);
          }
          if (epoch !== this.pathEpoch || this.mode !== "booking") {
            this.pendingGuideTarget = null;
            return;
          }
        }

        const target = this.pendingGuideTarget;
        this.pendingGuideTarget = null;
        if (target === null) break;

        const current = this.state.bookingGuideIndex ?? 0;
        if (this.state.step === "booking_guide" && target <= current) {
          continue;
        }

        const response = this.provider.getBookingGuideStep?.(target, {
          aware: true,
          isHighEnd: this.lastProgressMeta.isHighEnd,
          serviceName: this.lastProgressMeta.serviceName,
        });
        if (!response) return;

        this.quickReplies = [];
        this.status = "analyzing";
        this.commit();
        await delay(420);
        if (epoch !== this.pathEpoch || this.mode !== "booking") return;

        this.status = "typing";
        this.commit();
        await delay(900);
        if (epoch !== this.pathEpoch || this.mode !== "booking") return;

        this.applyAssistantResponse(response);
        this.status = "idle";
        this.commit();
      }
    } finally {
      this.guideSyncing = false;
      if (
        this.pendingGuideTarget !== null &&
        this.mode === "booking" &&
        epoch === this.pathEpoch
      ) {
        if (this.status === "idle") {
          void this.flushBookingGuideSync();
        } else {
          void delay(200).then(() => this.flushBookingGuideSync());
        }
      }
    }
  }

  /**
   * Proactive booking guide when user lands on /reservar.
   * Waits for the engine to be idle so it works even if welcome is still typing.
   */
  async offerBookingAssistIfNeeded() {
    if (!this.pathname.startsWith("/reservar") || this.mode !== "booking") {
      return;
    }
    if (this.bookingAssistShown) return;

    const epoch = this.pathEpoch;

    for (let i = 0; i < 24 && this.status !== "idle"; i++) {
      await delay(150);
    }
    if (epoch !== this.pathEpoch || this.mode !== "booking") return;
    if (this.status !== "idle") return;
    if (this.bookingAssistShown) return;

    const interviewing = ["ask_name", "ask_whatsapp", "ask_email"].includes(
      this.state.step,
    );
    if (interviewing) return;

    if (this.state.step === "booking_guide") {
      this.bookingAssistShown = true;
      return;
    }

    const intro = this.provider.getBookingAssistIntro?.();
    if (!intro) return;

    this.bookingAssistShown = true;

    const userHasSpoken = this.messages.some((m) => m.role === "user");
    if (!userHasSpoken) {
      this.messages = [];
    }

    this.quickReplies = [];
    this.status = "analyzing";
    this.commit();
    await delay(500);
    if (epoch !== this.pathEpoch || this.mode !== "booking") return;

    this.status = "typing";
    this.commit();
    await delay(1100);
    if (epoch !== this.pathEpoch || this.mode !== "booking") return;

    this.applyAssistantResponse(intro);
    this.status = "idle";
    this.commit();

    const latest = getLatestBookingProgress();
    if (latest && latest.completed > 0) {
      void this.syncBookingProgress(latest);
    }
  }

  /** Welcome with Analizando… → Escribiendo… for a professional first impression. */
  private async bootstrapWelcome() {
    const epoch = this.pathEpoch;
    this.status = "analyzing";
    this.commit();
    await delay(520);
    if (epoch !== this.pathEpoch) return;

    this.status = "typing";
    this.commit();
    await delay(680);
    if (epoch !== this.pathEpoch) return;

    // Solo saludo de sitio aquí; en /reservar usa offerBookingAssistIfNeeded.
    if (this.pathname.startsWith("/reservar") || this.mode === "booking") {
      this.status = "idle";
      this.commit();
      return;
    }

    const welcome = this.provider.getWelcome({ pathname: this.pathname });
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
    this.bookingAssistShown = false;
    this.pendingGuideTarget = null;
    this.lastUiCompleted = 0;
    this.siteBag = null;
    this.mode = this.pathname.startsWith("/reservar") ? "booking" : "site";
    this.pathEpoch += 1;
    this.commit();
    if (this.mode === "booking") {
      void this.restartBookingGuide(getLatestBookingProgress());
    } else {
      void this.bootstrapWelcome();
    }
  }

  async send(userText: string): Promise<ChatMessage | null> {
    const trimmed = userText.trim();
    if (!trimmed || this.status !== "idle") return null;

    // «Repetir guía» / reinicio: limpia el hilo de reserva.
    if (
      this.mode === "booking" &&
      /repite la guia|desde el inicio|reinicia(r)? (la )?guia/.test(
        trimmed
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
      )
    ) {
      await this.restartBookingGuide(getLatestBookingProgress());
      return null;
    }

    const epoch = this.pathEpoch;

    this.messages = [...this.messages, createMessage("user", trimmed)];
    this.quickReplies = [];
    this.status = "analyzing";
    this.commit();
    await delay(350);
    if (epoch !== this.pathEpoch) return null;

    this.status = "typing";
    this.commit();

    const response = await this.provider.getResponse(trimmed, {
      history: this.messages,
      state: this.state,
      pathname: this.pathname,
    });

    if (epoch !== this.pathEpoch) return null;

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

  /** Persists lead in localStorage (`leads_demo`) for the dashboard. */
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
