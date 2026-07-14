export type LeadStatus = "nuevo" | "atendido";
export type LeadPriority = "alta" | "media" | "baja";

export type PipelineStage =
  | "nuevo_contacto"
  | "cita_agendada"
  | "en_tratamiento"
  | "post_procedimiento"
  | "recurrente";

export type Lead = {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  service: string | null;
  status: LeadStatus;
  priority: LeadPriority;
  stage: PipelineStage;
  next_review: string | null;
  assistant_notes: string;
  doctor_notes: string;
  created_at: string;
  attended_at: string | null;
};

export type LeadInput = {
  id?: string;
  name: string;
  whatsapp: string;
  email: string;
  service?: string | null;
  status?: LeadStatus;
  priority?: LeadPriority;
  stage?: PipelineStage;
  next_review?: string | null;
  assistant_notes?: string;
  doctor_notes?: string;
  created_at?: string;
  attended_at?: string | null;
};

export const LEADS_STORAGE_KEY = "leads_demo";
export const DEMO_ADMIN_PASSWORD = "123";
export const DEMO_ADMIN_SESSION_KEY = "admin_demo_session";

export const PRIORITY_RANK: Record<LeadPriority, number> = {
  alta: 0,
  media: 1,
  baja: 2,
};

export const PIPELINE_STAGES: {
  id: PipelineStage;
  label: string;
}[] = [
  { id: "nuevo_contacto", label: "Nuevo contacto" },
  { id: "cita_agendada", label: "Cita Agendada" },
  { id: "en_tratamiento", label: "En Tratamiento" },
  { id: "post_procedimiento", label: "Seguimiento Post-Procedimiento" },
  { id: "recurrente", label: "Paciente Recurrente" },
];

export const WHATSAPP_TEMPLATES: {
  id: string;
  label: string;
  build: (lead: Lead) => string;
}[] = [
  {
    id: "confirmar_cita",
    label: "Confirmar Cita",
    build: (lead) =>
      `Hola ${lead.name.split(" ")[0]}, te saluda el equipo del Dr. Andrés Osuna. Te escribimos para confirmar tu cita de ${serviceLabel(lead.service)}. ¿Me confirmas tu asistencia? Quedamos atentos.`,
  },
  {
    id: "pre_procedimiento",
    label: "Instrucciones Pre-Procedimiento",
    build: (lead) =>
      `Hola ${lead.name.split(" ")[0]}, antes de tu procedimiento de ${serviceLabel(lead.service)} te compartimos instrucciones: evita exposición solar intensa, suspende antiinflamatorios si tu médico lo indicó y llega con la piel limpia. Cualquier duda, escribe por este chat.`,
  },
  {
    id: "post_tratamiento",
    label: "Encuesta Post-Tratamiento",
    build: (lead) =>
      `Hola ${lead.name.split(" ")[0]}, esperamos que te sientas muy bien tras tu ${serviceLabel(lead.service)}. ¿Cómo ha evolucionado tu recuperación del 1 al 10? Tu opinión nos ayuda a cuidar mejor tu seguimiento. ¡Gracias!`,
  },
];

const CHANGE_EVENT = "leads_demo_change";
const STAGE_IDS = new Set<PipelineStage>(
  PIPELINE_STAGES.map((s) => s.id),
);

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function notifyLeadsChanged() {
  if (!canUseStorage()) return;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function writeLeads(leads: Lead[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  notifyLeadsChanged();
}

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function daysFromNow(days: number) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function serviceLabel(service: string | null | undefined) {
  if (!service) return "consulta";
  const map: Record<string, string> = {
    botox: "Botox",
    fillers: "Rellenos",
    endolift: "Endolift",
  };
  return map[service] ?? service;
}

export function stageLabel(stage: PipelineStage) {
  return PIPELINE_STAGES.find((s) => s.id === stage)?.label ?? stage;
}

function normalizeLead(raw: Partial<Lead> & LeadInput): Lead {
  const priority =
    raw.priority === "alta" || raw.priority === "media" || raw.priority === "baja"
      ? raw.priority
      : "media";

  const stage =
    raw.stage && STAGE_IDS.has(raw.stage) ? raw.stage : "nuevo_contacto";

  return {
    id:
      raw.id ??
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    name: (raw.name ?? "").trim(),
    whatsapp: (raw.whatsapp ?? "").trim(),
    email: (raw.email ?? "").trim().toLowerCase(),
    service: raw.service?.trim() || null,
    status: raw.status === "atendido" ? "atendido" : "nuevo",
    priority,
    stage,
    next_review: raw.next_review || null,
    assistant_notes: raw.assistant_notes?.trim() || "",
    doctor_notes: raw.doctor_notes ?? "",
    created_at: raw.created_at ?? new Date().toISOString(),
    attended_at: raw.attended_at ?? null,
  };
}

export function getSeedLeads(): Lead[] {
  return [
    normalizeLead({
      id: "demo-ana-garcia",
      name: "Ana García",
      whatsapp: "669 155 7846",
      email: "ana.garcia@email.com",
      service: "botox",
      status: "nuevo",
      priority: "alta",
      stage: "cita_agendada",
      next_review: daysFromNow(1),
      assistant_notes:
        "Preguntó por disponibilidad el fin de semana y paquetes de Botox frontales.",
      doctor_notes: "",
      created_at: hoursAgo(3),
    }),
    normalizeLead({
      id: "demo-sofia-mendez",
      name: "Sofía Méndez",
      whatsapp: "669 301 2244",
      email: "sofia.mendez@email.com",
      service: "botox",
      status: "nuevo",
      priority: "alta",
      stage: "nuevo_contacto",
      next_review: daysFromNow(0),
      assistant_notes:
        "Urgente: evento social en 10 días. Quiere valoración hoy o mañana.",
      doctor_notes: "",
      created_at: hoursAgo(1),
    }),
    normalizeLead({
      id: "demo-carlos-ruiz",
      name: "Carlos Ruiz",
      whatsapp: "669 280 1190",
      email: "carlos.ruiz@email.com",
      service: "endolift",
      status: "nuevo",
      priority: "media",
      stage: "en_tratamiento",
      next_review: daysFromNow(4),
      assistant_notes:
        "En protocolo Endolift papada. Segunda sesión pendiente de calendario.",
      doctor_notes: "Revisar fotos basales antes de la cita.",
      created_at: hoursAgo(18),
    }),
    normalizeLead({
      id: "demo-miguel-torres",
      name: "Miguel Torres",
      whatsapp: "669 445 9088",
      email: "miguel.torres@correo.com",
      service: "endolift",
      status: "atendido",
      priority: "alta",
      stage: "cita_agendada",
      next_review: daysFromNow(2),
      assistant_notes:
        "Confirmó cita de Endolift. Preguntó por recuperación laboral.",
      doctor_notes: "Pasar consentimiento informado firmado.",
      created_at: hoursAgo(30),
      attended_at: hoursAgo(22),
    }),
    normalizeLead({
      id: "demo-elena-gomez",
      name: "Elena Gómez",
      whatsapp: "669 412 5533",
      email: "elena.gomez@email.com",
      service: "fillers",
      status: "atendido",
      priority: "baja",
      stage: "post_procedimiento",
      next_review: daysFromNow(6),
      assistant_notes:
        "Rellenos de labios realizados. Solicita seguimiento de asimetría leve.",
      doctor_notes: "Control fotográfico en la próxima revisión.",
      created_at: hoursAgo(50),
      attended_at: hoursAgo(40),
    }),
    normalizeLead({
      id: "demo-laura-ibarra",
      name: "Laura Ibarra",
      whatsapp: "669 177 6610",
      email: "laura.ibarra@email.com",
      service: "fillers",
      status: "nuevo",
      priority: "media",
      stage: "cita_agendada",
      next_review: daysFromNow(3),
      assistant_notes:
        "Quiere harmonización de mentón. Agenda tentativa el miércoles.",
      doctor_notes: "",
      created_at: hoursAgo(12),
    }),
    normalizeLead({
      id: "demo-roberto-salas",
      name: "Roberto Salas",
      whatsapp: "669 522 0199",
      email: "roberto.salas@email.com",
      service: "botox",
      status: "atendido",
      priority: "baja",
      stage: "recurrente",
      next_review: daysFromNow(20),
      assistant_notes:
        "Paciente recurrente cada 4–5 meses. Pide mismo protocolo de frente.",
      doctor_notes: "Historial estable. Reaplicar 25–30 U según mapa previo.",
      created_at: hoursAgo(96),
      attended_at: hoursAgo(90),
    }),
    normalizeLead({
      id: "demo-patricia-vega",
      name: "Patricia Vega",
      whatsapp: "669 833 4412",
      email: "patricia.vega@email.com",
      service: "endolift",
      status: "nuevo",
      priority: "alta",
      stage: "post_procedimiento",
      next_review: daysFromNow(1),
      assistant_notes:
        "Día 5 post Endolift. Reporta leve inflamación; pide orientación.",
      doctor_notes: "",
      created_at: hoursAgo(6),
    }),
    normalizeLead({
      id: "demo-diego-navarro",
      name: "Diego Navarro",
      whatsapp: "669 290 7781",
      email: "diego.navarro@email.com",
      service: "fillers",
      status: "nuevo",
      priority: "media",
      stage: "en_tratamiento",
      next_review: null,
      assistant_notes:
        "Inicio de plan en 2 etapas (pómulos + labios). Sin fecha de control aún.",
      doctor_notes: "",
      created_at: hoursAgo(40),
    }),
    normalizeLead({
      id: "demo-marina-cruz",
      name: "Marina Cruz",
      whatsapp: "669 614 3320",
      email: "marina.cruz@email.com",
      service: "botox",
      status: "atendido",
      priority: "media",
      stage: "recurrente",
      next_review: daysFromNow(5),
      assistant_notes:
        "Mantenimiento anual. Prefiere citas matutinas entre semana.",
      doctor_notes: "Recordar foto de comparación lateral.",
      created_at: hoursAgo(72),
      attended_at: hoursAgo(60),
    }),
  ];
}

function parseLeads(raw: string): Lead[] {
  try {
    const parsed = JSON.parse(raw) as Partial<Lead>[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) =>
        normalizeLead({
          name: item.name ?? "",
          whatsapp: item.whatsapp ?? "",
          email: item.email ?? "",
          ...item,
        }),
      )
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  } catch {
    return [];
  }
}

function readStoredLeads(): Lead[] {
  if (!canUseStorage()) return [];
  const raw = localStorage.getItem(LEADS_STORAGE_KEY);
  if (raw === null) return [];
  return parseLeads(raw);
}

export function getLeads(): Lead[] {
  if (!canUseStorage()) return [];
  const raw = localStorage.getItem(LEADS_STORAGE_KEY);
  if (raw === null) {
    const seed = getSeedLeads();
    writeLeads(seed);
    return seed;
  }
  return parseLeads(raw);
}

export function addLead(lead: Lead | LeadInput): void {
  if (!canUseStorage()) return;
  const normalized = normalizeLead({
    ...lead,
    assistant_notes:
      lead.assistant_notes ??
      "Capturado por el asistente virtual. Solicita seguimiento para valoración.",
    priority: lead.priority ?? "media",
    stage: lead.stage ?? "nuevo_contacto",
  });
  writeLeads([normalized, ...readStoredLeads()]);
}

export function markAsAttended(id: string): void {
  const next = readStoredLeads().map((lead) =>
    lead.id === id
      ? {
          ...lead,
          status: "atendido" as const,
          attended_at: new Date().toISOString(),
        }
      : lead,
  );
  writeLeads(next);
}

export function updateDoctorNotes(id: string, notes: string): void {
  const next = readStoredLeads().map((lead) =>
    lead.id === id ? { ...lead, doctor_notes: notes } : lead,
  );
  writeLeads(next);
}

export function updateLeadPriority(id: string, priority: LeadPriority): void {
  const next = readStoredLeads().map((lead) =>
    lead.id === id ? { ...lead, priority } : lead,
  );
  writeLeads(next);
}

export function updateLeadStage(id: string, stage: PipelineStage): void {
  const next = readStoredLeads().map((lead) =>
    lead.id === id ? { ...lead, stage } : lead,
  );
  writeLeads(next);
}

export function updateNextReview(id: string, nextReview: string | null): void {
  const next = readStoredLeads().map((lead) =>
    lead.id === id ? { ...lead, next_review: nextReview || null } : lead,
  );
  writeLeads(next);
}

export function deleteLead(id: string): void {
  writeLeads(readStoredLeads().filter((lead) => lead.id !== id));
}

export function clearLeads(): void {
  if (!canUseStorage()) return;
  writeLeads([]);
}

export function resetDemoLeads(): void {
  writeLeads(getSeedLeads());
}

export function buildWhatsAppUrl(whatsapp: string, text?: string): string {
  let digits = whatsapp.replace(/\D/g, "");
  if (digits.startsWith("521") && digits.length >= 13) {
    // ok
  } else if (digits.startsWith("52") && digits.length >= 12) {
    if (!digits.startsWith("521")) digits = `521${digits.slice(2)}`;
  } else if (digits.length === 10) {
    digits = `521${digits}`;
  }
  const base = `https://wa.me/${digits}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

/** Inclusive week window: today → +7 days (date-only). */
export function isReviewThisWeek(nextReview: string | null): boolean {
  if (!nextReview) return false;
  const review = new Date(`${nextReview}T12:00:00`);
  if (Number.isNaN(review.getTime())) return false;

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  end.setHours(23, 59, 59, 999);

  return review >= start && review <= end;
}

export function getFollowUpsThisWeek(leads: Lead[] = getLeads()): Lead[] {
  return leads
    .filter((l) => isReviewThisWeek(l.next_review))
    .sort((a, b) =>
      String(a.next_review).localeCompare(String(b.next_review)),
    );
}

export function getConversionRate(leads: Lead[]): number {
  if (leads.length === 0) return 0;
  const attended = leads.filter((l) => l.status === "atendido").length;
  return Math.round((attended / leads.length) * 100);
}

export function getServiceDemand(leads: Lead[]): {
  id: string;
  label: string;
  count: number;
}[] {
  const counts: Record<string, number> = {
    botox: 0,
    fillers: 0,
    endolift: 0,
  };
  for (const lead of leads) {
    const key = lead.service ?? "otro";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return [
    { id: "botox", label: "Botox", count: counts.botox ?? 0 },
    { id: "endolift", label: "Endolift", count: counts.endolift ?? 0 },
    { id: "fillers", label: "Rellenos", count: counts.fillers ?? 0 },
  ];
}

export function subscribeLeads(listener: () => void) {
  if (!canUseStorage()) return () => {};

  const onStorage = (e: StorageEvent) => {
    if (e.key === LEADS_STORAGE_KEY || e.key === null) listener();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, listener);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
}

export function isDemoAdminLoggedIn(): boolean {
  if (!canUseStorage()) return false;
  return localStorage.getItem(DEMO_ADMIN_SESSION_KEY) === "1";
}

export function setDemoAdminLoggedIn(value: boolean) {
  if (!canUseStorage()) return;
  if (value) localStorage.setItem(DEMO_ADMIN_SESSION_KEY, "1");
  else localStorage.removeItem(DEMO_ADMIN_SESSION_KEY);
}
