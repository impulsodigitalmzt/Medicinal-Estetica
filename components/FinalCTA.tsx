import Image from "next/image";
import Link from "next/link";
import { CLINIC } from "@/lib/data";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0">
        <Image
          src={CLINIC.assets.finalCtaImage}
          alt="Ambiente de clínica estética"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-luxury-dark/50" />
      </div>

      <div className="luxury-container relative z-10 flex justify-center">
        <div className="glass-luxury w-full max-w-lg rounded-serenity-lg px-8 py-12 text-center md:px-12 md:py-14">
          <h2 className="font-serif text-2xl text-luxury-dark sm:text-3xl">
            {CLINIC.copy.finalCtaTitle}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-luxury-text/80">
            {CLINIC.copy.finalCtaSubcopy}
          </p>
          <Link href="/reservar" className="btn-luxury-gold mt-8 w-full sm:w-auto">
            Agendar cita
          </Link>
        </div>
      </div>
    </section>
  );
}
