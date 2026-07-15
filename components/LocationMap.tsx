import Image from "next/image";
import Link from "next/link";
import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import ClinicMap from "@/components/ClinicMap";
import PageHeader from "@/components/PageHeader";
import { CLINIC } from "@/lib/data";

const CLINIC_EXTERIOR_IMAGE = "/fotos/doctor/retrato-principal.jpg";

const HOURS = CLINIC.hours;

export default function LocationMap() {
  return (
    <>
      <PageHeader
        label="Ubicación"
        title={CLINIC.copy.locationTitle}
        description={CLINIC.copy.locationDescription}
      />

      <section className="section-padding bg-luxury-card pt-0">
        <div className="luxury-container">
          <div className="mb-12 grid items-stretch gap-5 md:mb-14 md:grid-cols-2 md:gap-6 lg:mb-16 lg:gap-8">
            <div className="relative aspect-[4/5] overflow-hidden rounded-serenity-lg border border-luxury-accent/20 shadow-serenity-lg sm:aspect-[3/4] md:aspect-auto md:min-h-[420px] lg:min-h-[560px] xl:min-h-[640px]">
              <Image
                src={CLINIC_EXTERIOR_IMAGE}
                alt={`${CLINIC.doctorDisplayName} — consultorio en ${CLINIC.landmark}, ${CLINIC.city}`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-luxury-dark/35 via-transparent to-transparent" />
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto">
                <p className="inline-block max-w-full break-words rounded-serenity border border-white/25 bg-luxury-bg/90 px-3 py-2 text-xs font-medium text-luxury-dark shadow-float backdrop-blur-sm sm:px-4 sm:text-sm">
                  <span className="sm:hidden">{CLINIC.doctorShortName}</span>
                  <span className="hidden sm:inline">
                    {CLINIC.name} · {CLINIC.landmark}
                  </span>
                </p>
              </div>
            </div>

            <ClinicMap
              heightClass="h-full"
              className="min-h-[280px] sm:min-h-[340px] md:min-h-[420px] lg:min-h-[560px] xl:min-h-[640px]"
            />
          </div>

          <div className="mb-12 grid gap-4 sm:grid-cols-3 lg:mb-16">
            <div className="glass-luxury rounded-serenity-lg p-5 text-center">
              <MapPin
                size={22}
                className="mx-auto text-luxury-accent"
                strokeWidth={1.25}
              />
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-luxury-dark">
                Dirección
              </p>
              <p className="mt-2 text-sm leading-relaxed text-luxury-text/80">
                {CLINIC.address}, {CLINIC.city}
              </p>
            </div>

            <div className="glass-luxury rounded-serenity-lg p-5 text-center">
              <Clock
                size={22}
                className="mx-auto text-luxury-accent"
                strokeWidth={1.25}
              />
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-luxury-dark">
                Horario
              </p>
              <p className="mt-2 text-sm text-luxury-text/80">
                Lun–Vie 9:00 – 19:00
                <br />
                Sáb 9:00 – 15:00
              </p>
            </div>

            <div className="glass-luxury rounded-serenity-lg p-5 text-center">
              <Phone
                size={22}
                className="mx-auto text-luxury-accent"
                strokeWidth={1.25}
              />
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-luxury-dark">
                Contacto
              </p>
              <a
                href={`tel:${CLINIC.phoneE164}`}
                className="mt-2 block text-sm text-luxury-text/80 transition-colors hover:text-luxury-accent"
              >
                {CLINIC.phone}
              </a>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center lg:order-2">
              <div className="card-serenity bg-luxury-card p-5 sm:p-8 md:p-10">
                <h2 className="font-serif text-xl text-luxury-dark sm:text-2xl">
                  Información de contacto
                </h2>

                <ul className="mt-8 space-y-6">
                  <li className="flex gap-4">
                    <MapPin
                      size={20}
                      className="mt-0.5 shrink-0 text-luxury-accent"
                      strokeWidth={1.25}
                    />
                    <div>
                      <p className="text-sm font-medium text-luxury-dark">
                        Dirección
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-luxury-text/80">
                        {CLINIC.address}
                        <br />
                        {CLINIC.city}, {CLINIC.state} {CLINIC.postalCode}
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <Phone
                      size={20}
                      className="mt-0.5 shrink-0 text-luxury-accent"
                      strokeWidth={1.25}
                    />
                    <div>
                      <p className="text-sm font-medium text-luxury-dark">
                        Teléfono / WhatsApp
                      </p>
                      <a
                        href={`tel:${CLINIC.phoneE164}`}
                        className="mt-1 block text-sm text-luxury-text/80 transition-colors hover:text-luxury-accent"
                      >
                        {CLINIC.phone}
                      </a>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <Mail
                      size={20}
                      className="mt-0.5 shrink-0 text-luxury-accent"
                      strokeWidth={1.25}
                    />
                    <div>
                      <p className="text-sm font-medium text-luxury-dark">
                        Correo
                      </p>
                      {CLINIC.email ? (
                        <a
                          href={`mailto:${CLINIC.email}`}
                          className="mt-1 block text-sm text-luxury-text/80 transition-colors hover:text-luxury-accent"
                        >
                          {CLINIC.email}
                        </a>
                      ) : (
                        <Link
                          href="/reservar"
                          className="mt-1 block text-sm text-luxury-text/80 transition-colors hover:text-luxury-accent"
                        >
                          Reservar cita en línea
                        </Link>
                      )}
                    </div>
                  </li>
                </ul>

                <div className="mt-10 border-t border-luxury-accent/15 pt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <Clock
                      size={18}
                      className="text-luxury-accent"
                      strokeWidth={1.25}
                    />
                    <h3 className="font-serif text-lg text-luxury-dark">
                      Horarios de atención
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {HOURS.map((slot) => (
                      <li
                        key={slot.days}
                        className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between sm:gap-4 text-luxury-text/80"
                      >
                        <span>{slot.days}</span>
                        <span className="font-medium text-luxury-dark">
                          {slot.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={CLINIC.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-outline mt-8 inline-flex items-center gap-2"
                >
                  Abrir en Google Maps
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            <div className="lg:order-1">
              <div className="card-serenity h-full bg-luxury-card p-5 sm:p-8 md:p-10">
                <h2 className="font-serif text-xl text-luxury-dark sm:text-2xl">
                  ¿Cómo llegar?
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-luxury-text/80">
                  Atendemos en Mazatlán, Sinaloa. Confirma la dirección exacta
                  al agendar tu cita en línea. Usa el mapa como referencia
                  general de la zona.
                </p>
                <ul className="mt-8 space-y-4 text-sm text-luxury-text/80">
                  <li className="flex gap-3">
                    <span className="font-medium text-luxury-dark">•</span>
                    <span>Confirmación de ubicación al agendar</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-medium text-luxury-dark">•</span>
                    <span>Atención en Mazatlán, Sinaloa</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-medium text-luxury-dark">•</span>
                    <span>Agenda rápida en Agendar cita</span>
                  </li>
                </ul>
                <Link href="/reservar" className="btn-luxury-gold mt-8 inline-flex">
                  Agendar cita
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
