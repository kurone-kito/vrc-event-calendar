import { EventCategory } from "@prisma/client";

type Event = {
  id: string;
  title: string;
  startAt: string | Date;
  endAt: string | Date;
  category: EventCategory;
  worldName: string | null;
  description: string | null;
};

const categoryColors: Record<EventCategory, string> = {
  PARTY: "bg-pink-100 text-pink-800",
  MUSIC: "bg-purple-100 text-purple-800",
  ART: "bg-indigo-100 text-indigo-800",
  GAME: "bg-green-100 text-green-800",
  SOCIAL: "bg-blue-100 text-blue-800",
  OTHER: "bg-slate-100 text-slate-800",
};

function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventCard({ event }: { event: Event }) {
  const badgeClass = categoryColors[event.category] ?? categoryColors.OTHER;

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white/85 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold leading-snug text-slate-900">
          {event.title}
        </h2>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
        >
          {event.category}
        </span>
      </div>
      <p className="text-sm text-slate-600">{formatDate(event.startAt)}</p>
      {event.worldName && (
        <p className="text-sm text-slate-500">{event.worldName}</p>
      )}
    </article>
  );
}
