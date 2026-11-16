"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  ShieldAlert,
  LogOut,
} from "lucide-react";

interface AdminSidebarProps {
  user: { full_name: string; role: string };
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/technicians", label: "Technicians", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: ClipboardList },
  { href: "/admin/categories", label: "Categories", icon: FileText },
  { href: "/admin/users", label: "Users", icon: ShieldAlert },
];

/**
 * Sidebar navigation for the admin section.
 * Dark admin color profile — distinct from the customer/technician app chrome.
 * Placed on every /admin/* page (except login) so moving between sections
 * is always one click away.
 */
export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const [state, logout] = useActionState<{ ok: boolean }, FormData>(
    async () => {
      await logoutAction();
      return { ok: true };
    },
    { ok: false },
  );

  useEffect(() => {
    if (state.ok) {
      window.location.href = "/login";
    }
  }, [state]);

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f100d] border-r border-[#3a3b33] hidden lg:flex flex-col"
      aria-label="Admin navigation"
    >
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Brand */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#f2f0e8] font-display tracking-tight">
            HireATech
          </h2>
          <p className="text-xs text-[#77786f] uppercase tracking-wider mt-0.5">
            Admin panel
          </p>
        </div>

        {/* User info */}
        <div className="mb-8 pb-4 border-b border-[#3a3b33]">
          <p className="text-sm font-semibold text-[#f2f0e8]">
            {user.full_name}
          </p>
          <p className="text-xs text-[#5e5f57] uppercase tracking-wider">
            {user.role}
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5" aria-label="Admin sections">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  active
                    ? "bg-[#1a1b16] text-[#f2f0e8] border-r-2 border-[#B77A35]"
                    : "text-[#a9a99f] hover:text-[#f2f0e8] hover:bg-[#1a1b16]/50",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sign out */}
      <div className="p-6 border-t border-[#3a3b33]">
        <form action={logout} className="w-full">
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            className="w-full text-[#f2f0e8] border-[#3a3b33] hover:bg-[#B7443D]/10"
          >
            <LogOut className="size-4 mr-2" aria-hidden="true" />
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}
