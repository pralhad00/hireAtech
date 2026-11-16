import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/guards";
import { listTechnicianServices } from "@/lib/queries/technicians";
import { ServicesForm } from "./Form";

export const instant = false;

export default async function TechnicianServicesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "technician") {
    redirect("/login?next=" + encodeURIComponent("/technician/services"));
  }

  const services = await listTechnicianServices(user.id);
  return <ServicesForm initialServices={services} />;
}
