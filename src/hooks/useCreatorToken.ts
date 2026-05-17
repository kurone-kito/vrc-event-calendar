"use client";

export function saveCreatorToken(eventId: string, token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`creatorToken:${eventId}`, token);
}

export function getCreatorToken(eventId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`creatorToken:${eventId}`);
}
