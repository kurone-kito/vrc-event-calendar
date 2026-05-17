"use client";

import { EventCategory } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { saveCreatorToken } from "@/hooks/useCreatorToken";

type FormErrors = {
  title?: string;
  startAt?: string;
  endAt?: string;
  category?: string;
  form?: string;
};

const CATEGORIES = Object.values(EventCategory);

export default function NewEventPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const title = data.get("title") as string;
    const startAt = data.get("startAt") as string;
    const endAt = data.get("endAt") as string;
    const category = data.get("category") as string;
    const description = data.get("description") as string;
    const worldId = data.get("worldId") as string;
    const worldName = data.get("worldName") as string;

    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!startAt) newErrors.startAt = "Start date is required";
    if (!endAt) newErrors.endAt = "End date is required";
    if (!category) newErrors.category = "Category is required";
    if (startAt && endAt && new Date(startAt) >= new Date(endAt)) {
      newErrors.endAt = "End date must be after start date";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          startAt,
          endAt,
          category,
          ...(description ? { description } : {}),
          ...(worldId ? { worldId } : {}),
          ...(worldName ? { worldName } : {}),
        }),
      });

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        setErrors({ form: body.error ?? "Failed to create event" });
        return;
      }

      const event = (await res.json()) as { id: string };
      const token = res.headers.get("X-Creator-Token");
      if (token) {
        saveCreatorToken(event.id, token);
      }

      router.push(`/events/${event.id}`);
    } catch {
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-lg">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back to events
        </Link>

        <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900">
          Create Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-slate-700"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-600">{errors.category}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="startAt"
                className="block text-sm font-medium text-slate-700"
              >
                Start <span className="text-red-500">*</span>
              </label>
              <input
                id="startAt"
                name="startAt"
                type="datetime-local"
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              {errors.startAt && (
                <p className="mt-1 text-xs text-red-600">{errors.startAt}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="endAt"
                className="block text-sm font-medium text-slate-700"
              >
                End <span className="text-red-500">*</span>
              </label>
              <input
                id="endAt"
                name="endAt"
                type="datetime-local"
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
            {submitting ? "Creating…" : "Create Event"}
          </button>
        </form>
      </div>
    </main>
  );
}
