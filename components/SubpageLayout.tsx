import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandSlider from "@/components/BrandSlider";
import Marquee from "@/components/Marquee";
import FinalCTA from "@/components/FinalCTA";

type SubpageLayoutProps = {
  children: React.ReactNode;
  showCta?: boolean;
  showMarquee?: boolean;
  showBrandSlider?: boolean;
};

export default function SubpageLayout({
  children,
  showCta = true,
  showMarquee = true,
  showBrandSlider = true,
}: SubpageLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="bg-luxury-bg">{children}</main>
      {showBrandSlider && <BrandSlider />}
      {showMarquee && <Marquee />}
      {showCta && <FinalCTA />}
      <Footer />
    </>
  );
}
