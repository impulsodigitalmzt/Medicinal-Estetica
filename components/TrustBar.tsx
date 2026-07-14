import { ALL_SERVICES } from "@/lib/data";

const TREATMENTS = ALL_SERVICES.map((service) => service.name);
const MARQUEE_ITEMS = [...TREATMENTS, ...TREATMENTS];

export default function TrustBar() {
  return (
    <section className="border-y border-luxury-accent/25 bg-luxury-dark">
      <div className="overflow-hidden py-5 md:py-6">
        <div
          className="flex w-max animate-brand-marquee-slow items-center motion-reduce:animate-none"
          aria-label="Tratamientos disponibles en la clínica"
        >
          {MARQUEE_ITEMS.map((treatment, index) => (
            <span
              key={`${treatment}-${index}`}
              aria-hidden={index >= TREATMENTS.length}
              className="mx-6 flex shrink-0 items-center gap-6 font-serif text-sm tracking-wide text-luxury-bg/90 md:mx-8 md:text-base"
            >
              {treatment}
              <span className="text-luxury-accent" aria-hidden>
                •
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
