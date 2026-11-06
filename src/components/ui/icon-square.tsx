import { CategoryIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/*
 * Bare category icon — filled, capped at 48px (size-12). The bordered tile
 * (DESIGN.md §13) is retired; callers may pass e.g. group-hover color shifts.
 */

export function IconSquare({ icon, className }: { icon: string; className?: string }) {
  return <CategoryIcon icon={icon} className={cn("size-12 shrink-0 text-primary", className)} />;
}
