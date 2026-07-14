import { CLINIC } from "@/lib/data";

export default function CofeprisNotice({ className = "" }: { className?: string }) {
  if (!CLINIC.cofeprisNotice && !CLINIC.professionalLicenseNotice) {
    return null;
  }

  return (
    <div
      className={`space-y-1 text-center text-xs leading-relaxed text-luxury-text/55 ${className}`}
    >
      {CLINIC.cofeprisNotice ? <p>{CLINIC.cofeprisNotice}</p> : null}
      {CLINIC.professionalLicenseNotice ? (
        <p>{CLINIC.professionalLicenseNotice}</p>
      ) : null}
    </div>
  );
}
