"use client";

import Image from "next/image";
import NativeVideo from "@/components/NativeVideo";
import { CLINIC } from "@/lib/data";

export default function Process() {
  const steps = CLINIC.copy.processSteps;

  return (
    <section className="section-padding bg-luxury-dark text-luxury-bg">
      <div className="luxury-container">
        <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-luxury-accent">
            Cómo funciona
          </p>
          <h2 className="font-serif text-3xl text-luxury-bg sm:text-4xl lg:text-[2.75rem]">
            Tu camino hacia el bienestar clínico
          </h2>
        </div>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <article
              key={step.title}
              className="flex flex-col gap-5 rounded-serenity-lg border border-luxury-bg/10 bg-luxury-bg/5 p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-6"
            >
              <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-serenity bg-luxury-dark sm:h-28 sm:w-40">
                {step.video ? (
                  <NativeVideo
                    src={step.video}
                    title={step.title}
                    className="absolute inset-0"
                    fit="cover"
                    controls={false}
                  />
                ) : (
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                )}
              </div>
              <div className="flex flex-1 items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-luxury-accent/30 font-serif text-sm text-luxury-bg">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-luxury-bg">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-luxury-bg/70">
                    {step.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
