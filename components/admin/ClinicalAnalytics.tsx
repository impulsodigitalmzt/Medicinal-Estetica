"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Percent,
  CalendarClock,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Lead } from "@/lib/leads/demo";
import {
  getConversionRate,
  getFollowUpsThisWeek,
  getServiceDemand,
} from "@/lib/leads/demo";

type Props = {
  leads: Lead[];
  onShowFollowUps: () => void;
  followUpsActive?: boolean;
};

export default function ClinicalAnalytics({
  leads,
  onShowFollowUps,
  followUpsActive = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const conversion = useMemo(() => getConversionRate(leads), [leads]);
  const demand = useMemo(() => getServiceDemand(leads), [leads]);
  const followUps = useMemo(() => getFollowUpsThisWeek(leads), [leads]);
  const maxDemand = Math.max(1, ...demand.map((d) => d.count));

  const barColors = [
    "bg-luxury-accent",
    "bg-luxury-dark/70",
    "bg-amber-600/80",
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-luxury-dark/10 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 px-5 py-3.5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-luxury-dark">
            Analítica clínica
          </p>
          <p className="truncate text-xs text-luxury-text/50">
            Conversión, demanda y seguimientos de la semana
            {!open && followUps.length > 0
              ? ` · ${followUps.length} pendiente${followUps.length === 1 ? "" : "s"} esta semana`
              : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-luxury-dark/12 bg-luxury-bg/50 px-3 py-1.5 text-xs font-medium text-luxury-dark transition hover:border-luxury-dark/25 hover:bg-luxury-bg"
          aria-expanded={open}
        >
          {open ? "Ocultar métricas" : "Mostrar métricas"}
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="metrics-panel"
            initial={
              reduceMotion ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
            }
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-luxury-dark/8"
          >
            <div className="grid gap-3 p-4 sm:p-5 lg:grid-cols-3">
              <div className="rounded-xl border border-luxury-dark/8 bg-luxury-bg/30 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-luxury-text/45">
                    Tasa de conversión
                  </p>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-luxury-dark/55 shadow-sm">
                    <Percent size={15} />
                  </span>
                </div>
                <p className="mt-3 font-serif text-3xl text-luxury-dark">
                  {conversion}%
                </p>
                <p className="mt-1 text-xs text-luxury-text/50">
                  Leads atendidos vs. total capturado
                </p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-luxury-card">
                  <div
                    className="h-full rounded-full bg-luxury-accent transition-all"
                    style={{ width: `${conversion}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-luxury-dark/8 bg-luxury-bg/30 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-luxury-text/45">
                    Top servicios
                  </p>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-luxury-dark/55 shadow-sm">
                    <BarChart3 size={15} />
                  </span>
                </div>
                <ul className="mt-4 space-y-3">
                  {demand.map((item, i) => (
                    <li key={item.id}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-medium text-luxury-dark">
                          {item.label}
                        </span>
                        <span className="text-luxury-text/50">{item.count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-luxury-card">
                        <div
                          className={`h-full rounded-full ${barColors[i % barColors.length]}`}
                          style={{
                            width: `${Math.round((item.count / maxDemand) * 100)}%`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={onShowFollowUps}
                className={`rounded-xl border p-4 text-left transition ${
                  followUpsActive
                    ? "border-sky-700/30 bg-gradient-to-br from-sky-50 to-white ring-1 ring-sky-600/15"
                    : "border-luxury-dark/8 bg-luxury-bg/30 hover:border-sky-700/25 hover:bg-sky-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-sky-900/55">
                    Seguimiento esta semana
                  </p>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-800">
                    <CalendarClock size={15} />
                  </span>
                </div>
                <p className="mt-3 font-serif text-3xl text-sky-950">
                  {followUps.length}
                </p>
                <p className="mt-1 text-xs text-sky-900/50">
                  {followUpsActive
                    ? "Filtro activo — clic para ver todos"
                    : "Pacientes con próxima revisión en 7 días"}
                </p>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
