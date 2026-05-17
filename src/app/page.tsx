import { EventCard } from "@/components/EventCard";

type EventsResponse = {
  events: {
    id: string;
    title: string;
    startAt: string;
    endAt: string;
    category: string;
    worldName: string | null;
    description: string | null;
  }[];
  total: number;
};

async function getEvents(): Promise<EventsResponse> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/events`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return { events: [], total: 0 };
  }
  return res.json() as Promise<EventsResponse>;
}

export default async function Home() {
  const { events, total } = await getEvents();

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
          VRChat Events
        </h1>
        <p className="mb-8 text-sm text-slate-500">{total} upcoming events</p>
        {events.length === 0 ? (
          <p className="text-slate-500">
            No events found. Run{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-xs">
              npm run db:seed
            </code>{" "}
            to add sample events.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
