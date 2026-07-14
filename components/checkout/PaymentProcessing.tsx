"use client";

import { motion } from "framer-motion";

export default function PaymentProcessing() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-luxury flex flex-col items-center justify-center rounded-serenity-lg px-8 py-16 text-center"
    >
      <div className="relative mb-8 h-16 w-16">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-luxury-accent/25"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
        <motion.span
          className="absolute inset-1 rounded-full border-2 border-t-luxury-accent border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-2.5 w-2.5 rounded-full bg-luxury-accent" />
        </span>
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="font-serif text-2xl text-luxury-dark"
      >
        Procesando pago…
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-3 max-w-xs text-sm text-luxury-text/70"
      >
        Verificando tu tarjeta de forma segura. Esto tomará solo un momento.
      </motion.p>

      <motion.div
        className="mt-8 flex gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-luxury-accent"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
