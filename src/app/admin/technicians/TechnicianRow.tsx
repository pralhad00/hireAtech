"use client";

import { useActionState, useEffect, useState } from "react";
import { approveTechnician, rejectTechnician } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, AlertCircle } from "lucide-react";

interface Tech {
  userId: string;
  fullName: string;
  email: string;
  categoryName: string;
  experienceYears: number;
  serviceArea: string | null;
  rejectionReason: string | null;
}

/** Action result shape returned by the Server Actions. */
interface ActionResult {
  ok: boolean;
  error?: { message: string; fieldErrors?: Record<string, string[]> };
}

/**
 * One row in the pending technicians table.
 * Client component because it uses useActionState for the approve/reject forms.
 */
export function TechnicianRow({ tech }: { tech: Tech }) {
  const [approveState, approveAction] = useActionState<ActionResult, FormData>(
    async (_prev, formData: FormData) => {
      const technicianId = formData.get("technicianId") as string;
      return approveTechnician(technicianId);
    },
    { ok: false },
  );

  const [rejectState, rejectAction] = useActionState<ActionResult, FormData>(
    async (_prev, formData: FormData) => {
      const technicianId = formData.get("technicianId") as string;
      const reason = formData.get("reason") as string;
      return rejectTechnician({ technicianId, reason });
    },
    { ok: false },
  );

  const [rejectOpen, setRejectOpen] = useState(false);

  useEffect(() => {
    // Clear stale state when the row re-renders with new data
  }, [tech.userId]);

  const showError = (state: ActionResult) => state.error?.message;

  return (
    <tr className="hover:bg-bg/50 transition-colors group">
      <td className="px-4 py-3">
        <div className="text-sm font-medium text-ink">{tech.fullName}</div>
        <div className="text-sm text-muted-strong">{tech.email}</div>
      </td>
      <td className="px-4 py-3 text-sm text-ink">{tech.categoryName}</td>
      <td className="px-4 py-3 text-sm text-ink">
        {tech.experienceYears} years
      </td>
      <td className="px-4 py-3 text-sm text-ink">
        {tech.serviceArea ?? "—"}
      </td>
      <td className="px-4 py-3 text-sm text-ink"></td>
      <td className="px-4 py-3">
        {/* Approve — immediate, no extra input */}
        <form action={approveAction} className="inline">
          <input type="hidden" name="technicianId" value={tech.userId} />
          <Button
            type="submit"
            size="sm"
            disabled={approveState.ok}
            className={cn(
              "text-xs px-3 py-1.5",
              approveState.ok
                ? "bg-[#287A50] text-[#f2f0e8] hover:bg-[#287A50]/90"
                : "bg-[#414A2F] text-[#f2f0e8] hover:bg-[#414A2F]/90",
            )}
          >
            {approveState.ok ? (
              <>
                <Check className="size-3 mr-1" aria-hidden="true" />
                Approved
              </>
            ) : (
              "Approve"
            )}
          </Button>
          {showError(approveState) && (
            <p className="text-[#B7443D] text-xs mt-1" role="alert">
              {showError(approveState)}
            </p>
          )}
        </form>

        {/* Reject — requires a reason */}
        <div className="mt-2 inline-block">
          {!rejectOpen ? (
            <Button
              type="button"
              size="sm"
              onClick={() => setRejectOpen(true)}
              className="text-xs px-3 py-1.5 border border-[#B7443D] text-[#B7443D] hover:bg-[#B7443D]/10"
            >
              <AlertCircle className="size-3 mr-1" aria-hidden="true" />
              Reject
            </Button>
          ) : (
            <form action={rejectAction} className="space-y-2">
              <input type="hidden" name="technicianId" value={tech.userId} />
              <textarea
                name="reason"
                rows={2}
                className="w-full h-12 border border-[#3a3b33] rounded-md bg-[#1a1b16] text-[#f2f0e8] p-2 text-sm focus:outline-none focus:border-[#B77A35]"
                placeholder="Reason for rejection"
                required
              ></textarea>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={rejectState.ok}
                  className="text-xs px-3 py-1.5 bg-[#B7443D] text-[#111418] hover:bg-[#B7443D]/90"
                >
                  {rejectState.ok ? (
                    <>
                      <X className="size-3 mr-1" aria-hidden="true" />
                      Rejected
                    </>
                  ) : (
                    "Reject"
                  )}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setRejectOpen(false)}
                  variant="ghost"
                  className="text-xs px-3 py-1.5 text-[#a9a99f] hover:text-[#f2f0e8]"
                >
                  Cancel
                </Button>
              </div>
              {showError(rejectState) && (
                <p className="text-[#B7443D] text-xs" role="alert">
                  {showError(rejectState)}
                </p>
              )}
            </form>
          )}
        </div>
      </td>
    </tr>
  );
}
