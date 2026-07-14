"use client";

import Link from "next/link";
import Card3D from "@/components/Card3D";
import NativeVideo from "@/components/NativeVideo";
import ScrollReveal from "@/components/ScrollReveal";
import { CLINIC } from "@/lib/data";

export default function Intro() {
  return (
    <div className="overflow-x-clip">
      <div className="luxury-container pb-6 pt-12 md:pb-10 md:pt-24 lg:pt-28">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="relative lg:col-span-7 lg:pr-6">
            <div
              aria-hidden
              className="absolute -bottom-6 -right-4 -z-10 hidden h-[90%] w-[80%] rounded-serenity-lg bg-luxury-card transition-transform duration-700 ease-out lg:block xl:-right-8"
            />
            <div
              aria-hidden
              className="absolute -left-4 top-10 -z-10 h-28 w-28 rounded-full border border-luxury-accent/15 bg-luxury-card/50 lg:h-36 lg:w-36"
            />

            <Card3D className="transition-transform duration-700 ease-out lg:translate-x-3 xl:translate-x-6">
              <div className="relative aspect-[4/5] overflow-hidden rounded-serenity-lg bg-luxury-dark shadow-float ring-1 ring-luxury-accent/15 transition-shadow duration-700 ease-out hover:shadow-serenity-lg sm:aspect-[5/6] lg:aspect-[4/5]">
                <NativeVideo
                  src={CLINIC.assets.videos.doctor}
                  title={`${CLINIC.doctorShortName} — medicina estética y antienvejecimiento`}
                  className="absolute inset-0"
                  fit="cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-luxury-dark/25 via-transparent to-luxury-bg/5" />
              </div>
            </Card3D>
          </div>

          <ScrollReveal
            className="lg:col-span-5 lg:py-8 xl:py-14"
            gentle
            offset={48}
            delay={0.1}
          >
            <p className="section-label">Experiencia premium</p>
            <h2 className="section-title mt-4">{CLINIC.copy.introTitle}</h2>
            {CLINIC.copy.introParagraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="mt-6 text-base leading-relaxed text-luxury-text/85 first:mt-8 sm:text-lg sm:leading-loose"
              >
                {paragraph}
              </p>
            ))}

            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/reservar"
                className="btn-luxury-gold transition-all duration-500 ease-out"
              >
                Agendar valoración
              </Link>
              <Link
                href="/tienda"
                className="btn-pill-outline transition-all duration-500 ease-out"
              >
                Ver catálogo de skincare
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
