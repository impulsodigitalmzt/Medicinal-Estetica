import Link from "next/link";
import { ArrowUpRight, Calendar, MapPin, ShoppingBag, Sparkles, Zap } from "lucide-react";
import Card3D from "@/components/Card3D";

const PAGES = [
  {
    href: "/servicios",
    label: "Servicios",
    title: "Nuestros tratamientos",
    description:
      "Botox, fillers, Endolift y protocolos de antienvejecimiento con precios de referencia.",
    icon: Sparkles,
  },
  {
    href: "/tecnologia",
    label: "Tecnología",
    title: "Botox, fillers y Endolift",
    description:
      "Tres pilares de medicina estética con enfoque natural y valoración médica personalizada.",
    icon: Zap,
  },
  {
    href: "/ubicacion",
    label: "Ubicación",
    title: "Atención en Mazatlán",
    description:
      "Consulta el mapa y agenda tu cita en línea para confirmar horarios y disponibilidad.",
    icon: MapPin,
  },
  {
    href: "/tienda",
    label: "Tienda",
    title: "Catálogo informativo",
    description:
      "Recomendaciones de cuidado posteriores a tu tratamiento. Orientación en consulta.",
    icon: ShoppingBag,
  },
  {
    href: "/reservar",
    label: "Reservar",
    title: "Reserva tu cita",
    description:
      "Agenda tu tratamiento y elige pagar en clínica o en línea al confirmar.",
    icon: Calendar,
  },
];

export default function InternalLinks() {
  return (
    <section className="section-padding bg-luxury-card">
      <div className="luxury-container">
        <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-16">
          <p className="section-label">Explora el consultorio</p>
          <h2 className="section-title">
            Todo lo que necesitas, en un solo lugar
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PAGES.map((page) => (
            <Card3D key={page.href}>
              <Link
                href={page.href}
                className="card-serenity group flex h-full flex-col bg-luxury-bg p-8"
              >
                <div className="mb-6 flex items-start justify-between">
                  <page.icon
                    size={22}
                    strokeWidth={1.25}
                    className="text-luxury-accent"
                  />
                  <ArrowUpRight
                    size={18}
                    className="text-luxury-accent/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-luxury-accent"
                  />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-luxury-accent">
                  {page.label}
                </p>
                <h3 className="mt-2 font-serif text-xl text-luxury-dark">
                  {page.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-luxury-text/75">
                  {page.description}
                </p>
              </Link>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
  );
}
