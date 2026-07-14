"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Layers,
  ScanFace,
  ShieldCheck,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import NativeVideo from "@/components/NativeVideo";
import { CLINIC } from "@/lib/data";

const YOUTUBE_ID = "U5-xQ1Qp3tA";
const LOCAL_VIDEO = CLINIC.assets.videos.morpheus8;

const MEDIA = CLINIC.assets.equipos.beforeAfterDir;

const TREATMENT_ZONES_IMAGE = `${MEDIA}/zonas de tratamiento1.png`;

const SPECS = [
  {
    label: "Tipo de tratamiento",
    value:
      "Remodelación dérmica y subdérmica para rostro, cuello y escote",
  },
  {
    label: "Número de pines",
    value: "12 pines, 24 pines (depende del cabezal)",
  },
  {
    label: "Longitud pin",
    value: "Hasta 4 mm programables",
  },
  {
    label: "Periorbital · Facial · Cuello",
    value: "0.5 mm, 1 mm, 2 mm, 3 mm, 4 mm programables",
  },
  {
    label: "Profundidad de la coagulación",
    value: "Hasta 4 mm",
  },
  {
    label: "Profundidad del calentamiento",
    value: "Hasta 1 mm perfil térmico adicional",
  },
];

const RESULTS_CAROUSEL = [
  {
    src: `${MEDIA}/carrusel1.jpg`,
    alt: "Antes y después Morpheus 8 — zona perioral",
  },
  {
    src: `${MEDIA}/carrusel2.jpg`,
    alt: "Antes y después Morpheus 8 — perfil facial",
  },
  {
    src: `${MEDIA}/carrusel3.jpg`,
    alt: "Antes y después Morpheus 8 — contorno de ojos",
  },
  {
    src: `${MEDIA}/carrusel4.jpg`,
    alt: "Antes y después Morpheus 8 — rostro frontal",
  },
  {
    src: `${MEDIA}/carrusel5.jpg`,
    alt: "Antes y después Morpheus 8 — rejuvenecimiento facial",
  },
  {
    src: `${MEDIA}/carrusel6.jpg`,
    alt: "Antes y después Morpheus 8 — línea mandibular",
  },
];

const IDEAL_CANDIDATES =
  "Indicado para quienes, a cualquier edad, buscan elevar la calidad y el aspecto de su piel. Ofrece buenos resultados en los distintos fototipos y tonos cutáneos. Cada aplicación se diseña de forma individual, de modo que el tratamiento se ajusta al perfil y a las metas de cada persona.";

const BEFORE_TREATMENT =
  "Conviene suspender la exposición solar directa, el uso de autobronceadores y algunos fármacos que incrementen la sensibilidad de la piel. En la consulta inicial, el médico entregará las recomendaciones precisas para tu caso.";

const TREATMENT_PROCESS =
  "La primera etapa es una valoración médica que define el plan a seguir. Durante la sesión, finas microagujas alcanzan las capas profundas de la piel para reactivar la formación de colágeno y elastina. Se aplica anestesia local en crema para mayor bienestar; en pieles muy reactivas, puede valorarse un protocolo más suave. La aplicación suele ser ágil y la convalecencia corta: es habitual un rubor o leve hinchazón que cede en pocos días.";

const SESSION_PROTOCOL = {
  recommendation:
    "El esquema sugerido para resultados óptimos comprende 3 sesiones, con 4 a 6 semanas de separación entre cada una en rostro, cuello y escote.",
  reasons: [
    "Cada aplicación activa la producción de colágeno y elastina, y los cambios se suman sesión tras sesión.",
    "Las pausas entre citas coinciden con el ritmo natural de regeneración y reparación cutánea.",
    "Facilita modificar la intensidad y el enfoque conforme evoluciona la respuesta de cada paciente.",
    "Distribuir la energía en varias sesiones moderadas limita las molestias y agiliza la recuperación frente a un único tratamiento de alta intensidad.",
  ],
};

const RECOVERY_TIMELINE = [
  {
    period: "Día 1",
    status:
      "La piel puede verse enrojecida, como tras un día de sol suave, con sensación de calor o inflamación leve en la zona tratada.",
    care: "Usa agua termal, crema cicatrizante y protector solar. Sin maquillaje ni exposición solar directa.",
  },
  {
    period: "Días 2 – 3",
    status: "El rojo y la hinchazón van cediendo. Puede surgir una descamación discreta.",
    care: "Mantén una rutina suave, hidrata y protege del sol. Evita exfoliantes y fórmulas agresivas.",
  },
  {
    period: "Días 4 – 6",
    status: "El tejido continúa renovándose con una descamación leve.",
    care: "Limpieza con syndet, crema epitelizante, hidratación y bloqueador diario.",
  },
  {
    period: "Días 7 – 10",
    status:
      "En la mayoría de los casos, los signos del procedimiento ya no son visibles. Surgen los primeros indicios de mayor luminosidad y textura más uniforme.",
    care: "Puedes reincorporar el maquillaje y tu rutina de cuidado cuando el médico lo autorice.",
  },
];

const BENEFITS = [
  "Entrega fraccionada con profundidad de acción y potencia térmica ajustables",
  "Alcanza el tejido graso hasta 4 mm de profundidad",
  "Preserva la integridad de la capa superficial de la piel",
  "Apto para fototipo VI con escasa probabilidad de hiperpigmentación postinflamatoria (PIH)",
  "Indicado en contextos quirúrgicos, dermatológicos y de electrocoagulación con hemostasia",
  "Perfil térmico con alcance de hasta 5 mm",
  "Calor subnecrótico que coagula tejido subdérmico y tensa el tejido conectivo de manera simultánea",
  "Parámetros ajustables según el perfil y objetivos de cada paciente",
];

const TREATMENT_AREAS: {
  area: string;
  benefits: string;
  icon: LucideIcon;
}[] = [
  {
    area: "Rostro",
    icon: ScanFace,
    benefits:
      "Acción anti-edad, suaviza líneas finas, unifica el tono, reduce poros, atenúa marcas de acné y renueva la textura",
  },
  {
    area: "Contorno de ojos",
    icon: Eye,
    benefits:
      "Favorece la síntesis de colágeno; mejora líneas delicadas, textura, ojeras e inflamación periorbital",
  },
  {
    area: "Línea de la mandíbula",
    icon: UserRound,
    benefits: "Esculpe y tonifica el contorno del óvalo facial",
  },
  {
    area: "Zona submentoniana",
    icon: Layers,
    benefits: "Reduce acumulaciones grasas bajo el mentón",
  },
  {
    area: "Cuello y escote",
    icon: Sparkles,
    benefits:
      "Incrementa tonicidad y densidad cutánea; minimiza signos de fotoenvejecimiento",
  },
];

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Respaldo FDA",
    text: "Plataforma InMode avalada por estudios clínicos internacionales",
  },
  {
    icon: Layers,
    title: "Hasta 4 mm",
    text: "Calibración de profundidad y energía según la zona a tratar",
  },
  {
    icon: ScanFace,
    title: "Facial y periorbital",
    text: "Aplicable en rostro, cuello, escote, párpados y contorno mandibular",
  },
  {
    icon: Sparkles,
    title: "Colágeno profundo",
    text: "Firmeza, refinamiento de textura y rejuvenecimiento gradual",
  },
  {
    icon: Clock,
    title: "Mínima recuperación",
    text: "Evolución visible sin prolongados periodos de reposo",
  },
  {
    icon: Check,
    title: "Microagujas de titanio",
    text: "Aplicación médica con planes hechos a la medida",
  },
];

const PROTOCOL_STEPS: {
  step: string;
  title: string;
  text: string;
  bullets?: string[];
}[] = [
  { step: "01", title: "Candidatos ideales", text: IDEAL_CANDIDATES },
  { step: "02", title: "Antes del tratamiento", text: BEFORE_TREATMENT },
  { step: "03", title: "Proceso del tratamiento", text: TREATMENT_PROCESS },
  {
    step: "04",
    title: "Protocolo de tratamiento",
    text: SESSION_PROTOCOL.recommendation,
  },
  {
    step: "05",
    title: "Cantidad de sesiones",
    text: "El plan estándar contempla tres aplicaciones para potenciar la neocolagénesis y obtener resultados más duraderos.",
    bullets: SESSION_PROTOCOL.reasons,
  },
  {
    step: "06",
    title: "Recuperación",
    text: "La convalecencia suele ser breve: rubor o hinchazón leve que cede en pocos días, con evolución personalizada según la intensidad del protocolo.",
  },
];

const RESULT_OUTCOMES = [
  {
    label: "Primeros cambios",
    text: "Mayor luminosidad, poros menos visibles, tono más parejo y líneas finas menos marcadas tras la reparación cutánea.",
  },
  {
    label: "Evolución en el tiempo",
    text: "La formación de colágeno nuevo se extiende entre 3 y 6 meses, aportando firmeza de manera gradual y acumulativa.",
  },
  {
    label: "Para sostener los logros",
    text: "Higiene suave, hidratación y fotoprotección diaria. Una sesión de refuerzo anual puede complementar tu rutina.",
  },
];

function SpecsTable() {
  return (
    <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
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
  );
}

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

const CAROUSEL_INTERVAL_MS = 5500;

function BeforeAfterCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = RESULTS_CAROUSEL.length;

  const goTo = (index: number) => {
    setActive((index + total) % total);
  };

  useEffect(() => {
    if (paused) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % total);
    }, CAROUSEL_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [paused, total]);

  const visibleSlides = [0, 1, 2].map(
    (offset) => RESULTS_CAROUSEL[(active + offset) % total],
  );

  return (
    <div
      className="mt-8 w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="flex items-center gap-3 md:gap-4">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-label="Imagen anterior"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-luxury-accent/50 bg-luxury-dark text-luxury-accent transition-colors hover:bg-luxury-accent hover:text-luxury-dark sm:h-10 sm:w-10"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>

        {/* Móvil: una imagen */}
        <div className="relative min-w-0 flex-1 overflow-hidden rounded-serenity-lg border border-luxury-accent/30 bg-luxury-dark/95 shadow-serenity md:hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {RESULTS_CAROUSEL.map(({ src, alt }) => (
              <div
                key={src}
                className="relative aspect-[5/3] w-full shrink-0"
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover object-center"
                  sizes="85vw"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Escritorio: tres imágenes visibles */}
        <div
          key={active}
          className="hidden min-w-0 flex-1 grid-cols-3 gap-3 md:grid lg:gap-4"
        >
          {visibleSlides.map(({ src, alt }, index) => (
            <div
              key={`${src}-${index}`}
              className="relative aspect-[5/3] overflow-hidden rounded-serenity-lg border border-luxury-accent/30 bg-luxury-dark/95 shadow-serenity transition-opacity duration-500"
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 28vw, 320px"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(active + 1)}
          aria-label="Imagen siguiente"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-luxury-accent/50 bg-luxury-dark text-luxury-accent transition-colors hover:bg-luxury-accent hover:text-luxury-dark sm:h-10 sm:w-10"
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      </div>

      <div className="mt-5 flex justify-center gap-2.5">
        {RESULTS_CAROUSEL.map(({ src }, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Ver imagen ${index + 1}`}
            aria-current={index === active}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              index === active
                ? "bg-luxury-accent"
                : "border-2 border-luxury-accent/70 bg-transparent hover:bg-luxury-accent/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Morpheus8Block() {
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
            src={CLINIC.assets.equipos.morpheus8}
            alt="Equipo Morpheus 8"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="order-1 lg:order-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-luxury-accent">
              Radiofrecuencia fraccionada de última generación
            </p>
            <h2
              ref={titleRef}
              className="mt-2 scroll-mt-28 font-serif text-3xl text-luxury-dark md:scroll-mt-32 md:text-4xl"
            >
              Morpheus 8
            </h2>
            <p className="mt-3 text-sm leading-snug text-luxury-text lg:mt-4 lg:text-[0.9rem] lg:leading-relaxed">
              Procedimiento de baja invasión que integra microneedling fraccionado
              con radiofrecuencia para renovar y redefinir la piel del rostro,
              cuello y escote. Reactiva colágeno y elastina con una convalecencia corta;
              indicado para flacidez, irregularidades de textura, marcas residuales
              y signos del paso del tiempo.
            </p>

            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:mt-5 lg:gap-2.5">
              {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="flex gap-2.5 rounded-serenity-lg border border-luxury-accent/15 bg-luxury-card/90 p-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-luxury-dark/5 text-luxury-accent">
                    <Icon size={16} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-luxury-dark sm:text-sm">
                      {title}
                    </p>
                    <p className="mt-0.5 text-[0.68rem] leading-snug text-luxury-text/85 sm:text-xs sm:leading-relaxed">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            className="btn-pill-outline relative z-10 mt-8 inline-flex items-center gap-2"
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
            key="morpheus-expanded"
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
                    Morpheus 8 — By InMode
                  </span>
                </div>

                <div className="space-y-14 p-5 sm:p-8 md:space-y-16 md:p-10">
                  <section>
                    <SectionBadge title="Cómo funciona Morpheus8" />
                    <div className="mt-8 overflow-hidden rounded-serenity-lg border border-luxury-accent/20 bg-luxury-bg shadow-serenity">
                      <div className="grid items-start gap-4 p-6 sm:gap-5 sm:p-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-6">
                        {LOCAL_VIDEO ? (
                          <figure className="order-1 mx-auto w-full max-w-[220px] shrink-0 sm:max-w-[240px] lg:mx-0 lg:max-w-[260px]">
                            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-serenity-lg border border-luxury-accent/25 bg-luxury-dark shadow-float">
                              <NativeVideo
                                src={LOCAL_VIDEO}
                                title="Cómo funciona el equipo Morpheus 8 / InMode"
                                className="absolute inset-0"
                                fit="cover"
                                autoPlay
                                muted
                                loop
                              />
                            </div>
                            <figcaption className="mt-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-luxury-text/50 lg:text-left">
                              Cómo funciona el equipo
                            </figcaption>
                          </figure>
                        ) : null}

                        <div className="order-2 space-y-4 pt-0 text-base leading-relaxed text-luxury-text">
                          <p>
                            Morpheus8, de InMode, es un tratamiento de mínima
                            invasión que combina microagujas fraccionadas con
                            radiofrecuencia para renovar y reestructurar la piel.
                            Está totalmente aprobado por las autoridades
                            reguladoras más estrictas y ayuda a tratar líneas de
                            expresión, arrugas, cicatrices de acné, manchas por el
                            sol, flacidez y tono disparejo, mediante un plan
                            personalizado diseñado en tu cita de valoración.
                          </p>
                          <p>
                            Las microagujas abren canales mínimos que activan la
                            producción natural de colágeno y elastina, mientras la
                            radiofrecuencia trabaja en las capas profundas para
                            lograr una remodelación mucho más marcada. Así, la piel
                            gana firmeza, un tono uniforme y luminosidad,
                            logrando un efecto tensor sin cirugía que se nota
                            muchísimo en el rostro.
                          </p>
                          <p>
                            Es un procedimiento seguro y muy efectivo para
                            cualquier tono de piel en rostro, cuello y escote:
                            desde el contorno de ojos hasta la zona
                            submentoniana. Cada sesión se calibra a tu medida según tu
                            edad, tipo de piel y los resultados que busques,
                            siempre después de una valoración médica.
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-luxury-accent/15 px-6 py-6 sm:px-8 sm:py-8">
                        <SectionBadge title="Especificaciones técnicas" />
                        <div className="mt-6">
                          <SpecsTable />
                        </div>
                      </div>
                      <div className="border-t border-luxury-accent/15 px-6 py-6 sm:px-8 sm:py-8">
                        <figure className="mx-auto w-full max-w-3xl">
                          <YouTubeEmbed
                            videoId={YOUTUBE_ID}
                            title="Presentación Morpheus 8"
                            className="max-w-none border-luxury-accent/25"
                          />
                          <figcaption className="mt-3 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-luxury-text/50">
                            Presentación Morpheus 8
                          </figcaption>
                        </figure>
                      </div>
                    </div>
                  </section>

                  <section>
                    <SectionBadge title="Áreas de tratamiento" />
                    <div className="mt-8 overflow-hidden rounded-serenity-lg border border-luxury-accent/20 bg-luxury-bg shadow-serenity">
                      <p className="p-6 text-sm leading-relaxed text-luxury-text sm:p-8">
                        Entre las zonas más demandadas están el rostro, el
                        cuello y el escote. En cada región se emplean ajustes
                        precisos de profundidad y potencia energética.
                      </p>
                      <div className="flex justify-center border-t border-luxury-accent/15 px-4 py-5 sm:px-8 sm:py-6">
                        <Image
                          src={TREATMENT_ZONES_IMAGE}
                          alt="Mapa de zonas de tratamiento facial con Morpheus 8"
                          width={1312}
                          height={812}
                          className="h-auto w-full max-w-[17.5rem] sm:max-w-xs md:max-w-sm lg:max-w-md"
                          sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 448px"
                        />
                      </div>
                      <ul className="grid gap-4 border-t border-luxury-accent/15 p-5 sm:grid-cols-2 sm:p-8 lg:grid-cols-3">
                        {TREATMENT_AREAS.map(({ area, benefits, icon: Icon }) => (
                          <li
                            key={area}
                            className="flex flex-col items-center rounded-serenity-lg border-2 border-luxury-accent/50 bg-gradient-to-br from-luxury-dark to-[#2a2618] p-5 text-center shadow-float"
                          >
                            <Icon
                              className="mb-3 text-luxury-card/90"
                              size={30}
                              strokeWidth={1.5}
                            />
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-luxury-accent">
                              {area}
                            </p>
                            <p className="mt-2 text-xs leading-relaxed text-luxury-card/75">
                              {benefits}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>

                  <section>
                    <SectionBadge title="Protocolo y proceso médico" />
                    <ul className="relative mt-10 space-y-0">
                      {PROTOCOL_STEPS.map(
                        ({ step, title, text, bullets }, index) => (
                          <li
                            key={step}
                            className="relative flex gap-5 pb-10 last:pb-0 sm:gap-8"
                          >
                            <div className="flex w-12 shrink-0 flex-col items-center sm:w-14">
                              <span className="font-serif text-2xl leading-none text-luxury-accent sm:text-3xl">
                                {step}
                              </span>
                              {index < PROTOCOL_STEPS.length - 1 && (
                                <span
                                  className="mt-3 w-px flex-1 bg-luxury-accent/35"
                                  aria-hidden
                                />
                              )}
                            </div>
                            <div className="min-w-0 flex-1 border-b border-luxury-accent/15 pb-8 last:border-0 last:pb-0">
                              <h4 className="font-serif text-lg text-luxury-dark sm:text-xl">
                                {title}
                              </h4>
                              <p className="mt-3 text-sm leading-relaxed text-luxury-text sm:text-base">
                                {text}
                              </p>
                              {bullets && (
                                <ul className="mt-4 space-y-2">
                                  {bullets.map((item) => (
                                    <li
                                      key={item}
                                      className="flex gap-2 text-sm leading-relaxed text-luxury-text/90"
                                    >
                                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-luxury-accent" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </li>
                        ),
                      )}
                    </ul>
                  </section>

                  <section>
                    <SectionBadge title="Recuperación y resultados" />
                    <p className="mt-6 text-sm leading-relaxed text-luxury-text sm:text-base">
                      Cada persona evoluciona de forma distinta, aunque por lo
                      general la reincorporación es rápida y las mejoras se van
                      sumando con el paso de las semanas.
                    </p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      {RECOVERY_TIMELINE.map(({ period, status, care }) => (
                        <div
                          key={period}
                          className="overflow-hidden rounded-serenity-lg border-2 border-luxury-accent/25 shadow-serenity"
                        >
                          <p className="bg-luxury-dark px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.15em] text-luxury-card">
                            {period}
                          </p>
                          <ul className="space-y-2 bg-luxury-bg px-4 py-4 text-sm leading-relaxed text-luxury-text">
                            <li className="flex gap-2">
                              <span className="text-luxury-accent">•</span>
                              <span>
                                <strong className="font-medium text-luxury-dark">
                                  Piel:
                                </strong>{" "}
                                {status}
                              </span>
                            </li>
                            <li className="flex gap-2">
                              <span className="text-luxury-accent">•</span>
                              <span>
                                <strong className="font-medium text-luxury-dark">
                                  Cuidados:
                                </strong>{" "}
                                {care}
                              </span>
                            </li>
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {RESULT_OUTCOMES.map(({ label, text }) => (
                        <div
                          key={label}
                          className="rounded-serenity-lg border border-luxury-accent/20 bg-luxury-bg p-5 text-sm leading-relaxed text-luxury-text"
                        >
                          <p className="font-medium text-luxury-dark">{label}</p>
                          <p className="mt-2 text-luxury-text/90">{text}</p>
                        </div>
                      ))}
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

                  <section className="text-center md:text-left">
                    <div className="flex justify-center md:justify-start">
                      <SectionBadge title="Explora y compara resultados" />
                    </div>
                    <p className="mt-6 text-sm leading-relaxed text-luxury-text">
                      Resultados reales del tratamiento Morpheus8. La evolución
                      de cada paciente es individual según zona, protocolo y
                      características de la piel.
                    </p>
                    <BeforeAfterCarousel />
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
