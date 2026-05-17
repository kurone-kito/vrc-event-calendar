"use client";

import Link from "next/link";
import { useState } from "react";

type CalendarEvent = {
  id: string;
  title: string;
  startAt: string;
};

type CalendarViewProps = {
  events: CalendarEvent[];
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function CalendarView({ events }: CalendarViewProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  function prevMonth() {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  }

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const d = new Date(event.startAt);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = String(d.getDate());
      const list = eventsByDate.get(key) ?? [];
      list.push(event);
      eventsByDate.set(key, list);
    }
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded-md px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
        >
          ←
        </button>
        <span className="text-sm font-semibold text-slate-800">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="rounded-md px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7">
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className="py-1 text-center text-xs font-medium text-slate-500"
          >
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          const dayEvents = day ? (eventsByDate.get(String(day)) ?? []) : [];
          return (
            <div
              key={i}
              className="min-h-[4rem] border-t border-slate-100 p-1 text-xs"
            >
              {day && (
                <>
                  <span className="text-slate-400">{day}</span>
                  <div className="mt-1 flex flex-col gap-0.5">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <Link
                        key={ev.id}
                        href={`/events/${ev.id}`}
                        className="truncate rounded bg-blue-100 px-1 text-xs text-blue-800 hover:bg-blue-200"
                        title={ev.title}
                      >
                        {ev.title}
                      </Link>
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-xs text-slate-400">
                        +{dayEvents.length - 3} more
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
