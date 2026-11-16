"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertTechnicianAvailabilityAction, deleteTechnicianAvailabilityAction } from "@/lib/actions/technician";
import { dayLabel, windowLabel } from "@/lib/utils";
import Link from "next/link";

const DAYS = [0, 1, 2, 3, 4, 5, 6];
const WINDOWS: Array<"morning" | "afternoon" | "evening"> = ["morning", "afternoon", "evening"];

interface AvailabilityFormProps {
  initialAvailability: Array<{ day_of_week: number; time_window: string }>;
}

export function AvailabilityForm({ initialAvailability }: AvailabilityFormProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialAvailability.map((a) => `${a.day_of_week}-${a.time_window}`)),
  );
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const isSelected = (day: number, window: string) => selected.has(`${day}-${window}`);

  const toggle = async (day: number, window: string) => {
    const key = `${day}-${window}`;
    const currentlySelected = isSelected(day, window);
    setSaving((prev) => new Set([...prev, key]));

    try {
      if (currentlySelected) {
        await deleteTechnicianAvailabilityAction(day, window);
      } else {
        await upsertTechnicianAvailabilityAction(day, window);
      }
      setSelected((prev) => {
        const next = new Set(prev);
        if (currentlySelected) next.delete(key);
        else next.add(key);
        return next;
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update availability.");
    } finally {
      setSaving((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">Availability</h1>
        <p className="text-muted-strong">
          Select the days and time windows you&rsquo;re available to work. Customers
          can only book you during these slots.
        </p>
      </header>

      {error && (
        <div className="mb-6 p-3 border border-error text-error text-sm rounded-[2px]" role="alert">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-muted-strong uppercase tracking-wider mb-5">Weekly availability</h2>
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-2 text-muted-strong text-sm font-medium">Day / Time</div>
          {WINDOWS.map((w) => (
            <div key={w} className="col-span-1 text-center text-xs font-semibold text-muted-strong uppercase">
              {windowLabel(w)}
            </div>
          ))}
          {DAYS.map((day) => (
            <div key={day} className="col-span-2">
              <div className="text-sm font-medium text-ink mb-2">{dayLabel(day)}</div>
              <div className="grid grid-cols-3 gap-1">
                {WINDOWS.map((w) => {
                  const key = `${day}-${w}`;
                  return (
                    <label
                      key={key}
                      className={`block cursor-pointer select-none py-2 rounded-[2px] border text-center text-sm font-medium transition-colors ${
                        isSelected(day, w)
                          ? "border-primary bg-primary text-[#111418]"
                          : "border-border bg-surface text-ink hover:border-primary hover:bg-muted"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected(day, w)}
                        onChange={() => toggle(day, w)}
                        className="hidden"
                        aria-label={`${dayLabel(day)} ${windowLabel(w)}`}
                      />
                      {saving.has(key) ? (
                        <span className="text-xs">⟳</span>
                      ) : isSelected(day, w) ? (
                        <span className="text-xs">✓</span>
                      ) : null}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-strong">
          Tip: if you&rsquo;re available all day on a day, select all three windows
          (morning, afternoon, evening).
        </p>
      </div>

      <p className="mt-8 text-center text-sm text-muted-strong">
        <Link href="/technician" className="text-primary underline hover:no-underline">
          &larr; Back to dashboard
        </Link>
      </p>
    </main>
  );
}
