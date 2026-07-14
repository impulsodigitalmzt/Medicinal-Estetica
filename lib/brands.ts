export type BrandItem = {

  id: string;

  label: string;

};



import { siteConfig } from "@/config/siteConfig";



/** Tira maestra con todos los logotipos en alta resolución */

export const BRAND_STRIP_IMAGE = siteConfig.assets.brandStrip || "";

export const BRAND_STRIP_WIDTH = 2709;

export const BRAND_STRIP_HEIGHT = 73;



export const DERMATOLOGY_BRANDS: BrandItem[] = [

  { id: "toskani", label: "TOSKANI" },

  { id: "hd-cosmetic", label: "HD COSMETIC EFFICIENCY" },

  { id: "avene", label: "AVÈNE" },

  { id: "filorga", label: "FILORGA PARIS" },

  { id: "elementre", label: "ELEMENTRE" },

  { id: "accuderm", label: "ACCUDERM" },

  { id: "isispharma", label: "ISISPHARMA" },

  { id: "noreva", label: "NOREVA" },

  { id: "cumlaude", label: "CUMLAUDE LAB" },

  { id: "neostrata", label: "NEOSTRATA" },

  { id: "uriage", label: "URIAGE" },

];



export const BRAND_STRIP_ALT = `Marcas dermatológicas premium: ${DERMATOLOGY_BRANDS.map((brand) => brand.label).join(", ")}`;


