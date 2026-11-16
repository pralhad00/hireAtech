import { Metadata } from "next";
import { requireRole } from "@/lib/auth/guards";
import { listAllTechnicians } from "@/lib/queries/technicians";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { TechnicianRow } from "./TechnicianRow";
import Link from "next/link";

// Admin pages read the session + database on every request, so they must not
// be statically prerendered (Next.js 16 with cacheComponents uses
// `instant = false` instead of `dynamic = 'force-dynamic'`).
export const instant = false;

export const metadata: Metadata = {
  title: "Technicians | HireATech Admin",
  description: "Approve or reject technician applications",
};

export default async function TechniciansPage() {
  const user = await requireRole(["admin"]);
  const technicians = await listAllTechnicians();

  const pending = technicians.filter((t) => t.approvalStatus === "pending");
  const approved = technicians.filter((t) => t.approvalStatus === "approved");
  const rejected = technicians.filter((t) => t.approvalStatus === "rejected");

  return (
    <div className="flex h-screen">
      <AdminSidebar user={user} />

      <main className="flex-1 overflow-y-auto bg-bg lg:ml-64">
        <div className="max-w-7xl mx-auto p-6">
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-ink font-display">
                Technicians
              </h1>
              <p className="text-muted-strong mt-1">
                Approve or reject technician applications. Approved
                technicians appear in search and can receive bookings.
              </p>
            </div>
            <Link
              href="/admin"
              className="text-sm font-medium text-primary underline hover:no-underline"
            >
              ← Back to dashboard
            </Link>
          </header>

          {/* Pending approval section */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex size-2 rounded-full bg-[#B77A35]" />
              <h2 className="text-xl font-semibold text-ink">
                Pending approval ({pending.length})
              </h2>
            </div>

            {pending.length === 0 ? (
              <div className="surface border border-border rounded-[4px] p-6 text-center">
                <p className="text-muted-strong">
                  No technicians awaiting approval.
                </p>
              </div>
            ) : (
              <div className="surface border border-border rounded-[4px] overflow-hidden">
                <table className="w-full text-left border-b border-border">
                  <thead>
                    <tr className="bg-bg-subtle">
                      <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                        Technician
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                        Service area
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                        Applied
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pending.map((tech) => (
                      <TechnicianRow key={tech.userId} tech={tech} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Approved section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex size-2 rounded-full bg-[#287A50]" />
              <h2 className="text-xl font-semibold text-ink">
                Approved technicians ({approved.length})
              </h2>
            </div>

            {approved.length === 0 ? (
              <div className="surface border border-border rounded-[4px] p-6 text-center">
                <p className="text-muted-strong">
                  No approved technicians yet.
                </p>
              </div>
            ) : (
              <div className="surface border border-border rounded-[4px] overflow-hidden">
                <table className="w-full text-left border-b border-border">
                  <thead>
                    <tr className="bg-bg-subtle">
                      <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                        Technician
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                        Service area
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {approved.map((tech) => (
                      <tr key={tech.userId} className="hover:bg-bg/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-ink">
                            {tech.fullName}
                          </div>
                          <div className="text-sm text-muted-strong">
                            {tech.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-ink">
                          {tech.categoryName}
                        </td>
                        <td className="px-4 py-3 text-sm text-ink">
                          {tech.experienceYears} years
                        </td>
                        <td className="px-4 py-3 text-sm text-ink">
                          {tech.serviceArea ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#E7F5EC] text-[#287A50] text-xs font-semibold">
                            Approved
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Rejected section (collapsed info) */}
          {rejected.length > 0 && (
            <section className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex size-2 rounded-full bg-[#B7443D]" />
                <h2 className="text-xl font-semibold text-ink">
                  Rejected technicians ({rejected.length})
                </h2>
              </div>
              <div className="surface border border-border rounded-[4px] overflow-hidden">
                <table className="w-full text-left border-b border-border">
                  <thead>
                    <tr className="bg-bg-subtle">
                      <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                        Technician
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rejected.map((tech) => (
                      <tr key={tech.userId} className="hover:bg-bg/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-ink">
                            {tech.fullName}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-ink">
                          {tech.categoryName}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-strong">
                          {tech.rejectionReason ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
