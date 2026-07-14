import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Services from "@/components/Services";
import SubpageLayout from "@/components/SubpageLayout";
import { CLINIC } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nuestros Tratamientos",
  description: `Faciales médicos, medicina estética y tratamientos corporales de alta gama en ${CLINIC.name}, ${CLINIC.city}.`,
};

export default function ServiciosPage() {
  return (
    <SubpageLayout>
      <PageHeader
        label="Catálogo clínico"
        title="Nuestros Tratamientos"
        description="Protocolos médicos diseñados para realzar tu belleza con resultados naturales. Reserva y paga tus tratamientos en línea; el catálogo de productos en Tienda es únicamente informativo."
      />
      <Services />
    </SubpageLayout>
  );
}
