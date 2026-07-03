import type { Experience } from "@/server/portfolio/types";

export function experienceDuration(e: Experience): string {
  const start = new Date(e.startDate + "-01");
  const end = e.current || !e.endDate ? new Date() : new Date(e.endDate + "-01");
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [];
  if (y) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
  if (m) parts.push(`${m} mo`);
  return parts.join(" ") || "< 1 mo";
}

export function formatMonth(v?: string): string {
  if (!v) return "Present";
  const d = new Date(v + "-01");
  return d.toLocaleString(undefined, { month: "short", year: "numeric" });
}
