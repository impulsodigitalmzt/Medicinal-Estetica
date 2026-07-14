/**
 * Public chatbot module API.
 *
 * To switch to OpenAI later:
 *   1. Create OpenAIProvider implements LLMProvider
 *   2. Call getChatEngine(new OpenAIProvider()) or engine.setProvider(...)
 *   3. Leave ChatUI untouched
 */
export type { ChatMessage, ChatRole, QuickReply } from "./types";
export type {
  ConversationState,
  LLMContext,
  LLMLink,
  LLMProvider,
  LLMResponse,
} from "./LLMProvider";
export { createInitialState } from "./LLMProvider";
export { LocalJSONProvider, defaultLLMProvider } from "./LocalJSONProvider";
export { OpenAIProvider } from "./OpenAIProvider";
export {
  ConversationEngine,
  getChatEngine,
  resetChatEngine,
  type ConversationSnapshot,
  type EngineStatus,
} from "./ConversationEngine";
