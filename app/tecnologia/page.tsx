import type { Metadata } from "next";

import Technology from "@/components/Technology";

import SubpageLayout from "@/components/SubpageLayout";

import { CLINIC } from "@/lib/data";



export const metadata: Metadata = {

  title: "Tecnología Médica Certificada",

  description: `Morpheus 8, Lumecca y Alma Prime X. Aparatología médica original certificada con el ${CLINIC.doctorDisplayName} en ${CLINIC.city}.`,

};



export default function TecnologiaPage() {

  return (

    <SubpageLayout>

      <Technology variant="page" />

    </SubpageLayout>

  );

}


