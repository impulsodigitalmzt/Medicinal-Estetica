import type { Metadata } from "next";
import LocationMap from "@/components/LocationMap";
import SubpageLayout from "@/components/SubpageLayout";
import { CLINIC } from "@/lib/data";

export const metadata: Metadata = {
  title: "Ubicación y Contacto",
  description: `Visítanos en ${CLINIC.address}, ${CLINIC.city}. Horarios, mapa y datos de contacto de ${CLINIC.name}.`,
};

export default function UbicacionPage() {
  return (
    <SubpageLayout showCta={false}>
      <LocationMap />
    </SubpageLayout>
  );
}
