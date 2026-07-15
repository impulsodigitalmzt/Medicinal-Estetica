"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarDays,
  Check,
  Download,
  Flag,
  MessageCircle,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { Lead, LeadPriority, PipelineStage } from "@/lib/leads/demo";
import {
  PIPELINE_STAGES,
  PRIORITY_RANK,
  WHATSAPP_TEMPLATES,
  buildWhatsAppUrl,
  clearLeads,
  deleteLead,
  getLeads,
  isReviewThisWeek,
  markAsAttended,
  resetDemoLeads,
  serviceLabel as demoServiceLabel,
  stageLabel,
  subscribeLeads,
  updateDoctorNotes,
  updateLeadPriority,
  updateLeadStage,
  updateNextReview,
} from "@/lib/leads/demo";
import ClinicalAnalytics from "@/components/admin/ClinicalAnalytics";

type StatusFilter = "todos" | "pendientes" | "atendidos" | "seguimiento";
type SortKey = "fecha" | "prioridad" | "paciente" | "servicio";
type SortDir = "asc" | "desc";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatDateShort(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatReviewDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "short",
    }).format(new Date(`${iso}T12:00:00`));
  } catch {
    return iso;
  }
}

function serviceLabel(service: string | null) {
  if (!service) return "Consulta general";
  return demoServiceLabel(service);
}

function priorityLabel(p: LeadPriority) {
  return p === "alta" ? "Alta" : p === "media" ? "Media" : "Baja";
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function dateSearchText(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    const d = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`);
    if (Number.isNaN(d.getTime())) return iso;
    const parts = [
      iso.slice(0, 10),
      formatDate(iso.includes("T") ? iso : `${iso}T12:00:00`),
      new Intl.DateTimeFormat("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(d),
      new Intl.DateTimeFormat("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d),
      new Intl.DateTimeFormat("es-MX", { month: "long" }).format(d),
      String(d.getDate()),
      String(d.getFullYear()),
    ];
    return parts.join(" ").toLowerCase();
  } catch {
    return String(iso).toLowerCase();
  }
}

function leadMatchesQuery(lead: Lead, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  const textHaystack = [
    lead.name,
    lead.email,
    lead.whatsapp,
    serviceLabel(lead.service),
    lead.service ?? "",
    lead.assistant_notes,
    lead.doctor_notes,
    priorityLabel(lead.priority),
    stageLabel(lead.stage),
  ]
    .join(" ")
    .toLowerCase();

  if (textHaystack.includes(q)) return true;

  // Teléfono: ignora espacios, guiones y lada
  const qDigits = digitsOnly(q);
  if (qDigits.length >= 3) {
    const phoneDigits = digitsOnly(lead.whatsapp);
    if (phoneDigits.includes(qDigits)) return true;
  }

  // Fecha de captura y próxima revisión (varios formatos)
  const dateHaystack = [
    dateSearchText(lead.created_at),
    dateSearchText(lead.next_review),
    dateSearchText(lead.attended_at),
  ].join(" ");

  if (dateHaystack.includes(q)) return true;

  // Fecha escrita como 14/07 o 14-07-2026
  const compactQuery = q.replace(/\s+/g, "");
  if (compactQuery.length >= 2 && /[\d/\-.]/.test(compactQuery)) {
    const dateCompact = dateHaystack.replace(/\s+/g, "");
    if (dateCompact.includes(compactQuery)) return true;
  }

  return false;
}

function exportLeadsCsv(leads: Lead[]) {
  const headers = [
    "Paciente",
    "Email",
    "WhatsApp",
    "Servicio",
    "Estado",
    "Prioridad",
    "Etapa",
    "Próxima revisión",
    "Fecha",
    "Notas asistente",
    "Notas doctor",
  ];

  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;

  const rows = leads.map((l) =>
    [
      l.name,
      l.email,
      l.whatsapp,
      serviceLabel(l.service),
      l.status === "nuevo" ? "Pendiente" : "Atendido",
      priorityLabel(l.priority),
      stageLabel(l.stage),
      l.next_review ?? "",
      formatDate(l.created_at),
      l.assistant_notes,
      l.doctor_notes,
    ]
      .map((cell) => escape(String(cell ?? "")))
      .join(","),
  );

  const csv = `\uFEFF${[headers.join(","), ...rows].join("\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-dr-osuna-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [ready, setReady] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("todos");
  const [sortKey, setSortKey] = useState<SortKey>("prioridad");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const refresh = useCallback(() => {
    setLeads(getLeads());
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);
    return subscribeLeads(refresh);
  }, [refresh]);

  const selected = useMemo(
    () => leads.find((l) => l.id === selectedId) ?? null,
    [leads, selectedId],
  );

  const visible = useMemo(() => {
    let list = [...leads];
    if (filter === "pendientes") list = list.filter((l) => l.status === "nuevo");
    if (filter === "atendidos")
      list = list.filter((l) => l.status === "atendido");
    if (filter === "seguimiento")
      list = list.filter((l) => isReviewThisWeek(l.next_review));

    const q = query.trim();
    if (q) {
      list = list.filter((l) => leadMatchesQuery(l, q));
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "fecha") {
        cmp =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortKey === "prioridad") {
        cmp = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      } else if (sortKey === "paciente") {
        cmp = a.name.localeCompare(b.name, "es");
      } else {
        cmp = serviceLabel(a.service).localeCompare(
          serviceLabel(b.service),
          "es",
        );
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [leads, filter, sortKey, sortDir, query]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "fecha" ? "desc" : "asc");
    }
  }

  function handleMarkAttended(id: string) {
    setBusyId(id);
    markAsAttended(id);
    refresh();
    setBusyId(null);
  }

  function handleDelete(id: string, e?: MouseEvent) {
    e?.stopPropagation();
    if (!window.confirm("¿Eliminar este lead de la lista?")) return;
    setBusyId(id);
    deleteLead(id);
    if (selectedId === id) setSelectedId(null);
    refresh();
    setBusyId(null);
  }

  function handleWhatsApp(lead: Lead, e: MouseEvent) {
    e.stopPropagation();
    const url = buildWhatsAppUrl(lead.whatsapp);
    window.open(url, "_blank", "noopener,noreferrer");

    if (lead.status === "nuevo") {
      const mark = window.confirm(
        "¿Deseas marcar este lead como contactado automáticamente?",
      );
      if (mark) {
        markAsAttended(lead.id);
        refresh();
      }
    }
  }

  function handleClearDemo() {
    if (
      !window.confirm(
        "¿Borrar todos los leads de prueba? Puedes restaurar los ejemplos después.",
      )
    ) {
      return;
    }
    clearLeads();
    setSelectedId(null);
    refresh();
  }

  function handleRestoreDemo() {
    resetDemoLeads();
    refresh();
  }

  if (!ready) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white px-6 py-14 text-center text-sm text-gray-500 shadow-md">
        Cargando panel…
      </div>
    );
  }

  const chips: { id: StatusFilter; label: string }[] = [
    { id: "todos", label: "Todos" },
    { id: "pendientes", label: "Solo Pendientes" },
    { id: "atendidos", label: "Solo Atendidos" },
    { id: "seguimiento", label: "Seguimiento semana" },
  ];

  return (
    <>
      <div className="mb-6">
        <ClinicalAnalytics
          leads={leads}
          followUpsActive={filter === "seguimiento"}
          onShowFollowUps={() =>
            setFilter((f) => (f === "seguimiento" ? "todos" : "seguimiento"))
          }
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-md">
        <div className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50/80 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Embudos de contacto
              </p>
              <p className="text-xs text-gray-500">
                Haz clic en una fila para ver el detalle del paciente
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => exportLeadsCsv(visible)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-luxury-dark/12 bg-white px-3 py-1.5 text-xs font-medium text-luxury-dark transition hover:border-luxury-accent/40"
              >
                <Download size={13} />
                Exportar a Excel
              </button>
              <button
                type="button"
                onClick={handleRestoreDemo}
                className="inline-flex items-center gap-1.5 rounded-lg border border-luxury-dark/12 bg-white px-3 py-1.5 text-xs font-medium text-luxury-text/75 transition hover:border-luxury-accent/40 hover:text-luxury-dark"
              >
                <RotateCcw size={13} />
                Restaurar ejemplos
              </button>
              <button
                type="button"
                onClick={handleClearDemo}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-800/15 bg-white px-3 py-1.5 text-xs font-medium text-red-800/70 transition hover:bg-red-50/80"
              >
                <Trash2 size={13} />
                Limpiar Demo
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-luxury-text/40"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre, teléfono o fecha…"
                className="w-full rounded-lg border border-luxury-dark/12 bg-white py-2 pl-9 pr-3 text-sm text-luxury-dark outline-none transition placeholder:text-luxury-text/40 focus:border-luxury-accent/45 focus:ring-2 focus:ring-luxury-accent/15"
                aria-label="Buscar leads"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setFilter(chip.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    filter === chip.id
                      ? "bg-luxury-dark text-luxury-bg shadow-sm"
                      : "border border-luxury-dark/10 bg-white text-luxury-text/65 hover:border-luxury-dark/25"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-serif text-xl text-luxury-dark">Sin resultados</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-luxury-text/60">
              Cambia el filtro o restaura los leads de ejemplo.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="md:hidden">
              {visible.map((lead, index) => (
                <article
                  key={lead.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedId(lead.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedId(lead.id);
                    }
                  }}
                  className={`space-y-3 px-5 py-4 text-left transition hover:bg-gray-100/80 ${
                    index % 2 === 1 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {lead.name}
                        </h3>
                        {lead.next_review && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                              isReviewThisWeek(lead.next_review)
                                ? "bg-sky-100 text-sky-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                            title={`Próxima revisión: ${lead.next_review}`}
                          >
                            <CalendarDays size={11} />
                            {formatReviewDate(lead.next_review)}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {serviceLabel(lead.service)} · Captura{" "}
                        {formatDateShort(lead.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <PriorityBadge priority={lead.priority} />
                      <StatusBadge status={lead.status} />
                    </div>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleWhatsApp(lead, e)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1ebe57]"
                    >
                      <MessageCircle size={14} />
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(lead.id, e)}
                      className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-2 text-red-700 transition hover:bg-red-50"
                      aria-label={`Eliminar ${lead.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="bg-black text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    <SortHeader
                      label="Paciente"
                      active={sortKey === "paciente"}
                      dir={sortDir}
                      onClick={() => toggleSort("paciente")}
                    />
                    <SortHeader
                      label="Servicio"
                      active={sortKey === "servicio"}
                      dir={sortDir}
                      onClick={() => toggleSort("servicio")}
                    />
                    <th className="px-4 py-3.5 font-semibold text-white">WhatsApp</th>
                    <SortHeader
                      label="Fecha captura"
                      active={sortKey === "fecha"}
                      dir={sortDir}
                      onClick={() => toggleSort("fecha")}
                    />
                    <SortHeader
                      label="Prioridad"
                      active={sortKey === "prioridad"}
                      dir={sortDir}
                      onClick={() => toggleSort("prioridad")}
                    />
                    <th className="px-4 py-3.5 font-semibold text-white">Estado</th>
                    <th className="px-6 py-3.5 text-right font-semibold text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((lead, index) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedId(lead.id)}
                      className={`cursor-pointer transition-colors hover:bg-amber-50/60 ${
                        index % 2 === 1 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {lead.name}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {lead.email}
                            </p>
                          </div>
                          {lead.next_review && (
                            <span
                              className={`mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-semibold ${
                                isReviewThisWeek(lead.next_review)
                                  ? "bg-sky-100 text-sky-800 ring-1 ring-sky-700/15"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                              title={`Próxima revisión: ${formatReviewDate(lead.next_review)}`}
                            >
                              <CalendarDays size={12} />
                              {formatReviewDate(lead.next_review)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        {serviceLabel(lead.service)}
                      </td>
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleWhatsApp(lead, e)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-2.5 py-1.5 text-white shadow-sm transition hover:bg-[#1ebe57]"
                          title="Contactar por WhatsApp"
                        >
                          <MessageCircle size={14} />
                          <span className="text-xs font-semibold">
                            {lead.whatsapp}
                          </span>
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <p className="text-sm font-medium text-gray-800">
                          {formatDateShort(lead.created_at)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-500">
                          {new Intl.DateTimeFormat("es-MX", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(lead.created_at))}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <PriorityBadge priority={lead.priority} />
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td
                        className="px-6 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {lead.status === "nuevo" ? (
                            <button
                              type="button"
                              onClick={() => handleMarkAttended(lead.id)}
                              disabled={busyId === lead.id}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-50"
                              title="Marcar como atendido"
                            >
                              <Check size={16} strokeWidth={2.25} />
                            </button>
                          ) : (
                            <span className="inline-flex h-9 w-9 items-center justify-center text-emerald-700/40">
                              <Check size={16} />
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => handleDelete(lead.id, e)}
                            disabled={busyId === lead.id}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                            title="Eliminar lead"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {selected && (
        <LeadDetailModal
          lead={selected}
          onClose={() => setSelectedId(null)}
          onSaveNotes={(notes) => {
            updateDoctorNotes(selected.id, notes);
            refresh();
          }}
          onPriority={(p) => {
            updateLeadPriority(selected.id, p);
            refresh();
          }}
          onStage={(stage) => {
            updateLeadStage(selected.id, stage);
            refresh();
          }}
          onNextReview={(date) => {
            updateNextReview(selected.id, date);
            refresh();
          }}
          onWhatsApp={(e) => handleWhatsApp(selected, e)}
          onAttend={() => {
            handleMarkAttended(selected.id);
          }}
          onDelete={(e) => handleDelete(selected.id, e)}
        />
      )}
    </>
  );
}

function SortHeader({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <th className="px-4 py-3.5 font-semibold first:px-6">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`inline-flex items-center gap-1 text-white transition hover:text-white/80 ${
          active ? "text-white" : "text-white/90"
        }`}
      >
        {label}
        {active ? (
          dir === "asc" ? (
            <ArrowUp size={12} />
          ) : (
            <ArrowDown size={12} />
          )
        ) : (
          <ArrowUpDown size={12} className="opacity-70" />
        )}
      </button>
    </th>
  );
}

function StatusBadge({ status }: { status: Lead["status"] }) {
  const isPending = status === "nuevo";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm ${
        isPending ? "bg-amber-600" : "bg-emerald-700"
      }`}
    >
      {isPending ? "Pendiente" : "Atendido"}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: LeadPriority }) {
  const styles =
    priority === "alta"
      ? "bg-orange-500 text-white"
      : priority === "media"
        ? "bg-amber-100 text-amber-900 ring-1 ring-amber-600/25"
        : "bg-slate-200 text-slate-700";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles}`}
    >
      <Flag size={10} />
      {priorityLabel(priority)}
    </span>
  );
}

function LeadDetailModal({
  lead,
  onClose,
  onSaveNotes,
  onPriority,
  onStage,
  onNextReview,
  onWhatsApp,
  onAttend,
  onDelete,
}: {
  lead: Lead;
  onClose: () => void;
  onSaveNotes: (notes: string) => void;
  onPriority: (p: LeadPriority) => void;
  onStage: (s: PipelineStage) => void;
  onNextReview: (date: string | null) => void;
  onWhatsApp: (e: MouseEvent) => void;
  onAttend: () => void;
  onDelete: (e: MouseEvent) => void;
}) {
  const [notes, setNotes] = useState(lead.doctor_notes);
  const [savedFlash, setSavedFlash] = useState(false);
  const [templateFlash, setTemplateFlash] = useState("");

  useEffect(() => {
    setNotes(lead.doctor_notes);
  }, [lead.id, lead.doctor_notes]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function saveNotes() {
    onSaveNotes(notes);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1600);
  }

  async function applyTemplate(templateId: string) {
    const template = WHATSAPP_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    const text = template.build(lead);
    try {
      await navigator.clipboard.writeText(text);
      setTemplateFlash("Plantilla copiada");
    } catch {
      setTemplateFlash("No se pudo copiar — pégalo manualmente en WhatsApp");
    }
    window.open(
      buildWhatsAppUrl(lead.whatsapp, text),
      "_blank",
      "noopener,noreferrer",
    );
    window.setTimeout(() => setTemplateFlash(""), 2200);
  }

  const pipelineOptions = PIPELINE_STAGES.filter(
    (s) => s.id !== "nuevo_contacto",
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-stretch justify-end bg-luxury-dark/35 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <aside
        className="flex h-full w-full max-w-md flex-col border-l border-luxury-dark/10 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Detalle de ${lead.name}`}
      >
        <div className="flex items-start justify-between border-b border-luxury-dark/8 px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-luxury-accent">
              Vista rápida · Ciclo de vida
            </p>
            <h2 className="mt-1 font-serif text-2xl text-luxury-dark">
              {lead.name}
            </h2>
            <p className="mt-1 text-sm text-luxury-text/55">{lead.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-luxury-text/50 transition hover:bg-luxury-bg hover:text-luxury-dark"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={lead.status} />
            <PriorityBadge priority={lead.priority} />
            <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-800 ring-1 ring-sky-700/15">
              {stageLabel(lead.stage)}
            </span>
          </div>

          <dl className="grid gap-3 rounded-xl border border-luxury-dark/8 bg-luxury-bg/40 p-4 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.12em] text-luxury-text/45">
                Servicio
              </dt>
              <dd className="mt-0.5 font-medium text-luxury-dark">
                {serviceLabel(lead.service)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.12em] text-luxury-text/45">
                WhatsApp
              </dt>
              <dd className="mt-0.5 text-luxury-dark">{lead.whatsapp}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.12em] text-luxury-text/45">
                Fecha de captura
              </dt>
              <dd className="mt-0.5 text-luxury-dark">
                {formatDate(lead.created_at)}
              </dd>
            </div>
          </dl>

          <div>
            <label
              htmlFor="pipeline-stage"
              className="text-[11px] font-medium uppercase tracking-[0.12em] text-luxury-text/45"
            >
              Etapa de seguimiento
            </label>
            <select
              id="pipeline-stage"
              value={lead.stage}
              onChange={(e) => onStage(e.target.value as PipelineStage)}
              className="mt-2 w-full rounded-xl border border-luxury-dark/12 bg-white px-3.5 py-2.5 text-sm text-luxury-dark outline-none focus:border-luxury-accent/50 focus:ring-2 focus:ring-luxury-accent/15"
            >
              <option value="nuevo_contacto">Nuevo contacto</option>
              {pipelineOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="next-review"
              className="text-[11px] font-medium uppercase tracking-[0.12em] text-luxury-text/45"
            >
              Próxima revisión
            </label>
            <input
              id="next-review"
              type="date"
              value={lead.next_review ?? ""}
              onChange={(e) => onNextReview(e.target.value || null)}
              className="mt-2 w-full rounded-xl border border-luxury-dark/12 bg-white px-3.5 py-2.5 text-sm text-luxury-dark outline-none focus:border-luxury-accent/50 focus:ring-2 focus:ring-luxury-accent/15"
            />
            {isReviewThisWeek(lead.next_review) && (
              <p className="mt-1.5 text-xs text-sky-800/80">
                Esta revisión cae en la ventana de seguimiento de esta semana.
              </p>
            )}
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-luxury-text/45">
              Prioridad
            </label>
            <div className="mt-2 flex gap-2">
              {(["alta", "media", "baja"] as LeadPriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPriority(p)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
                    lead.priority === p
                      ? "bg-luxury-dark text-luxury-bg"
                      : "border border-luxury-dark/12 text-luxury-text/65 hover:border-luxury-dark/30"
                  }`}
                >
                  {priorityLabel(p)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="wa-template"
              className="text-[11px] font-medium uppercase tracking-[0.12em] text-luxury-text/45"
            >
              Plantillas de WhatsApp
            </label>
            <select
              id="wa-template"
              defaultValue=""
              onChange={(e) => {
                const id = e.target.value;
                if (id) {
                  void applyTemplate(id);
                  e.target.value = "";
                }
              }}
              className="mt-2 w-full rounded-xl border border-emerald-700/20 bg-emerald-50/40 px-3.5 py-2.5 text-sm text-luxury-dark outline-none focus:border-emerald-700/40 focus:ring-2 focus:ring-emerald-600/15"
            >
              <option value="" disabled>
                Elegir plantilla…
              </option>
              {WHATSAPP_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            {templateFlash && (
              <p className="mt-1.5 text-xs text-emerald-700">{templateFlash}</p>
            )}
            <p className="mt-1.5 text-[11px] text-luxury-text/45">
              Copia el mensaje y abre WhatsApp listo para enviar.
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-luxury-text/45">
              Notas del asistente
            </h3>
            <p className="mt-2 rounded-xl border border-luxury-dark/8 bg-luxury-card/40 px-3.5 py-3 text-sm leading-relaxed text-luxury-text/80">
              {lead.assistant_notes ||
                "Sin notas del asistente para este contacto."}
            </p>
          </div>

          <div>
            <label
              htmlFor="doctor-notes"
              className="text-[11px] font-medium uppercase tracking-[0.12em] text-luxury-text/45"
            >
              Notas del doctor
            </label>
            <textarea
              id="doctor-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Escribe recordatorios tras hablar con el paciente…"
              className="mt-2 w-full resize-none rounded-xl border border-luxury-dark/12 bg-white px-3.5 py-3 text-sm text-luxury-dark outline-none transition placeholder:text-luxury-text/35 focus:border-luxury-accent/50 focus:ring-2 focus:ring-luxury-accent/15"
            />
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={saveNotes}
                className="rounded-lg bg-luxury-dark px-3.5 py-2 text-xs font-medium text-luxury-bg transition hover:bg-luxury-dark/90"
              >
                Guardar notas
              </button>
              {savedFlash && (
                <span className="text-xs text-emerald-700">Guardado</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-luxury-dark/8 px-5 py-4">
          <button
            type="button"
            onClick={onWhatsApp}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1ebe57]"
          >
            <MessageCircle size={16} />
            WhatsApp
          </button>
          {lead.status === "nuevo" && (
            <button
              type="button"
              onClick={onAttend}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-luxury-dark/12 px-3 py-2.5 text-sm font-medium text-luxury-dark"
            >
              <Check size={16} />
              Atendido
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center justify-center rounded-lg border border-red-800/15 px-3 py-2.5 text-red-800/75"
            aria-label="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </aside>
    </div>
  );
}
