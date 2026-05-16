/**
 * Dynamic date helpers for MSW mock handlers.
 * All dates are computed relative to Date.now() so the mock data
 * stays realistic regardless of when the app is viewed.
 */

const fmt = (d: Date): string => d.toISOString().slice(0, 10); // YYYY-MM-DD
const isoFmt = (d: Date): string => d.toISOString();           // full ISO-8601

/** YYYY-MM-DD for a date N days in the past */
export const daysAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return fmt(d);
};

/** YYYY-MM-DD for a date N days in the future */
export const daysFromNow = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return fmt(d);
};

/** YYYY-MM-DD N calendar months from today */
export const monthsFromNow = (n: number): string => {
  const d = new Date();
  d.setMonth(d.getMonth() + n);
  return fmt(d);
};

/**
 * YYYY-MM-DD for a specific calendar day within the current month.
 * If that day is still in the future this month, returns the same
 * day in the previous month — so dates are always in the past.
 *
 * Example: today is 8 Jan
 *   currentMonthDay(3)  → "2025-01-03"  (already passed)
 *   currentMonthDay(15) → "2024-12-15"  (not yet this month)
 */
export const currentMonthDay = (day: number): string => {
  const today = new Date();
  const candidate = new Date(today.getFullYear(), today.getMonth(), day);
  if (candidate > today) {
    return fmt(new Date(today.getFullYear(), today.getMonth() - 1, day));
  }
  return fmt(candidate);
};

/** YYYY-MM-DD for day N of next calendar month */
export const nextMonthDay = (day: number): string => {
  const d = new Date();
  return fmt(new Date(d.getFullYear(), d.getMonth() + 1, day));
};

/** Full ISO-8601 timestamp N days in the past at a given hour (default 10:30) */
export const isoDaysAgo = (n: number, hour = 10): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 30, 0, 0);
  return isoFmt(d);
};
