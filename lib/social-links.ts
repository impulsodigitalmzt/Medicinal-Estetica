import { Facebook, Instagram, type LucideIcon } from "lucide-react";
import { CLINIC } from "@/lib/data";

export type SocialLink =
  | { href: string; label: string; type: "lucide"; icon: LucideIcon; handle?: string }
  | { href: string; label: string; type: "tiktok"; handle?: string };

export const SOCIAL_LINKS: SocialLink[] = [
  CLINIC.facebook
    ? {
        href: CLINIC.facebook,
        label: "Facebook",
        type: "lucide" as const,
        icon: Facebook,
        handle: CLINIC.socialHandles.facebook,
      }
    : null,
  CLINIC.instagram
    ? {
        href: CLINIC.instagram,
        label: "Instagram",
        type: "lucide" as const,
        icon: Instagram,
        handle: CLINIC.socialHandles.instagram,
      }
    : null,
  CLINIC.tiktok
    ? {
        href: CLINIC.tiktok,
        label: "TikTok",
        type: "tiktok" as const,
        handle: CLINIC.socialHandles.tiktok,
      }
    : null,
].filter(Boolean) as SocialLink[];
