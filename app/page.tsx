import Script from "next/script";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import BrandSlider from "@/components/BrandSlider";
import Intro from "@/components/Intro";
import AboutStats from "@/components/AboutStats";
import Process from "@/components/Process";
import TechnologyHighlight from "@/components/TechnologyHighlight";
import Reviews from "@/components/Reviews";
import Marquee from "@/components/Marquee";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import InternalLinks from "@/components/InternalLinks";
import Footer from "@/components/Footer";
import { CLINIC } from "@/lib/data";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: CLINIC.fullName,
    image: CLINIC.assets.logo,
    address: {
      "@type": "PostalAddress",
      streetAddress: CLINIC.address,
      addressLocality: CLINIC.city,
      addressRegion: CLINIC.state,
      postalCode: CLINIC.postalCode,
      addressCountry: CLINIC.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CLINIC.geo.latitude,
      longitude: CLINIC.geo.longitude,
    },
    telephone: CLINIC.phoneE164,
    priceRange: "$$$",
    sameAs: [CLINIC.facebook, CLINIC.instagram, CLINIC.tiktok].filter(Boolean),
    knowsAbout: [
      "Botox",
      "Fillers",
      "Endolift",
      "Morpheus 8",
      "Lumecca",
      "Alma Prime X",
      "Medicina estética",
      "Antienvejecimiento",
    ],
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <TrustBar />

        <section
          aria-label="Introducción"
          className="bg-luxury-bg pb-20 md:pb-28 lg:pb-32"
        >
          <Intro />
          <div className="mt-10 w-full md:mt-14 lg:mt-16">
            <BrandSlider variant="floating" />
          </div>
        </section>

        <AboutStats />
        <Process />
        <TechnologyHighlight />
        <Reviews />
        <Marquee />
        <FAQ />
        <FinalCTA />
        <InternalLinks />
      </main>
      <Footer />
    </>
  );
}
