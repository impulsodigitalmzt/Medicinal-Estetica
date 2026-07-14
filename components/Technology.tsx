import { Award, ShieldCheck } from "lucide-react";
import AlmaPrimeXBlock from "@/components/AlmaPrimeXBlock";
import LumeccaBlock from "@/components/LumeccaBlock";
import Morpheus8Block from "@/components/Morpheus8Block";
import PageHeader from "@/components/PageHeader";
import { CLINIC } from "@/lib/data";

const CERTIFICATIONS = [
  {
    icon: ShieldCheck,
    text: "Cédula Profesional Médica",
    detail: CLINIC.professionalLicense,
  },
  { icon: Award, text: "Aparatología Original Certificada" },
  {
    icon: ShieldCheck,
    text: "Espacio Clínico Autorizado por COFEPRIS",
    detail: CLINIC.cofeprisNumber,
  },
];

type TechnologyProps = {
  variant?: "section" | "page";
};

export default function Technology({ variant = "section" }: TechnologyProps) {
  const isPage = variant === "page";

  return (
    <section className={isPage ? "bg-luxury-bg" : "bg-luxury-card py-20 md:py-28"}>
      {isPage && (
        <PageHeader
          label="Autoridad médica"
          title="Tecnología certificada de clase mundial"
          description="Invertimos en aparatología médica original y certificada para ofrecer tratamientos seguros, efectivos y respaldados por evidencia clínica internacional."
        />
      )}

      <div className={`luxury-container section-padding ${isPage ? "" : "pt-0"}`}>

        {!isPage && (

          <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-16">

            <p className="section-label">Tecnología certificada</p>

            <h2 className="section-title">Aparatología médica de gama alta</h2>

          </div>

        )}



        <div className="space-y-16 md:space-y-24">

          <Morpheus8Block />

          <LumeccaBlock />

          <AlmaPrimeXBlock />

        </div>



        <div

          className={`glass-luxury flex flex-col items-center justify-center gap-6 px-6 py-10 md:flex-row md:flex-wrap md:justify-center lg:flex-nowrap lg:gap-12 ${

            isPage ? "mt-16 md:mt-20" : "mt-12"

          }`}

        >

          {CERTIFICATIONS.map(({ icon: Icon, text, detail }) => (

            <div

              key={text}

              className="flex w-full max-w-xs items-center gap-3 text-luxury-dark md:w-auto md:max-w-[14rem] lg:max-w-none"

            >

              <Icon size={22} className="shrink-0 text-luxury-accent" />

              <div>

                <span className="block text-sm font-medium tracking-wide">{text}</span>

                {detail && (

                  <span className="mt-0.5 block font-sans text-xs tracking-wider text-luxury-accent">

                    {detail}

                  </span>

                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}


