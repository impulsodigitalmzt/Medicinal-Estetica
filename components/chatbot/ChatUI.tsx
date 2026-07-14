"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Send, X } from "lucide-react";
import ChatBotLogo from "@/components/chatbot/ChatBotLogo";
import type { EngineStatus } from "@/lib/chatbot/ConversationEngine";
import type { ChatMessage, QuickReply } from "@/lib/chatbot/types";

export type ChatUIProps = {
  name: string;
  /** Optional secondary note; transparency legend is always shown. */
  disclaimer?: string;
  messages: ChatMessage[];
  quickReplies: QuickReply[];
  status: EngineStatus;
  input: string;
  onInputChange: (value: string) => void;
  onSend: (text: string) => void;
  onClose: () => void;
  className?: string;
};

function formatContent(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i} className="block">
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j} className="font-medium text-luxury-dark">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={j}>{part}</span>
          ),
        )}
      </span>
    );
  });
}

function StatusBubble({ status }: { status: EngineStatus }) {
  if (status === "idle") return null;

  const label = status === "analyzing" ? "Analizando…" : "Escribiendo…";

  return (
    <div className="flex justify-start">
      <div className="glass-luxury flex items-center gap-2.5 rounded-serenity px-3.5 py-2.5">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-luxury-accent"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.14,
              }}
            />
          ))}
        </div>
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-luxury-text/65">
          {label}
        </span>
      </div>
    </div>
  );
}

/**
 * Presentational chat surface. Receives state from ConversationEngine —
 * never imports LocalJSONProvider or KnowledgeBase directly.
 */
export default function ChatUI({
  name,
  messages,
  quickReplies,
  status,
  input,
  onInputChange,
  onSend,
  onClose,
  className = "",
}: ChatUIProps) {
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = status !== "idle";

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  }, [messages, status, reduceMotion]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-serenity-lg border border-white/50 bg-white/70 shadow-serenity-lg backdrop-blur-2xl ${className}`}
      role="dialog"
      aria-label="Asistente virtual de la clínica"
    >
      <div className="relative border-b border-white/40 bg-gradient-to-r from-luxury-card/90 to-white/80 px-4 py-3.5">
        <div className="flex items-center gap-3 pr-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm ring-1 ring-black/5">
            <ChatBotLogo size={32} isBotTyping={busy} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-luxury-dark">{name}</p>
            <p className="mt-0.5 font-sans text-[10px] font-light tracking-[0.14em] text-luxury-text/45">
              Asistente virtual con IA
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-luxury-text/60 transition-colors hover:bg-white/60 hover:text-luxury-dark"
          aria-label="Cerrar chat"
        >
          <X size={18} />
        </button>
      </div>

      <div
        ref={listRef}
        className="flex max-h-[min(52vh,420px)] flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-serenity px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-luxury-dark text-luxury-bg"
                    : "glass-luxury text-luxury-text"
                }`}
              >
                {formatContent(msg.content)}
                {msg.links && msg.links.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {msg.links.map((link) => (
                      <Link
                        key={link.href + link.label}
                        href={link.href}
                        className="rounded-pill border border-luxury-accent/30 bg-white/70 px-2.5 py-1 text-[11px] font-medium text-luxury-dark transition-colors hover:border-luxury-accent hover:bg-white"
                        onClick={onClose}
                        {...(link.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <StatusBubble status={status} />
      </div>

      {quickReplies.length > 0 && !busy && (
        <div className="flex flex-wrap gap-1.5 border-t border-white/30 px-3 py-2.5">
          {quickReplies.map((qr) => (
            <button
              key={qr.id}
              type="button"
              onClick={() => onSend(qr.message)}
              className="rounded-pill border border-luxury-accent/25 bg-white/50 px-2.5 py-1 text-[11px] font-medium text-luxury-dark transition-all hover:border-luxury-accent hover:bg-white/80"
            >
              {qr.label}
            </button>
          ))}
        </div>
      )}

      <form
        className="border-t border-white/40 bg-white/50 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSend(input);
        }}
      >
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Escribe tu consulta…"
            className="luxury-input flex-1 py-2.5 text-sm"
            disabled={busy}
          />
          <button
            type="submit"
            disabled={!input.trim() || busy}
            className="btn-luxury-gold flex h-11 w-11 shrink-0 items-center justify-center !px-0 disabled:opacity-40"
            aria-label="Enviar mensaje"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
