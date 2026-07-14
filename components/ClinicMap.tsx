import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { CLINIC, CLINIC_MAP_EMBED_URL } from "@/lib/data";

type ClinicMapProps = {
  className?: string;
  heightClass?: string;
  showOverlay?: boolean;
};

export default function ClinicMap({
  className = "",
  heightClass = "h-[320px] sm:h-[420px] lg:h-[500px]",
  showOverlay = true,
}: ClinicMapProps) {
  const fillsParent = heightClass.includes("h-full");

  return (
    <div
      className={`group relative overflow-hidden rounded-serenity-lg border border-luxury-accent/20 bg-luxury-card shadow-serenity-lg ${
        fillsParent ? `h-full ${className}` : className
      }`}
    >
      <iframe
        title={`Ubicación de ${CLINIC.name}`}
        src={CLINIC_MAP_EMBED_URL}
        className={
          fillsParent
            ? `absolute inset-0 h-full w-full ${heightClass}`
            : `w-full ${heightClass}`
        }
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />

      {showOverlay && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-luxury-dark/55 to-transparent sm:h-32" />

          <div className="pointer-events-none absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm">
            <div className="pointer-events-auto rounded-serenity border border-white/20 bg-luxury-bg/95 p-3 shadow-float backdrop-blur-sm sm:p-5">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-luxury-accent/15 sm:h-10 sm:w-10">
                  <MapPin size={18} className="text-luxury-accent" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-serif text-sm text-luxury-dark sm:text-lg">
                    {CLINIC.name}
                  </p>
                  <p className="mt-0.5 hidden text-xs leading-relaxed text-luxury-text/80 sm:mt-1 sm:block sm:text-sm">
                    {CLINIC.address}
                    <br />
                    {CLINIC.city}, {CLINIC.state}
                  </p>
                  <p className="mt-0.5 text-[0.7rem] leading-snug text-luxury-text/80 sm:hidden">
                    {CLINIC.address}
                  </p>
                </div>
              </div>

              <a
                href={CLINIC.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-luxury-gold mt-3 inline-flex w-full items-center justify-center gap-2 text-sm sm:mt-4 sm:w-auto"
              >
                <Navigation size={16} />
                Cómo llegar
                <ExternalLink size={14} className="opacity-70" />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
