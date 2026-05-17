import { describe, expect, it } from "vitest";

import { CreateEventSchema, UpdateEventSchema } from "../event";

const validCreate = {
  title: "VRChat Party",
  startAt: "2026-06-01T10:00:00Z",
  endAt: "2026-06-01T12:00:00Z",
  category: "PARTY" as const,
};

describe("CreateEventSchema", () => {
  it("accepts valid create input", () => {
    const result = CreateEventSchema.safeParse(validCreate);
    expect(result.success).toBe(true);
  });

  it("accepts optional fields", () => {
    const result = CreateEventSchema.safeParse({
      ...validCreate,
      description: "A great party",
      worldId: "wrld_abc123",
      worldName: "Party World",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty object (missing required fields)", () => {
    const result = CreateEventSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("title");
      expect(paths).toContain("startAt");
      expect(paths).toContain("endAt");
      expect(paths).toContain("category");
    }
  });

  it("rejects missing title", () => {
    const { title: _t, ...rest } = validCreate;
    void _t;
    const result = CreateEventSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects whitespace-only title", () => {
    const result = CreateEventSchema.safeParse({ ...validCreate, title: "   " });
    expect(result.success).toBe(false);
  });

  it("rejects missing startAt", () => {
    const { startAt: _s, ...rest } = validCreate;
    void _s;
    const result = CreateEventSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing endAt", () => {
    const { endAt: _e, ...rest } = validCreate;
    void _e;
    const result = CreateEventSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing category", () => {
    const { category: _c, ...rest } = validCreate;
    void _c;
    const result = CreateEventSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects invalid category value", () => {
    const result = CreateEventSchema.safeParse({ ...validCreate, category: "CONCERT" });
    expect(result.success).toBe(false);
  });

  it("rejects non-datetime startAt", () => {
    const result = CreateEventSchema.safeParse({ ...validCreate, startAt: "not-a-date" });
    expect(result.success).toBe(false);
  });

  it("rejects endAt before startAt", () => {
    const result = CreateEventSchema.safeParse({
      ...validCreate,
      startAt: "2026-06-01T12:00:00Z",
      endAt: "2026-06-01T10:00:00Z",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const endAtError = result.error.issues.find((i) => i.path[0] === "endAt");
      expect(endAtError).toBeDefined();
      expect(endAtError?.message).toContain("endAt");
    }
  });

  it("rejects endAt equal to startAt", () => {
    const result = CreateEventSchema.safeParse({
      ...validCreate,
      startAt: "2026-06-01T10:00:00Z",
      endAt: "2026-06-01T10:00:00Z",
    });
    expect(result.success).toBe(false);
  });
});

describe("UpdateEventSchema", () => {
  it("accepts empty object (all fields optional)", () => {
    const result = UpdateEventSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts partial update with only title", () => {
    const result = UpdateEventSchema.safeParse({ title: "Updated Title" });
    expect(result.success).toBe(true);
  });

  it("accepts partial update with only category", () => {
    const result = UpdateEventSchema.safeParse({ category: "MUSIC" });
    expect(result.success).toBe(true);
  });

  it("accepts full update input", () => {
    const result = UpdateEventSchema.safeParse({
      title: "Updated Party",
      startAt: "2026-07-01T10:00:00Z",
      endAt: "2026-07-01T12:00:00Z",
      category: "SOCIAL",
      description: "Updated description",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid category in update", () => {
    const result = UpdateEventSchema.safeParse({ category: "INVALID" });
    expect(result.success).toBe(false);
  });

  it("rejects non-datetime startAt in update", () => {
    const result = UpdateEventSchema.safeParse({ startAt: "not-a-date" });
    expect(result.success).toBe(false);
  });
});
