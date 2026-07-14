"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getCalendarMonth,
  getMonthLabel,
  getQuickDates,
  parseDateString,
  startOfDay,
  WEEKDAYS,
  type CalendarCell,
} from "@/lib/booking-helpers";

type BookingCalendarProps = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export default function BookingCalendar({
  selectedDate,
  onSelectDate,
}: BookingCalendarProps) {
  const today = startOfDay(new Date());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const quickDates = useMemo(() => getQuickDates(), []);
  const cells = useMemo(
    () => getCalendarMonth(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + 3);
    return d;
  }, [today]);

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const canGoNext =
    viewYear < maxDate.getFullYear() ||
    (viewYear === maxDate.getFullYear() && viewMonth < maxDate.getMonth());

  function goMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function handleQuickSelect(date: string) {
    const parsed = parseDateString(date);
    setViewYear(parsed.getFullYear());
    setViewMonth(parsed.getMonth());
    onSelectDate(date);
  }

  return (
    <div className="rounded-serenity border border-luxury-accent/15 bg-luxury-card/50 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap gap-2">
        {quickDates.map((day) => (
          <button
            key={day.date}
            type="button"
            onClick={() => handleQuickSelect(day.date)}
            className={`rounded-pill px-4 py-2 text-sm font-medium transition-all duration-300 ${
              selectedDate === day.date
                ? "bg-luxury-dark text-luxury-bg"
                : "bg-luxury-bg text-luxury-text hover:bg-luxury-accent/20"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goMonth(-1)}
          disabled={!canGoPrev}
          aria-label="Mes anterior"
          className="flex h-9 w-9 items-center justify-center rounded-pill border border-luxury-accent/25 text-luxury-dark transition-all hover:border-luxury-accent disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>

        <p className="font-serif text-lg capitalize text-luxury-dark sm:text-xl">
          {getMonthLabel(viewYear, viewMonth)}
        </p>

        <button
          type="button"
          onClick={() => goMonth(1)}
          disabled={!canGoNext}
          aria-label="Mes siguiente"
          className="flex h-9 w-9 items-center justify-center rounded-pill border border-luxury-accent/25 text-luxury-dark transition-all hover:border-luxury-accent disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-luxury-accent"
          >
            {day}
          </div>
        ))}

        {cells.map((cell) => (
          <DayButton
            key={`${cell.date}-${cell.inMonth}`}
            cell={cell}
            selected={selectedDate === cell.date}
            onSelect={onSelectDate}
          />
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-luxury-text/55">
        Domingos cerrado · Puedes agendar hasta 3 meses adelante
      </p>
    </div>
  );
}

function DayButton({
  cell,
  selected,
  onSelect,
}: {
  cell: CalendarCell;
  selected: boolean;
  onSelect: (date: string) => void;
}) {
  const { inMonth, isSelectable, isToday, day, date } = cell;

  if (!inMonth) {
    return <div className="aspect-square" aria-hidden />;
  }

  return (
    <button
      type="button"
      disabled={!isSelectable}
      onClick={() => onSelect(date)}
      className={`relative flex aspect-square items-center justify-center rounded-serenity text-sm font-medium transition-all duration-200 ${
        selected
          ? "bg-luxury-dark text-luxury-bg shadow-serenity"
          : isSelectable
            ? "text-luxury-dark hover:bg-luxury-bg"
            : "cursor-not-allowed text-luxury-text/25"
      } ${isToday && !selected ? "ring-1 ring-luxury-accent/50" : ""}`}
    >
      {day}
      {isToday && !selected && (
        <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-luxury-accent" />
      )}
    </button>
  );
}
