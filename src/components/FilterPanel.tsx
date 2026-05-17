"use client";

import { EventCategory } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const CATEGORIES = Object.values(EventCategory);

export function FilterPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const selectedCategory = searchParams.get("category") ?? "";
  const dateFrom = searchParams.get("date_from") ?? "";
  const dateTo = searchParams.get("date_to") ?? "";

  return (
    <div className="mb-6 rounded-xl border border-slate-200/80 bg-white/85 p-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-600">Category</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateParam("category", null)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                !selectedCategory
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  updateParam("category", selectedCategory === cat ? null : cat)
                }
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="date_from"
              className="text-xs font-medium text-slate-600"
            >
              From
            </label>
            <input
              id="date_from"
              type="date"
              value={dateFrom}
              onChange={(e) => updateParam("date_from", e.target.value || null)}
              className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="date_to"
              className="text-xs font-medium text-slate-600"
            >
              To
            </label>
            <input
              id="date_to"
              type="date"
              value={dateTo}
              onChange={(e) => updateParam("date_to", e.target.value || null)}
              className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
