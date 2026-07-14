import TikTokIcon from "@/components/TikTokIcon";
import type { SocialLink } from "@/lib/social-links";

type SocialIconProps = {
  link: SocialLink;
  size?: number;
};

export default function SocialIcon({ link, size = 13 }: SocialIconProps) {
  if (link.type === "tiktok") {
    return <TikTokIcon size={size} />;
  }

  const Icon = link.icon;
  return <Icon size={size} strokeWidth={1.75} />;
}
