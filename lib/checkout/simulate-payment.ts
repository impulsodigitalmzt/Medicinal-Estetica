import type { CardBrand, CheckoutOrder } from "./types";

export type SimulatedPaymentResult = {
  success: true;
  transactionId: string;
  authorizationCode: string;
  paidAt: string;
  order: CheckoutOrder;
  brand: CardBrand;
  last4: string;
  receiptEmail: string;
};

export type SimulatedPaymentError = {
  success: false;
  code: "card_declined" | "expired_card" | "incorrect_cvc" | "processing_error";
  message: string;
};

function segment() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function generateTransactionId() {
  return `pi_${segment()}${segment()}`.toLowerCase();
}

export function generateAuthorizationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function detectCardBrand(cardNumber: string): CardBrand {
  const n = cardNumber.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return "unknown";
}

export function brandLabel(brand: CardBrand) {
  if (brand === "visa") return "Visa";
  if (brand === "mastercard") return "Mastercard";
  if (brand === "amex") return "American Express";
  return "Tarjeta";
}

function isExpiryValid(expiry: string) {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const end = new Date(year, month, 0, 23, 59, 59);
  return end >= new Date();
}

/**
 * Simulates a payment gateway round-trip (Stripe/Conekta-style).
 * Test cards:
 * - 4242… → éxito
 * - …0002 → rechazada
 */
export async function simulatePayment(
  order: CheckoutOrder,
  card: {
    cardNumber: string;
    expiry: string;
    cvc: string;
    email: string;
  },
  delayMs = 3200,
): Promise<SimulatedPaymentResult> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const digits = card.cardNumber.replace(/\D/g, "");
  const brand = detectCardBrand(digits);

  if (digits.endsWith("0002")) {
    const err: SimulatedPaymentError = {
      success: false,
      code: "card_declined",
      message:
        "Tu banco rechazó el cargo. Prueba otra tarjeta o contacta a tu banco.",
    };
    throw err;
  }

  if (!isExpiryValid(card.expiry)) {
    const err: SimulatedPaymentError = {
      success: false,
      code: "expired_card",
      message: "La tarjeta está vencida. Revisa la fecha de expiración.",
    };
    throw err;
  }

  if (digits.length < 15) {
    const err: SimulatedPaymentError = {
      success: false,
      code: "processing_error",
      message: "Número de tarjeta incompleto. Verifica e intenta de nuevo.",
    };
    throw err;
  }

  return {
    success: true,
    transactionId: generateTransactionId(),
    authorizationCode: generateAuthorizationCode(),
    paidAt: new Date().toISOString(),
    order,
    brand,
    last4: digits.slice(-4),
    receiptEmail: card.email.trim(),
  };
}
