import { timingSafeEqual } from "crypto";

import { EventCategory } from "@prisma/client";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { UpdateEventSchema } from "@/lib/validators/event";

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
    body = {};
  }

  const result = UpdateEventSchema.safeParse(body ?? {});
  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { title, startAt, endAt, category, description, worldId, worldName } =
    result.data;

  const resolvedStart = startAt ? new Date(startAt) : event.startAt;
  const resolvedEnd = endAt ? new Date(endAt) : event.endAt;
  if (resolvedStart >= resolvedEnd) {
    return NextResponse.json(
      { errors: { endAt: ["endAt must be after startAt"] } },
      { status: 400 },
    );
  }

  const updated = await db.event.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(startAt !== undefined ? { startAt: new Date(startAt) } : {}),
      ...(endAt !== undefined ? { endAt: new Date(endAt) } : {}),
      ...(category !== undefined ? { category: category as EventCategory } : {}),
      ...(worldId !== undefined ? { worldId } : {}),
      ...(worldName !== undefined ? { worldName } : {}),
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
