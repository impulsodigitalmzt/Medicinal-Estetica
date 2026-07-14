import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { CLINIC } from "@/lib/data";
import CofeprisNotice from "@/components/CofeprisNotice";
import Logo from "@/components/Logo";
import SocialIcon from "@/components/SocialIcon";
import { SOCIAL_LINKS } from "@/lib/social-links";

export default function Footer() {
  return (
    <footer className="bg-luxury-dark pt-16 text-luxury-bg md:pt-20">
      <div className="luxury-container">
        {/* Newsletter row */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 border-b border-luxury-bg/10 pb-12 md:flex-row md:items-center">
          <Logo variant="footer" />
          <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="w-full flex-1 rounded-pill border border-luxury-bg/15 bg-luxury-bg/5 px-5 py-3 text-sm text-luxury-bg placeholder:text-luxury-bg/40 outline-none focus:border-luxury-accent"
            />
            <button
              type="button"
              className="btn-pill w-full shrink-0 bg-luxury-accent px-6 text-luxury-bg hover:bg-luxury-bg hover:text-luxury-dark sm:w-auto"
            >
              Suscribirse
            </button>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <p className="text-sm leading-relaxed text-luxury-bg/65">
              {CLINIC.copy.footerBlurb}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-luxury-bg/90">
              Enlaces
            </h3>
            <ul className="space-y-2.5 text-sm text-luxury-bg/65">
              {[
                ["/servicios", "Servicios"],
                ["/reservar", "Reservar cita"],
                ["/tienda", "Tienda skincare"],
                ["/tecnologia", "Tecnología"],
                ["/ubicacion", "Ubicación"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-luxury-accent">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-luxury-bg/90">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-luxury-bg/65">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-luxury-accent" />
                <span>
                  {CLINIC.address}
                  <br />
                  {CLINIC.city}, {CLINIC.state}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-luxury-accent" />
                <a href={`tel:${CLINIC.phoneE164}`} className="hover:text-luxury-accent">
                  {CLINIC.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-luxury-bg/90">
              Redes sociales
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={
                      link.handle
                        ? `${link.label} — ${link.handle}`
                        : `${link.label} — ${CLINIC.name}`
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-pill border border-luxury-bg/15 text-luxury-bg/70 transition-colors hover:border-luxury-accent hover:text-luxury-accent"
                  >
                    <SocialIcon link={link} size={18} />
                  </a>
                ))}
                <a
                  href={CLINIC.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Google Maps"
                  className="flex h-10 w-10 items-center justify-center rounded-pill border border-luxury-bg/15 text-luxury-bg/70 transition-colors hover:border-luxury-accent hover:text-luxury-accent"
                >
                  <MapPin size={18} />
                </a>
              </div>
              <p className="text-xs text-luxury-bg/50">
                {[
                  CLINIC.socialHandles.instagram && CLINIC.instagram
                    ? { href: CLINIC.instagram, label: CLINIC.socialHandles.instagram }
                    : null,
                  CLINIC.socialHandles.tiktok && CLINIC.tiktok
                    ? { href: CLINIC.tiktok, label: CLINIC.socialHandles.tiktok }
                    : null,
                ]
                  .filter(Boolean)
                  .map((item, index, arr) => (
                    <span key={item!.label}>
                      <a
                        href={item!.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-luxury-accent"
                      >
                        {item!.label}
                      </a>
                      {index < arr.length - 1 ? " · " : null}
                    </span>
                  ))}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-luxury-bg/10 pt-8">
          <CofeprisNotice className="text-luxury-bg/50" />
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-luxury-bg/10 py-8 text-xs text-luxury-bg/45 sm:flex-row">
          <p>© {new Date().getFullYear()} {CLINIC.name}. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/ubicacion" className="hover:text-luxury-accent">
              Privacidad
            </Link>
            <Link href="/ubicacion" className="hover:text-luxury-accent">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
