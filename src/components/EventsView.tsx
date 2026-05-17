"use client";

import { Suspense, useEffect, useState } from "react";

import { CalendarView } from "@/components/CalendarView";
import { EventCard } from "@/components/EventCard";
import { FilterPanel } from "@/components/FilterPanel";

type Event = {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  category: string;
  worldName: string | null;
  description: string | null;
};

type View = "list" | "calendar";

export function EventsView({ events }: { events: Event[] }) {
  const [view, setView] = useState<View>("list");

  useEffect(() => {
    const saved = localStorage.getItem("eventsView") as View | null;
    if (saved === "list" || saved === "calendar") {
      setView(saved);
    }
  }, []);

  function toggleView(v: View) {
    setView(v);
    localStorage.setItem("eventsView", v);
  }

  return (
    <>
      <Suspense>
        <FilterPanel />
      </Suspense>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => toggleView("list")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            view === "list"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          List
        </button>
        <button
          onClick={() => toggleView("calendar")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            view === "calendar"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Calendar
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-slate-500">No events found.</p>
      ) : view === "calendar" ? (
        <CalendarView events={events} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </>
  );
}
