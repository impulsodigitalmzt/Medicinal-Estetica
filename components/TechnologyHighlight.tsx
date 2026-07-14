import Link from "next/link";

import Card3D from "@/components/Card3D";



const EQUIPMENT = [

  {

    name: "Morpheus 8",

    description:

      "Radiofrecuencia fraccionada FDA para tensado cutáneo profundo y remodelación subdérmica.",

  },

  {

    name: "Lumecca (InMode)",

    description:

      "IPL de alta potencia para manchas, rosácea y lesiones pigmentarias con resultados en menos sesiones.",

  },

  {

    name: "Alma Prime X",

    description:

      "Ultrasonido y radiofrecuencia patentados para contorneo corporal y reducción de celulitis.",

  },

];



export default function TechnologyHighlight() {

  return (

    <section className="section-padding bg-luxury-bg">

      <div className="luxury-container">

        <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-16">

          <p className="section-label">Aparatología médica</p>

          <h2 className="section-title">

            Tecnología certificada de clase mundial

          </h2>

        </div>



        <div className="grid gap-5 md:grid-cols-3">

          {EQUIPMENT.map((item) => (

            <Card3D key={item.name}>

              <article className="card-serenity flex h-full flex-col bg-luxury-card p-6 sm:p-8">

                <h3 className="font-serif text-xl text-luxury-dark sm:text-2xl">

                  {item.name}

                </h3>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-luxury-text/85">

                  {item.description}

                </p>

              </article>

            </Card3D>

          ))}

        </div>



        <div className="mt-12 text-center">

          <Link href="/tecnologia" className="btn-pill-outline">

            Conocer toda la aparatología

          </Link>

        </div>

      </div>

    </section>

  );

}


