import type { Bill } from "../types";

export const deriveTags = (bill: Bill): string[] => {
  const year = bill.dateIntroduced ? new Date(bill.dateIntroduced).getFullYear().toString() : "";
  const fallback = [
    bill.category,
    bill.state,
    bill.status ?? "Active",
    bill.source ?? "GovInfo",
    year ? `${year}` : ""
  ].filter(Boolean) as string[];

  const set = new Set<string>();
  bill.tags?.filter(Boolean).forEach((tag) => set.add(tag));
  fallback.forEach((tag) => set.add(tag));
  return Array.from(set).slice(0, 8);
};
