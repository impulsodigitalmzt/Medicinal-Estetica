import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CLINIC } from "@/lib/data";

type UltherapyBadgeProps = {
  variant?: "featured" | "bar" | "compact";
};

export default function UltherapyBadge({ variant = "featured" }: UltherapyBadgeProps) {
  if (!CLINIC.ultherapy || !CLINIC.ultherapyLogo) {
    return null;
  }

  if (variant === "bar") {
    return (
      <a
        href={CLINIC.ultherapy}
        target="_blank"
        rel="noopener noreferrer"
        className="group mx-auto flex w-full max-w-3xl items-center gap-5 rounded-serenity-lg border border-luxury-accent/40 bg-white/5 px-5 py-5 shadow-float transition-all duration-500 hover:border-luxury-accent/60 hover:bg-white/[0.08] hover:shadow-serenity-lg sm:gap-8 sm:px-8 sm:py-6"
      >
        <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
          <Image
            src={CLINIC.ultherapyLogo}
            alt="Sello de médico certificado Ultherapy"
            fill
            className="object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
            sizes="96px"
          />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-luxury-accent">
            Certificación internacional
          </p>
          <p className="mt-1 font-serif text-lg text-luxury-bg sm:text-xl">
            Médico certificado Ultherapy®
          </p>
          <p className="mt-1 text-sm text-luxury-bg/70">
            Perfil verificado en el directorio oficial de prácticas autorizadas.
          </p>
        </div>
        <span className="hidden shrink-0 items-center justify-center rounded-pill border border-luxury-bg/20 bg-luxury-bg/10 p-3 text-luxury-bg transition-colors group-hover:border-luxury-accent group-hover:bg-luxury-accent/20 group-hover:text-luxury-accent sm:flex">
          <ArrowUpRight size={18} />
        </span>
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <a
        href={CLINIC.ultherapy}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-4 rounded-serenity border border-luxury-accent/20 bg-luxury-bg/95 px-5 py-4 shadow-serenity transition-all duration-300 hover:border-luxury-accent/40"
      >
        <div className="relative h-16 w-16 shrink-0">
          <Image
            src={CLINIC.ultherapyLogo}
            alt="Ultherapy certified provider"
            fill
            className="object-contain"
            sizes="64px"
          />
        </div>
        <div className="text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-luxury-accent">
            Ultherapy®
          </p>
          <p className="text-sm font-medium text-luxury-dark">Médico certificado</p>
        </div>
        <ArrowUpRight size={14} className="text-luxury-accent" />
      </a>
    );
  }

  return (
    <a
      href={CLINIC.ultherapy}
      target="_blank"
      rel="noopener noreferrer"
      className="group mx-auto mt-10 block max-w-lg rounded-serenity-lg border border-luxury-accent/25 bg-luxury-bg p-8 text-center shadow-serenity-lg transition-all duration-500 hover:border-luxury-accent/40 hover:shadow-float sm:p-10"
    >
      <div className="relative mx-auto h-32 w-32 sm:h-36 sm:w-36">
        <Image
          src={CLINIC.ultherapyLogo}
          alt="Sello de médico certificado Ultherapy"
          fill
          className="object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="144px"
          priority
        />
      </div>
      <p className="section-label mt-6">Certificación oficial</p>
      <p className="mt-2 font-serif text-2xl text-luxury-dark">
        Médico certificado Ultherapy®
      </p>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-luxury-text/75">
        {CLINIC.copy.ultherapyBadge}
      </p>
      <span className="btn-pill-outline mt-6 inline-flex gap-2 text-xs uppercase tracking-[0.16em]">
        Ver perfil oficial
        <ArrowUpRight size={14} />
      </span>
    </a>
  );
}
