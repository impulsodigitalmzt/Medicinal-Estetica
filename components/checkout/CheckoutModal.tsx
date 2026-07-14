"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { buildCheckoutOrder } from "@/lib/checkout/build-order";
import { simulatePayment } from "@/lib/checkout/simulate-payment";
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
  const [paymentResult, setPaymentResult] = useState<Awaited<
    ReturnType<typeof simulatePayment>
  > | null>(null);

  const reset = useCallback(() => {
    setStep("summary");
    setCard(EMPTY_CARD);
    setOrder(null);
    setPaymentResult(null);
  }, []);

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "processing") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, step]);

  function handleCardChange(field: keyof CardFormData, value: string) {
    setCard((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePay() {
    const built = buildCheckoutOrder(orderInput);
    setOrder(built);
    setStep("processing");

    try {
      const result = await simulatePayment(built);
      setPaymentResult(result);
      setStep("success");
      onSuccess?.(result.transactionId);
    } catch {
      setStep("summary");
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
            className="absolute inset-0 bg-luxury-dark/55 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            className="relative z-10 flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-serenity-lg border border-luxury-accent/20 bg-luxury-bg/90 shadow-float backdrop-blur-xl sm:rounded-serenity-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-luxury-accent/15 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-accent">
                  Checkout seguro
                </p>
                <h2 id="checkout-title" className="font-serif text-lg text-luxury-dark">
                  Pago en línea
                </h2>
              </div>
              {step !== "processing" && (
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex h-9 w-9 items-center justify-center rounded-pill border border-luxury-accent/25 text-luxury-text transition-colors hover:border-luxury-accent hover:text-luxury-dark"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              <AnimatePresence mode="wait">
                {step === "summary" && (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    className="space-y-5"
                  >
                    <OrderSummary order={activeOrder} />
                    <PaymentCardForm
                      value={card}
                      onChange={handleCardChange}
                      onSubmit={handlePay}
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
