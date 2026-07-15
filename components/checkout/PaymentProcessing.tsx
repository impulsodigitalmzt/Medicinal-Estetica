"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, CreditCard, ShieldCheck } from "lucide-react";

const STAGES = [
  {
    id: "connect",
    title: "Conectando con la pasarela",
    detail: "Estableciendo canal seguro con el procesador de pagos…",
    icon: ShieldCheck,
  },
  {
    id: "bank",
    title: "Autorizando con tu banco",
    detail: "Verificando fondos y autenticación 3D Secure…",
    icon: Building2,
  },
  {
    id: "confirm",
    title: "Confirmando el cargo",
    detail: "Registrando la autorización y generando tu recibo…",
    icon: CreditCard,
  },
] as const;

export default function PaymentProcessing() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStageIndex(1), 1100),
      window.setTimeout(() => setStageIndex(2), 2200),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const stage = STAGES[stageIndex] ?? STAGES[0];
  const Icon = stage.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm"
    >
      <div className="relative mb-8 h-16 w-16">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-gray-200"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
        <motion.span
          className="absolute inset-1 rounded-full border-2 border-t-emerald-600 border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-emerald-700">
          <Icon size={22} />
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="font-serif text-2xl text-gray-900">{stage.title}</h3>
          <p className="mx-auto mt-3 max-w-xs text-sm text-gray-500">
            {stage.detail}
          </p>
        </motion.div>
      </AnimatePresence>

      <ol className="mt-8 flex w-full max-w-xs flex-col gap-2 text-left text-xs">
        {STAGES.map((s, i) => (
          <li
            key={s.id}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
              i === stageIndex
                ? "bg-emerald-50 font-semibold text-emerald-900"
                : i < stageIndex
                  ? "text-gray-500"
                  : "text-gray-300"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                i < stageIndex
                  ? "bg-emerald-600 text-white"
                  : i === stageIndex
                    ? "bg-emerald-700 text-white"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {i + 1}
            </span>
            {s.title}
          </li>
        ))}
      </ol>

      <p className="mt-6 text-[11px] uppercase tracking-wider text-gray-400">
        No cierres esta ventana
      </p>
    </motion.div>
  );
}
