import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteButton } from "@/components/DeleteButton";

type Event = {
  id: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string;
  category: string;
  worldId: string | null;
  worldName: string | null;
};

async function getEvent(id: string): Promise<Event | null> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/events/${id}`;
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    return null;
  }
  return res.json() as Promise<Event>;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back to events
        </Link>

        <article className="rounded-xl border border-slate-200/80 bg-white/85 p-6 shadow-sm">
          <header className="mb-4">
            <span className="mb-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {event.category}
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {event.title}
            </h1>
          </header>

          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-medium text-slate-700">Start</dt>
              <dd className="text-slate-600">{formatDate(event.startAt)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">End</dt>
              <dd className="text-slate-600">{formatDate(event.endAt)}</dd>
            </div>
            {event.worldName && (
              <div>
                <dt className="font-medium text-slate-700">World</dt>
                <dd className="text-slate-600">{event.worldName}</dd>
              </div>
            )}
            {event.worldId && (
              <div>
                <dt className="font-medium text-slate-700">World ID</dt>
                <dd className="font-mono text-xs text-slate-500">
                  {event.worldId}
                </dd>
              </div>
            )}
            {event.description && (
              <div>
                <dt className="font-medium text-slate-700">Description</dt>
                <dd className="text-slate-600">{event.description}</dd>
              </div>
            )}
          </dl>

          <div className="mt-6 flex gap-3">
            <Link
              href={`/events/${event.id}/edit`}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit
            </Link>
            <DeleteButton eventId={event.id} />
          </div>
        </article>
      </div>
    </main>
  );
}
