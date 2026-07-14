import { Suspense } from "react";
import type { Metadata } from "next";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Acceso administrativo",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-luxury-bg px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(92,107,79,0.12), transparent 70%)",
        }}
      />
      <div className="relative w-full max-w-md rounded-serenity-lg border border-white/60 bg-white/70 p-8 shadow-serenity-lg backdrop-blur-xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-luxury-accent">
          Panel interno · Demo
        </p>
        <h1 className="mt-2 font-serif text-3xl text-luxury-dark">
          Dr. Andrés Osuna
        </h1>
        <p className="mt-2 text-sm text-luxury-text/65">
          Acceso restringido al dashboard de leads (sin servidor).
        </p>
        <div className="mt-8">
          <Suspense
            fallback={<p className="text-sm text-luxury-text/50">Cargando…</p>}
          >
            <AdminLoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
