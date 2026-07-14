import Image from "next/image";
import Logo from "@/components/Logo";

type PageHeaderProps = {
  label: string;
  title: string;
  description?: string;
  /** Contextual background photo for the header band. */
  image?: string;
  imageAlt?: string;
  tone?: "sand" | "cream";
};

export default function PageHeader({
  label,
  title,
  description,
  image = "/fotos/Captura.JPG",
  imageAlt = "Consultorio Dr. Andrés Osuna",
  tone = "sand",
}: PageHeaderProps) {
  const overlay =
    tone === "sand"
      ? "bg-luxury-card/45"
      : "bg-luxury-bg/40";

  return (
    <div className="relative isolate overflow-hidden border-b border-luxury-accent/10">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className={`absolute inset-0 ${overlay}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-bg/25 via-transparent to-luxury-bg/35" />

      <div className="luxury-container relative z-10 pb-12 pt-6 text-center md:pb-16 md:pt-8">
        <div className="mb-8 flex justify-center md:mb-10">
          <Logo variant="navbar" />
        </div>
        <p className="section-label drop-shadow-sm">{label}</p>
        <h1 className="section-title drop-shadow-sm">{title}</h1>
        {description && (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-luxury-text sm:text-lg sm:leading-loose">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
