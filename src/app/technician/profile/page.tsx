import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/guards";
import { getTechnicianProfile } from "@/lib/queries/technicians";
import { listCategoryOptions } from "@/lib/queries/categories";
import { ProfileForm } from "./Form";

export const instant = false;

export default async function TechnicianProfilePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "technician") {
    redirect("/login?next=" + encodeURIComponent("/technician/profile"));
  }

  const [profile, categories] = await Promise.all([
    getTechnicianProfile(user.id),
    listCategoryOptions(),
  ]);
  if (!profile) {
    redirect("/technician");
  }

  return <ProfileForm initial={profile} categories={categories} />;
}
