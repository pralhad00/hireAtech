import {
  ArrowRight,
  Axe,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Droplet,
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
  Zap,
} from "lucide-react";

/*
 * Lucide is the one approved icon library (spec §3, amended; DESIGN.md §6).
 * Used sparingly — typography and layout lead. Sizes: 16px inline, 20px
 * rows, 24px tiles; 2px stroke.
 *
 * The category mapping mirrors db/seed.sql icon keys exactly — never invent
 * new ones: bolt, droplet, saw, plug, brush, hammer.
 */

/** Props for Lucide icons (className/size/color/etc.), plus `icon` for the map. */
export type CategoryIconProps = React.ComponentProps<typeof Zap> & {
  icon: string;
};

const categoryIconMap = {
  bolt: Zap,
  droplet: Droplet,
  saw: Axe,
  plug: Plug,
  brush: Paintbrush,
  hammer: Hammer,
} as const;

export type CategoryIconKey = keyof typeof categoryIconMap;

/** Renders the Lucide icon for a category's `icon` value (falls back to hammer). */
export function CategoryIcon({ icon, ...props }: CategoryIconProps) {
  const Named = categoryIconMap[icon as CategoryIconKey] ?? Hammer;
  return <Named aria-hidden={true} {...props} />;
}

export { ArrowRight, Building2, Check, CheckCircle2, Clock, CreditCard, Filter, MapPin, Menu, Search, ShieldCheck, Star, Users, X };
