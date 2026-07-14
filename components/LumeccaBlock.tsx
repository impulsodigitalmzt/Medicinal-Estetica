"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { CLINIC } from "@/lib/data";

const YOUTUBE_ID = "L_R9SAQUe30";

const DETAILS = [
  "Tecnología InMode con pulsos de luz optimizados",
  "Tratamiento eficaz de manchas solares y rosácea",
  "Sesiones rápidas con resultados visibles desde la primera aplicación",
  "Protocolos personalizados según fototipo cutáneo",
];

const TREATS = [
  "Manchas marrones y rojas",
  "Pecas y daño solar",
  "Enrojecimiento y rosácea",
  "Telangiectasias y arañas vasculares",
  "Textura irregular y poros dilatados",
];

const SPECS = [
  { label: "Longitud de onda", value: "580 SR / 580–1200 nm" },
  { label: "Tamaño del punto", value: "8 mm" },
  { label: "Fluencia", value: "5–30 J/cm²" },
  { label: "Duración del pulso", value: "1,5–15 ms" },
  { label: "Enfriamiento por pulso", value: "15–22 °C" },
  { label: "Frecuencia de repetición", value: "1 pps" },
];

const BENEFITS = [
  "Suaviza líneas finas y mejora la textura de la piel",
  "Trata rosácea, enrojecimiento y lesiones vasculares superficiales",
  "Reduce manchas, pecas e hiperpigmentación por sol",
  "Estimula colágeno para mayor luminosidad y firmeza",
  "Aplicable en rostro, cuello, escote, manos y más zonas",
  "Sesiones cómodas gracias al enfriamiento activo del aplicador",
];

function SectionBadge({ title }: { title: string }) {
  return (
    <div className="flex justify-center sm:justify-start">
      <div className="rounded-full border-2 border-luxury-accent/60 bg-luxury-dark px-6 py-2.5 shadow-serenity">
        <h3 className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-luxury-bg sm:text-xs">
          {title}
        </h3>
      </div>
    </div>
  );
}

export default function LumeccaBlock() {
  const [expanded, setExpanded] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const handleCollapse = () => {
    setExpanded(false);
    window.setTimeout(() => {
      titleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <article>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div className="order-1 lg:order-1">
          <div className="flex flex-col lg:aspect-[4/3] lg:min-h-0">
            <div className="shrink-0">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-luxury-accent">
                IPL de alta potencia para manchas y vascular
              </p>
              <h2
                ref={titleRef}
                className="mt-2 scroll-mt-28 font-serif text-3xl text-luxury-dark md:scroll-mt-32 md:text-4xl"
              >
                Lumecca (InMode)
              </h2>
              <p className="mt-3 text-sm leading-snug text-luxury-text lg:mt-4 lg:text-[0.9rem] lg:leading-relaxed">
                IPL (Luz Pulsada Intensa) de alta potencia para el tratamiento de
                lesiones vasculares y pigmentarias (manchas) con resultados en
                menos sesiones.
              </p>
            </div>

            <ul className="mt-4 space-y-2.5 lg:mt-5 lg:flex-1 lg:content-center">
              {DETAILS.map((detail) => (
                <li
                  key={detail}
                  className="flex gap-3 text-sm leading-relaxed text-luxury-text/90"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-luxury-accent" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            className="btn-pill-outline mt-6 inline-flex items-center gap-2 lg:mt-8"
          >
            {expanded ? "Menos información" : "Más información"}
            <ChevronDown
              size={18}
              className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="relative order-2 aspect-[4/3] w-full overflow-hidden rounded-serenity-lg border border-luxury-accent/15 shadow-serenity lg:order-2">
          <Image
            src={CLINIC.assets.equipos.lumecca}
            alt="Equipo Lumecca InMode"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="lumecca-expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-12 border-b-2 border-luxury-dark pb-10 md:mt-16 md:pb-12">
              <div className="overflow-hidden rounded-serenity-lg border-2 border-luxury-accent/25 bg-luxury-card/40">
                <div className="flex items-center justify-between border-b border-luxury-accent/25 bg-luxury-dark px-5 py-3 sm:px-8">
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-luxury-bg sm:text-xs">
                    Lumecca — By InMode
                  </span>
                </div>

                <div className="space-y-14 p-5 sm:p-8 md:space-y-16 md:p-10">
                  <section>
                    <SectionBadge title="Cómo funciona Lumecca" />
                    <div className="mt-8 overflow-hidden rounded-serenity-lg border border-luxury-accent/20 bg-luxury-bg shadow-serenity">
                      <div className="space-y-5 p-6 text-base leading-relaxed text-luxury-text sm:p-8">
                        <p>
                          El fotofacial IPL con Lumecca es un tratamiento de luz
                          pulsada intensa que se dirige a problemas de pigmentación
                          como manchas marrones, daño solar, puntos rojos y rosácea.
                          La luz atraviesa la epidermis, actúa sobre las células
                          productoras de pigmento y ayuda a dispersir la pigmentación
                          desigual.
                        </p>
                        <p>
                          Lumecca emite múltiples longitudes de onda en la piel y
                          actúa de forma eficaz sobre la melanina y la hemoglobina
                          en capas superficiales. La energía lumínica se convierte
                          en calor, fragmenta el exceso de pigmento y estimula la
                          renovación cutánea, revelando una piel más luminosa y
                          uniforme.
                        </p>
                        <p>
                          Puede aplicarse en rostro, cuello, escote, hombros,
                          espalda, brazos y piernas. También es una opción eficaz
                          para venitas rotas y arañas vasculares. Con Lumecca-I,
                          además, se pueden tratar zonas delicadas como el contorno
                          periorbital con precisión y mínima molestia.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <SectionBadge title="Especificaciones técnicas" />
                    <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
                      <YouTubeEmbed
                        videoId={YOUTUBE_ID}
                        title="Video sobre Lumecca InMode"
                        className="max-w-none"
                      />
                      <dl className="grid gap-x-8 gap-y-4 rounded-serenity-lg border border-luxury-accent/20 bg-luxury-bg p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-1">
                        {SPECS.map(({ label, value }) => (
                          <div key={label}>
                            <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-luxury-dark">
                              {label}
                            </dt>
                            <dd className="mt-1.5 text-sm leading-relaxed text-luxury-text/90">
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </section>

                  <section>
                    <SectionBadge title="¿Qué trata el fotofacial IPL?" />
                    <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                      {TREATS.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-3 rounded-serenity-lg border border-luxury-accent/20 bg-luxury-bg px-4 py-3 text-sm leading-relaxed text-luxury-text"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-luxury-dark text-white">
                            <Check size={14} strokeWidth={3} />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <SectionBadge title="IPL vs láser" />
                    <div className="mt-8 space-y-4 rounded-serenity-lg border border-luxury-accent/20 bg-luxury-bg p-6 text-sm leading-relaxed text-luxury-text sm:p-8 sm:text-base">
                      <p>
                        Tanto el IPL como los tratamientos con láser pueden
                        mejorar diversos problemas de la piel. La principal
                        diferencia es que la terapia IPL suele ser más suave y
                        requiere más sesiones que el láser para resultados
                        comparables.
                      </p>
                      <p>
                        El láser es más intenso, la recuperación puede ser más
                        prolongada y logra cambios más notables en menos
                        procedimientos. Sin embargo, a diferencia del láser, un
                        dispositivo IPL emite más de una longitud de onda de luz
                        pulsada, lo que permite tratar varias condiciones al mismo
                        tiempo.
                      </p>
                      <p>
                        Lumecca destaca por ofrecer hasta 3–4 veces más energía
                        efectiva en el rango crítico de 515–620 nm, con mayor
                        confort gracias a su punta de zafiro con enfriamiento
                        activo y sesiones más breves que un IPL convencional.
                      </p>
                    </div>
                  </section>

                  <section>
                    <SectionBadge title="Conoce los beneficios" />
                    <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                      {BENEFITS.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-start gap-3 rounded-serenity-lg border border-luxury-accent/35 bg-white px-4 py-3 text-sm leading-relaxed text-luxury-text shadow-serenity"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-luxury-dark text-white">
                            <Check size={14} strokeWidth={3} />
                          </span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>

              <div className="flex justify-center pt-8 md:pt-10">
                <button
                  type="button"
                  onClick={handleCollapse}
                  aria-expanded={expanded}
                  className="btn-luxury-gold inline-flex items-center gap-2"
                >
                  ▲ Menos información
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
