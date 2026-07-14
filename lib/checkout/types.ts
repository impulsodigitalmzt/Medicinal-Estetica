export type CheckoutStep = "summary" | "processing" | "success";

export type CardFormData = {
  holderName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

export type CheckoutOrder = {
  id: string;
  serviceId: string;
  serviceName: string;
  categoryName: string;
  amountCents: number;
  currency: "mxn";
  customerName: string;
  customerPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  priceLabel: string;
};

/** Shape compatible with a future Stripe PaymentIntent metadata payload */
export type PaymentIntentMetadata = {
  serviceId: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  customerName: string;
  customerPhone: string;
};
