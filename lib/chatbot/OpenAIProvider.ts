import type { LLMContext, LLMProvider, LLMResponse } from "./LLMProvider";

/**
 * Future OpenAI-backed provider.
 * Implement getResponse with the official SDK / fetch to /api/chat.
 * ChatUI and ConversationEngine stay unchanged when you swap providers.
 *
 * Example:
 *   getChatEngine(new OpenAIProvider({ apiKey: process.env.OPENAI_API_KEY }))
 */
export class OpenAIProvider implements LLMProvider {
  constructor(
    private readonly options: {
      apiKey?: string;
      model?: string;
      endpoint?: string;
    } = {},
  ) {}

  getWelcome(): LLMResponse {
    return {
      content:
        "Hola, soy el Asistente Virtual del Dr. Andrés Osuna. (OpenAIProvider pendiente de configurar).",
      nextState: { step: "welcome" },
    };
  }

  async getResponse(_msg: string, _context: LLMContext): Promise<LLMResponse> {
    void this.options;
    throw new Error(
      "OpenAIProvider no está configurado. Usa LocalJSONProvider o implementa la llamada a OpenAI aquí.",
    );
  }
}
