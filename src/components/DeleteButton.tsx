"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getCreatorToken } from "@/hooks/useCreatorToken";

export function DeleteButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setHasToken(!!getCreatorToken(eventId));
  }, [eventId]);

  if (!hasToken) return null;

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const token = getCreatorToken(eventId);
    if (!token) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
        headers: { "X-Creator-Token": token },
      });

      if (res.status === 403) {
        setError("You are not authorized to delete this event.");
        return;
      }

      if (!res.ok) {
        setError("Failed to delete event. Please try again.");
        return;
      }

      router.push("/");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
      >
        {deleting ? "Deleting…" : "Delete Event"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
