import Image from "next/image";
import {
  BRAND_STRIP_ALT,
  BRAND_STRIP_HEIGHT,
  BRAND_STRIP_IMAGE,
  BRAND_STRIP_WIDTH,
} from "@/lib/brands";

type BrandSliderProps = {
  variant?: "default" | "floating";
};

const LOGO_FILTER =
  "brightness-0 invert opacity-70 transition-opacity duration-300 hover:opacity-100";

export default function BrandSlider({ variant = "default" }: BrandSliderProps) {
  if (!BRAND_STRIP_IMAGE) {
    return null;
  }

  const isFloating = variant === "floating";

  return (
    <div
      aria-label="Marcas dermatológicas premium"
      className="relative w-full overflow-hidden border-y border-luxury-accent/25 bg-luxury-dark py-9 md:py-[2.835rem]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-luxury-accent/5 via-transparent to-luxury-text/30"
      />

      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)]">
        <div
          className={`brand-slider-track ${isFloating ? "" : "brand-slider-track--slow"}`}
        >
          {[0, 1].map((index) => (
            <div key={index} className="shrink-0" aria-hidden={index === 1}>
              <Image
                src={BRAND_STRIP_IMAGE}
                alt={index === 0 ? BRAND_STRIP_ALT : ""}
                width={BRAND_STRIP_WIDTH}
                height={BRAND_STRIP_HEIGHT}
                priority={index === 0}
                draggable={false}
                className={`block h-[2.025rem] w-auto max-w-none object-contain object-center md:h-[2.43rem] lg:h-[2.835rem] ${LOGO_FILTER}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
