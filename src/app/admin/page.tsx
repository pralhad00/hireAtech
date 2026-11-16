import { Metadata } from "next";
import { requireRole } from "@/lib/auth/guards";
import { getAdminDashboardStats } from "@/lib/queries/admin";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import Link from "next/link";

// Admin pages read the session + database on every request, so they must not
// be statically prerendered (Next.js 16 with cacheComponents uses
// `instant = false` instead of `dynamic = 'force-dynamic'`).
export const instant = false;

export const metadata: Metadata = {
  title: "Admin dashboard | HireATech",
  description: "Admin overview: users, technicians, bookings",
};

const statusLabel = (status: string): string => {
  switch (status) {
    case "pending":
      return "Pending";
    case "accepted":
      return "Accepted";
    case "in_progress":
      return "In progress";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
};

export default async function AdminDashboardPage() {
  const user = await requireRole(["admin"]);
  const stats = await getAdminDashboardStats();

  return (
    <div className="flex h-screen">
      <AdminSidebar user={user} />

      <main className="flex-1 overflow-y-auto bg-bg lg:ml-64">
        <div className="max-w-7xl mx-auto p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-ink font-display">
              Admin dashboard
            </h1>
            <p className="text-muted-strong mt-1">
              Signed in as{" "}
              <span className="text-ink font-semibold">{user.full_name}</span>
              ({user.role})
            </p>
          </header>

          {/* Count cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total users"
              value={stats.totalUsers}
              valueClassName="bg-[#414A2F] text-[#f2f0e8]"
            />
            <StatCard
              label="Pending technicians"
              value={stats.pendingTechnicians}
              valueClassName="bg-[#B77A35] text-[#111418]"
            />
            <StatCard
              label="Total bookings"
              value={stats.totalBookings}
              valueClassName="bg-[#414A2F] text-[#f2f0e8]"
            />
            <StatCard
              label="Pending bookings"
              value={stats.bookingsByStatus.pending}
              valueClassName="bg-[#B77A35] text-[#111418]"
            />
          </div>

          {/* Bookings by status */}
          <section
            className="surface border border-border rounded-[4px] p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-ink mb-4">
              Bookings by status
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.bookingsByStatus).map(([status, count]) => (
                <div
                  key={status}
                  className="surface border border-border rounded-[4px] p-4"
                >
                  <div className="text-sm text-muted-strong">
                    {statusLabel(status)}
                  </div>
                  <div
                    className={[
                      "mt-1 text-2xl font-bold",
                      status === "pending" || status === "in_progress"
                        ? "text-[#B77A35]"
                        : status === "accepted" || status === "completed"
                          ? "text-[#287A50]"
                          : status === "cancelled" || status === "rejected"
                            ? "text-[#B7443D]"
                            : "text-ink",
                    ].join(" ")}
                  >
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick actions */}
          <section className="surface border border-border rounded-[4px] p-6">
            <h2 className="text-xl font-semibold text-ink mb-4">
              Quick actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <AdminCardLink
                href="/admin/technicians"
                label="Technicians"
                description="Approve / reject pending technicians"
              />
              <AdminCardLink
                href="/admin/bookings"
                label="Bookings"
                description="View and cancel any booking"
              />
              <AdminCardLink
                href="/admin/categories"
                label="Categories"
                description="Manage categories and search aliases"
              />
              <AdminCardLink
                href="/admin/users"
                label="Users"
                description="Block / unblock users"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: number;
  valueClassName: string;
}) {
  return (
    <div className="surface border border-border rounded-[4px] p-6">
      <div className="text-sm text-muted-strong">{label}</div>
      <div className={`mt-2 text-3xl font-bold ${valueClassName}`}>{value}</div>
    </div>
  );
}

function AdminCardLink({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block surface border border-border rounded-[4px] p-4 hover:border-primary transition-colors"
    >
      <div className="text-sm font-semibold text-ink">{label}</div>
      <div className="mt-1 text-sm text-muted-strong">{description}</div>
    </Link>
  );
}
