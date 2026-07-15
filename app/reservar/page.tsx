"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, ChevronDown, MessageCircle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SubpageLayout from "@/components/SubpageLayout";
import BookingCalendar from "@/components/BookingCalendar";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import DemoWhatsAppModal from "@/components/DemoWhatsAppModal";
import {
  ALL_SERVICES,
  AVAILABLE_TIMES,
  CLINIC,
  formatPriceMXN,
  HIGH_END_SERVICE_IDS,
  SERVICE_CATEGORIES,
} from "@/lib/data";
import {
  formatDateLong,
  getBookedTimesForDate,
  POPULAR_BY_CATEGORY,
  QUICK_INTENTS,
} from "@/lib/booking-helpers";
import { publishBookingProgress } from "@/lib/booking/progress";
import { getChatEngine } from "@/lib/chatbot/ConversationEngine";

function ReservarContent() {
  const searchParams = useSearchParams();
  const scheduleRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const nombreRef = useRef<HTMLInputElement>(null);
  const telefonoRef = useRef<HTMLInputElement>(null);

  const [categoryId, setCategoryId] = useState("faciales");
  const [serviceId, setServiceId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showAllServices, setShowAllServices] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"clinic" | "online">("clinic");
  const [paymentEngaged, setPaymentEngaged] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paidOnline, setPaidOnline] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [demoWhatsApp, setDemoWhatsApp] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });

  function showDemoWhatsApp(message: string) {
    setDemoWhatsApp({ open: true, message });
  }

  useEffect(() => {
    const svc = searchParams.get("servicio");
    const cat = searchParams.get("categoria");
    const fecha = searchParams.get("fecha");
    const hora = searchParams.get("hora");
    if (cat) setCategoryId(cat);
    if (svc) setServiceId(svc);
    if (fecha) setSelectedDate(fecha);
    if (hora && fecha) {
      const booked = getBookedTimesForDate(fecha, AVAILABLE_TIMES);
      if (!booked.includes(hora)) setSelectedTime(hora);
    } else if (hora) {
      setSelectedTime(hora);
    }
  }, [searchParams]);

  const selectedService = useMemo(
    () => ALL_SERVICES.find((s) => s.id === serviceId),
    [serviceId]
  );

  const isHighEnd = serviceId ? HIGH_END_SERVICE_IDS.has(serviceId) : false;
  const activeCategory = SERVICE_CATEGORIES.find((c) => c.id === categoryId);

  const popularIds = POPULAR_BY_CATEGORY[categoryId] ?? [];
  const popularServices = useMemo(
    () =>
      (activeCategory?.services ?? []).filter((s) =>
        popularIds.includes(s.id)
      ),
    [activeCategory, popularIds]
  );

  const otherServices = useMemo(
    () =>
      (activeCategory?.services ?? []).filter(
        (s) => !popularIds.includes(s.id)
      ),
    [activeCategory, popularIds]
  );

  const readyForContact =
    isHighEnd
      ? !!serviceId && nombre.trim().length >= 2 && telefono.trim().length >= 8
      : !!serviceId &&
        !!selectedDate &&
        !!selectedTime &&
        nombre.trim().length >= 2 &&
        telefono.trim().length >= 8;

  const showContactStep =
    !!serviceId && (isHighEnd || (!!selectedDate && !!selectedTime));
  const nombreListo = nombre.trim().length >= 2;
  const showNombreHint = showContactStep && !nombreListo;

  // Al llegar a "Tus datos": foco en Nombre.
  useEffect(() => {
    if (!showContactStep || nombreListo) return;
    const timer = window.setTimeout(() => {
      nombreRef.current?.focus({ preventScroll: true });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [showContactStep, serviceId, selectedDate, selectedTime, isHighEnd, nombreListo]);

  const nombreListoPrev = useRef(false);
  // Al completar el nombre: oculta leyenda y muestra WhatsApp con foco.
  useEffect(() => {
    if (!showContactStep) {
      nombreListoPrev.current = false;
      return;
    }
    const justCompleted = nombreListo && !nombreListoPrev.current;
    nombreListoPrev.current = nombreListo;
    if (!justCompleted) return;
    const timer = window.setTimeout(() => {
      telefonoRef.current?.focus({ preventScroll: true });
    }, 200);
    return () => window.clearTimeout(timer);
  }, [showContactStep, nombreListo]);

  // Notifica al chatbot el progreso real del formulario (avance automático).
  useEffect(() => {
    let completed = 0;
    if (serviceId) completed = 1;
    if (!isHighEnd && selectedDate && selectedTime) completed = 2;
    if (readyForContact) completed = 3;
    if (paymentEngaged || checkoutOpen || paidOnline) {
      completed = Math.max(completed, 4);
    }
    if (confirmed) completed = 5;

    const progress = {
      completed,
      isHighEnd,
      serviceName: selectedService?.name.split("(")[0].trim(),
    };
    publishBookingProgress(progress);
    const engine = getChatEngine();
    engine.setPathname("/reservar");
    // Llamada directa: el bot debe reaccionar en cuanto eliges tratamiento/hora/datos.
    void engine.syncBookingProgress(progress);
  }, [
    serviceId,
    selectedDate,
    selectedTime,
    readyForContact,
    paymentEngaged,
    checkoutOpen,
    paidOnline,
    confirmed,
    isHighEnd,
    selectedService,
  ]);

  const bookedTimes = useMemo(
    () =>
      selectedDate
        ? getBookedTimesForDate(selectedDate, AVAILABLE_TIMES)
        : [],
    [selectedDate],
  );
  const bookedSet = useMemo(() => new Set(bookedTimes), [bookedTimes]);
  const freeSlotsCount = AVAILABLE_TIMES.length - bookedTimes.length;

  function scrollTo(el: React.RefObject<HTMLDivElement | null>) {
    setTimeout(() => {
      el.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function selectCategory(id: string) {
    setCategoryId(id);
    setServiceId("");
    setSelectedDate("");
    setSelectedTime("");
    setShowAllServices(false);
    setPaymentMethod("clinic");
    setPaymentEngaged(false);
    setConfirmed(false);
    setPaidOnline(false);
    setTransactionId("");
  }

  function selectService(id: string, catId?: string) {
    if (catId) setCategoryId(catId);
    setServiceId(id);
    setSelectedDate("");
    setSelectedTime("");
    setPaymentMethod("clinic");
    setPaymentEngaged(false);
    setConfirmed(false);
    setPaidOnline(false);
    setTransactionId("");

    const highEnd = HIGH_END_SERVICE_IDS.has(id);
    if (highEnd) scrollTo(contactRef);
    else scrollTo(scheduleRef);
  }

  function selectQuickIntent(intent: (typeof QUICK_INTENTS)[number]) {
    if ("whatsappOnly" in intent && intent.whatsappOnly) {
      showDemoWhatsApp(
        `Hola, me gustaría consultar disponibilidad para aparatología médica en ${CLINIC.copy.whatsappBookingClinicName}.`,
      );
      return;
    }
    selectService(intent.serviceId, intent.categoryId);
  }

  function selectDateTime(date: string, time: string) {
    if (getBookedTimesForDate(date, AVAILABLE_TIMES).includes(time)) return;
    setSelectedDate(date);
    setSelectedTime(time);
    scrollTo(contactRef);
  }

  function selectPayment(method: "clinic" | "online") {
    setPaymentMethod(method);
    setPaymentEngaged(true);

    if (method === "online") {
      const hasContact =
        nombre.trim().length >= 2 && telefono.trim().length >= 8;
      if (!hasContact) {
        scrollTo(contactRef);
        return;
      }
      setCheckoutOpen(true);
    }
  }

  /** Reserva con pago en clínica: requiere confirmación explícita. */
  function handleConfirmClinic() {
    if (!readyForContact || !selectedService || paymentMethod !== "clinic") {
      return;
    }
    setConfirmed(true);
    showDemoWhatsApp(buildReservationMessage());
  }

  function buildReservationMessage(paymentRef?: string) {
    if (!selectedService) {
      return "Hola, quiero agendar una cita.";
    }

    const paidNote =
      paymentRef || paidOnline
        ? `\nPago en línea confirmado. Ref: ${paymentRef ?? transactionId}`
        : "";

    if (isHighEnd) {
      return `Hola, soy ${nombre}. Solicito valoración para ${selectedService.name} (${formatPriceMXN(selectedService.price, { from: selectedService.priceFrom })} estimado) en ${CLINIC.copy.whatsappBookingClinicName}.\nTel: ${telefono}`;
    }

    return `Hola, soy ${nombre}. Deseo reservar ${selectedService.name} el ${formatDateLong(selectedDate)} a las ${selectedTime}.\nPrecio referencia: ${formatPriceMXN(selectedService.price, { from: selectedService.priceFrom })}\nPago: ${paymentMethod === "online" || paidOnline ? "en línea" : "en clínica"}${paidNote}\nTel: ${telefono}`;
  }

  return (
    <SubpageLayout showCta={false}>
      <PageHeader
        label="Reserva tu cita"
        title="Reserva tu tratamiento"
        description="Elige tratamiento, horario y tus datos. Al final decide si pagas en clínica o en línea."
      />

      <section className="section-padding bg-luxury-bg pb-28 sm:pb-24">
        <div className="luxury-container max-w-2xl">
          <div className="mb-8">
            <p className="section-label">Opción más rápida</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {QUICK_INTENTS.map((intent) => (
                <button
                  key={intent.id}
                  type="button"
                  onClick={() => selectQuickIntent(intent)}
                  className={`card-serenity px-3 py-4 text-center transition-all duration-300 ${
                    serviceId === intent.serviceId
                      ? "!border-luxury-dark bg-luxury-dark text-luxury-bg"
                      : "bg-luxury-bg text-luxury-dark hover:!border-luxury-accent/50"
                  }`}
                >
                  <span className="mb-1 block text-lg">{intent.emoji}</span>
                  <span className="text-sm font-medium">{intent.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card-serenity bg-luxury-bg p-6 md:p-8">
            <section className="mb-8">
              <p className="section-label">Área de tratamiento</p>
              <div className="flex flex-wrap gap-2">
                {SERVICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat.id)}
                    className={`rounded-pill px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                      categoryId === cat.id
                        ? "bg-luxury-dark text-luxury-bg"
                        : "bg-luxury-card text-luxury-text hover:bg-luxury-accent/20"
                    }`}
                  >
                    {cat.tabLabel}
                  </button>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <p className="section-label">Tratamiento</p>
              <div className="flex flex-wrap gap-2">
                {popularServices.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => selectService(service.id)}
                    className={`rounded-pill border px-3 py-2 text-left text-sm transition-all duration-300 ${
                      serviceId === service.id
                        ? "border-luxury-dark bg-luxury-dark text-luxury-bg"
                        : "border-luxury-accent/30 text-luxury-text hover:border-luxury-accent"
                    }`}
                  >
                    {service.name.split("(")[0].trim()}
                  </button>
                ))}
              </div>

              {otherServices.length > 0 && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setShowAllServices((v) => !v)}
                    className="flex items-center gap-1 text-xs text-luxury-accent hover:underline"
                  >
                    {showAllServices ? "Menos opciones" : "Ver todos los tratamientos"}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${showAllServices ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showAllServices && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {otherServices.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => selectService(service.id)}
                          className={`rounded-pill border px-3 py-2 text-left text-xs transition-all duration-300 ${
                            serviceId === service.id
                              ? "border-luxury-dark bg-luxury-dark text-luxury-bg"
                              : "border-luxury-accent/30 text-luxury-text hover:border-luxury-accent"
                          }`}
                        >
                          {service.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            {serviceId && selectedService && (
              <div className="mb-8 rounded-serenity border border-luxury-accent/20 bg-luxury-card px-4 py-4">
                <p className="text-sm font-medium text-luxury-dark">
                  {selectedService.name}
                </p>
                <p className="mt-1 font-serif text-xl text-luxury-accent">
                  {formatPriceMXN(selectedService.price, {
                    from: selectedService.priceFrom,
                  })}
                </p>
                <p className="mt-1 text-xs text-luxury-text/60">
                  Precio estimado de referencia
                </p>
              </div>
            )}

            {serviceId && !isHighEnd && (
              <section ref={scheduleRef} className="mb-8 scroll-mt-28 scroll-mb-28">
                <p className="section-label">¿Cuándo te conviene?</p>

                <BookingCalendar
                  selectedDate={selectedDate}
                  onSelectDate={(date) => {
                    setSelectedDate(date);
                    setSelectedTime("");
                  }}
                />

                {selectedDate ? (
                  <div className="mt-6">
                    <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                      <p className="text-sm font-medium text-luxury-dark">
                        Horarios para{" "}
                        <span className="font-serif capitalize text-luxury-accent">
                          {formatDateLong(selectedDate)}
                        </span>
                      </p>
                      <p className="text-xs text-luxury-text/55">
                        {freeSlotsCount} disponible
                        {freeSlotsCount === 1 ? "" : "s"} · {bookedTimes.length}{" "}
                        reservado{bookedTimes.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                      {AVAILABLE_TIMES.map((time) => {
                        const booked = bookedSet.has(time);
                        const selected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            disabled={booked}
                            onClick={() => selectDateTime(selectedDate, time)}
                            title={
                              booked
                                ? "Horario ya reservado"
                                : `Reservar a las ${time}`
                            }
                            className={`relative min-h-10 rounded-pill px-1.5 py-2 text-xs transition-all duration-300 sm:px-2 sm:py-2.5 sm:text-sm ${
                              booked
                                ? "cursor-not-allowed border border-transparent bg-luxury-dark/[0.04] text-luxury-text/30 line-through"
                                : selected
                                  ? "bg-luxury-dark text-luxury-bg"
                                  : "border border-luxury-accent/30 text-luxury-text hover:border-luxury-accent"
                            }`}
                          >
                            {time}
                            {booked ? (
                              <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-wide text-luxury-text/35 no-underline sm:text-[10px]">
                                Ocupado
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-luxury-text/50">
                      Los horarios marcados como ocupados ya tienen cita
                      confirmada.
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-luxury-text/60">
                    Selecciona un día en el calendario para ver horarios
                  </p>
                )}
              </section>
            )}

            {serviceId && isHighEnd && (
              <div className="mb-8 rounded-serenity bg-luxury-card px-4 py-3 text-sm text-luxury-text">
                Este tratamiento requiere valoración médica previa. Te contactaremos
                por WhatsApp para confirmar tu cita.
              </div>
            )}

            {showContactStep && (
              <section
                ref={contactRef}
                className="mb-8 scroll-mt-28 scroll-mb-28"
              >
                <p className="section-label">Tus datos</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="min-w-0">
                    <input
                      ref={nombreRef}
                      type="text"
                      placeholder="Tu nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      onBlur={() => {
                        if (
                          !isHighEnd &&
                          nombre.trim().length >= 2 &&
                          telefono.trim().length >= 8
                        ) {
                          scrollTo(paymentRef);
                        }
                      }}
                      className="luxury-input"
                      autoComplete="name"
                      aria-describedby={
                        showNombreHint ? "nombre-hint" : undefined
                      }
                    />
                    {showNombreHint && (
                      <p
                        id="nombre-hint"
                        className="mt-2 text-xs leading-relaxed text-luxury-accent"
                      >
                        Escribe tu nombre para continuar
                      </p>
                    )}
                  </div>
                  {nombreListo && (
                    <div className="min-w-0">
                      <input
                        ref={telefonoRef}
                        type="tel"
                        placeholder="WhatsApp / Teléfono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        onBlur={() => {
                          if (
                            !isHighEnd &&
                            nombre.trim().length >= 2 &&
                            telefono.trim().length >= 8
                          ) {
                            scrollTo(paymentRef);
                          }
                        }}
                        className="luxury-input"
                        autoComplete="tel"
                      />
                    </div>
                  )}
                </div>
              </section>
            )}

            {serviceId && !isHighEnd && selectedDate && selectedTime && (
              <div className="mb-8 rounded-serenity bg-luxury-card px-4 py-3 text-sm text-luxury-text">
                Si pagas en línea, la reserva se confirma al completar el pago. Si
                eliges clínica, confirma abajo para registrar tu cita.
              </div>
            )}

            {serviceId && !isHighEnd && selectedDate && selectedTime && (
              <section
                ref={paymentRef}
                className="mb-8 scroll-mt-28 scroll-mb-28"
              >
                <p className="section-label">Forma de pago</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => selectPayment("clinic")}
                    className={`rounded-serenity border px-4 py-3 text-left text-sm transition-all duration-300 ${
                      paymentMethod === "clinic"
                        ? "border-luxury-dark bg-luxury-dark text-luxury-bg"
                        : "border-luxury-accent/30 text-luxury-text hover:border-luxury-accent"
                    }`}
                  >
                    <span className="block font-medium">Pagar en clínica</span>
                    <span className="mt-1 block text-xs opacity-80">
                      Efectivo o tarjeta el día de tu cita
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectPayment("online")}
                    className={`rounded-serenity border px-4 py-3 text-left text-sm transition-all duration-300 ${
                      paymentMethod === "online"
                        ? "border-luxury-dark bg-luxury-dark text-luxury-bg"
                        : "border-luxury-accent/30 text-luxury-text hover:border-luxury-accent"
                    }`}
                  >
                    <span className="block font-medium">Pagar en línea</span>
                    <span className="mt-1 block text-xs opacity-80">
                      Al pagar, la reserva se confirma sola
                    </span>
                  </button>
                </div>

                {paymentMethod === "clinic" && (
                  <button
                    type="button"
                    disabled={!readyForContact || confirmed}
                    onClick={handleConfirmClinic}
                    className="mt-4 flex w-full flex-col items-center justify-center gap-0.5 rounded-xl bg-[#1a1a1a] px-4 py-3.5 text-white shadow-lg transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="text-sm font-semibold sm:text-base">
                      {confirmed ? "Reserva confirmada" : "Confirmar reserva"}
                    </span>
                    {selectedService && !confirmed && (
                      <span className="max-w-full truncate text-[11px] text-white/70">
                        {selectedService.name.split("(")[0].trim()}
                        {selectedTime ? ` · ${selectedTime}` : ""} · Pago en clínica
                      </span>
                    )}
                  </button>
                )}

                {paymentMethod === "online" && !paidOnline && (
                  <div className="mt-4 space-y-2">
                    <p className="rounded-serenity border border-luxury-accent/20 bg-luxury-card/60 px-3.5 py-2.5 text-xs leading-relaxed text-luxury-text/80">
                      Completa el pago en la pasarela. Al autorizarse el cargo, tu
                      cita queda confirmada automáticamente.
                    </p>
                    <button
                      type="button"
                      disabled={!readyForContact}
                      onClick={() => setCheckoutOpen(true)}
                      className="flex w-full items-center justify-center rounded-xl border border-luxury-dark/15 bg-white px-4 py-3 text-sm font-semibold text-luxury-dark shadow-sm transition hover:bg-luxury-card disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Abrir pasarela de pago
                    </button>
                  </div>
                )}
              </section>
            )}

            {confirmed && (
              <div className="mt-6 flex items-start gap-3 rounded-serenity bg-luxury-card px-4 py-3 text-sm text-luxury-dark">
                <Check size={18} className="mt-0.5 shrink-0 text-luxury-accent" />
                <div>
                  <p>
                    {paidOnline
                      ? "Pago autorizado y reserva confirmada."
                      : "Reserva confirmada. Pagarás en la clínica el día de tu cita."}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      showDemoWhatsApp(
                        buildReservationMessage(
                          paidOnline ? transactionId : undefined,
                        ),
                      )
                    }
                    className="mt-2 text-xs font-semibold text-luxury-accent underline"
                  >
                    Ver mensaje enviado
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="mt-8 text-center text-xs text-luxury-text/60">
            También puedes escribirnos al{" "}
            <a
              href={`tel:${CLINIC.phoneE164}`}
              className="text-luxury-accent hover:underline"
            >
              {CLINIC.phone}
            </a>
          </p>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-luxury-accent hover:underline">
              ← Volver al inicio
            </Link>
          </div>
        </div>

        {serviceId && isHighEnd && (
          <button
            type="button"
            disabled={!readyForContact}
            onClick={() => {
              if (!readyForContact || !selectedService) return;
              setConfirmed(true);
              showDemoWhatsApp(buildReservationMessage());
            }}
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-2xl flex-col items-center justify-center gap-0.5 rounded-xl bg-[#25D366] px-4 py-3.5 text-white shadow-2xl transition hover:bg-[#1ebe57] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold sm:text-base">
              <MessageCircle size={18} />
              <span className="sm:hidden">Valoración</span>
              <span className="hidden sm:inline">Solicitar valoración</span>
            </span>
            {selectedService && (
              <span className="max-w-full truncate text-[11px] font-normal text-white/70">
                {selectedService.name.split("(")[0].trim()}
              </span>
            )}
          </button>
        )}
      </section>

      {selectedService && !isHighEnd && (
        <CheckoutModal
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          orderInput={{
            serviceId: selectedService.id,
            serviceName: selectedService.name,
            categoryName: activeCategory?.title ?? "",
            price: selectedService.price,
            priceFrom: selectedService.priceFrom,
            customerName: nombre,
            customerPhone: telefono,
            appointmentDate: selectedDate,
            appointmentTime: selectedTime,
          }}
          onSuccess={(ref) => {
            setPaidOnline(true);
            setTransactionId(ref);
            setConfirmed(true);
            setCheckoutOpen(false);
            showDemoWhatsApp(buildReservationMessage(ref));
          }}
          onWhatsApp={(ref) => {
            setCheckoutOpen(false);
            showDemoWhatsApp(buildReservationMessage(ref));
          }}
        />
      )}

      <DemoWhatsAppModal
        open={demoWhatsApp.open}
        message={demoWhatsApp.message}
        onClose={() => setDemoWhatsApp((s) => ({ ...s, open: false }))}
      />
    </SubpageLayout>
  );
}

export default function ReservarPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-luxury-bg">
          <p className="text-luxury-text">Cargando...</p>
        </div>
      }
    >
      <ReservarContent />
    </Suspense>
  );
}
