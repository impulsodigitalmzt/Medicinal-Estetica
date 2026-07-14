import type { CheckoutOrder } from "./types";

export type SimulatedPaymentResult = {
  success: true;
  transactionId: string;
  paidAt: string;
  order: CheckoutOrder;
};

export function generateTransactionId() {
  const segment = () => Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CLS-${segment()}-${segment()}`;
}

/** Simulates a payment gateway round-trip (replace with Stripe confirmPayment later) */
export async function simulatePayment(
  order: CheckoutOrder,
  delayMs = 2400,
): Promise<SimulatedPaymentResult> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  return {
    success: true,
    transactionId: generateTransactionId(),
    paidAt: new Date().toISOString(),
    order,
  };
}
