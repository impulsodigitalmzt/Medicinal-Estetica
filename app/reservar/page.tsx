"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, ChevronDown, MessageCircle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SubpageLayout from "@/components/SubpageLayout";
import BookingCalendar from "@/components/BookingCalendar";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import {
  ALL_SERVICES,
  AVAILABLE_TIMES,
  CLINIC,
  formatPriceMXN,
  HIGH_END_SERVICE_IDS,
  SERVICE_CATEGORIES,
  whatsappUrl,
} from "@/lib/data";
import {
  formatDateLong,
  POPULAR_BY_CATEGORY,
  QUICK_INTENTS,
} from "@/lib/booking-helpers";

function ReservarContent() {
  const searchParams = useSearchParams();
  const scheduleRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const [categoryId, setCategoryId] = useState("faciales");
  const [serviceId, setServiceId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showAllServices, setShowAllServices] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"clinic" | "online">("clinic");
  const [confirmed, setConfirmed] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paidOnline, setPaidOnline] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    const svc = searchParams.get("servicio");
    const cat = searchParams.get("categoria");
    const fecha = searchParams.get("fecha");
    const hora = searchParams.get("hora");
    if (cat) setCategoryId(cat);
    if (svc) setServiceId(svc);
    if (fecha) setSelectedDate(fecha);
    if (hora) setSelectedTime(hora);
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
    setConfirmed(false);
    setPaidOnline(false);
    setTransactionId("");

    const highEnd = HIGH_END_SERVICE_IDS.has(id);
    if (highEnd) scrollTo(contactRef);
    else scrollTo(scheduleRef);
  }

  function selectQuickIntent(intent: (typeof QUICK_INTENTS)[number]) {
    if ("whatsappOnly" in intent && intent.whatsappOnly) {
      window.open(
        whatsappUrl(
          `Hola, me gustaría consultar disponibilidad para aparatología médica en ${CLINIC.copy.whatsappBookingClinicName}.`
        ),
        "_blank"
      );
      return;
    }
    selectService(intent.serviceId, intent.categoryId);
  }

  function selectDateTime(date: string, time: string) {
    setSelectedDate(date);
    setSelectedTime(time);
    scrollTo(paymentRef);
  }

  function selectPayment(method: "clinic" | "online") {
    setPaymentMethod(method);

    if (method === "online") {
      // Elige pago en línea → abre el checkout (no saltar a nombre).
      setCheckoutOpen(true);
      return;
    }

    scrollTo(contactRef);
  }

  function handleConfirm() {
    if (!readyForContact || !selectedService) return;

    if (!isHighEnd && paymentMethod === "online") {
      setCheckoutOpen(true);
      return;
    }

    setConfirmed(true);
    window.open(buildWhatsAppUrl(), "_blank");
  }

  function buildWhatsAppUrl(paymentRef?: string) {
    if (!selectedService) return whatsappUrl("Hola, quiero agendar una cita.");

    const paidNote =
      paymentRef || paidOnline
        ? `\nPago en línea confirmado (demo). Ref: ${paymentRef ?? transactionId}`
        : "";

    const msg = isHighEnd
      ? `Hola, soy ${nombre}. Solicito valoración para ${selectedService.name} (${formatPriceMXN(selectedService.price, { from: selectedService.priceFrom })} estimado) en ${CLINIC.copy.whatsappBookingClinicName}.\nTel: ${telefono}`
      : `Hola, soy ${nombre}. Deseo reservar ${selectedService.name} el ${formatDateLong(selectedDate)} a las ${selectedTime}.\nPrecio referencia: ${formatPriceMXN(selectedService.price, { from: selectedService.priceFrom })}\nPago: ${paymentMethod === "online" || paidOnline ? "en línea" : "en clínica"}${paidNote}\nTel: ${telefono}`;

    return whatsappUrl(msg);
  }

  return (
    <SubpageLayout showCta={false}>
      <PageHeader
        label="Reserva tu cita"
        title="Reserva tu tratamiento"
        description="Elige tratamiento, horario y forma de pago. Puedes reservar sin pagar ahora y abonar en clínica, o indicar pago en línea al confirmar."
      />

      <section className="section-padding bg-luxury-bg pb-44 sm:pb-40">
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
                    <p className="mb-3 text-sm font-medium text-luxury-dark">
                      Horarios para{" "}
                      <span className="font-serif capitalize text-luxury-accent">
                        {formatDateLong(selectedDate)}
                      </span>
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                      {AVAILABLE_TIMES.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => selectDateTime(selectedDate, time)}
                          className={`min-h-10 rounded-pill px-1.5 py-2 text-xs transition-all duration-300 sm:px-2 sm:py-2.5 sm:text-sm ${
                            selectedTime === time
                              ? "bg-luxury-dark text-luxury-bg"
                              : "border border-luxury-accent/30 text-luxury-text hover:border-luxury-accent"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
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

            {serviceId && !isHighEnd && (
              <div className="mb-8 rounded-serenity bg-luxury-card px-4 py-3 text-sm text-luxury-text">
                El pago es opcional al reservar. Puedes pagar en la clínica el día
                de tu cita o elegir pago en línea al confirmar.
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
                      Reserva ahora y paga el día de tu cita
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
                      Abre el checkout seguro con tarjeta simulada
                    </span>
                  </button>
                </div>
                {paymentMethod === "online" && (
                  <p className="mt-3 rounded-serenity border border-luxury-accent/20 bg-luxury-card/60 px-3.5 py-2.5 text-xs leading-relaxed text-luxury-text/80">
                    Se abre el checkout seguro. Si lo cierras, puedes volver a
                    abrirlo con el botón{" "}
                    <span className="font-semibold text-luxury-dark">
                      Ir al checkout
                    </span>{" "}
                    abajo.
                  </p>
                )}
              </section>
            )}

            {serviceId && (isHighEnd || (selectedDate && selectedTime)) && (
              <section ref={contactRef} className="scroll-mt-28 scroll-mb-28">
                <p className="section-label">Tus datos</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="luxury-input"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp / Teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="luxury-input"
                  />
                </div>
              </section>
            )}

            {confirmed && (
              <div className="mt-6 flex items-center gap-3 rounded-serenity bg-luxury-card px-4 py-3 text-sm text-luxury-dark">
                <Check size={18} className="shrink-0 text-luxury-accent" />
                {paidOnline
                  ? "Pago simulado y reserva registradas."
                  : "Solicitud enviada."}{" "}
                Si WhatsApp no se abrió,{" "}
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                >
                  toca aquí
                </a>
                .
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

        {serviceId && (
          <button
            type="button"
            disabled={!readyForContact}
            onClick={handleConfirm}
            className={`fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-2xl flex-col items-center justify-center gap-0.5 rounded-xl px-4 py-3.5 text-white shadow-2xl transition disabled:cursor-not-allowed disabled:opacity-40 ${
              isHighEnd
                ? "bg-[#25D366] hover:bg-[#1ebe57]"
                : "bg-[#1a1a1a] hover:bg-black"
            }`}
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold sm:text-base">
              {isHighEnd ? <MessageCircle size={18} /> : null}
              <span className="sm:hidden">
                {isHighEnd
                  ? "Valoración"
                  : paymentMethod === "online"
                    ? "Checkout"
                    : "Confirmar"}
              </span>
              <span className="hidden sm:inline">
                {isHighEnd
                  ? "Solicitar valoración"
                  : paymentMethod === "online"
                    ? "Ir al checkout"
                    : "Confirmar reserva"}
              </span>
            </span>
            {selectedService && (
              <span className="max-w-full truncate text-[11px] font-normal text-white/70">
                {selectedService.name.split("(")[0].trim()}
                {!isHighEnd && selectedDate && selectedTime
                  ? ` · ${selectedTime}`
                  : ""}
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
          }}
          onWhatsApp={(ref) => {
            window.open(buildWhatsAppUrl(ref), "_blank");
            setCheckoutOpen(false);
          }}
        />
      )}
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
