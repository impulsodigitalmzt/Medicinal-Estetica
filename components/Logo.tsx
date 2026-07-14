import Image from "next/image";
import Link from "next/link";
import { CLINIC } from "@/lib/data";

type LogoProps = {
  variant?: "navbar" | "hero" | "footer" | "mobile";
  /** El logo oficial ya incluye nombre y especialidad; por defecto no se duplica. */
  showText?: boolean;
  /**
   * `true` = LOGO_blanco (fondos oscuros).
   * Si no se indica: hero y footer usan blanco; navbar/mobile usan el logo normal.
   */
  onDark?: boolean;
  asLink?: boolean;
  className?: string;
};

const SIZES = {
  navbar: { width: 340, height: 116, className: "h-12 w-auto sm:h-14 md:h-16" },
  hero: { width: 460, height: 158, className: "h-24 w-auto sm:h-28 md:h-32" },
  footer: { width: 260, height: 90, className: "h-14 w-auto md:h-16" },
  mobile: { width: 240, height: 82, className: "h-12 w-auto" },
} as const;

const DARK_VARIANTS = new Set(["hero", "footer"]);

export default function Logo({
  variant = "navbar",
  showText = false,
  onDark,
  asLink = true,
  className = "",
}: LogoProps) {
  const size = SIZES[variant];
  const isHero = variant === "hero";
  const isFooter = variant === "footer";
  const useDarkLogo = onDark ?? DARK_VARIANTS.has(variant);
  const logoSrc = useDarkLogo
    ? CLINIC.assets.logoOnDark || CLINIC.assets.logo
    : CLINIC.assets.logo;

  const hasDualLogo =
    Boolean(CLINIC.assets.logoOnDark) &&
    CLINIC.assets.logoOnDark !== CLINIC.assets.logo;

  const logoImage = hasDualLogo ? (
    <span className="relative inline-grid">
      <Image
        src={CLINIC.assets.logoOnDark!}
        alt=""
        width={size.width}
        height={size.height}
        aria-hidden
        className={`col-start-1 row-start-1 object-contain object-left transition-opacity duration-500 ${size.className} ${
          useDarkLogo ? "opacity-100" : "opacity-0"
        }`}
        priority={variant === "navbar" || variant === "hero"}
      />
      <Image
        src={CLINIC.assets.logo}
        alt={CLINIC.name}
        width={size.width}
        height={size.height}
        className={`col-start-1 row-start-1 object-contain object-left transition-opacity duration-500 ${size.className} ${
          useDarkLogo ? "opacity-0" : "opacity-100"
        }`}
        priority={variant === "navbar" || variant === "hero"}
      />
    </span>
  ) : (
    <Image
      src={logoSrc}
      alt={CLINIC.name}
      width={size.width}
      height={size.height}
      className={`object-contain object-left ${size.className}`}
      priority={variant === "navbar" || variant === "hero"}
    />
  );

  const content = (
    <>
      <span className="relative flex shrink-0 items-center overflow-hidden rounded-serenity">
        {logoImage}
      </span>
      {showText && (
        <span
          className={`text-left leading-tight ${variant === "navbar" ? "hidden sm:block" : ""}`}
        >
          <span
            className={`block font-serif text-base tracking-wide md:text-xl ${
              isHero || isFooter ? "text-luxury-bg" : "text-luxury-dark"
            }`}
          >
            {CLINIC.doctorShortName}
          </span>
          <span
            className={`mt-0.5 block text-[10px] uppercase tracking-[0.2em] md:text-xs text-luxury-accent`}
          >
            {CLINIC.specialty}
          </span>
        </span>
      )}
    </>
  );

  const wrapperClass = `group flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`;

  if (asLink && !isHero) {
    return (
      <Link href="/" className={wrapperClass}>
        {content}
      </Link>
    );
  }

  if (asLink && isHero) {
    return (
      <Link href="/" className={`${wrapperClass} flex-col gap-4 text-center`}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}
