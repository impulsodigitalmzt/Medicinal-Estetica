"use client";

import { Star } from "lucide-react";
import CoverFlowCarousel from "@/components/CoverFlowCarousel";
import { CLINIC, GOOGLE_REVIEWS, type GoogleReview } from "@/lib/data";

const { reviews: ALL_REVIEWS, rating, count } = GOOGLE_REVIEWS;

const GENERIC_QUOTES = new Set([
  "excelente.",
  "excelente",
  "muy bueno.",
  "muy bueno",
]);

/** Misma lógica de curaduría que el carrusel Cover Flow de la iglesia. */
const CAROUSEL_REVIEWS = ALL_REVIEWS.filter((review) => {
  const trimmed = review.text.trim();
  if (trimmed.length < 50) return false;
  return !GENERIC_QUOTES.has(trimmed.toLowerCase());
}).sort((a, b) => b.text.length - a.text.length);

function reviewInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

function GoogleRatingBadge() {
  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-pill border border-white/20 bg-white/10 px-5 py-2.5 shadow-sm">
      <div className="flex" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={16}
            className="fill-luxury-accent text-luxury-accent"
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-luxury-bg">
        {rating.toFixed(1)}
      </span>
      <span className="text-sm text-luxury-bg/70">
        · {count} opiniones en Google
      </span>
    </div>
  );
}

function TestimonialCard({
  testimonial: t,
  isActive,
}: {
  testimonial: GoogleReview;
  isActive: boolean;
}) {
  return (
    <article
      className={`flex h-[min(72vw,340px)] max-h-[360px] min-h-[260px] flex-col overflow-hidden rounded-serenity-lg border p-5 sm:h-[300px] sm:p-7 md:h-[320px] md:p-8 ${
        isActive
          ? "border-luxury-accent/25 bg-luxury-bg"
          : "border-luxury-accent/10 bg-luxury-bg/95"
      }`}
    >
      <div className="mb-3 flex gap-0.5 sm:mb-4">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className="fill-luxury-accent text-luxury-accent"
          />
        ))}
      </div>

      <figure className="flex min-h-0 flex-1 flex-col">
        <blockquote className="relative min-h-0 flex-1 overflow-hidden pl-6 font-sans text-base font-medium leading-relaxed text-luxury-dark sm:text-lg md:text-xl">
          <span
            aria-hidden
            className="absolute left-0 top-0 font-serif text-4xl leading-none text-luxury-accent/30"
          >
            &ldquo;
          </span>
          <span className="line-clamp-5 sm:line-clamp-6">{t.text}</span>
        </blockquote>

        <figcaption className="mt-6 flex items-center gap-3 border-t border-luxury-accent/15 pt-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-luxury-card font-serif text-xs text-luxury-dark">
            {reviewInitials(t.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-luxury-dark">
              {t.name}
            </p>
            {t.localGuide ? (
              <p className="text-xs text-luxury-text/60">Local Guide</p>
            ) : (
              <p className="text-xs text-luxury-text/60">Google</p>
            )}
          </div>
        </figcaption>
      </figure>
    </article>
  );
}

export default function Reviews() {
  return (
    <section
      className="section-padding overflow-x-hidden bg-luxury-dark text-luxury-bg"
      aria-label="Testimonios"
    >
      <div className="luxury-container">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
          <div className="text-center md:text-left">
            <p className="section-label !text-luxury-bg/70">Testimonios</p>
            <h2 className="font-serif text-2xl text-luxury-bg sm:text-3xl lg:text-4xl">
              Lo que dicen nuestras pacientes
            </h2>
            <p className="mt-2 max-w-xl text-sm text-luxury-bg/70 md:text-base">
              Opiniones reales de Google sobre el consultorio del{" "}
              {CLINIC.doctorShortName} en Mazatlán.
            </p>
          </div>
          <GoogleRatingBadge />
        </div>

        <div className="mt-10 md:mt-12">
          <CoverFlowCarousel
            theme="dark"
            items={CAROUSEL_REVIEWS}
            ariaLabel="Testimonios del consultorio"
            autoplay
            autoplayDelay={4500}
            getLabel={(item) => item.name.split(" ")[0] ?? item.name}
            renderItem={(item, isActive) => (
              <TestimonialCard testimonial={item} isActive={isActive} />
            )}
          />
        </div>

        {CLINIC.googleReviews ? (
          <div className="mt-10 text-center md:mt-12">
            <a
              href={CLINIC.googleReviews}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-outline border-luxury-bg/25 text-luxury-bg hover:border-luxury-accent hover:bg-luxury-accent/10 hover:text-luxury-bg"
            >
              Ver todos los comentarios en Google
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
