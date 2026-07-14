import { formatPriceMXN } from "@/lib/data";
import type { CheckoutOrder } from "./types";
import { generateTransactionId } from "./simulate-payment";

type BuildOrderInput = {
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

export function buildCheckoutOrder(input: BuildOrderInput): CheckoutOrder {
  return {
    id: generateTransactionId(),
    serviceId: input.serviceId,
    serviceName: input.serviceName,
    categoryName: input.categoryName,
    amountCents: input.price * 100,
    currency: "mxn",
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    appointmentDate: input.appointmentDate,
    appointmentTime: input.appointmentTime,
    priceLabel: formatPriceMXN(input.price, { from: input.priceFrom }),
  };
}
