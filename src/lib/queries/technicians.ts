import "server-only";
import { query } from "../db";

export interface TechnicianProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: "technician";
  is_blocked: boolean;
  category_id: string;
  category_name: string;
  headline: string | null;
  bio: string | null;
  experience_years: number;
  service_area: string | null;
  approval_status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  created_at: Date;
}

export interface DashboardStats {
  totalBookings: number;
  pendingRequests: number;
  completedJobs: number;
  cancelledJobs: number;
  averageRating: number | null;
  reviewCount: number;
}

export interface BookingSummary {
  id: string;
  customer_name: string;
  customer_phone: string;
  status: string;
  preferred_date: Date;
  time_window: string;
  job_summary: string;
  created_at: Date;
}

export interface ReviewSummary {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: Date;
}

/** Full profile for the signed-in technician. */
export async function getTechnicianProfile(userId: string): Promise<TechnicianProfile | null> {
  const result = await query<TechnicianProfile>(
    `SELECT u.id, u.email, u.full_name, u.phone, u.role, u.is_blocked,
            tp.category_id, c.name AS category_name, tp.headline, tp.bio,
            tp.experience_years, tp.service_area, tp.approval_status,
            tp.rejection_reason, tp.created_at
     FROM users u
     JOIN technician_profiles tp ON tp.user_id = u.id
     JOIN service_categories c ON c.id = tp.category_id
     WHERE u.id = $1`,
    [userId],
  );
  return result.rows[0] ?? null;
}

interface DashboardStatsRaw {
  total_bookings: string;
  pending_requests: string;
  completed_jobs: string;
  cancelled_jobs: string;
  avg_rating: string | null;
  review_count: string;
}

/** Dashboard summary stats for a technician. */
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const result = await query<DashboardStatsRaw>(
    `SELECT
            (SELECT count(*) FROM bookings WHERE technician_id = $1) AS total_bookings,
            (SELECT count(*) FROM bookings WHERE technician_id = $1 AND status = 'pending') AS pending_requests,
            (SELECT count(*) FROM bookings WHERE technician_id = $1 AND status = 'completed') AS completed_jobs,
            (SELECT count(*) FROM bookings WHERE technician_id = $1 AND status = 'cancelled') AS cancelled_jobs,
            (SELECT AVG(rating)::numeric(3,2) FROM reviews WHERE technician_id = $1) AS avg_rating,
            (SELECT count(*) FROM reviews WHERE technician_id = $1) AS review_count`,
    [userId],
  );
  const row = result.rows[0];
  return {
    totalBookings: Number(row.total_bookings),
    pendingRequests: Number(row.pending_requests),
    completedJobs: Number(row.completed_jobs),
    cancelledJobs: Number(row.cancelled_jobs),
    averageRating: row.avg_rating ? Number(row.avg_rating) : null,
    reviewCount: Number(row.review_count),
  };
}

/** Recent pending booking requests for a technician. */
export async function getRecentBookingRequests(userId: string, limit = 5): Promise<BookingSummary[]> {
  const result = await query<BookingSummary>(
    `SELECT b.id, u.full_name AS customer_name, u.phone AS customer_phone,
            b.status, b.preferred_date, b.time_window, b.job_summary, b.created_at
     FROM bookings b
     JOIN users u ON u.id = b.customer_id
     WHERE b.technician_id = $1 AND b.status = 'pending'
     ORDER BY b.created_at DESC
     LIMIT $2`,
    [userId, limit],
  );
  return result.rows;
}

/** Upcoming (accepted / in_progress) appointments for a technician. */
export async function getUpcomingAppointments(userId: string, limit = 5): Promise<BookingSummary[]> {
  const result = await query<BookingSummary>(
    `SELECT b.id, u.full_name AS customer_name, u.phone AS customer_phone,
            b.status, b.preferred_date, b.time_window, b.job_summary, b.created_at
     FROM bookings b
     JOIN users u ON u.id = b.customer_id
     WHERE b.technician_id = $1 AND b.status IN ('accepted','in_progress')
     ORDER BY b.preferred_date ASC, b.created_at DESC
     LIMIT $2`,
    [userId, limit],
  );
  return result.rows;
}

/** Recent reviews for a technician. */
export async function getRecentReviews(userId: string, limit = 5): Promise<ReviewSummary[]> {
  const result = await query<ReviewSummary>(
    `SELECT r.id, u.full_name AS customer_name, r.rating, r.comment, r.created_at
     FROM reviews r
     JOIN users u ON u.id = r.customer_id
     WHERE r.technician_id = $1
     ORDER BY r.created_at DESC
     LIMIT $2`,
    [userId, limit],
  );
  return result.rows;
}

/** A technician profile with user and category info, for admin listing. */
export interface AdminTechnician {
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  isBlocked: boolean;
  categoryId: string;
  categoryName: string;
  headline: string | null;
  experienceYears: number;
  serviceArea: string | null;
  approvalStatus: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  createdAt: Date;
}

interface AdminTechnicianRaw {
  user_id: string;
  email: string;
  full_name: string;
  phone: string;
  is_blocked: boolean;
  category_id: string;
  category_name: string;
  headline: string | null;
  experience_years: number;
  service_area: string | null;
  approval_status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  created_at: Date;
}

/** List all technicians with their profiles (admin view). */
export async function listAllTechnicians(): Promise<AdminTechnician[]> {
  const result = await query<AdminTechnicianRaw>(
    `SELECT u.id AS user_id, u.email, u.full_name, u.phone, u.is_blocked,
            tp.category_id, c.name AS category_name, tp.headline,
            tp.experience_years, tp.service_area, tp.approval_status,
            tp.rejection_reason, tp.created_at
     FROM users u
     JOIN technician_profiles tp ON tp.user_id = u.id
     JOIN service_categories c ON c.id = tp.category_id
     WHERE u.role = 'technician'
     ORDER BY tp.approval_status, u.created_at DESC`,
    [],
  );
  return result.rows.map((row) => ({
    userId: row.user_id,
    email: row.email,
    fullName: row.full_name,
    phone: row.phone,
    isBlocked: row.is_blocked,
    categoryId: row.category_id,
    categoryName: row.category_name,
    headline: row.headline,
    experienceYears: row.experience_years,
    serviceArea: row.service_area,
    approvalStatus: row.approval_status,
    rejectionReason: row.rejection_reason,
    createdAt: row.created_at,
  }));
}

/** Approve or reject a technician (admin only). */
export async function setTechnicianApprovalStatus(
  userId: string,
  status: "approved" | "rejected",
  rejectionReason: string | null,
): Promise<void> {
  await query(
    `UPDATE technician_profiles
      SET approval_status = $2,
          rejection_reason = $3
     WHERE user_id = $1`,
    [userId, status, rejectionReason],
  );
}

/** All services offered by a technician. */
export interface TechnicianService {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  price_type: string;
  is_active: boolean;
}

export async function listTechnicianServices(userId: string): Promise<TechnicianService[]> {
  const result = await query<TechnicianService>(
    `SELECT id, title, description, price, price_type, is_active
     FROM technician_services
     WHERE technician_id = $1
     ORDER BY title`,
    [userId],
  );
  return result.rows;
}

/** All availability slots for a technician. */
export interface TechnicianAvailability {
  day_of_week: number;
  time_window: string;
}

export async function listTechnicianAvailability(userId: string): Promise<TechnicianAvailability[]> {
  const result = await query<TechnicianAvailability>(
    `SELECT day_of_week, time_window
     FROM technician_availability
     WHERE technician_id = $1
     ORDER BY day_of_week, time_window`,
    [userId],
  );
  return result.rows;
}

export interface BookingRow {
  id: string;
  customer_name: string;
  customer_phone: string;
  status: string;
  preferred_date: Date;
  time_window: string;
  job_summary: string;
  created_at: Date;
}

/** All bookings for a technician, optionally filtered by status. */
export async function getTechnicianBookings(userId: string, statusFilter: string): Promise<BookingRow[]> {
  let sql = `
    SELECT b.id, u.full_name AS customer_name, u.phone AS customer_phone,
           b.status, b.preferred_date, b.time_window, b.job_summary, b.created_at
    FROM bookings b
    JOIN users u ON u.id = b.customer_id
    WHERE b.technician_id = $1
  `;
  const params: unknown[] = [userId];
  if (statusFilter && statusFilter !== "all") {
    params.push(statusFilter);
    sql += ` AND b.status = $${params.length}`;
  }
  sql += ` ORDER BY b.created_at DESC`;
  const result = await query<BookingRow>(sql, params);
  return result.rows;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function dayLabel(d: number) {
  return DAYS[d];
}

export function windowLabel(w: string) {
  return w.charAt(0).toUpperCase() + w.slice(1);
}
