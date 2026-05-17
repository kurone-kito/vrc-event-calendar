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
