import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import ChatWidget from "@/components/chatbot/ChatWidget";
import { CartProvider } from "@/context/CartContext";
import { siteConfig } from "@/config/siteConfig";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.seo.titleDefault,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.description,
  keywords: [...siteConfig.seo.keywords],
  openGraph: {
    title: siteConfig.seo.titleDefault,
    description: siteConfig.seo.openGraphDescription,
    locale: "es_MX",
    type: "website",
  },
  icons: {
    icon: [{ url: siteConfig.assets.logo, type: "image/png" }],
    shortcut: siteConfig.assets.logo,
    apple: siteConfig.assets.logo,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} ${cormorant.variable}`}>
      <body>
        <CartProvider>
          {children}
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
