import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

import SocialIcon from "@/components/SocialIcon";

import { CLINIC } from "@/lib/data";

import { SOCIAL_LINKS } from "@/lib/social-links";



function Separator() {

  return (

    <span className="hidden text-luxury-accent/35 sm:inline" aria-hidden>

      |

    </span>

  );

}



export default function TopBar() {

  return (

    <div className="border-b border-luxury-accent/15 bg-luxury-bg">

      <div className="luxury-container flex h-9 items-center justify-end gap-3 text-xs text-luxury-text sm:gap-4 sm:text-sm">

        <a

          href={`tel:${CLINIC.phoneE164}`}

          className="hidden items-center gap-1.5 transition-colors hover:text-luxury-dark sm:inline-flex"

        >

          <Phone size={13} strokeWidth={1.75} className="text-luxury-dark" />

          <span>{CLINIC.phone}</span>

        </a>



        <Separator />



        <div className="flex items-center gap-1.5">

          {SOCIAL_LINKS.map((link) => (

            <a

              key={link.label}

              href={link.href}

              target="_blank"

              rel="noopener noreferrer"

              aria-label={link.label}

              className="flex h-7 w-7 items-center justify-center rounded-full bg-luxury-dark text-luxury-bg transition-all duration-300 hover:bg-luxury-accent"

            >

              <SocialIcon link={link} size={13} />

            </a>

          ))}

        </div>



        <Separator />



        <Link
          href="/ubicacion"
          className="hidden items-center gap-1.5 transition-colors hover:text-luxury-dark md:inline-flex"
        >
          <MapPin size={13} strokeWidth={1.75} className="text-luxury-dark" />
          <span>Ubicación</span>
        </Link>

      </div>

    </div>

  );

}

