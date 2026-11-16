"use client";

import { useActionState, useState } from "react";
import { cancelBooking } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { X, AlertCircle } from "lucide-react";

interface Booking {
  id: string;
  reference: string;
  status: string;
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

interface ActionResult {
  ok: boolean;
  error?: { message: string; fieldErrors?: Record<string, string[]> };
}

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

const statusColor = (status: string): string => {
  switch (status) {
    case "pending":
    case "in_progress":
      return "text-[#B77A35]";
    case "accepted":
    case "completed":
      return "text-[#287A50]";
    case "cancelled":
    case "rejected":
      return "text-[#B7443D]";
    default:
      return "text-ink";
  }
};

export function BookingRow({ booking, cancelable }: { booking: Booking; cancelable: boolean }) {
  const [cancelState, cancelAction] = useActionState<ActionResult, FormData>(
    async (_prev, formData: FormData) => {
      const bookingId = formData.get("bookingId") as string;
      const reason = formData.get("reason") as string;
      return cancelBooking({ bookingId, reason });
    },
    { ok: false },
  );

  const [cancelOpen, setCancelOpen] = useState(false);

  const price = booking.servicePrice != null
    ? `NPR ${booking.servicePrice.toLocaleString()}`
    : "Quote";

  return (
    <tr className="hover:bg-bg/50 transition-colors group">
      <td className="px-4 py-3 text-sm font-medium text-ink">
        {booking.reference}
      </td>
      <td className="px-4 py-3">
        <div className="text-sm font-medium text-ink">{booking.customerName}</div>
        <div className="text-sm text-muted-strong">{booking.customerPhone}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm font-medium text-ink">{booking.technicianName}</div>
        <div className="text-sm text-muted-strong">{booking.technicianPhone}</div>
      </td>
      <td className="px-4 py-3 text-sm text-ink">
        {booking.categoryName}
        {booking.serviceTitle ? (
          <div className="text-xs text-muted-strong mt-0.5">
            {booking.serviceTitle} · {price}
          </div>
        ) : null}
      </td>
      <td className="px-4 py-3 text-sm text-ink hidden sm:table-cell">
        {booking.preferredDate.toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-sm text-ink">
        {booking.timeWindow.charAt(0).toUpperCase() + booking.timeWindow.slice(1)}
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold ${
            statusColor(booking.status)
          }`}
        >
          {statusLabel(booking.status)}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-muted-strong">
        {booking.createdAt.toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-right">
        {cancelable ? (
          <>
            {!cancelOpen ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setCancelOpen(true)}
                className="text-xs px-3 py-1.5 border border-[#B7443D] text-[#B7443D] hover:bg-[#B7443D]/10"
              >
                <AlertCircle className="size-3 mr-1" aria-hidden="true" />
                Cancel
              </Button>
            ) : (
              <form action={cancelAction} className="space-y-2">
                <input type="hidden" name="bookingId" value={booking.id} />
                <textarea
                  name="reason"
                  rows={2}
                  className="w-full h-12 border border-[#3a3b33] rounded-md bg-[#1a1b16] text-[#f2f0e8] p-2 text-sm focus:outline-none focus:border-[#B77A35]"
                  placeholder="Reason for cancellation"
                  required
                ></textarea>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={cancelState.ok}
                    className="text-xs px-3 py-1.5 bg-[#B7443D] text-[#111418] hover:bg-[#B7443D]/90"
                  >
                    {cancelState.ok ? (
                      <>
                        <X className="size-3 mr-1" aria-hidden="true" />
                        Cancelled
                      </>
                    ) : (
                      "Cancel booking"
                    )}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setCancelOpen(false)}
                    variant="ghost"
                    className="text-xs px-3 py-1.5 text-[#a9a99f] hover:text-[#f2f0e8]"
                  >
                    Keep
                  </Button>
                </div>
                {cancelState.error?.message && (
                  <p className="text-[#B7443D] text-xs" role="alert">
                    {cancelState.error.message}
                  </p>
                )}
              </form>
            )}
          </>
        ) : (
          <span className="text-xs text-muted-strong">—</span>
        )}
      </td>
    </tr>
  );
}
