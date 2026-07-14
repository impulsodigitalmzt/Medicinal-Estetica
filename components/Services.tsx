"use client";

import { useState } from "react";
import Link from "next/link";
import { CLINIC, formatPriceMXN, SERVICE_CATEGORIES } from "@/lib/data";
import { StaggerGrid, StaggerItem } from "@/components/StaggerReveal";

export default function Services() {
  const [activeTab, setActiveTab] = useState(0);
  const category = SERVICE_CATEGORIES[activeTab];

  return (
    <section className="section-padding bg-luxury-bg">
      <div className="luxury-container">
        <div className="mb-12 flex flex-wrap justify-center gap-2 md:mb-16">
          {SERVICE_CATEGORIES.map((cat, index) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`rounded-pill px-4 py-2 text-xs font-medium transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-sm ${
                activeTab === index
                  ? "bg-luxury-dark text-luxury-bg shadow-serenity"
                  : "glass-luxury text-luxury-text hover:border-luxury-accent/40"
              }`}
            >
              {cat.tabLabel}
            </button>
          ))}
        </div>

        <div className="mb-12 text-center md:mb-16">
          <h2 className="font-serif text-2xl text-luxury-dark md:text-3xl">
            {category.title}
          </h2>
          <p className="mt-3 text-luxury-text/90">{category.subtitle}</p>
        </div>

        <StaggerGrid
          key={category.id}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {category.services.map((service) => (
            <StaggerItem key={service.id}>
              <article className="card-serenity flex h-full flex-col p-5 sm:p-7 md:p-8">
                <h3 className="font-serif text-xl text-luxury-dark">
                  {service.name}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-luxury-text">
                  {service.description}
                </p>
                {service.subItems && (
                  <ul className="mt-4 space-y-2 text-sm text-luxury-text/90">
                    {service.subItems.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-luxury-accent">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-5 font-serif text-2xl text-luxury-dark">
                  {formatPriceMXN(service.price, { from: service.priceFrom })}
                </p>
                {service.priceFrom && (
                  <p className="mt-1 text-xs text-luxury-text/60">
                    Precio estimado según zona y protocolo
                  </p>
                )}
                <Link
                  href={`/reservar?categoria=${category.id}&servicio=${service.id}`}
                  className={
                    service.requiresValidation
                      ? "btn-pill-outline mt-6 w-full text-center"
                      : "btn-luxury-gold mt-6 w-full text-center"
                  }
                >
                  {service.requiresValidation ? "Solicitar valoración" : "Reservar cita"}
                </Link>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <p className="mt-16 break-words text-center text-sm leading-relaxed text-luxury-text/70">
          Puedes reservar tu tratamiento y pagar en línea o directamente en la
          clínica. El catálogo de skincare en Tienda es solo informativo.
          <br className="hidden sm:inline" />
          <span className="mt-2 block sm:mt-0 sm:inline">
            {CLINIC.phone} · {CLINIC.address}, {CLINIC.city}
          </span>
        </p>
      </div>
    </section>
  );
}
