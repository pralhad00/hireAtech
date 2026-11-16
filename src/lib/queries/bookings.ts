import "server-only";
import { query } from "../db";

export interface AdminBooking {
  id: string;
  reference: string;
  status: "pending" | "accepted" | "rejected" | "in_progress" | "completed" | "cancelled";
  customerName: string;
  customerPhone: string;
  technicianName: string;
  technicianPhone: string;
  categoryName: string;
  serviceTitle: string | null;
  servicePrice: number | null;
  jobSummary: string;
  preferredDate: Date;
  timeWindow: string;
  createdAt: Date;
}

/** List all bookings with customer and technician details (admin view). */
export async function listAllBookings(statusFilter?: string): Promise<AdminBooking[]> {
  const params: unknown[] = [];
  let sql = `
    SELECT b.id, b.reference, b.status, b.job_summary, b.preferred_date,
            b.time_window, b.created_at,
            u.full_name AS customer_name, u.phone AS customer_phone,
            tu.full_name AS technician_name, tu.phone AS technician_phone,
            c.name AS category_name,
            ts.title AS service_title, ts.price AS service_price
     FROM bookings b
     JOIN users u ON u.id = b.customer_id
     JOIN technician_profiles tp ON tp.user_id = b.technician_id
     JOIN users tu ON tu.id = tp.user_id
     JOIN service_categories c ON c.id = tp.category_id
     LEFT JOIN technician_services ts ON ts.id = b.service_id
  `;
  if (statusFilter && statusFilter !== "all") {
    params.push(statusFilter);
    sql += ` WHERE b.status = $${params.length}`;
  }
  sql += ` ORDER BY b.created_at DESC`;
  const result = await query<AdminBookingRaw>(sql, params);
  return result.rows.map((row) => ({
    id: row.id,
    reference: row.reference,
    status: row.status as AdminBooking["status"],
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    technicianName: row.technician_name,
    technicianPhone: row.technician_phone,
    categoryName: row.category_name,
    serviceTitle: row.service_title,
    servicePrice: row.service_price ? Number(row.service_price) : null,
    jobSummary: row.job_summary,
    preferredDate: row.preferred_date,
    timeWindow: row.time_window,
    createdAt: row.created_at,
  }));
}

interface AdminBookingRaw {
  id: string;
  reference: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  technician_name: string;
  technician_phone: string;
  category_name: string;
  service_title: string | null;
  service_price: string | null;
  job_summary: string;
  preferred_date: Date;
  time_window: string;
  created_at: Date;
}

/** Get a single booking by ID (admin view). */
export async function getBookingById(id: string): Promise<AdminBooking | null> {
  const result = await query<AdminBookingRaw>(
    `SELECT b.id, b.reference, b.status, b.job_summary, b.preferred_date,
            b.time_window, b.created_at, b.status_note,
            u.full_name AS customer_name, u.phone AS customer_phone,
            tu.full_name AS technician_name, tu.phone AS technician_phone,
            c.name AS category_name,
            ts.title AS service_title, ts.price AS service_price
     FROM bookings b
     JOIN users u ON u.id = b.customer_id
     JOIN technician_profiles tp ON tp.user_id = b.technician_id
     JOIN users tu ON tu.id = tp.user_id
     JOIN service_categories c ON c.id = tp.category_id
     LEFT JOIN technician_services ts ON ts.id = b.service_id
     WHERE b.id = $1`,
    [id],
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: row.id,
    reference: row.reference,
    status: row.status as AdminBooking["status"],
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    technicianName: row.technician_name,
    technicianPhone: row.technician_phone,
    categoryName: row.category_name,
    serviceTitle: row.service_title,
    servicePrice: row.service_price ? Number(row.service_price) : null,
    jobSummary: row.job_summary,
    preferredDate: row.preferred_date,
    timeWindow: row.time_window,
    createdAt: row.created_at,
  };
}
