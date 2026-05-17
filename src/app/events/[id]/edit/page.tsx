"use client";

import { EventCategory } from "@prisma/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

import { getCreatorToken } from "@/hooks/useCreatorToken";

type Event = {
  id: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string;
  category: EventCategory;
  worldId: string | null;
  worldName: string | null;
};

type FormErrors = {
  endAt?: string;
  form?: string;
};

const CATEGORIES = Object.values(EventCategory);

function toDatetimeLocal(iso: string): string {
  return iso.slice(0, 16);
}

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = getCreatorToken(id);
    setHasToken(!!token);

    fetch(`/api/events/${id}`)
      .then((r) => (r.ok ? (r.json() as Promise<Event>) : null))
      .then((data) => setEvent(data))
      .catch(() => setEvent(null));
  }, [id]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = getCreatorToken(id);
    if (!token) return;

    const form = e.currentTarget;
    const data = new FormData(form);

    const startAt = data.get("startAt") as string;
    const endAt = data.get("endAt") as string;

    if (startAt && endAt && new Date(startAt) >= new Date(endAt)) {
      setErrors({ endAt: "End date must be after start date" });
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Creator-Token": token,
        },
        body: JSON.stringify({
          title: data.get("title") as string,
          description: (data.get("description") as string) || null,
          startAt,
          endAt,
          category: data.get("category") as string,
          worldId: (data.get("worldId") as string) || null,
          worldName: (data.get("worldName") as string) || null,
        }),
      });

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        setErrors({ form: body.error ?? "Failed to update event" });
        return;
      }

      router.push(`/events/${id}`);
    } catch {
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (hasToken === null || event === null) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="animate-pulse text-slate-400">Loading…</div>
      </main>
    );
  }

  if (!hasToken) {
    return (
      <main className="min-h-screen px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-lg">
          <Link
            href={`/events/${id}`}
            className="mb-6 inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
          >
            ← Back to event
          </Link>
          <p className="text-slate-600">
            This is not your event — you do not have the creator token required
            to edit it.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-lg">
        <Link
          href={`/events/${id}`}
          className="mb-6 inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back to event
        </Link>

        <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900">
          Edit Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={event.title}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-slate-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={event.category}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="startAt"
                className="block text-sm font-medium text-slate-700"
              >
                Start
              </label>
              <input
                id="startAt"
                name="startAt"
                type="datetime-local"
                defaultValue={toDatetimeLocal(event.startAt)}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="endAt"
                className="block text-sm font-medium text-slate-700"
              >
                End
              </label>
              <input
                id="endAt"
                name="endAt"
                type="datetime-local"
                defaultValue={toDatetimeLocal(event.endAt)}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              {errors.endAt && (
                <p className="mt-1 text-xs text-red-600">{errors.endAt}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={event.description ?? ""}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="worldName"
                className="block text-sm font-medium text-slate-700"
              >
                World Name
              </label>
              <input
                id="worldName"
                name="worldName"
                type="text"
                defaultValue={event.worldName ?? ""}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="worldId"
                className="block text-sm font-medium text-slate-700"
              >
                World ID
              </label>
              <input
                id="worldId"
                name="worldId"
                type="text"
                defaultValue={event.worldId ?? ""}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {errors.form && (
            <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}
