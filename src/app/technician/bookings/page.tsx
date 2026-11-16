import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/guards";
import { getTechnicianBookings } from "@/lib/queries/technicians";
import { BookingActions } from "./BookingActions";

export const instant = false;

export default async function TechnicianBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "technician") {
    redirect("/login?next=" + encodeURIComponent("/technician/bookings"));
  }

  const params = await searchParams;
  const statusFilter = params.status ?? "all";
  const bookings = await getTechnicianBookings(user.id, statusFilter);

  const statusCounts: Record<string, number> = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    accepted: bookings.filter((b) => b.status === "accepted").length,
    in_progress: bookings.filter((b) => b.status === "in_progress").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">My bookings</h1>
          <p className="text-muted-strong">View and manage your booking requests.</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          {["all", "pending", "accepted", "in_progress", "completed", "cancelled"].map((s) => (
            <a
              key={s}
              href={`/technician/bookings?status=${s}`}
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === s
                  ? "border-primary bg-primary text-[#111418]"
                  : "border-border bg-transparent text-ink hover:border-primary hover:text-primary"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")}
              <span className="ml-1 text-[0.65rem] font-bold">{statusCounts[s]}</span>
            </a>
          ))}
        </div>
      </header>

      {bookings.length === 0 ? (
        <p className="text-muted-strong text-center py-12">
          {statusFilter === "all" ? "No bookings yet." : `No ${statusFilter} bookings.`}
        </p>
      ) : (
        <div className="rounded-lg border border-border bg-surface overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-subtle">
                <th className="px-4 py-3 text-muted-strong font-semibold">Customer</th>
                <th className="px-4 py-3 text-muted-strong font-semibold">Date</th>
                <th className="px-4 py-3 text-muted-strong font-semibold">Window</th>
                <th className="px-4 py-3 text-muted-strong font-semibold">Status</th>
                <th className="px-4 py-3 text-muted-strong font-semibold">Job</th>
                <th className="px-4 py-3 text-muted-strong font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-ink">{b.customer_name}</td>
                  <td className="px-4 py-3 text-ink">
                    {b.preferred_date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-ink font-mono">{b.time_window.charAt(0).toUpperCase() + b.time_window.slice(1)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.7rem] font-bold ${
                      b.status === "pending"
                        ? "bg-warning/10 text-warning border border-warning/20"
                        : b.status === "accepted"
                          ? "bg-success/10 text-success border border-success/20"
                          : b.status === "in_progress"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : b.status === "completed"
                              ? "bg-success/20 text-success border border-success/30"
                              : "bg-error/10 text-error border border-error/20"
                    }`}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1).replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-strong truncate max-w-xs">{b.job_summary}</td>
                  <td className="px-4 py-3">
                    <BookingActions bookingId={b.id} status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-muted-strong">
        <Link href="/technician" className="text-primary underline hover:no-underline">
          &larr; Back to dashboard
        </Link>
      </p>
    </main>
  );
}
