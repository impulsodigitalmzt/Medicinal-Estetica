"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { CLINIC } from "@/lib/data";

const YOUTUBE_ID = "RgnhcMUERIw";

const DETAILS = [
  "Combinación patentada de ultrasonido y radiofrecuencia",
  "Reducción de celulitis y grasa localizada sin cirugía",
  "Moldea y reafirma zonas corporales específicas",
  "Tratamiento cómodo con resultados acumulativos",
];

const TREATMENT_ZONES = {
  corporales:
    "Abdomen, cintura (flancos), muslos (cara interna y externa), nalgas y brazos.",
  faciales:
    "Reducción de grasa en la papada (doble mentón), definición del óvalo de la mandíbula y perfilado de mejillas.",
};

const PATENTS = [
  {
    name: "ConeX",
    text: "Un diseño emisor en forma de cono que distribuye las ondas de ultrasonido de manera tridimensional. ¿El beneficio? Máxima seguridad, evitando concentraciones molestas de calor en un solo punto.",
  },
  {
    name: "Impulse",
    text: "La energía se emite en ráfagas de pulsos en lugar de un haz continuo. Esto destruye el tejido graso con mayor eficacia y hace que el tratamiento sea sumamente confortable.",
  },
  {
    name: "MaXimize",
    text: "Un sistema de vacío integrado que realiza una succión ligera en tu piel. Esto asegura que el aplicador esté siempre en contacto perfecto contigo, logrando que la energía se entregue de forma uniforme y al máximo.",
  },
  {
    name: "ReACCT",
    text: "Un sistema inteligente que reconoce las características y cambios de tu tejido en tiempo real, ajustando la frecuencia de forma continua durante la sesión para adaptarse exactamente a ti.",
  },
];

const TREATMENT_MENUS = [
  {
    name: "Primex Classic (Pura Reducción Volumétrica)",
    text: "Ideal si tu meta principal es eliminar esos depósitos de grasa rebelde y localizada. ¡Resultados espectaculares en solo 20 minutos por zona!",
  },
  {
    name: "Primex Pro (Modelado y Tensado)",
    text: "El equilibrio perfecto. Combina la reducción de grasa con el tensado inicial de la piel para redefinir tu silueta y combatir la flacidez leve.",
  },
  {
    name: "Primex Premium (Tratamiento Integral de Alta Potencia)",
    text: "Nuestra experiencia VIP definitiva. Ideal para una reducción potente de grasa, un tensado cutáneo profundo y una mejora visible en la apariencia de la celulitis.",
  },
];

const FAQ = [
  {
    question: "¿Qué se siente durante la sesión?",
    answer:
      "Es un procedimiento muy cómodo, similar a recibir un masaje con una agradable sensación de calor térmico. Gracias al sistema de pulsos Impulse, el riesgo de dolor o molestia es prácticamente inexistente.",
  },
  {
    question: "¿Se puede combinar con otros tratamientos?",
    answer:
      "¡Por supuesto! Es totalmente seguro y recomendable. Podemos combinarlo con masajes de drenaje linfático u otras tecnologías complementarias del spa para potenciar, acelerar y optimizar aún más tus resultados.",
  },
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

export default function AlmaPrimeXBlock() {
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
        <div className="relative order-2 aspect-[4/3] w-full overflow-hidden rounded-serenity-lg border border-luxury-accent/15 shadow-serenity lg:order-1">
          <Image
            src={CLINIC.assets.equipos.almaPrimeX}
            alt="Equipo Alma Prime X"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="order-1 lg:order-2">
          <div className="flex flex-col lg:aspect-[4/3] lg:min-h-0">
            <div className="shrink-0">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-luxury-accent">
                Contorneo corporal no invasivo
              </p>
              <h2
                ref={titleRef}
                className="mt-2 scroll-mt-28 font-serif text-3xl text-luxury-dark md:scroll-mt-32 md:text-4xl"
              >
                Alma Prime X
              </h2>
              <p className="mt-3 text-sm leading-snug text-luxury-text lg:mt-4 lg:text-[0.9rem] lg:leading-relaxed">
                Plataforma líder para contorneo corporal y reducción de celulitis
                mediante la combinación patentada de ultrasonido longitudinal y
                radiofrecuencia acentuada.
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
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="alma-expanded"
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
                    Alma PrimeX — Alma Lasers
                  </span>
                </div>

                <div className="space-y-14 p-5 sm:p-8 md:space-y-16 md:p-10">
                  <section>
                    <SectionBadge title="Conoce Alma PrimeX" />
                    <div className="mt-8 overflow-hidden rounded-serenity-lg border border-luxury-accent/20 bg-luxury-bg shadow-serenity">
                      <div className="space-y-5 p-6 text-base leading-relaxed text-luxury-text sm:p-8">
                        <div>
                          <p className="font-serif text-2xl text-luxury-dark">
                            Alma PrimeX™
                          </p>
                          <p className="mt-2 text-sm font-medium text-luxury-accent">
                            El factor X en remodelación corporal y facial no
                            invasiva.
                          </p>
                        </div>
                        <p>
                          ¿Buscas reducir grasa localizada, tensar la piel y
                          remodelar tu silueta sin pasar por un quirófano? Te
                          presentamos Alma PrimeX, la tecnología médica más
                          avanzada del momento que combina el poder de los
                          Ultrasonidos Guiados y la Radiofrecuencia Unipolar de
                          Alta Potencia en una sola sesión.
                        </p>
                        <p>
                          Olvídate de tratamientos dolorosos o largas
                          recuperaciones. Con sesiones rápidas de entre 15 y 50
                          minutos, podrás regresar de inmediato a tus
                          actividades luciendo una piel visiblemente más firme y
                          un contorno más definido.
                        </p>
                      </div>

                      <div className="flex justify-center border-t border-luxury-accent/15 px-6 py-6 sm:px-8 sm:py-8">
                        <YouTubeEmbed
                          videoId={YOUTUBE_ID}
                          title="Video sobre Alma PrimeX"
                        />
                      </div>
                    </div>
                  </section>

                  <section>
                    <SectionBadge title="¿Qué zonas podemos transformar juntos?" />
                    <div className="mt-8 space-y-4 rounded-serenity-lg border border-luxury-accent/20 bg-luxury-bg p-6 text-sm leading-relaxed text-luxury-text sm:p-8 sm:text-base">
                      <p>
                        Gracias a su increíble versatilidad y el uso de
                        aplicadores especializados, diseñamos un plan a tu medida
                        tanto para el cuerpo como para el rostro:
                      </p>
                      <ul className="space-y-3">
                        <li className="flex gap-3">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-luxury-accent" />
                          <span>
                            <strong className="font-medium text-luxury-dark">
                              Zonas Corporales:
                            </strong>{" "}
                            {TREATMENT_ZONES.corporales}
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-luxury-accent" />
                          <span>
                            <strong className="font-medium text-luxury-dark">
                              Zonas Faciales:
                            </strong>{" "}
                            {TREATMENT_ZONES.faciales}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <SectionBadge title="El secreto detrás de los resultados" />
                    <p className="mt-6 text-sm leading-relaxed text-luxury-text sm:text-base">
                      Alma PrimeX no es un equipo común. Cuenta con cuatro
                      patentes exclusivas que garantizan que tu sesión sea ultra
                      efectiva, segura y completamente cómoda:
                    </p>
                    <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                      {PATENTS.map(({ name, text }) => (
                        <li
                          key={name}
                          className="rounded-serenity-lg border border-luxury-accent/20 bg-luxury-bg p-5 text-sm leading-relaxed text-luxury-text"
                        >
                          <p className="font-medium text-luxury-dark">{name}</p>
                          <p className="mt-2 text-luxury-text/90">{text}</p>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <SectionBadge title="3 menús de tratamiento" />
                    <p className="mt-6 text-sm leading-relaxed text-luxury-text sm:text-base">
                      Porque cada cuerpo es único, adaptamos el equipo en tres
                      modalidades según lo que quieras lograr:
                    </p>
                    <ol className="mt-8 space-y-4">
                      {TREATMENT_MENUS.map(({ name, text }, index) => (
                        <li
                          key={name}
                          className="flex gap-4 rounded-serenity-lg border border-luxury-accent/20 bg-luxury-bg p-5"
                        >
                          <span className="font-serif text-2xl leading-none text-luxury-accent">
                            {index + 1}
                          </span>
                          <div className="min-w-0 text-sm leading-relaxed text-luxury-text sm:text-base">
                            <p className="font-medium text-luxury-dark">{name}</p>
                            <p className="mt-2 text-luxury-text/90">{text}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section>
                    <SectionBadge title="Preguntas frecuentes en nuestro spa" />
                    <ul className="mt-8 space-y-4">
                      {FAQ.map(({ question, answer }) => (
                        <li
                          key={question}
                          className="rounded-serenity-lg border border-luxury-accent/20 bg-luxury-bg p-5 text-sm leading-relaxed text-luxury-text sm:text-base"
                        >
                          <p className="font-medium text-luxury-dark">
                            {question}
                          </p>
                          <p className="mt-2 text-luxury-text/90">{answer}</p>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="text-center sm:text-left">
                    <SectionBadge title="¡Agenda tu valoración hoy mismo!" />
                    <p className="mt-6 text-sm leading-relaxed text-luxury-text sm:text-base">
                      Regálale a tu cuerpo la tecnología que los profesionales
                      confían. Déjanos ayudarte a lucir tu mejor versión con Alma
                      PrimeX.
                    </p>
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
