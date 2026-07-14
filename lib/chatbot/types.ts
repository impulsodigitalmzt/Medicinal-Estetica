export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  links?: { label: string; href: string }[];
};

export type QuickReply = {
  id: string;
  label: string;
  message: string;
};
