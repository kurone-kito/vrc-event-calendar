import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { dateRangeOverlaps, formatEventDate, isEventToday } from "../date";

describe("formatEventDate", () => {
  it("returns a non-empty string", () => {
    const result = formatEventDate(new Date(2026, 0, 15, 10, 0));
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("includes the year", () => {
    const result = formatEventDate(new Date(2026, 4, 17, 15, 30));
    expect(result).toContain("2026");
  });
});

describe("isEventToday", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true for event happening right now", () => {
    vi.setSystemTime(new Date(2026, 0, 15, 12, 0));
    expect(isEventToday(new Date(2026, 0, 15, 10, 0), new Date(2026, 0, 15, 14, 0))).toBe(true);
  });

  it("returns false for event entirely in the past", () => {
    vi.setSystemTime(new Date(2026, 0, 16, 12, 0));
    expect(isEventToday(new Date(2026, 0, 15, 10, 0), new Date(2026, 0, 15, 14, 0))).toBe(false);
  });

  it("returns false for event entirely in the future", () => {
    vi.setSystemTime(new Date(2026, 0, 14, 12, 0));
    expect(isEventToday(new Date(2026, 0, 15, 10, 0), new Date(2026, 0, 15, 14, 0))).toBe(false);
  });

  it("returns true for event spanning midnight into today (yesterday started)", () => {
    vi.setSystemTime(new Date(2026, 0, 15, 0, 30));
    expect(isEventToday(new Date(2026, 0, 14, 22, 0), new Date(2026, 0, 15, 2, 0))).toBe(true);
  });

  it("returns true for event spanning midnight out of today (ends tomorrow)", () => {
    vi.setSystemTime(new Date(2026, 0, 15, 23, 30));
    expect(isEventToday(new Date(2026, 0, 15, 22, 0), new Date(2026, 0, 16, 2, 0))).toBe(true);
  });

  it("returns false for event ending exactly at local midnight (half-open boundary)", () => {
    vi.setSystemTime(new Date(2026, 0, 15, 0, 0));
    // endAt equals todayStart — strict greater-than means no overlap
    expect(isEventToday(new Date(2026, 0, 14, 22, 0), new Date(2026, 0, 15, 0, 0))).toBe(false);
  });

  it("handles UTC/JST midnight: event crosses UTC midnight and overlaps local today", () => {
    // 00:30 local time on Jan 16 — "today" local is Jan 16
    vi.setSystemTime(new Date(2026, 0, 16, 0, 30));
    // Event that started at 23:00 local Jan 15 and ends 01:00 local Jan 16
    const start = new Date(2026, 0, 15, 23, 0);
    const end = new Date(2026, 0, 16, 1, 0);
    expect(isEventToday(start, end)).toBe(true);
  });
});

describe("dateRangeOverlaps", () => {
  const t = (h: number) => new Date(2026, 0, 15, h, 0);

  it("returns false for non-overlapping ranges (A before B)", () => {
    expect(dateRangeOverlaps(t(1), t(3), t(4), t(6))).toBe(false);
  });

  it("returns false for non-overlapping ranges (B before A)", () => {
    expect(dateRangeOverlaps(t(4), t(6), t(1), t(3))).toBe(false);
  });

  it("returns false for adjacent ranges (A end == B start)", () => {
    expect(dateRangeOverlaps(t(1), t(3), t(3), t(5))).toBe(false);
  });

  it("returns true for partial overlap (A starts before B ends)", () => {
    expect(dateRangeOverlaps(t(1), t(4), t(3), t(6))).toBe(true);
  });

  it("returns true for partial overlap (B starts before A ends)", () => {
    expect(dateRangeOverlaps(t(3), t(6), t(1), t(4))).toBe(true);
  });

  it("returns true when A fully contains B", () => {
    expect(dateRangeOverlaps(t(1), t(6), t(2), t(5))).toBe(true);
  });

  it("returns true when B fully contains A", () => {
    expect(dateRangeOverlaps(t(2), t(5), t(1), t(6))).toBe(true);
  });

  it("returns true for identical ranges", () => {
    expect(dateRangeOverlaps(t(2), t(5), t(2), t(5))).toBe(true);
  });
});
