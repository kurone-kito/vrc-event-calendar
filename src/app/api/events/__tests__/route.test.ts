import { EventCategory } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/db', () => ({
  db: {
    event: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { db } from '@/lib/db';
import { GET } from '../route';

type MockEvent = {
  id: string;
  title: string;
  description: string | null;
  startAt: Date;
  endAt: Date;
  category: EventCategory;
  worldId: string | null;
  worldName: string | null;
  creatorToken: string;
  createdAt: Date;
  updatedAt: Date;
};

const events: MockEvent[] = [
  {
    id: 'seed-party-2023',
    title: 'Year End Bash',
    description: 'A 2023 party event.',
    startAt: new Date('2023-12-31T18:00:00.000Z'),
    endAt: new Date('2023-12-31T20:00:00.000Z'),
    category: EventCategory.PARTY,
    worldId: 'wrld_2023_party',
    worldName: 'Countdown Plaza',
    creatorToken: 'token-2023-party',
    createdAt: new Date('2023-12-01T00:00:00.000Z'),
    updatedAt: new Date('2023-12-01T00:00:00.000Z'),
  },
  {
    id: 'seed-party-2024',
    title: 'Spring Party',
    description: 'A 2024 party event.',
    startAt: new Date('2024-03-10T12:00:00.000Z'),
    endAt: new Date('2024-03-10T15:00:00.000Z'),
    category: EventCategory.PARTY,
    worldId: 'wrld_2024_party',
    worldName: 'Sky Garden',
    creatorToken: 'token-2024-party',
    createdAt: new Date('2024-02-01T00:00:00.000Z'),
    updatedAt: new Date('2024-02-01T00:00:00.000Z'),
  },
  {
    id: 'seed-art-2024',
    title: 'Gallery Night',
    description: 'A 2024 art event.',
    startAt: new Date('2024-06-20T09:00:00.000Z'),
    endAt: new Date('2024-06-20T11:00:00.000Z'),
    category: EventCategory.ART,
    worldId: 'wrld_2024_art',
    worldName: 'Gallery Atrium',
    creatorToken: 'token-2024-art',
    createdAt: new Date('2024-05-01T00:00:00.000Z'),
    updatedAt: new Date('2024-05-01T00:00:00.000Z'),
  },
  {
    id: 'seed-music-2025',
    title: 'New Year Live',
    description: 'A 2025 music event.',
    startAt: new Date('2025-01-10T19:00:00.000Z'),
    endAt: new Date('2025-01-10T21:00:00.000Z'),
    category: EventCategory.MUSIC,
    worldId: 'wrld_2025_music',
    worldName: 'Resonance Hall',
    creatorToken: 'token-2025-music',
    createdAt: new Date('2024-12-01T00:00:00.000Z'),
    updatedAt: new Date('2024-12-01T00:00:00.000Z'),
  },
];

function filterEvents(input: MockEvent[], where: unknown) {
  const typedWhere = (where ?? {}) as {
    category?: EventCategory;
    startAt?: {
      gte?: Date;
      lte?: Date;
    };
  };

  return input
    .filter((event) => {
      if (typedWhere.category && event.category !== typedWhere.category) {
        return false;
      }

      if (typedWhere.startAt?.gte && event.startAt < typedWhere.startAt.gte) {
        return false;
      }

      if (typedWhere.startAt?.lte && event.startAt > typedWhere.startAt.lte) {
        return false;
      }

      return true;
    })
    .sort((left, right) => left.startAt.getTime() - right.startAt.getTime());
}

describe('GET /api/events', () => {
  const findManyMock = vi.mocked(db.event.findMany);
  const countMock = vi.mocked(db.event.count);

  beforeEach(() => {
    findManyMock.mockReset();
    countMock.mockReset();

    findManyMock.mockImplementation(
      ((args?: { where?: unknown }) =>
        Promise.resolve(filterEvents(events, args?.where))) as never,
    );
    countMock.mockImplementation(
      ((args?: { where?: unknown }) =>
        Promise.resolve(filterEvents(events, args?.where).length)) as never,
    );
  });

  it('returns all events when no filters are provided', async () => {
    const response = await GET(new Request('http://localhost:3000/api/events'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.total).toBe(4);
    expect(data.events.map((event: { title: string }) => event.title)).toEqual([
      'Year End Bash',
      'Spring Party',
      'Gallery Night',
      'New Year Live',
    ]);
    expect(findManyMock).toHaveBeenCalledWith({
      where: {},
      orderBy: {
        startAt: 'asc',
      },
    });
  });

  it('filters events by category', async () => {
    const response = await GET(
      new Request('http://localhost:3000/api/events?category=PARTY'),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.total).toBe(2);
    expect(
      data.events.map((event: { category: string }) => event.category),
    ).toEqual(['PARTY', 'PARTY']);
    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        category: EventCategory.PARTY,
      },
      orderBy: {
        startAt: 'asc',
      },
    });
  });

  it('filters events by date range', async () => {
    const response = await GET(
      new Request(
        'http://localhost:3000/api/events?date_from=2024-01-01&date_to=2024-12-31',
      ),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.total).toBe(2);
    expect(data.events.map((event: { title: string }) => event.title)).toEqual([
      'Spring Party',
      'Gallery Night',
    ]);
    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        startAt: {
          gte: new Date('2024-01-01'),
          lte: new Date('2024-12-31'),
        },
      },
      orderBy: {
        startAt: 'asc',
      },
    });
  });

  it('combines category and date filters', async () => {
    const response = await GET(
      new Request(
        'http://localhost:3000/api/events?category=PARTY&date_from=2024-01-01&date_to=2024-12-31',
      ),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.total).toBe(1);
    expect(data.events.map((event: { title: string }) => event.title)).toEqual([
      'Spring Party',
    ]);
  });

  it('returns an empty result when filters do not match any events', async () => {
    const response = await GET(
      new Request(
        'http://localhost:3000/api/events?category=SOCIAL&date_from=2024-01-01&date_to=2024-12-31',
      ),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.total).toBe(0);
    expect(data.events).toEqual([]);
  });
});
