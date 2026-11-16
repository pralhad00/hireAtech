import { Metadata } from "next";
import { requireRole } from "@/lib/auth/guards";
import { listAllBookings } from "@/lib/queries/bookings";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { BookingRow } from "./BookingRow";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bookings | HireATech Admin",
  description: "View and cancel all bookings",
};

const CANCELABLE = ["pending", "accepted", "in_progress"];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireRole(["admin"]);
  const params = await searchParams;
  const statusFilter = params.status ?? "all";

  const bookings = await listAllBookings(
    statusFilter === "all" ? undefined : statusFilter,
  );

  const statuses = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "in_progress", label: "In progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="flex h-screen">
      <AdminSidebar user={user} />

      <main className="flex-1 overflow-y-auto bg-bg lg:ml-64">
        <div className="max-w-7xl mx-auto p-6">
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-ink font-display">
                Bookings
              </h1>
              <p className="text-muted-strong mt-1">
                Every booking on the platform. Cancel any non-final booking.
              </p>
            </div>
            <Link
              href="/admin"
              className="text-sm font-medium text-primary underline hover:no-underline"
            >
              ← Back to dashboard
            </Link>
          </header>

          {/* Status filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {statuses.map((s) => {
              const active = s.value === statusFilter;
              return (
                <Link
                  key={s.value}
                  href={`/admin/bookings?status=${s.value}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-white"
                      : "border border-border text-ink hover:bg-bg-subtle"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}
          </div>

          <div className="surface border border-border rounded-[4px] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-bg-subtle">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                    Technician
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                    Time window
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-muted-strong">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <BookingRow key={b.id} booking={b} cancelable={CANCELABLE.includes(b.status)} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
