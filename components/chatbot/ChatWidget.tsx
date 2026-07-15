"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import ChatUI from "@/components/chatbot/ChatUI";
import ChatBotLogo from "@/components/chatbot/ChatBotLogo";
import {
  getChatEngine,
  type ConversationSnapshot,
} from "@/lib/chatbot/ConversationEngine";
import knowledge from "@/lib/chatbot/KnowledgeBase.json";

const engine = getChatEngine();

function subscribe(onStoreChange: () => void) {
  return engine.subscribe(onStoreChange);
}

function getSnapshot(): ConversationSnapshot {
  return engine.getSnapshot();
}

/**
 * Site shell: floating launcher + panel placement.
 * Response logic lives in ConversationEngine + LLMProvider.
 */
export default function ChatWidget() {
  const pathname = usePathname();
  const onAdmin = pathname?.startsWith("/admin");
  const onBookingPage = pathname?.startsWith("/reservar");
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const isBotTyping = snapshot.status !== "idle";

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");
    await engine.send(trimmed);
  }, []);

  useEffect(() => {
    engine.setPathname(pathname ?? "/");
  }, [pathname]);

  // Al entrar a reservar: abrir el chat solo y enviar la guía automáticamente.
  useEffect(() => {
    if (!onBookingPage) return;

    setOpen(true);
    const timer = window.setTimeout(() => {
      void engine.offerBookingAssistIfNeeded();
    }, 350);

    return () => window.clearTimeout(timer);
  }, [onBookingPage, pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (onAdmin) return null;

  const fabBottom = onBookingPage
    ? "bottom-24 sm:bottom-28"
    : "bottom-4 sm:bottom-6";

  const panelBottom = onBookingPage
    ? "bottom-[8.5rem] sm:bottom-32"
    : "bottom-[6.75rem] sm:bottom-28";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed right-4 z-50 w-[min(100vw-2rem,380px)] sm:right-6 ${panelBottom}`}
          >
            <ChatUI
              name={knowledge.meta.name}
              messages={snapshot.messages}
              quickReplies={snapshot.quickReplies}
              status={snapshot.status}
              input={input}
              onInputChange={setInput}
              onSend={sendMessage}
              onClose={() => setOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`fixed right-4 z-50 flex flex-col items-center gap-1.5 sm:right-6 ${fabBottom}`}
      >
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={
            open
              ? "flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-luxury-dark/85 text-white shadow-serenity-lg backdrop-blur-md"
              : "flex h-[4.25rem] w-[4.25rem] items-center justify-center overflow-visible bg-transparent p-0"
          }
          whileHover={reduceMotion ? undefined : { scale: open ? 1.04 : 1.06 }}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          aria-expanded={open}
          aria-label={open ? "Cerrar asistente" : "Abrir asistente virtual"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <X size={22} strokeWidth={1.75} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center overflow-visible"
              >
                <ChatBotLogo size={64} isBotTyping={isBotTyping} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <p className="max-w-[5.75rem] text-center font-sans text-[9px] font-light leading-tight tracking-[0.16em] text-luxury-text/45">
          Asistente virtual con IA
        </p>
      </div>
    </>
  );
}
