"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, CreditCard, User } from "lucide-react";
import type { CheckoutOrder } from "@/lib/checkout/types";
import { formatDateLong } from "@/lib/booking-helpers";

type OrderSummaryProps = {
  order: CheckoutOrder;
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="glass-luxury rounded-serenity-lg p-5 sm:p-6"
    >
      <motion.p variants={item} className="section-label mb-1">
        Resumen
      </motion.p>
      <motion.h3 variants={item} className="font-serif text-xl text-luxury-dark">
        {order.serviceName}
      </motion.h3>
      <motion.p variants={item} className="mt-1 text-xs text-luxury-text/60">
        {order.categoryName}
      </motion.p>

      <motion.div
        variants={item}
        className="mt-5 flex items-end justify-between border-t border-luxury-accent/15 pt-4"
      >
        <span className="text-sm text-luxury-text/70">Total estimado</span>
        <span className="font-serif text-2xl text-luxury-dark">{order.priceLabel}</span>
      </motion.div>

      <motion.ul variants={item} className="mt-5 space-y-3 text-sm text-luxury-text/80">
        <li className="flex items-center gap-2.5">
          <User size={15} className="shrink-0 text-luxury-accent" />
          {order.customerName}
        </li>
        <li className="flex items-center gap-2.5">
          <Calendar size={15} className="shrink-0 text-luxury-accent" />
          {formatDateLong(order.appointmentDate)}
        </li>
        <li className="flex items-center gap-2.5">
          <Clock size={15} className="shrink-0 text-luxury-accent" />
          {order.appointmentTime}
        </li>
        <li className="flex items-center gap-2.5">
          <CreditCard size={15} className="shrink-0 text-luxury-accent" />
          Pago simulado · MXN
        </li>
      </motion.ul>
    </motion.div>
  );
}
