import { timingSafeEqual } from "crypto";

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
