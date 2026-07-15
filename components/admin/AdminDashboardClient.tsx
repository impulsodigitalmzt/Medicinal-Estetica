"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Clock3, Sparkles } from "lucide-react";
import LeadsTable from "@/components/admin/LeadsTable";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import {
  getLeads,
  isDemoAdminLoggedIn,
  subscribeLeads,
  type Lead,
} from "@/lib/leads/demo";

export default function AdminDashboardClient() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (!isDemoAdminLoggedIn()) {
      router.replace("/admin/login?next=/admin/dashboard");
      return;
    }
    setAllowed(true);
    setLeads(getLeads());
    return subscribeLeads(() => setLeads(getLeads()));
  }, [router]);

  if (!allowed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-luxury-bg">
        <p className="text-sm text-luxury-text/50">Verificando acceso…</p>
      </main>
    );
  }

  const pendientes = leads.filter((l) => l.status === "nuevo").length;
  const atendidos = leads.filter((l) => l.status === "atendido").length;

  return (
    <main className="min-h-screen bg-luxury-bg">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(92,107,79,0.12), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Demo mode banner */}
        <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-amber-700/20 bg-gradient-to-r from-amber-50 to-white px-4 py-2.5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center rounded-md bg-amber-600/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
              Modo demostración
            </span>
            <p className="hidden text-xs text-amber-950/65 sm:block">
              Datos de ejemplo locales — así se verá el CRM en producción.
            </p>
          </div>
          <Sparkles size={14} className="shrink-0 text-amber-700/50" />
        </div>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-luxury-accent">
              Panel clínico
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Leads del asistente
            </h1>
            <p className="mt-2 max-w-xl text-sm text-gray-600">
              Gestiona contactos capturados por el chatbot: prioriza pendientes,
              abre WhatsApp y marca conversaciones atendidas.
            </p>
          </div>
          <AdminLogoutButton />
        </header>

        {/* KPI cards */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200/80 bg-white px-5 py-4 shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                Total
              </p>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white">
                <Users size={15} />
              </span>
            </div>
            <p className="mt-2 font-serif text-3xl font-semibold text-gray-900">
              {leads.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">Contactos en cola</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white px-5 py-4 shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-800">
                Pendientes
              </p>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white">
                <Clock3 size={15} />
              </span>
            </div>
            <p className="mt-2 font-serif text-3xl font-semibold text-gray-900">
              {pendientes}
            </p>
            <p className="mt-1 text-xs text-gray-500">Por contactar hoy</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800">
                Atendidos
              </p>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white">
                <Sparkles size={15} />
              </span>
            </div>
            <p className="mt-2 font-serif text-3xl font-semibold text-gray-900">
              {atendidos}
            </p>
            <p className="mt-1 text-xs text-gray-500">Cerrados en demo</p>
          </div>
        </div>

        <section className="mt-8">
          <LeadsTable />
        </section>
      </div>
    </main>
  );
}
