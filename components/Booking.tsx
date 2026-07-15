"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, MessageCircle } from "lucide-react";
import { AVAILABLE_TIMES, CLINIC } from "@/lib/data";
import { getBookedTimesForDate } from "@/lib/booking-helpers";

export default function Booking() {
  const [tab, setTab] = useState<"calendar" | "whatsapp">("calendar");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const bookedSet = useMemo(
    () => new Set(getBookedTimesForDate(selectedDate, AVAILABLE_TIMES)),
    [selectedDate],
  );

  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const monthName = today.toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });

  const handleDateSelect = (day: number) => {
    const date = new Date(today.getFullYear(), today.getMonth(), day);
    setSelectedDate(date.toISOString().split("T")[0]);
    setSelectedTime("");
  };

  return (
    <section id="reservar" className="bg-luxury-card py-20 md:py-28">
      <div className="luxury-container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-luxury-accent">
            Agenda tu cita
          </p>
          <h2 className="font-serif text-3xl text-luxury-dark sm:text-4xl">
            Reserva con confianza
          </h2>
          <p className="mt-4 text-luxury-text">
            Elige la opción que mejor se adapte a tu tratamiento
          </p>
        </div>

        <div className="mx-auto max-w-3xl rounded-lg border border-luxury-accent/20 bg-luxury-bg p-6 md:p-10">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setTab("calendar")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-sm px-3 py-3 text-xs font-medium transition-all duration-300 sm:px-4 sm:text-sm ${
                tab === "calendar"
                  ? "bg-luxury-dark text-luxury-bg"
                  : "bg-luxury-card text-luxury-text hover:bg-luxury-accent/20"
              }`}
            >
              <Calendar size={18} />
              Valoraciones y faciales
            </button>
            <button
              type="button"
              onClick={() => setTab("whatsapp")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-sm px-3 py-3 text-xs font-medium transition-all duration-300 sm:px-4 sm:text-sm ${
                tab === "whatsapp"
                  ? "bg-luxury-dark text-luxury-bg"
                  : "bg-luxury-card text-luxury-text hover:bg-luxury-accent/20"
              }`}
            >
              <MessageCircle size={18} />
              Aparatología médica
            </button>
          </div>

          {tab === "calendar" ? (
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="flex-1">
                <p className="mb-4 font-serif text-lg capitalize text-luxury-dark">
                  {monthName}
                </p>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((d) => (
                    <div key={d} className="py-2 font-medium text-luxury-accent">
                      {d}
                    </div>
                  ))}
                  {calendarDays.map((day, i) => {
                    if (day === null) return <div key={`empty-${i}`} />;
                    const isPast = day < today.getDate();
                    const isSelected =
                      selectedDate ===
                      new Date(today.getFullYear(), today.getMonth(), day)
                        .toISOString()
                        .split("T")[0];
                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={isPast}
                        onClick={() => handleDateSelect(day)}
                        className={`aspect-square min-h-10 rounded-sm text-sm transition-all duration-300 ${
                          isPast
                            ? "cursor-not-allowed text-luxury-text/30"
                            : isSelected
                              ? "bg-luxury-dark text-luxury-bg"
                              : "hover:bg-luxury-card text-luxury-text"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1">
                <p className="mb-4 font-serif text-lg text-luxury-dark">
                  Horarios disponibles
                </p>
                {!selectedDate ? (
                  <p className="text-sm text-luxury-text/70">
                    Selecciona una fecha para ver horarios
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABLE_TIMES.map((time) => {
                      const booked = bookedSet.has(time);
                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={booked}
                          onClick={() => setSelectedTime(time)}
                          className={`min-h-10 rounded-sm px-3 py-2 text-sm transition-all duration-300 ${
                            booked
                              ? "cursor-not-allowed bg-luxury-dark/5 text-luxury-text/30 line-through"
                              : selectedTime === time
                                ? "bg-luxury-dark text-luxury-bg"
                                : "border border-luxury-accent/30 text-luxury-text hover:border-luxury-accent"
                          }`}
                        >
                          {time}
                          {booked ? (
                            <span className="mt-0.5 block text-[9px] uppercase tracking-wide no-underline">
                              Ocupado
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                )}

                {selectedDate && selectedTime && (
                  <Link
                    href={`/reservar?fecha=${selectedDate}&hora=${selectedTime}`}
                    className="mt-6 block rounded-sm bg-luxury-dark px-6 py-3 text-center text-sm font-medium text-luxury-bg transition-all duration-300 hover:bg-luxury-accent"
                  >
                    Continuar reservación
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-6 text-luxury-text">
                Tratamientos avanzados como Endolift o protocolos combinados
                requieren validación personalizada con el equipo clínico.
              </p>
              <Link
                href="/reservar"
                className="btn-luxury-gold inline-flex w-full max-w-md items-center justify-center gap-2 px-4 py-4 text-sm sm:w-auto sm:px-8"
              >
                <Calendar size={20} className="shrink-0" />
                Agendar cita en línea
              </Link>
              <p className="mt-4 text-sm text-luxury-text/70">
                También puedes llamarnos al {CLINIC.phone}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
