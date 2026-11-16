import "server-only";
import { query } from "../db";

export interface AdminDashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalTechnicians: number;
  totalAdmins: number;
  pendingTechnicians: number;
  approvedTechnicians: number;
  rejectedTechnicians: number;
  bookingsByStatus: Record<string, number>;
  totalBookings: number;
}

/** Dashboard counts for the admin overview page (spec §5: /admin). */
export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const result = await query<{
    total_users: string;
    total_customers: string;
    total_technicians: string;
    total_admins: string;
    pending_technicians: string;
    approved_technicians: string;
    rejected_technicians: string;
    total_bookings: string;
    bookings_pending: string;
    bookings_accepted: string;
    bookings_in_progress: string;
    bookings_completed: string;
    bookings_cancelled: string;
    bookings_rejected: string;
  }>(
    `SELECT
            (SELECT count(*) FROM users) AS total_users,
            (SELECT count(*) FROM users WHERE role = 'customer') AS total_customers,
            (SELECT count(*) FROM users WHERE role = 'technician') AS total_technicians,
            (SELECT count(*) FROM users WHERE role = 'admin') AS total_admins,
            (SELECT count(*) FROM technician_profiles WHERE approval_status = 'pending') AS pending_technicians,
            (SELECT count(*) FROM technician_profiles WHERE approval_status = 'approved') AS approved_technicians,
            (SELECT count(*) FROM technician_profiles WHERE approval_status = 'rejected') AS rejected_technicians,
            (SELECT count(*) FROM bookings) AS total_bookings,
            (SELECT count(*) FROM bookings WHERE status = 'pending') AS bookings_pending,
            (SELECT count(*) FROM bookings WHERE status = 'accepted') AS bookings_accepted,
            (SELECT count(*) FROM bookings WHERE status = 'in_progress') AS bookings_in_progress,
            (SELECT count(*) FROM bookings WHERE status = 'completed') AS bookings_completed,
            (SELECT count(*) FROM bookings WHERE status = 'cancelled') AS bookings_cancelled,
            (SELECT count(*) FROM bookings WHERE status = 'rejected') AS bookings_rejected`,
    [],
  );
  const row = result.rows[0];
  return {
    totalUsers: Number(row.total_users),
    totalCustomers: Number(row.total_customers),
    totalTechnicians: Number(row.total_technicians),
    totalAdmins: Number(row.total_admins),
    pendingTechnicians: Number(row.pending_technicians),
    approvedTechnicians: Number(row.approved_technicians),
    rejectedTechnicians: Number(row.rejected_technicians),
    totalBookings: Number(row.total_bookings),
    bookingsByStatus: {
      pending: Number(row.bookings_pending),
      accepted: Number(row.bookings_accepted),
      in_progress: Number(row.bookings_in_progress),
      completed: Number(row.bookings_completed),
      cancelled: Number(row.bookings_cancelled),
      rejected: Number(row.bookings_rejected),
    },
  };
}
