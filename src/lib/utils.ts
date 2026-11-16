export { cn } from "cn";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function dayLabel(d: number) {
  return DAYS[d];
}

export function windowLabel(w: string) {
  return w.charAt(0).toUpperCase() + w.slice(1);
}
