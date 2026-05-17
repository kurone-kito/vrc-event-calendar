import { timingSafeEqual } from "crypto";

import { EventCategory } from "@prisma/client";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

function isValidId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,100}$/.test(id);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json({ error: "Invalid event ID format" }, { status: 400 });
  }

  const event = await db.event.findUnique({ where: { id } });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(event);
}

function tokensMatch(provided: string, stored: string): boolean {
  try {
    const a = Buffer.from(provided);
    const b = Buffer.from(stored);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json({ error: "Invalid event ID format" }, { status: 400 });
  }

  const token = request.headers.get("X-Creator-Token") ?? "";

  const event = await db.event.findUnique({ where: { id } });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (!tokensMatch(token, event.creatorToken)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, description, startAt, endAt, category, worldId, worldName } =
    (body ?? {}) as Record<string, unknown>;

  const startAtDate = startAt ? new Date(startAt as string) : undefined;
  const endAtDate = endAt ? new Date(endAt as string) : undefined;

  if (startAtDate && Number.isNaN(startAtDate.getTime())) {
    return NextResponse.json({ error: "Invalid date: startAt" }, { status: 400 });
  }
  if (endAtDate && Number.isNaN(endAtDate.getTime())) {
    return NextResponse.json({ error: "Invalid date: endAt" }, { status: 400 });
  }

  const resolvedStart = startAtDate ?? event.startAt;
  const resolvedEnd = endAtDate ?? event.endAt;
  if (resolvedStart >= resolvedEnd) {
    return NextResponse.json(
      { error: "startAt must be before endAt" },
      { status: 400 },
    );
  }

  if (
    category !== undefined &&
    !Object.values(EventCategory).includes(category as EventCategory)
  ) {
    return NextResponse.json(
      { error: "Invalid field: category" },
      { status: 400 },
    );
  }

  const updated = await db.event.update({
    where: { id },
    data: {
      ...(title && typeof title === "string" ? { title } : {}),
      ...(description !== undefined ? { description: description as string | null } : {}),
      ...(startAtDate ? { startAt: startAtDate } : {}),
      ...(endAtDate ? { endAt: endAtDate } : {}),
      ...(category ? { category: category as EventCategory } : {}),
      ...(worldId !== undefined ? { worldId: worldId as string | null } : {}),
      ...(worldName !== undefined ? { worldName: worldName as string | null } : {}),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json({ error: "Invalid event ID format" }, { status: 400 });
  }

  const token = request.headers.get("X-Creator-Token") ?? "";

  const event = await db.event.findUnique({ where: { id } });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (!tokensMatch(token, event.creatorToken)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.event.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
