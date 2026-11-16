import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/guards";
import {
  getTechnicianProfile,
  getDashboardStats,
  getRecentBookingRequests,
  getUpcomingAppointments,
  getRecentReviews,
  windowLabel,
} from "@/lib/queries/technicians";

export const instant = false;

export const metadata: Metadata = {
  title: "Technician Dashboard | HireATech",
  description: "Manage your bookings, services, and availability on HireATech",
};

function StatCard({ label, value, subtitle, color = "ink" }: { label: string; value: string | number; subtitle: string; color?: "ink" | "primary" | "success" | "warning" | "error" }) {
  const colorClasses: Record<string, string> = {
    ink: "border-ink text-ink",
    primary: "border-primary text-primary",
    success: "border-success text-success",
    warning: "border-warning text-warning",
    error: "border-error text-error",
  };
  return (
    <article className="rounded-[2px] border border-border bg-surface p-5">
      <p className="text-xs font-semibold text-muted-strong uppercase tracking-wider">{label}</p>
      <p className={`mt-1 font-display text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
      <p className="mt-1 text-xs text-muted-strong">{subtitle}</p>
    </article>
  );
}

export default async function TechnicianDashboard() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=" + encodeURIComponent("/technician"));
  }
  if (user.role !== "technician") {
    redirect("/");
  }

  const profile = await getTechnicianProfile(user.id);
  const stats = await getDashboardStats(user.id);
  const [requests, upcoming, reviews] = await Promise.all([
    getRecentBookingRequests(user.id),
    getUpcomingAppointments(user.id),
    getRecentReviews(user.id),
  ]);

  const isApproved = profile?.approval_status === "approved";
  const isPending = profile?.approval_status === "pending";
  const isRejected = profile?.approval_status === "rejected";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Technician Dashboard</h1>
          <p className="text-muted-strong">Manage your bookings, services, and availability.</p>
        </div>
        <nav className="flex gap-2 sm:gap-3">
          <a href="/technician/profile" className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-semibold text-ink hover:border-primary hover:text-primary transition-colors">
            Profile
          </a>
          <a href="/technician/services" className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-semibold text-ink hover:border-primary hover:text-primary transition-colors">
            Services
          </a>
          <a href="/technician/availability" className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-semibold text-ink hover:border-primary hover:text-primary transition-colors">
            Availability
          </a>
          <a href="/technician/bookings" className="inline-flex items-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 text-sm font-semibold text-[#111418] hover:bg-primary/90 transition-colors">
            Bookings
          </a>
        </nav>
      </header>

      {/* Approval status banner */}
      {isRejected && (
        <section className="mb-8 rounded-[2px] border border-error bg-error/10 p-4">
          <h2 className="text-sm font-bold text-error">Application rejected</h2>
          <p className="mt-1 text-sm text-error">
            {profile?.rejection_reason ? profile.rejection_reason : "Your technician application was rejected."}
          </p>
          <p className="mt-2 text-xs text-error">
            You can resubmit your profile for review. Your status will reset to <strong>pending</strong>.
          </p>
        </section>
      )}
      {isPending && (
        <section className="mb-8 rounded-[2px] border border-warning bg-warning/10 p-4">
          <h2 className="text-sm font-bold text-warning">Under review</h2>
          <p className="mt-1 text-sm text-warning">
            Your technician account is pending admin approval. You&rsquo;ll be able to accept bookings once approved.
          </p>
        </section>
      )}

      {/* Summary cards */}
      <section className="mb-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total bookings" value={stats.totalBookings} subtitle="All time" color="ink" />
        <StatCard label="Pending requests" value={stats.pendingRequests} subtitle="Awaiting your response" color="warning" />
        <StatCard label="Completed jobs" value={stats.completedJobs} subtitle="Finished work" color="success" />
        <StatCard label="Cancelled jobs" value={stats.cancelledJobs} subtitle="Cancelled by customer or you" color="error" />
        <StatCard label="Average rating" value={stats.averageRating ?? "&mdash;"} subtitle={`${stats.reviewCount} review${stats.reviewCount !== 1 ? "s" : ""}`} color="primary" />
      </section>

      {isApproved && (
        <>
          {/* Recent booking requests */}
          <section className="mb-8">
            <h2 className="font-display text-xl font-bold text-ink mb-4">Recent booking requests</h2>
            {requests.length === 0 ? (
              <p className="text-muted-strong">No pending requests.</p>
            ) : (
              <div className="rounded-lg border border-border bg-surface overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-bg-subtle">
                      <th className="px-4 py-3 text-muted-strong font-semibold">Customer</th>
                      <th className="px-4 py-3 text-muted-strong font-semibold">Date</th>
                      <th className="px-4 py-3 text-muted-strong font-semibold">Window</th>
                      <th className="px-4 py-3 text-muted-strong font-semibold">Job</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((b) => (
                      <tr key={b.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 text-ink">{b.customer_name}</td>
                        <td className="px-4 py-3 text-ink">
                          {b.preferred_date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                        </td>
                        <td className="px-4 py-3 text-ink font-mono">{windowLabel(b.time_window)}</td>
                        <td className="px-4 py-3 text-muted-strong truncate max-w-xs">{b.job_summary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Upcoming appointments */}
          <section className="mb-8">
            <h2 className="font-display text-xl font-bold text-ink mb-4">Upcoming appointments</h2>
            {upcoming.length === 0 ? (
              <p className="text-muted-strong">No upcoming appointments.</p>
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
                    </tr>
                  </thead>
                  <tbody>
                    {upcoming.map((b) => (
                      <tr key={b.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 text-ink">{b.customer_name}</td>
                        <td className="px-4 py-3 text-ink">
                          {b.preferred_date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                        </td>
                        <td className="px-4 py-3 text-ink font-mono">{windowLabel(b.time_window)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.7rem] font-bold ${
                            b.status === "accepted" ? "bg-success/10 text-success border border-success/20" : "bg-warning/10 text-warning border border-warning/20"
                          }`}>
                            {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-strong truncate max-w-xs">{b.job_summary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Recent reviews */}
          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-4">Recent customer reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-muted-strong">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <article key={r.id} className="rounded-lg border border-border bg-surface p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-semibold text-ink">{r.customer_name}</p>
                        <div className="flex items-center gap-1 text-warning">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={`text-[0.85rem] ${star <= r.rating ? "fill-current" : "text-muted-strong"}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs font-mono text-muted-strong">{r.created_at.toLocaleDateString()}</p>
                    </div>
                    {r.comment && (
                      <p className="text-sm text-ink">{r.comment}</p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
