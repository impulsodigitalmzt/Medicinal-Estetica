"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { SimulatedPaymentResult } from "@/lib/checkout/simulate-payment";
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
  const { order, transactionId } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-luxury relative overflow-hidden rounded-serenity-lg px-6 py-10 text-center sm:px-10"
    >
      <ConfettiBurst active />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
        className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-luxury-accent to-[#C4B896] shadow-float"
      >
        <Check size={36} className="text-luxury-bg" strokeWidth={2.5} />
      </motion.div>

      <h3 className="relative z-10 font-serif text-2xl text-luxury-dark sm:text-3xl">
        ¡Pago confirmado!
      </h3>
      <p className="relative z-10 mt-3 text-sm leading-relaxed text-luxury-text/75">
        Tu reserva para <strong className="font-medium text-luxury-dark">{order.serviceName}</strong>{" "}
        el {formatDateLong(order.appointmentDate)} a las {order.appointmentTime} fue
        registrada correctamente.
      </p>

      <div className="relative z-10 mt-6 rounded-serenity border border-luxury-accent/20 bg-luxury-bg/60 px-4 py-3 text-left text-sm">
        <p className="text-xs uppercase tracking-wide text-luxury-text/50">
          Referencia de transacción
        </p>
        <p className="mt-1 font-mono text-luxury-dark">{transactionId}</p>
        <p className="mt-2 text-luxury-accent">{order.priceLabel}</p>
      </div>

      <div className="relative z-10 mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {onWhatsApp && (
          <button type="button" onClick={onWhatsApp} className="btn-luxury-gold">
            Confirmar por WhatsApp
          </button>
        )}
        <button type="button" onClick={onClose} className="btn-pill-outline">
          Cerrar
        </button>
      </div>
    </motion.div>
  );
}
