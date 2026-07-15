"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Shield, User } from "lucide-react";
import type { CheckoutOrder } from "@/lib/checkout/types";
import { formatDateLong } from "@/lib/booking-helpers";

type OrderSummaryProps = {
  order: CheckoutOrder;
};

export default function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
            Resumen del cargo
          </p>
          <h3 className="mt-1 font-serif text-xl text-gray-900">
            {order.serviceName}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">{order.categoryName}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
          <Shield size={11} />
          Seguro
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-500">Total a pagar</p>
          <p className="text-[11px] text-gray-400">MXN · Impuestos incluidos</p>
        </div>
        <span className="font-serif text-2xl text-gray-900">{order.priceLabel}</span>
      </div>

      <ul className="mt-5 space-y-2.5 text-sm text-gray-700">
        <li className="flex items-center gap-2.5">
          <User size={15} className="shrink-0 text-gray-400" />
          {order.customerName?.trim() || "Paciente (completa tus datos)"}
        </li>
        <li className="flex items-center gap-2.5">
          <Calendar size={15} className="shrink-0 text-gray-400" />
          {formatDateLong(order.appointmentDate)}
        </li>
        <li className="flex items-center gap-2.5">
          <Clock size={15} className="shrink-0 text-gray-400" />
          {order.appointmentTime} hrs
        </li>
      </ul>
    </motion.div>
  );
}
