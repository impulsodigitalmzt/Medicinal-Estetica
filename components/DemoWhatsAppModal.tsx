"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, MessageCircle, X } from "lucide-react";

type DemoWhatsAppModalProps = {
  open: boolean;
  message: string;
  title?: string;
  onClose: () => void;
};

/**
 * Simulación visual de envío por WhatsApp para demos / propuestas.
 * No abre wa.me ni contacta números reales.
 */
export default function DemoWhatsAppModal({
  open,
  message,
  title = "WhatsApp (simulación)",
  onClose,
}: DemoWhatsAppModalProps) {
  const [phase, setPhase] = useState<"sending" | "sent">("sending");

  useEffect(() => {
    if (!open) {
      setPhase("sending");
      return;
    }
    setPhase("sending");
    const t = window.setTimeout(() => setPhase("sent"), 1400);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[110] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Cerrar simulación"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wa-demo-title"
            className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-gray-200 bg-[#E5DDD5] shadow-2xl sm:rounded-2xl"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex items-center justify-between bg-[#075E54] px-4 py-3 text-white">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <MessageCircle size={18} />
                </span>
                <div>
                  <p id="wa-demo-title" className="text-sm font-semibold">
                    {title}
                  </p>
                  <p className="text-[11px] text-white/70">Modo demostración</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="min-h-[220px] px-4 py-5">
              <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-wider text-[#667781]">
                No se envía a un número real · solo demo
              </p>

              <div className="ml-auto max-w-[90%] rounded-lg rounded-tr-sm bg-[#DCF8C6] px-3 py-2 shadow-sm">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900">
                  {message}
                </p>
                <p className="mt-1 text-right text-[10px] text-gray-500">
                  {new Intl.DateTimeFormat("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date())}
                  {phase === "sent" ? " ✓✓" : " ✓"}
                </p>
              </div>

              <div className="mt-6 text-center">
                {phase === "sending" ? (
                  <p className="text-sm text-[#075E54]">Enviando mensaje…</p>
                ) : (
                  <p className="inline-flex items-center gap-1.5 text-sm font-medium text-[#075E54]">
                    <Check size={16} />
                    Mensaje simulado enviado
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-black/5 bg-white px-4 py-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-[#075E54] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064e46]"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
