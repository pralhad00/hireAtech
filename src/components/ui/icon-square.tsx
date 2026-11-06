import { CategoryIcon } from "@/components/ui/icons";

/*
 * The signature category tile (DESIGN.md §13 migration): a Lucide icon in a
 * bordered, square-leaning tile (2–4px radius, 1px border token), off-white
 * or white fill. Sits wherever a category or trade name appears. Sparse by
 * design — typography leads (DESIGN.md §6).
 */

type Size = "sm" | "md" | "lg";

const sizeBox: Record<Size, string> = {
  sm: "size-9 [&_svg]:size-4",
  md: "size-12 [&_svg]:size-5",
  lg: "size-16 [&_svg]:size-6",
};

export function IconSquare({
  icon,
  size = "md",
  tone = "cream",
  className,
}: {
  icon: string;
  size?: Size;
  tone?: "cream" | "surface";
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-md border border-border text-primary ${
        tone === "cream" ? "bg-bg" : "bg-surface"
      } ${sizeBox[size]} ${className || ""}`}
    >
      <CategoryIcon icon={icon} />
    </span>
  );
}
