"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, X } from "lucide-react";
import { buildCheckoutOrder } from "@/lib/checkout/build-order";
import {
  simulatePayment,
  type SimulatedPaymentError,
  type SimulatedPaymentResult,
} from "@/lib/checkout/simulate-payment";
import type { CardFormData, CheckoutOrder, CheckoutStep } from "@/lib/checkout/types";
import OrderSummary from "./OrderSummary";
import PaymentCardForm from "./PaymentCardForm";
import PaymentProcessing from "./PaymentProcessing";
import PaymentSuccess from "./PaymentSuccess";

const EMPTY_CARD: CardFormData = {
  holderName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
  email: "",
};

type CheckoutModalProps = {
  open: boolean;
  onClose: () => void;
  orderInput: {
    serviceId: string;
    serviceName: string;
    categoryName: string;
    price: number;
    priceFrom?: boolean;
    customerName: string;
    customerPhone: string;
    appointmentDate: string;
    appointmentTime: string;
  };
  onSuccess?: (transactionId: string) => void;
  onWhatsApp?: (transactionId: string) => void;
};

export default function CheckoutModal({
  open,
  onClose,
  orderInput,
  onSuccess,
  onWhatsApp,
}: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>("summary");
  const [card, setCard] = useState<CardFormData>(EMPTY_CARD);
  const [order, setOrder] = useState<CheckoutOrder | null>(null);
  const [paymentResult, setPaymentResult] =
    useState<SimulatedPaymentResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep("summary");
    setCard(EMPTY_CARD);
    setOrder(null);
    setPaymentResult(null);
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }
    document.body.style.overflow = "hidden";
    // Prefill email-ish from name is weak; leave email empty.
    // Prefill holder from customer name when available.
    if (orderInput.customerName.trim()) {
      setCard((prev) =>
        prev.holderName
          ? prev
          : { ...prev, holderName: orderInput.customerName.trim() },
      );
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, reset, orderInput.customerName]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "processing") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, step]);

  function handleCardChange(field: keyof CardFormData, value: string) {
    setErrorMessage(null);
    setCard((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePay() {
    const built = buildCheckoutOrder(orderInput);
    setOrder(built);
    setErrorMessage(null);
    setStep("processing");

    try {
      const result = await simulatePayment(built, {
        cardNumber: card.cardNumber,
        expiry: card.expiry,
        cvc: card.cvc,
        email: card.email,
      });
      setPaymentResult(result);
      setStep("success");
      onSuccess?.(result.transactionId);
    } catch (err) {
      const paymentErr = err as SimulatedPaymentError;
      setStep("summary");
      setErrorMessage(
        paymentErr?.message ||
          "No se pudo completar el pago. Intenta de nuevo.",
      );
    }
  }

  function handleClose() {
    if (step === "processing") return;
    onClose();
    reset();
  }

  if (!open) return null;

  const activeOrder = order ?? buildCheckoutOrder(orderInput);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Cerrar checkout"
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            className="relative z-10 flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-gray-200 bg-[#F7F5F0] shadow-2xl sm:rounded-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  <Lock size={12} />
                  Checkout seguro
                </p>
                <h2
                  id="checkout-title"
                  className="mt-0.5 font-serif text-lg text-gray-900"
                >
                  Pasarela de pago
                </h2>
                <p className="text-xs text-gray-500">
                  Dr. Andrés Osuna · Medicina Estética
                </p>
              </div>
              {step !== "processing" && (
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Step indicator */}
            {step !== "success" && (
              <div className="flex items-center gap-2 border-b border-gray-200 bg-white/70 px-5 py-2.5 text-[11px] font-medium text-gray-400 sm:px-6">
                <span
                  className={
                    step === "summary" || step === "error"
                      ? "text-gray-900"
                      : "text-emerald-700"
                  }
                >
                  1. Datos
                </span>
                <span aria-hidden>·</span>
                <span
                  className={
                    step === "processing" ? "text-gray-900" : undefined
                  }
                >
                  2. Autorización
                </span>
                <span aria-hidden>·</span>
                <span>3. Recibo</span>
              </div>
            )}

            <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              <AnimatePresence mode="wait">
                {(step === "summary" || step === "error") && (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    className="space-y-4"
                  >
                    <OrderSummary order={activeOrder} />
                    <PaymentCardForm
                      value={card}
                      onChange={handleCardChange}
                      onSubmit={handlePay}
                      amountLabel={activeOrder.priceLabel.replace(/^Desde\s+/i, "")}
                      errorMessage={errorMessage}
                    />
                  </motion.div>
                )}

                {step === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <PaymentProcessing />
                  </motion.div>
                )}

                {step === "success" && paymentResult && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <PaymentSuccess
                      result={paymentResult}
                      onClose={handleClose}
                      onWhatsApp={
                        onWhatsApp
                          ? () => onWhatsApp(paymentResult.transactionId)
                          : undefined
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
