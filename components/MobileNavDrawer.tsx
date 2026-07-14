"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Clock,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import SocialIcon from "@/components/SocialIcon";
import { CLINIC } from "@/lib/data";
import { SOCIAL_LINKS } from "@/lib/social-links";

export type NavLink = { href: string; label: string };

type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
  pathname: string;
  links: NavLink[];
};

function linkClass(active: boolean) {
  return `flex items-center rounded-xl px-3.5 py-2.5 text-[15px] font-semibold transition-colors ${
    active
      ? "bg-luxury-accent/15 text-luxury-accent"
      : "text-luxury-dark hover:bg-luxury-card"
  }`;
}

export default function MobileNavDrawer({
  open,
  onClose,
  pathname,
  links,
}: MobileNavDrawerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar menú"
            className="fixed inset-0 z-[60] bg-luxury-dark/40 backdrop-blur-[2px] lg:hidden"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.aside
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="fixed inset-y-0 right-0 z-[70] flex h-full w-[min(100vw,400px)] flex-col border-l border-luxury-accent/15 bg-[#F3F0E8] shadow-float lg:hidden"
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? undefined : { x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="flex shrink-0 items-center gap-2 border-b border-luxury-accent/15 bg-luxury-bg px-3 py-3 sm:gap-3 sm:px-5 sm:py-4">
              <Logo
                variant="mobile"
                asLink
                onDark={false}
                className="min-w-0 shrink origin-left scale-[0.85] sm:scale-[0.92]"
              />
              <Link
                href="/reservar"
                onClick={onClose}
                className="btn-luxury-gold ml-auto shrink-0 px-3 py-2 text-xs sm:px-4 sm:text-sm"
              >
                Agendar cita
              </Link>
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={onClose}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-luxury-accent/25 bg-luxury-card text-luxury-dark transition-colors hover:bg-luxury-accent/15"
              >
                <X size={20} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <Link
                href="/ubicacion"
                onClick={onClose}
                className="group relative mb-4 block overflow-hidden rounded-serenity-lg shadow-md"
              >
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={CLINIC.assets.clinicInterior || CLINIC.assets.clinicExterior}
                    alt=""
                    fill
                    sizes="360px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
                      Consultorio
                    </p>
                    <p className="mt-1 font-serif text-lg font-semibold leading-tight">
                      Visítanos en {CLINIC.landmark}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/80">
                      {CLINIC.address}, {CLINIC.city}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-luxury-accent">
                      Ver ubicación
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>

              <nav
                aria-label="Navegación principal"
                className="overflow-hidden rounded-serenity-lg border border-luxury-accent/20 bg-luxury-bg shadow-sm"
              >
                <div className="border-b border-luxury-accent/15 px-2 py-2">
                  <Link
                    href="/"
                    onClick={onClose}
                    aria-current={pathname === "/" ? "page" : undefined}
                    className={linkClass(pathname === "/")}
                  >
                    Inicio
                  </Link>
                </div>

                <ul className="space-y-0.5 px-2 py-2">
                  {links.map((link) => {
                    const active =
                      pathname === link.href ||
                      pathname.startsWith(`${link.href}/`);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          aria-current={active ? "page" : undefined}
                          className={linkClass(active)}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="border-t border-luxury-accent/15 px-2 py-2">
                  <Link
                    href="/reservar"
                    onClick={onClose}
                    aria-current={pathname.startsWith("/reservar") ? "page" : undefined}
                    className={linkClass(pathname.startsWith("/reservar"))}
                  >
                    Agendar cita
                  </Link>
                </div>
              </nav>

              <div className="mt-4 rounded-serenity-lg border border-luxury-accent/20 bg-luxury-bg p-4 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-luxury-accent">
                  Visítanos
                </p>
                <div className="mt-3 space-y-3">
                  <div className="flex gap-3">
                    <Clock
                      size={16}
                      className="mt-0.5 shrink-0 text-luxury-accent"
                      aria-hidden
                    />
                    <div className="text-sm leading-relaxed text-luxury-text/75">
                      {CLINIC.hours.map((slot) => (
                        <p key={slot.days}>
                          {slot.days}: {slot.time}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-luxury-accent"
                      aria-hidden
                    />
                    <p className="text-sm leading-relaxed text-luxury-text/75">
                      {CLINIC.address}, {CLINIC.city}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`tel:${CLINIC.phoneE164}`}
                    className="btn-pill-outline inline-flex h-11 min-h-11 flex-1 min-w-[120px] items-center justify-center gap-2 text-sm"
                  >
                    <Phone size={14} />
                    Llamar
                  </a>
                  <Link
                    href="/ubicacion"
                    onClick={onClose}
                    className="btn-pill-outline inline-flex h-11 min-h-11 flex-1 min-w-[120px] items-center justify-center gap-2 text-sm"
                  >
                    <MapPin size={14} />
                    Mapa
                  </Link>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-luxury-accent/15 bg-luxury-bg px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-luxury-text/60">
                  Síguenos
                </p>
                <div className="flex items-center gap-1.5">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-luxury-text/70 transition-colors hover:bg-luxury-card hover:text-luxury-dark"
                    >
                      <SocialIcon link={link} size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
