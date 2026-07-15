"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import type { CardFormData } from "@/lib/checkout/types";
import { brandLabel, detectCardBrand } from "@/lib/checkout/simulate-payment";

type PaymentCardFormProps = {
  value: CardFormData;
  onChange: (field: keyof CardFormData, value: string) => void;
  onSubmit: () => void;
  amountLabel: string;
  disabled?: boolean;
  errorMessage?: string | null;
};

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function BrandMark({ brand }: { brand: ReturnType<typeof detectCardBrand> }) {
  if (brand === "visa") {
    return (
      <span className="rounded bg-[#1A1F71] px-2 py-0.5 text-[10px] font-bold italic tracking-wide text-white">
        VISA
      </span>
    );
  }
  if (brand === "mastercard") {
    return (
      <span className="inline-flex items-center">
        <span className="-mr-1.5 h-4 w-4 rounded-full bg-[#EB001B]" />
        <span className="h-4 w-4 rounded-full bg-[#F79E1B]/40" />
      </span>
    );
  }
  if (brand === "amex") {
    return (
      <span className="rounded bg-[#2E77BC] px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white">
        AMEX
      </span>
    );
  }
  return <CreditCard size={16} className="text-white/70" />;
}

export default function PaymentCardForm({
  value,
  onChange,
  onSubmit,
  amountLabel,
  disabled,
  errorMessage,
}: PaymentCardFormProps) {
  const digits = value.cardNumber.replace(/\s/g, "");
  const brand = detectCardBrand(digits);
  const maskedPreview =
    digits.length === 0
      ? "•••• •••• •••• ••••"
      : formatCardNumber(digits.padEnd(16, "•")).slice(0, 19);

  const isValid = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim());
    const cvcLen = brand === "amex" ? 4 : 3;
    return (
      value.holderName.trim().length >= 2 &&
      emailOk &&
      digits.length >= 15 &&
      value.expiry.length === 5 &&
      value.cvc.length >= cvcLen
    );
  }, [value, digits.length, brand]);

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={(e) => {
        e.preventDefault();
        if (isValid && !disabled) onSubmit();
      }}
      className="space-y-4"
    >
      {/* Live card preview */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black p-5 text-white shadow-xl">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"
        />
        <div className="relative flex items-start justify-between">
          <div className="h-8 w-11 rounded-md bg-gradient-to-br from-amber-200 to-amber-500/80 opacity-90" />
          <BrandMark brand={brand} />
        </div>
        <p className="relative mt-8 font-mono text-lg tracking-[0.18em] sm:text-xl">
          {maskedPreview}
        </p>
        <div className="relative mt-5 flex items-end justify-between gap-3 text-xs">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-white/45">
              Titular
            </p>
            <p className="truncate font-medium uppercase tracking-wide text-white/90">
              {value.holderName.trim() || "NOMBRE DEL TITULAR"}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] uppercase tracking-wider text-white/45">
              Vence
            </p>
            <p className="font-mono text-white/90">{value.expiry || "MM/AA"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900">Pago con tarjeta</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
            <Lock size={11} />
            TLS 1.3
          </span>
        </div>

        {/* Brand strip */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-[10px] font-bold italic text-[#1A1F71]">
            VISA
          </span>
          <span className="inline-flex items-center rounded border border-gray-200 bg-gray-50 px-2 py-1">
            <span className="-mr-1 h-3 w-3 rounded-full bg-[#EB001B]" />
            <span className="h-3 w-3 rounded-full bg-[#F79E1B]/50" />
          </span>
          <span className="rounded border border-gray-200 bg-gray-50 px-1.5 py-1 text-[9px] font-bold text-[#2E77BC]">
            AMEX
          </span>
          <span className="text-[11px] text-gray-400">
            {brand !== "unknown" ? brandLabel(brand) : "Detectamos tu tarjeta al escribir"}
          </span>
        </div>

        <div className="space-y-3.5">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-gray-600">
              Correo del recibo
            </span>
            <input
              type="email"
              value={value.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="paciente@email.com"
              className="luxury-input"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-gray-600">
              Nombre del titular
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
            <span className="mb-1.5 block text-xs font-semibold text-gray-600">
              Número de tarjeta
            </span>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={value.cardNumber}
                onChange={(e) =>
                  onChange("cardNumber", formatCardNumber(e.target.value))
                }
                placeholder="4242 4242 4242 4242"
                className="luxury-input pr-12 font-mono tracking-wider"
                autoComplete="cc-number"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                {brand === "unknown" ? (
                  <CreditCard size={16} className="text-gray-400" />
                ) : (
                  <BrandMark brand={brand} />
                )}
              </span>
            </div>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-600">
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
              <span className="mb-1.5 block text-xs font-semibold text-gray-600">
                CVC
              </span>
              <input
                type="password"
                inputMode="numeric"
                value={value.cvc}
                onChange={(e) =>
                  onChange("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder={brand === "amex" ? "1234" : "123"}
                className="luxury-input font-mono"
                autoComplete="cc-csc"
              />
            </label>
          </div>
        </div>

        {errorMessage ? (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800"
          >
            {errorMessage}
          </p>
        ) : (
          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            Tus datos viajan cifrados. Aceptamos Visa, Mastercard y American
            Express.
          </p>
        )}

        <button
          type="submit"
          disabled={!isValid || disabled}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a1a1a] px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Lock size={15} />
          Pagar {amountLabel} MXN
        </button>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] uppercase tracking-wider text-gray-400">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-600" />
            Cifrado 256-bit
          </span>
          <span>PCI DSS</span>
          <span>3D Secure</span>
        </div>
      </div>
    </motion.form>
  );
}
