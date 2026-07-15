"use client";

import { motion } from "framer-motion";
import { Check, Receipt } from "lucide-react";
import type { SimulatedPaymentResult } from "@/lib/checkout/simulate-payment";
import { brandLabel } from "@/lib/checkout/simulate-payment";
import { formatDateLong } from "@/lib/booking-helpers";
import ConfettiBurst from "./ConfettiBurst";

type PaymentSuccessProps = {
  result: SimulatedPaymentResult;
  onClose: () => void;
  onWhatsApp?: () => void;
};

export default function PaymentSuccess({
  result,
  onClose,
  onWhatsApp,
}: PaymentSuccessProps) {
  const { order, transactionId, authorizationCode, brand, last4, receiptEmail, paidAt } =
    result;

  const paidLabel = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(paidAt));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-8 text-center shadow-sm sm:px-8"
    >
      <ConfettiBurst active />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
        className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 shadow-lg"
      >
        <Check size={32} className="text-white" strokeWidth={2.5} />
      </motion.div>

      <h3 className="relative z-10 font-serif text-2xl text-gray-900 sm:text-3xl">
        Pago autorizado
      </h3>
      <p className="relative z-10 mt-2 text-sm text-gray-500">
        Cargo aprobado · {paidLabel}
      </p>

      <div className="relative z-10 mt-6 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 text-left">
        <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3">
          <Receipt size={15} className="text-gray-500" />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
            Comprobante
          </p>
        </div>
        <dl className="space-y-3 px-4 py-4 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">Comercio</dt>
            <dd className="font-medium text-gray-900">Dr. Andrés Osuna</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">Concepto</dt>
            <dd className="text-right font-medium text-gray-900">
              {order.serviceName}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">Cita</dt>
            <dd className="text-right text-gray-800">
              {formatDateLong(order.appointmentDate)} · {order.appointmentTime}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">Método</dt>
            <dd className="font-medium text-gray-900">
              {brandLabel(brand)} ···· {last4}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">Autorización</dt>
            <dd className="font-mono text-gray-900">{authorizationCode}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">ID de pago</dt>
            <dd className="max-w-[11rem] truncate font-mono text-xs text-gray-700">
              {transactionId}
            </dd>
          </div>
          {receiptEmail ? (
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500">Recibo a</dt>
              <dd className="truncate text-gray-800">{receiptEmail}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-3 border-t border-gray-200 pt-3">
            <dt className="font-semibold text-gray-900">Total cobrado</dt>
            <dd className="font-serif text-xl text-gray-900">{order.priceLabel}</dd>
          </div>
        </dl>
      </div>

      <p className="relative z-10 mt-4 text-xs text-gray-400">
        Simulación de pasarela · sin cargo bancario real
      </p>

      <div className="relative z-10 mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
        {onWhatsApp && (
          <button
            type="button"
            onClick={onWhatsApp}
            className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1ebe57]"
          >
            Simular envío por WhatsApp
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
        >
          Listo
        </button>
      </div>
    </motion.div>
  );
}
