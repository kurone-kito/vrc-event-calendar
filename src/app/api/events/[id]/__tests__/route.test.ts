import { EventCategory } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    event: {
      findUnique: vi.fn(),
    },
  },
}));

import { db } from "@/lib/db";
import { GET } from "../route";

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

const sampleEvent: MockEvent = {
  id: "seed-party-001",
  title: "VRChat Summer Party",
  description: "A summer party event.",
  startAt: new Date("2026-07-01T20:00:00.000Z"),
  endAt: new Date("2026-07-01T23:00:00.000Z"),
  category: EventCategory.PARTY,
  worldId: "wrld_party_001",
  worldName: "Beach Party World",
  creatorToken: "seed-creator-token",
  createdAt: new Date("2026-06-01T00:00:00.000Z"),
  updatedAt: new Date("2026-06-01T00:00:00.000Z"),
};

function makeRequest(id: string) {
  return {
    request: new Request(`http://localhost:3000/api/events/${id}`),
    context: { params: Promise.resolve({ id }) },
  };
}

describe("GET /api/events/[id]", () => {
  const findUniqueMock = vi.mocked(db.event.findUnique);

  beforeEach(() => {
    findUniqueMock.mockReset();
  });

  it("returns 200 with the event object when found", async () => {
    findUniqueMock.mockResolvedValue(sampleEvent as never);

    const { request, context } = makeRequest("seed-party-001");
    const response = await GET(request, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe("seed-party-001");
    expect(data.title).toBe("VRChat Summer Party");
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: "seed-party-001" },
    });
  });

  it("returns 404 when the event does not exist", async () => {
    findUniqueMock.mockResolvedValue(null);

    const { request, context } = makeRequest("nonexistent-id");
    const response = await GET(request, context);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Event not found");
  });

  it("returns 400 for an invalid ID format", async () => {
    const { request, context } = makeRequest("invalid/id/with/slashes");
    const response = await GET(request, context);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid event ID format");
    expect(findUniqueMock).not.toHaveBeenCalled();
  });
});
