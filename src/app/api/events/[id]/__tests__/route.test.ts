import { EventCategory } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    event: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { db } from "@/lib/db";
import { DELETE, GET, PUT } from "../route";

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

describe("PUT /api/events/[id]", () => {
  const findUniqueMock = vi.mocked(db.event.findUnique);
  const updateMock = vi.mocked(db.event.update);

  const storedEvent: MockEvent = {
    ...sampleEvent,
    creatorToken: "correct-token-abc",
  };

  function makePutRequest(id: string, token: string, body: unknown = {}) {
    return {
      request: new Request(`http://localhost:3000/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Creator-Token": token,
        },
        body: JSON.stringify(body),
      }),
      context: { params: Promise.resolve({ id }) },
    };
  }

  beforeEach(() => {
    findUniqueMock.mockReset();
    updateMock.mockReset();
    findUniqueMock.mockResolvedValue(storedEvent as never);
    updateMock.mockImplementation((({ data }: { data: object }) =>
      Promise.resolve({ ...storedEvent, ...data })) as never);
  });

  it("returns 200 with updated event when token matches", async () => {
    const { request, context } = makePutRequest(
      "seed-party-001",
      "correct-token-abc",
      { title: "Updated Title" },
    );
    const response = await PUT(request, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.title).toBe("Updated Title");
    expect(updateMock).toHaveBeenCalledOnce();
  });

  it("returns 403 when token does not match", async () => {
    const { request, context } = makePutRequest(
      "seed-party-001",
      "wrong-token",
    );
    const response = await PUT(request, context);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Forbidden");
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("returns 404 when event does not exist", async () => {
    findUniqueMock.mockResolvedValue(null);

    const { request, context } = makePutRequest("nonexistent", "any-token");
    const response = await PUT(request, context);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Event not found");
  });
});

describe("DELETE /api/events/[id]", () => {
  const findUniqueMock = vi.mocked(db.event.findUnique);
  const deleteMock = vi.mocked(db.event.delete);

  const storedEvent: MockEvent = {
    ...sampleEvent,
    creatorToken: "correct-token-xyz",
  };

  function makeDeleteRequest(id: string, token: string) {
    return {
      request: new Request(`http://localhost:3000/api/events/${id}`, {
        method: "DELETE",
        headers: { "X-Creator-Token": token },
      }),
      context: { params: Promise.resolve({ id }) },
    };
  }

  beforeEach(() => {
    findUniqueMock.mockReset();
    deleteMock.mockReset();
    findUniqueMock.mockResolvedValue(storedEvent as never);
    deleteMock.mockResolvedValue(storedEvent as never);
  });

  it("returns 204 and deletes the event when token matches", async () => {
    const { request, context } = makeDeleteRequest(
      "seed-party-001",
      "correct-token-xyz",
    );
    const response = await DELETE(request, context);

    expect(response.status).toBe(204);
    expect(deleteMock).toHaveBeenCalledWith({ where: { id: "seed-party-001" } });
  });

  it("returns 403 when token does not match", async () => {
    const { request, context } = makeDeleteRequest("seed-party-001", "wrong");
    const response = await DELETE(request, context);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Forbidden");
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it("returns 404 when event does not exist", async () => {
    findUniqueMock.mockResolvedValue(null);

    const { request, context } = makeDeleteRequest("nonexistent", "any");
    const response = await DELETE(request, context);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Event not found");
  });
});
