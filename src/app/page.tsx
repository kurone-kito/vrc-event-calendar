import { EventsView } from "@/components/EventsView";

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

type SearchParams = {
  category?: string;
  date_from?: string;
  date_to?: string;
};

async function getEvents(filters: SearchParams): Promise<EventsResponse> {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.date_from) params.set("date_from", filters.date_from);
  if (filters.date_to) params.set("date_to", filters.date_to);

  const query = params.toString();
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = `${base}/api/events${query ? `?${query}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return { events: [], total: 0 };
  }
  return res.json() as Promise<EventsResponse>;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = await searchParams;
  const { events, total } = await getEvents(filters);

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
          VRChat Events
        </h1>
        <p className="mb-4 text-sm text-slate-500">{total} events</p>
        <EventsView events={events} />
      </div>
    </main>
  );
}
