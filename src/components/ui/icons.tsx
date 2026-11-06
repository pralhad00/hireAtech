import Image from "next/image";
import {
  ArrowRight,
  Axe,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Filter,
  Hammer,
  MapPin,
  Menu,
  Paintbrush,
  Plug,
  Search,
  ShieldCheck,
  Star,
  Users,
  X,
} from "lucide-react";

/*
 * Lucide is the one approved icon library (spec §3, amended; DESIGN.md §6).
 * Category icons render FILLED (fill=currentColor) — solid shapes, no tile.
 * Sizes: 16px inline, 20px rows, up to 48px tiles; 2px stroke on top of fill.
 *
 * The category mapping mirrors db/seed.sql icon keys exactly — never invent
 * new ones: bolt, wrench, saw, plug, brush, hammer.
 *
 * bolt (electrician) and wrench (plumber) are one-off exceptions: exact SVG
 * files in public, rendered as images — no currentColor tinting. Their colors
 * are re-tinted to the palette: primary, primary-soft, bg-subtle.
 */

/** CategoryIcon only ever receives icon + className from callers. */
export type CategoryIconProps = {
  icon: string;
  className?: string;
};

/* SVG-file category icons (colors baked in — see each file's <style>). */
const svgCategoryIconSrc = {
  bolt: "/electrical-icon.svg",
  wrench: "/Wrench-2--Streamline-Kameleon.svg",
} as const;

const categoryIconMap = {
  saw: Axe,
  plug: Plug,
  brush: Paintbrush,
  hammer: Hammer,
} as const;

export type CategoryIconKey = keyof typeof categoryIconMap;

/** Renders the icon for a category's `icon` value (falls back to hammer). */
export function CategoryIcon({ icon, className }: CategoryIconProps) {
  const Svg = svgCategoryIconSrc[icon as keyof typeof svgCategoryIconSrc];
  if (Svg)
    return (
      <Image
        src={Svg}
        alt=""
        width={48}
        height={48}
        aria-hidden={true}
        className={className}
      />
    );
  const Named = categoryIconMap[icon as CategoryIconKey] ?? Hammer;
  return <Named fill="currentColor" aria-hidden={true} className={className} />;
}

export { ArrowRight, Building2, Check, CheckCircle2, Clock, CreditCard, Filter, MapPin, Menu, Search, ShieldCheck, Star, Users, X };
