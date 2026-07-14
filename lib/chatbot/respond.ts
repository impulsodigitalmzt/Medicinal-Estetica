/**
 * Legacy FAQ helpers retained for any external imports.
 * New UI should use ConversationEngine + LLMProvider.
 */
import type { ChatMessage } from "./types";
import { LocalJSONProvider } from "./LocalJSONProvider";
import { createInitialState } from "./LLMProvider";

const provider = new LocalJSONProvider();

export async function generateChatResponse(
  userMessage: string,
): Promise<Omit<ChatMessage, "id" | "role">> {
  const response = await provider.getResponse(userMessage, {
    history: [],
    state: createInitialState(),
  });
  return {
    content: response.content,
    links: response.links,
  };
}

export function createMessage(
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
