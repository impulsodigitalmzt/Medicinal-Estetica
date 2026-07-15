"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Logo from "@/components/Logo";
import MobileNavDrawer from "@/components/MobileNavDrawer";
import SocialIcon from "@/components/SocialIcon";
import { SOCIAL_LINKS } from "@/lib/social-links";

const NAV_LINKS = [
  { href: "/servicios", label: "Servicios" },
  { href: "/tecnologia", label: "Tecnología" },
  { href: "/ubicacion", label: "Ubicación" },
  { href: "/tienda", label: "Tienda" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 pt-3 md:pt-4">
        <div className="luxury-container">
          <div
            className={`rounded-full border transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 ease-out ${
              isTransparent
                ? "border-white/20 bg-white/10 shadow-lg shadow-black/10 backdrop-blur-xl"
                : "border-luxury-accent/20 bg-white/70 shadow-md shadow-luxury-dark/10 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60"
            }`}
          >
            <div className="relative flex h-[4.5rem] min-w-0 items-center justify-between gap-2 px-3 sm:h-[5rem] sm:gap-4 sm:px-5">
              <Logo
                variant="navbar"
                onDark={isTransparent}
                className="relative z-10 shrink-0 [&_img]:h-11 [&_img]:sm:h-14"
              />

              <nav
                aria-label="Navegación principal"
                className="hidden items-center gap-1 lg:flex"
              >
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative inline-flex items-center rounded-pill px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                        isTransparent
                          ? "text-white/88 hover:bg-white/10 hover:text-white"
                          : "text-luxury-text/80 hover:bg-luxury-card hover:text-luxury-dark"
                      } ${
                        active
                          ? isTransparent
                            ? "text-white"
                            : "text-luxury-accent"
                          : ""
                      }`}
                    >
                      <span>{link.label}</span>
                      {active && !reducedMotion ? (
                        <motion.span
                          layoutId="header-nav-indicator"
                          className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full ${
                            isTransparent ? "bg-white" : "bg-luxury-accent"
                          }`}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      ) : null}
                      {active && reducedMotion ? (
                        <span
                          className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full ${
                            isTransparent ? "bg-white" : "bg-luxury-accent"
                          }`}
                        />
                      ) : null}
                    </Link>
                  );
                })}

                <div
                  className={`ml-2 flex items-center gap-0.5 ${
                    isTransparent ? "text-white/85" : "text-luxury-text/70"
                  }`}
                >
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                        isTransparent
                          ? "hover:bg-white/10 hover:text-white"
                          : "hover:bg-luxury-card hover:text-luxury-dark"
                      }`}
                    >
                      <SocialIcon link={link} size={16} />
                    </a>
                  ))}
                </div>

                <Link
                  href="/reservar"
                  className={`btn-luxury-gold ml-1 px-5 py-2.5 shadow-sm transition-transform duration-300 hover:scale-[1.02] ${
                    isTransparent ? "shadow-lg shadow-black/10" : ""
                  }`}
                >
                  Agendar cita
                </Link>
              </nav>

              <div className="relative z-10 flex shrink-0 items-center gap-0.5 sm:gap-1.5 lg:hidden">
                <div
                  className={`flex items-center ${
                    isTransparent ? "text-white" : "text-luxury-dark"
                  }`}
                >
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                        isTransparent
                          ? "hover:bg-white/15 hover:text-white"
                          : "hover:bg-luxury-card hover:text-luxury-dark"
                      }`}
                    >
                      <SocialIcon link={link} size={18} />
                    </a>
                  ))}
                </div>
                <Link
                  href="/reservar"
                  className={`btn-luxury-gold hidden min-[400px]:inline-flex px-3 py-2 text-xs shadow-sm sm:px-4 sm:text-sm ${
                    isTransparent ? "shadow-lg shadow-black/10" : ""
                  }`}
                >
                  Agendar cita
                </Link>
                <button
                  type="button"
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-navigation-drawer"
                  aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    isTransparent
                      ? "text-white hover:bg-white/10"
                      : "text-luxury-dark hover:bg-luxury-card"
                  }`}
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {!isHome ? (
        <div
          aria-hidden
          className="h-[calc(4.5rem+1.5rem)] sm:h-[calc(5rem+1.5rem)] md:h-[calc(5rem+2rem)]"
        />
      ) : null}

      <MobileNavDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
        links={[...NAV_LINKS]}
      />
    </>
  );
}
