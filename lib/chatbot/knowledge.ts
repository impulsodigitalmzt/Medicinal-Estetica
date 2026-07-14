import knowledge from "./KnowledgeBase.json";
import type { QuickReply } from "./types";

export const CHATBOT_NAME = knowledge.meta.name;
export const CHATBOT_DISCLAIMER = knowledge.meta.disclaimer;
export const WELCOME_MESSAGE = knowledge.welcome;

export const QUICK_REPLIES: QuickReply[] = knowledge.quickReplies.welcome;
