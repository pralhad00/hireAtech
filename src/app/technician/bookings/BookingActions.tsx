"use client";

import { useState } from "react";
import { acceptBookingAction, rejectBookingAction } from "@/lib/actions/technician";

interface BookingActionsProps {
  bookingId: string;
  status: string;
}

export function BookingActions({ bookingId, status }: BookingActionsProps) {
  const [saving, setSaving] = useState(false);

  const handleAccept = async () => {
    if (!window.confirm("Accept this booking request?")) return;
    setSaving(true);
    try {
      const result = await acceptBookingAction(bookingId);
      if (!result.ok) {
        alert(result.error.message || "Failed to accept booking.");
      } else {
        window.location.reload();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to accept booking.");
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt("Reason for rejection (optional):");
    if (reason === null) return; // user cancelled
    setSaving(true);
    try {
      const result = await rejectBookingAction(bookingId, reason || undefined);
      if (!result.ok) {
        alert(result.error.message || "Failed to reject booking.");
      } else {
        window.location.reload();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject booking.");
    } finally {
      setSaving(false);
    }
  };

  const canAct = status === "pending";

  if (!canAct) {
    return <span className="text-xs text-muted-strong">—</span>;
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleAccept}
        disabled={saving}
        className="text-xs font-semibold text-success underline underline-offset-2 hover:text-success disabled:opacity-50"
      >
        {saving ? "…" : "Accept"}
      </button>
      <button
        onClick={handleReject}
        disabled={saving}
        className="text-xs font-semibold text-error underline underline-offset-2 hover:text-error disabled:opacity-50"
      >
        {saving ? "…" : "Reject"}
      </button>
    </div>
  );
}
