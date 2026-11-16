import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/guards";
import { listTechnicianAvailability } from "@/lib/queries/technicians";
import { AvailabilityForm } from "./Form";

export const instant = false;

export default async function TechnicianAvailabilityPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "technician") {
    redirect("/login?next=" + encodeURIComponent("/technician/availability"));
  }

  const availability = await listTechnicianAvailability(user.id);
  return <AvailabilityForm initialAvailability={availability} />;
}
