"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { CLINIC } from "@/lib/data";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = CLINIC.copy.faqs;

  return (
    <section className="section-padding bg-luxury-bg">
      <div className="luxury-container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="section-label">Preguntas frecuentes</p>
            <h2 className="section-title">
              Resolvemos tus dudas esenciales
            </h2>
            <Link href="/ubicacion" className="btn-pill-outline mt-8">
              Ver contacto
            </Link>
          </div>

          <div className="divide-y divide-luxury-accent/15">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="py-5">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-start justify-between gap-4 text-left"
                >
                  <span className="text-sm font-medium text-luxury-dark sm:text-base">{faq.q}</span>
                  <span className="mt-0.5 shrink-0 text-luxury-accent">
                    {open === i ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>
                {open === i && (
                  <p className="mt-3 pr-8 text-sm leading-relaxed text-luxury-text/80">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
