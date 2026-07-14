"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { CardFormData } from "@/lib/checkout/types";

type PaymentCardFormProps = {
  value: CardFormData;
  onChange: (field: keyof CardFormData, value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

function formatCardNumber(raw: string) {
  return raw
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function PaymentCardForm({
  value,
  onChange,
  onSubmit,
  disabled,
}: PaymentCardFormProps) {
  const isValid =
    value.holderName.trim().length >= 2 &&
    value.cardNumber.replace(/\s/g, "").length === 16 &&
    value.expiry.length === 5 &&
    value.cvc.length >= 3;

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={(e) => {
        e.preventDefault();
        if (isValid && !disabled) onSubmit();
      }}
      className="glass-luxury rounded-serenity-lg p-5 sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-medium text-luxury-dark">Datos de tarjeta</p>
        <span className="flex items-center gap-1 text-xs text-luxury-text/50">
          <Lock size={12} />
          Demo segura
        </span>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-luxury-text/70">
            Titular
          </span>
          <input
            type="text"
            value={value.holderName}
            onChange={(e) => onChange("holderName", e.target.value)}
            placeholder="Como aparece en la tarjeta"
            className="luxury-input"
            autoComplete="cc-name"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-luxury-text/70">
            Número de tarjeta
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={value.cardNumber}
            onChange={(e) => onChange("cardNumber", formatCardNumber(e.target.value))}
            placeholder="4242 4242 4242 4242"
            className="luxury-input font-mono tracking-wider"
            autoComplete="cc-number"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-luxury-text/70">
              Vencimiento
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={value.expiry}
              onChange={(e) => onChange("expiry", formatExpiry(e.target.value))}
              placeholder="MM/AA"
              className="luxury-input font-mono"
              autoComplete="cc-exp"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-luxury-text/70">
              CVC
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={value.cvc}
              onChange={(e) =>
                onChange("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="123"
              className="luxury-input font-mono"
              autoComplete="cc-csc"
            />
          </label>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-luxury-text/50">
        Simulación sin cargo real. Usa 4242 4242 4242 4242 para probar el flujo.
      </p>

      <button
        type="submit"
        disabled={!isValid || disabled}
        className="btn-luxury-gold mt-6 w-full disabled:cursor-not-allowed disabled:opacity-45"
      >
        Pagar ahora
      </button>
    </motion.form>
  );
}
