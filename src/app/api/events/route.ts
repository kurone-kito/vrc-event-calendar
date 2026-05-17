import { EventCategory, Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

function parseDate(value: string | null): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function parseCategory(value: string | null): EventCategory | undefined {
  if (!value) {
    return undefined;
  }

  return Object.values(EventCategory).includes(value as EventCategory)
    ? (value as EventCategory)
    : undefined;
}

export function buildEventWhere(
  searchParams: URLSearchParams,
): Prisma.EventWhereInput {
  const category = parseCategory(searchParams.get('category'));
  const dateFrom = parseDate(searchParams.get('date_from'));
  const dateTo = parseDate(searchParams.get('date_to'));

  return {
    ...(category ? { category } : {}),
    ...(dateFrom || dateTo
      ? {
          startAt: {
            ...(dateFrom ? { gte: dateFrom } : {}),
            ...(dateTo ? { lte: dateTo } : {}),
          },
        }
      : {}),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const where = buildEventWhere(searchParams);

  const [events, total] = await Promise.all([
    db.event.findMany({
      where,
      orderBy: {
        startAt: 'asc',
      },
    }),
    db.event.count({ where }),
  ]);

  return NextResponse.json({ events, total });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { error: 'Request body must be an object' },
      { status: 400 },
    );
  }

  const { title, startAt, endAt, category, description, worldId, worldName } =
    body as Record<string, unknown>;

  if (!title || typeof title !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid field: title' },
      { status: 400 },
    );
  }
  if (!startAt || typeof startAt !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid field: startAt' },
      { status: 400 },
    );
  }
  if (!endAt || typeof endAt !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid field: endAt' },
      { status: 400 },
    );
  }
  if (
    !category ||
    !Object.values(EventCategory).includes(category as EventCategory)
  ) {
    return NextResponse.json(
      { error: 'Missing or invalid field: category' },
      { status: 400 },
    );
  }

  const startAtDate = new Date(startAt);
  const endAtDate = new Date(endAt);

  if (Number.isNaN(startAtDate.getTime())) {
    return NextResponse.json(
      { error: 'Invalid date: startAt' },
      { status: 400 },
    );
  }
  if (Number.isNaN(endAtDate.getTime())) {
    return NextResponse.json(
      { error: 'Invalid date: endAt' },
      { status: 400 },
    );
  }
  if (startAtDate >= endAtDate) {
    return NextResponse.json(
      { error: 'startAt must be before endAt' },
      { status: 400 },
    );
  }

  const creatorToken = crypto.randomUUID();

  const event = await db.event.create({
    data: {
      title,
      startAt: startAtDate,
      endAt: endAtDate,
      category: category as EventCategory,
      creatorToken,
      ...(description && typeof description === 'string'
        ? { description }
        : {}),
      ...(worldId && typeof worldId === 'string' ? { worldId } : {}),
      ...(worldName && typeof worldName === 'string' ? { worldName } : {}),
    },
  });

  const response = NextResponse.json(event, { status: 201 });
  response.headers.set('X-Creator-Token', creatorToken);
  return response;
}
