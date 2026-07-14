import Link from "next/link";
import Logo from "@/components/Logo";
import UltherapyBadge from "@/components/UltherapyBadge";

const STATS = [
  { value: "500+", label: "Pacientes felices" },
  { value: "10+", label: "Años de experiencia" },
  { value: "98%", label: "Satisfacción clínica" },
];

export default function AboutStats() {
  return (
    <section className="section-padding bg-luxury-card">
      <div className="luxury-container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <Logo variant="navbar" asLink={false} />
          </div>
          <p className="section-label">Sobre nosotros</p>
          <h2 className="section-title">
            Creemos en resultados naturales y atención humana
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-luxury-text/85 sm:leading-loose">
            Combinamos aparatología médica certificada, protocolos
            personalizados y un espacio pensado para tu tranquilidad. Cada
            tratamiento se planifica con precisión clínica para realzar tu
            belleza sin perder autenticidad.
          </p>
          <Link href="/ubicacion" className="btn-pill-outline mt-8">
            Conocer el consultorio
          </Link>

          <UltherapyBadge variant="featured" />
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-8 border-t border-luxury-accent/15 pt-10 sm:grid-cols-3 sm:gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-2xl text-luxury-dark md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs leading-snug text-luxury-text/70 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
